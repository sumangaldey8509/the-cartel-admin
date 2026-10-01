"use client"

import { countryCodes } from "@/app/(main)/publishers/[slug]/page";
import { uploadPublisherPhoto } from "@/cloudionary/uploadNewsPhoto";
import Heading from "@/components/common/heading/heading"
import CountryDropdown from "@/components/publisher/CountryDropdown";
import ImageUploader from "@/components/publisher/ImageUploader";
import RoleMultiSelect from "@/components/user/RoleMultiSelect";
import { RoleInterface } from "@/interface/roles";
import appClient from "@/lib/appClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import { editUser } from "@/store/slices/manageUserSlice";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, RefreshCw, Search, Smartphone, User, Mail, Lock, Check, X, Globe, LogOut, Plus, Trash2, Link as LinkIcon, Shield, Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react";

const socialMediaData = [
    { label: "Youtube", value: "youtube" },
    { label: "Linkedin", value: "linkedin" },
    { label: "Instagram", value: "instagram" },
    { label: "Telegram", value: "telegram" },
]

const registrationTypes = [
    { label: "Publisher", value: "publisher" },
    { label: "Advertiser", value: "advertiser" },
    { label: "System Admin", value: "system-admin" },
    { label: "Content Creator", value: "content-creator" },
    { label: "Viewer", value: "viewer" },
]

interface ProfileLink {
    platform: string;
    url: string;
    username: string;
}

const ManageUserPage = () => {
    const authedUser = useAppSelector((store) => store.auth.user)
    const selectedUser = useAppSelector((store) => store.manageUser.user)
    const dispatch = useAppDispatch()

    const router = useRouter();

    const [roles, setRoles] = useState<RoleInterface[]>([])
    const [rolesLoading, setRolesLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(selectedUser?.profileImage || "");

    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [countrySearch, setCountrySearch] = useState("")

    const [profileLinks, setProfileLinks] = useState<ProfileLink[]>(selectedUser?.profileLinks || [])

    const [passwordHash, setPasswordHash] = useState("")
    const [sendPasswordMail, setSendPasswordMail] = useState(false);

    const [formData, setFormData] = useState({
        email: selectedUser?.email || "",
        role: selectedUser?.role?.map(role => role._id) || [],
        refreshToken: selectedUser?.refreshToken || null,
        registrationType: selectedUser?.registrationType || [],
        isVerified: selectedUser?.isVerified || true,
        fullName: selectedUser?.fullName || "",
        country: selectedUser?.country || "",
        countryCode: selectedUser?.countryCode || "",
        phoneNumber: selectedUser?.phoneNumber || "",
        isPublisherFormSubmitted: selectedUser?.isPublisherFormSubmitted || false,
        isUserActive: selectedUser?.isUserActive !== undefined ? selectedUser.isUserActive : true
    })

    // Initialize form data when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            setFormData({
                email: selectedUser.email,
                role: selectedUser.role?.map(role => role._id) || [],
                refreshToken: selectedUser.refreshToken,
                registrationType: selectedUser.registrationType || [],
                isVerified: selectedUser?.isVerified || true,
                fullName: selectedUser.fullName || "",
                country: selectedUser.country || "",
                countryCode: selectedUser.countryCode || "",
                phoneNumber: selectedUser.phoneNumber || "",
                isPublisherFormSubmitted: selectedUser.isPublisherFormSubmitted || false,
                isUserActive: selectedUser.isUserActive !== undefined ? selectedUser.isUserActive : true
            })
            setCurrentImageUrl(selectedUser.profileImage || "")
            setProfileLinks(selectedUser.profileLinks || [])
        } else {
            // Reset for new user
            setFormData({
                email: "",
                role: [],
                refreshToken: null,
                registrationType: [],
                isVerified: true,
                fullName: "",
                country: "",
                countryCode: "",
                phoneNumber: "",
                isPublisherFormSubmitted: false,
                isUserActive: true
            })
            setCurrentImageUrl("")
            setProfileLinks([])
        }
    }, [selectedUser])

    const handleGetRoles = useCallback(async () => {
        setRolesLoading(true)
        try {
            const response = await appClient.get("/api/roles/get")
            if (response.data.status) {
                setRoles(response.data.roles)
            }
        } catch (error) {
            console.log("getting error while fetching roles list", error)
        } finally {
            setRolesLoading(false)
        }
    }, [])

    useEffect(() => {
        handleGetRoles()
    }, [handleGetRoles])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleRegistrationTypeChange = (value: string) => {
        setFormData(prev => {
            const currentTypes = prev.registrationType
            if (currentTypes.includes(value)) {
                return {
                    ...prev,
                    registrationType: currentTypes.filter(type => type !== value)
                }
            } else {
                return {
                    ...prev,
                    registrationType: [...currentTypes, value]
                }
            }
        })
    }

    const addProfileLink = () => {
        setProfileLinks(prev => [...prev, { platform: "", url: "", username: "" }])
    }

    const updateProfileLink = (index: number, field: keyof ProfileLink, value: string) => {
        setProfileLinks(prev => {
            const newLinks = [...prev]
            newLinks[index] = {
                ...newLinks[index],
                [field]: value
            }
            return newLinks
        })
    }

    const removeProfileLink = (index: number) => {
        setProfileLinks(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(formData)

        if (!formData.email) {
            alert("Email is required")
            return
        }

        const isEdit = !!selectedUser
        const toastId = toastLoading(
            isEdit ? "Updating User..." : "Creating User...",
            {
                description: isEdit ? "Updating user information" : "Creating new user"
            }
        )

        setSaving(true)

        try {
            let imageUrl = currentImageUrl;

            // Upload new image if provided
            if (image) {
                imageUrl = await uploadPublisherPhoto(image, selectedUser?._id || Date.now().toString(), "user_photos")
            }


            let submitData;

            if (isEdit) {
                submitData = {
                    ...formData,
                    _id: selectedUser._id,
                    profileImage: imageUrl,
                    profileLinks: profileLinks.filter(link => link.platform && (link.url || link.username)),
                    actionTakenBy: authedUser?._id
                }
            } else {
                submitData = {
                    ...formData,
                    profileImage: imageUrl,
                    profileLinks: profileLinks.filter(link => link.platform && (link.url || link.username)),
                    actionTakenBy: authedUser?._id
                }
            }
            console.log({ submitData })
            const response = await appClient.post(`/api/auth/${isEdit ? 'update' : 'createUser'}`, submitData)

            if (response.data.status) {
                toastUpdate(toastId, "success",
                    isEdit ? "User Updated" : "User Created",
                    {
                        description: response.data.message || (isEdit ? "User updated successfully!" : "User created successfully!")
                    }
                )

                if (isEdit) {
                    dispatch(editUser(response.data.updatedUser))
                }
                // Navigate back or reset form
                if (!isEdit) {
                    router.push("/settings/users")
                }
            } else {
                toastUpdate(toastId, "error", "Operation Failed", {
                    description: response.data.message || "Something went wrong"
                })
            }
        } catch (error: any) {
            console.log("Error saving user:", error)
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
            toastUpdate(toastId, "error", "Operation Failed", {
                description: errorMessage
            })
        } finally {
            setSaving(false)
        }
    }

    const handleCountryCodeSelect = (code: string) => {
        setFormData(prev => ({ ...prev, countryCode: code }))
        setIsCountryDropdownOpen(false)
        setCountrySearch("")
    }

    const filteredCountries = useMemo(() => {
        if (!countrySearch) return countryCodes
        return countryCodes.filter(country =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            country.code.includes(countrySearch)
        )
    }, [countrySearch])

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode)

    const handleResetPassword = async () => {

        const toastId = toastLoading(
            "Updating User...",
            {
                description: "reset user password"
            }
        )

        try {
            const payload = {
                id: selectedUser?._id,
                password: passwordHash,
                sendPasswordMail: sendPasswordMail
            }

            const response = await appClient.post("/api/auth/resetPassword", payload)

            if (response.data.status) {
                toastUpdate(toastId, "success",
                    "User's password reset",
                    {
                        description: response.data.message
                    }
                )
            } else {
                toastUpdate(toastId, "error", "Operation Failed", {
                    description: response.data.message || "Something went wrong"
                })
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
            toastUpdate(toastId, "error", "Operation Failed", {
                description: errorMessage
            })
        }
    }

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => router.push("/settings/users")}
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                        <div className="h-6 w-px bg-gray-800"></div>

                        <div>
                            <Heading
                                heading={selectedUser ? "Edit User" : "Create User"}
                                subHeading={selectedUser ? "Update user information and permissions" : "Add a new user to the system"}
                                showButton={false}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile & Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Information Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg">
                                            <User size={20} className="text-[#bf953f]" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Basic Information</h2>
                                            <p className="text-gray-400 text-sm">User profile details and credentials</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGetRoles}
                                        disabled={rolesLoading}
                                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 disabled:opacity-50"
                                    >
                                        <RefreshCw size={12} className={rolesLoading ? 'animate-spin' : ''} />
                                        <span>Refresh Data</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Profile Photo Upload */}
                                    <div className="space-y-3">
                                        <ImageUploader
                                            image={image}
                                            imagePreview={imagePreview}
                                            setImage={setImage}
                                            setImagePreview={setImagePreview}
                                        />
                                    </div>

                                    {/* Full Name */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-text-primary/70">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/40" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-text-primary/70">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/40" />
                                            <input
                                                type="text"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password (only for new users or when changing) */}
                                    {selectedUser && (
                                        <div className="space-y-4">
                                            <label className="block text-sm font-medium text-text-primary/70">
                                                Password
                                            </label>

                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/40" />

                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="passwordHash"
                                                    value={passwordHash}
                                                    onChange={(e) => setPasswordHash(e.target.value)}
                                                    className="w-full pl-12 pr-12 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                    placeholder="Leave empty to keep current"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary/40 hover:text-text-primary/70"
                                                >
                                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                            </div>

                                            {/* Reset Button */}
                                            <button
                                                type="button"
                                                onClick={handleResetPassword}
                                                className="text-sm text-[#bf953f] hover:underline"
                                            >
                                                Reset Password
                                            </button>

                                            {/* Send Email Checkbox */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="sendMail"
                                                    checked={sendPasswordMail}
                                                    onChange={(e) => setSendPasswordMail(e.target.checked)}
                                                    className="w-4 h-4 accent-[#bf953f] bg-[#1a1a1a] border border-[#333] rounded"
                                                />
                                                <label
                                                    htmlFor="sendMail"
                                                    className="text-sm text-text-primary/70 cursor-pointer"
                                                >
                                                    Send password notification to user via email
                                                </label>
                                            </div>

                                            <p className="text-xs text-gray-500">
                                                Leave password empty to keep the current password.
                                            </p>
                                        </div>
                                    )}

                                    {/* Role Selection */}
                                    <div className="md:col-span-2">
                                        <RoleMultiSelect
                                            value={formData.role}
                                            onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                            roles={roles}
                                            label="Roles"
                                            placeholder="Select role(s)"
                                            loading={rolesLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                                        <Smartphone size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Contact Information</h2>
                                        <p className="text-gray-400 text-sm">User contact details and location</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Country */}
                                    <div className="space-y-3">
                                        <CountryDropdown
                                            value={formData.country}
                                            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                                            label="Country"
                                            placeholder="Select country"
                                            required
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-text-primary/70 mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="flex gap-2 items-center mt-2">
                                            {/* Country Code Dropdown */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                    className="flex items-center gap-2 px-3 py-[11px] bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] min-w-[100px]"
                                                >
                                                    <span className="text-sm">{selectedCountry?.flag}</span>
                                                    <span className="text-sm text-text-primary/80 font-medium">{selectedCountry?.code}</span>
                                                    <ChevronDown className={`w-4 h-4 text-text-primary/40 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {isCountryDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            className="absolute top-full left-0 mt-2 mb-2 w-64 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] shadow-lg z-50 overflow-hidden"
                                                        >
                                                            {/* Search Input */}
                                                            <div className="p-3 border-b border-[#333]">
                                                                <div className="relative">
                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-primary/40" />
                                                                    <input
                                                                        type="text"
                                                                        value={countrySearch}
                                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                                        placeholder="Search country or code..."
                                                                        className="w-full pl-9 pr-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-xs text-text-primary/80 placeholder:text-text-primary/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Country List */}
                                                            <div className="max-h-60 overflow-y-auto">
                                                                {filteredCountries.map((country) => (
                                                                    <button
                                                                        key={country.code}
                                                                        type="button"
                                                                        onClick={() => handleCountryCodeSelect(country.code)}
                                                                        className={`w-full flex items-center gap-3 px-4 py-1 hover:bg-text-primary/5 transition-colors ${formData.countryCode === country.code ? 'bg-blue-500/10 text-blue-500' : 'text-text-primary/80'
                                                                            }`}
                                                                    >
                                                                        <span className="text-lg">{country.flag}</span>
                                                                        <div className="flex-1 text-left">
                                                                            <div className="text-xs font-medium">{country.name}</div>
                                                                        </div>
                                                                        <div className="text-xs font-mono">{country.code}</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Phone Number Input */}
                                            <div className="flex-1 relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Smartphone className="w-5 h-5 text-text-primary/40" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 flex-1 px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                    placeholder="9876543210"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Settings & Social Media */}
                        <div className="space-y-6">
                            {/* Status & Registration Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                        <Shield size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Status & Registration</h2>
                                        <p className="text-gray-400 text-sm">User status and registration types</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* User Active Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-text-primary/70">
                                                User Active
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                User can login and access the system
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isUserActive: !prev.isUserActive }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isUserActive ? 'bg-green-500' : 'bg-gray-700'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isUserActive ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Verified Status (Readonly) */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-text-primary/70">
                                                Verified Status
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                Email verification status
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${formData.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {formData.isVerified ? (
                                                <div className="flex items-center gap-1">
                                                    <Check size={12} />
                                                    Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <X size={12} />
                                                    Not Verified
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Publisher Form Submitted (Editable only when updating) */}
                                    {selectedUser && (
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-text-primary/70">
                                                    Publisher Form Submitted
                                                </label>
                                                <p className="text-xs text-gray-500">
                                                    User has submitted publisher application
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                name="isPublisherFormSubmitted"
                                                checked={formData.isPublisherFormSubmitted}
                                                onChange={handleInputChange}
                                                className="h-5 w-5 rounded border-gray-700 bg-gray-800 text-[#bf953f] focus:ring-[#bf953f] focus:ring-offset-gray-900"
                                            />
                                        </div>
                                    )}

                                    {/* Registration Types */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-text-primary/70">
                                            Registration Types
                                        </label>
                                        <div className="space-y-2">
                                            {registrationTypes.map((type) => (
                                                <label key={type.value} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.registrationType.includes(type.value)}
                                                        onChange={() => handleRegistrationTypeChange(type.value)}
                                                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-[#bf953f] focus:ring-[#bf953f] focus:ring-offset-gray-900"
                                                    />
                                                    <span className="text-sm text-gray-300">{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Links Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                                            <Globe size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Social Media Links</h2>
                                            <p className="text-gray-400 text-sm">User's social media profiles</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addProfileLink}
                                        className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                        title="Add Social Link"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {profileLinks.map((link, index) => (
                                        <div key={index} className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-300">Social Link {index + 1}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProfileLink(index)}
                                                    className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                                    title="Remove Link"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Platform Selection */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Platform *
                                                    </label>
                                                    <select
                                                        value={link.platform}
                                                        onChange={(e) => updateProfileLink(index, 'platform', e.target.value)}
                                                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                        required
                                                    >
                                                        <option value="">Select Platform</option>
                                                        {socialMediaData.map((social) => (
                                                            <option key={social.value} value={social.value}>
                                                                {social.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* URL */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(e) => updateProfileLink(index, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                        placeholder="https://example.com/profile"
                                                    />
                                                </div>

                                                {/* Username */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={link.username}
                                                        onChange={(e) => updateProfileLink(index, 'username', e.target.value)}
                                                        className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                        placeholder="@username"
                                                    />
                                                </div>
                                            </div>

                                            {/* Validation Message */}
                                            {(!link.url && !link.username) && (
                                                <p className="text-xs text-red-400">
                                                    Either URL or Username is required
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {profileLinks.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                                            <Globe size={24} className="text-gray-600 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No social media links added</p>
                                            <p className="text-xs text-gray-600 mt-1">Click the + button to add links</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                {selectedUser ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                {selectedUser ? "Update User" : "Create User"}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => router.push("/settings/users")}
                                        className="w-full px-4 py-3 bg-[#222] hover:bg-[#333] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        disabled={saving}
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManageUserPage