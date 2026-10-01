"use client"

import { PublihserInterface } from "@/interface/publishers"
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks"
import {
    Building, User, Mail, Phone, MessageCircle, Link as LinkIcon,
    Globe, FileText, Shield, Zap, Edit, Save, X, AlertCircle,
    CheckCircle, Clock, PauseCircle, Trash2, Upload, Image as ImageIcon,
    Tag, DollarSign, Eye, Users, MapPin, Globe as Earth,
    ChevronLeft, RefreshCw, Copy, Check, ExternalLink, Folder,
    Briefcase, Hash, Info, BarChart, Target, Calendar,
    ChevronDown,
    Search,
    Smartphone
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import appClient from "@/lib/appClient"
import { motion, AnimatePresence } from "framer-motion"


// Import Components
import VerifyWebsiteButton from "@/components/publisher/VerifyWebsiteButton"
import ImageUploader from "@/components/publisher/ImageUploader"
import CountryDropdown from "@/components/publisher/CountryDropdown"
import LanguageDropdown from "@/components/publisher/LanguageDropdown"
import NicheDropdown from "@/components/publisher/NicheDropdown"
import CategoryMultiSelect from "@/components/publisher/CategoryMultiSelect"
import { editPublisher } from "@/store/slices/publisherSlice"
import { uploadPublisherPhoto } from "@/cloudionary/uploadNewsPhoto"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import Heading from "@/components/common/heading/heading"
import MembershipDropdown from "@/components/publisher/MembershipDropdown"
import CountriesMultiSelect from "@/components/publisher/CountryMultiselect"
import EditorToolbar from "@/components/news/EditorToolbar"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"


export const countryCodes = [
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+1", name: "United States", flag: "🇺🇸" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+92", name: "Pakistan", flag: "🇵🇰" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+233", name: "Ghana", flag: "🇬🇭" }
]


const EditPublisherPage = () => {
    const publisher = useAppSelector((state) => state.publisher.publisher)

    const authedUser = useAppSelector((state) => state.auth.user)
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)


    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

    const [tokenLoading, setTokenLoading] = useState(false)

    // Dropdown data states
    const [nichesData, setNichesData] = useState<any[]>([])
    const [categoriesData, setCategoriesData] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState({
        niches: false,
        categories: false
    })

    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [countrySearch, setCountrySearch] = useState("")

    const dispatch = useAppDispatch()


    const [formData, setFormData] = useState({
        _id: publisher?._id || "",
        accountType: publisher?.accountType || "individual",
        fullName: publisher?.fullName || "",
        organizationName: publisher?.organizationName || "",
        countryCode: publisher?.countryCode || "+1",
        phoneNumber: publisher?.phoneNumber || "",
        telegramUsername: publisher?.telegramUsername || "",
        profileLink: publisher?.profileLink || "",
        website: publisher?.website || "",
        publisherInfo: publisher?.publisherInfo || "",
        verificationToken: publisher?.verificationToken || "",
        verificationStatus: publisher?.verificationStatus || "pending",
        profileName: publisher?.profileName || "",
        pageViews: publisher?.pageViews || "",
        subscribers: publisher?.subscribers || "",
        topGEO: publisher?.topGEO || [],
        price: publisher?.price || "",
        language: publisher?.language || [],
        country: publisher?.country || "",
        marketplaceCategory: publisher?.marketplaceCategory?.map(cat => cat._id) || [],
        niches: publisher?.niches?.map(niche => niche._id) || null,

        membershipType: publisher?.membershipType || ""
    })


    // Editor
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#bf953f] underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: "<p>Not Available</p>",
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-[#C0C0C0]",
            },
        },
    });



    // Update form data when publisher changes
    useEffect(() => {
        if (publisher) {
            setFormData({
                _id: publisher._id,
                accountType: publisher.accountType,
                fullName: publisher.fullName || "",
                organizationName: publisher.organizationName || "",
                countryCode: publisher.countryCode || "+1",
                phoneNumber: publisher.phoneNumber || "",
                telegramUsername: publisher.telegramUsername || "",
                profileLink: publisher.profileLink || "",
                website: publisher.website || "",
                publisherInfo: publisher.publisherInfo || "",
                verificationToken: publisher.verificationToken || "",
                verificationStatus: publisher.verificationStatus,

                // profilePhoto: publisher.profilePhoto || "",
                profileName: publisher.profileName || "",
                // profileDescription: publisher.profileDescription || "",
                pageViews: publisher.pageViews || "",
                subscribers: publisher.subscribers || "",
                topGEO: publisher.topGEO || [],
                price: publisher.price || "",
                language: publisher?.language || [],
                country: publisher.country || "",
                marketplaceCategory: publisher.marketplaceCategory?.map(cat => cat._id) || [],
                niches: publisher?.niches?.map(niche => niche._id) || null,

                membershipType: publisher?.membershipType || ""
            })

            setCurrentImageUrl(publisher.profilePhoto || "");
            setImagePreview(publisher.profilePhoto || "");

            if (editor && publisher.profileDescription) {
                editor.commands.setContent(publisher.profileDescription)
            }

        }
    }, [publisher, editor])

    // Fetch dropdown data
    const fetchDropdownData = useCallback(async () => {
        setLoadingData(prev => ({ ...prev, niches: true, categories: true }))

        try {
            // Fetch niches
            const nichesResponse = await appClient.get("/api/marketplace/niches/get")
            if (nichesResponse.data.status) {
                setNichesData(nichesResponse.data.niches.docs || [])
            }

            // Fetch categories
            const categoriesResponse = await appClient.get("/api/marketplace/category/get", {
                params: { page: 1, limit: 100 }
            })
            if (categoriesResponse.data.status) {
                setCategoriesData(categoriesResponse.data.marketplaceCategory.docs || [])
            }
        } catch (error) {
            console.error("Error fetching dropdown data:", error)
            // toast.error("Failed to load dropdown data")
        } finally {
            setLoadingData(prev => ({ ...prev, niches: false, categories: false }))
        }
    }, [])

    useEffect(() => {
        fetchDropdownData()
    }, [fetchDropdownData])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        // Prepare data for API

        const toastId = toastLoading("Updating...", {
            description: "Updating Publisher info..."
        });


        try {

            let imageUrl = currentImageUrl;

            // upload new image if provided
            if (image) {
                imageUrl = await uploadPublisherPhoto(image, formData._id)
                console.log({ imageUrl })
            }

            const submitData = {
                ...formData,
                // Convert arrays to proper format if needed
                marketplaceCategory: formData.marketplaceCategory,
                niches: formData.niches,
                profilePhoto: imageUrl,
                actionTakenBy: authedUser?._id,
                profileDescription: editor?.getHTML()
            }

            const response = await appClient.post(`/api/publisher/action`, submitData)
            if (response.data.status) {
                toastUpdate(toastId, "success", "Publisher Updated", {
                    description: response.data.message || "Publisher updated successfully!"
                });
                dispatch(editPublisher(response.data.publisher))
            } else {
                toastUpdate(toastId, "error", "Publisher Updated failed", {
                    description: response.data.message || "Something went wrong"
                });
            }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong"
            toastUpdate(toastId, "error", "Publisher Updated failed", {
                description: errorMessage || "Something went wrong"
            });
        } finally {
            setSaving(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'rejected':
                return 'text-red-400 bg-red-400/10 border-red-400/20'
            case 'hold':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'pause':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            case 'pending':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return <CheckCircle size={14} className="text-green-400" />
            case 'rejected':
                return <AlertCircle size={14} className="text-red-400" />
            case 'hold':
                return <AlertCircle size={14} className="text-yellow-400" />
            case 'pause':
                return <PauseCircle size={14} className="text-orange-400" />
            case 'pending':
                return <Clock size={14} className="text-blue-400" />
            default:
                return <Clock size={14} className="text-gray-400" />
        }
    }

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Pending Verification',
            'verified': 'Verified',
            'rejected': 'Rejected',
            'hold': 'On Hold',
            'pause': 'Paused'
        }
        return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1)
    }

    const handleCopy = (text: string, field: string) => {
        if (!text) {
            // toast.error("Nothing to copy")
            return
        }
        navigator.clipboard.writeText(text)
        setCopied(field)
        setTimeout(() => setCopied(null), 2000)
        // toast.success("Copied to clipboard!")
    }

    const handleDeletePublisher = async () => {
        if (!confirm('Are you sure you want to delete this publisher? This action cannot be undone.')) {
            return
        }

        try {
            setLoading(true)
            const response = await appClient.delete(`/api/publisher/delete/${publisher?._id}`)

            if (response.data.status) {
                // toast.success("Publisher deleted successfully!")
                router.push('/publishers')
            } else {
                // toast.error(response.data.message || "Failed to delete publisher")
            }
        } catch (error: any) {
            console.error("Error deleting publisher:", error)
            // toast.error(error.response?.data?.message || "Failed to delete publisher")
        } finally {
            setLoading(false)
        }
    }

    if (!publisher) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
                <div className="flex items-center space-x-3 mb-6">
                    <button
                        onClick={() => router.push("/publishers")}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                    >
                        <ChevronLeft size={20} />
                        <span>Back to Publishers</span>
                    </button>
                </div>
                <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Publisher Not Found</h2>
                    <p className="text-gray-400 mb-6">The publisher information could not be loaded.</p>
                    <button
                        onClick={() => router.push("/publishers")}
                        className="px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] text-black font-medium rounded-lg transition-all duration-200"
                    >
                        Go Back to Publishers
                    </button>
                </div>
            </div>
        )
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

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0]

    const handleGenerateToken = async () => {
        setTokenLoading(true)
        try {

            const response = await appClient.post("/api/publisher/generate-token", { _id: publisher._id })

            console.log({ response })
            if (response.data.status) {
                dispatch(editPublisher(response.data.publisher))
                setFormData(prev => ({ ...prev, verificationToken: response.data.publisher.verificationToken }))
            }

        } catch (error) {
            console.error("Error generating token:", error)
        } finally {
            setTokenLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => router.push("/publishers")}
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                        <div className="h-6 w-px bg-gray-800"></div>

                        <div>
                            <Heading
                                heading="Edit Publisher"
                                subHeading="Setup and manage publisher information"
                                showButton={false}
                            />
                            {/* <h1 className="text-2xl font-bold text-white"></h1>
                            <p className="text-gray-400 text-sm"></p> */}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(publisher.verificationStatus)}
                            <span className={`px-4 py-2.5 rounded-lg border text-xs font-medium ${getStatusColor(publisher.verificationStatus)}`}>
                                {formatStatus(publisher.verificationStatus)}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.open(`mailto:${publisher.userId.email}`, '_blank')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm"
                        >
                            <Mail size={16} />
                            <span>Contact</span>
                        </button>
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
                                            <h2 className="text-lg font-bold text-white">Profile Information</h2>
                                            <p className="text-gray-400 text-sm">Update publisher profile details</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchDropdownData}
                                        disabled={loadingData.niches || loadingData.categories}
                                        className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 disabled:opacity-50"
                                    >
                                        <RefreshCw size={12} className={loadingData.niches || loadingData.categories ? 'animate-spin' : ''} />
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

                                    {/* Account Type */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <Shield size={14} className="mr-2 text-gray-400" />
                                            Account Type
                                        </label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, accountType: 'individual' }))}
                                                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${formData.accountType === 'individual' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'}`}
                                            >
                                                <User size={16} />
                                                <span className="font-medium">Individual</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, accountType: 'company' }))}
                                                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${formData.accountType === 'company' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:bg-[#222]'}`}
                                            >
                                                <Building size={16} />
                                                <span className="font-medium">Company</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center justify-between">
                                            <span>Full Name *</span>
                                            {publisher.fullName && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(publisher.fullName, 'name')}
                                                    className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                                                >
                                                    {copied === 'name' ? (
                                                        <>
                                                            <Check size={12} />
                                                            <span>Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    {/* Profile Name */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white">Profile Name</label>
                                        <input
                                            type="text"
                                            name="profileName"
                                            value={formData.profileName}
                                            onChange={handleInputChange}
                                            placeholder="Enter display name"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] mt-2"
                                        />
                                    </div>

                                    {/* Organization Name (for companies) */}
                                    {formData.accountType === 'company' && (
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-sm font-medium text-white flex items-center">
                                                <Briefcase size={14} className="mr-2 text-blue-400" />
                                                Organization Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleInputChange}
                                                required={formData.accountType === 'company'}
                                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                placeholder="Enter organization name"
                                            />
                                        </div>
                                    )}

                                    {/* Profile Description */}
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <Info size={14} className="mr-2 text-gray-400" />
                                            Profile Description
                                        </label>

                                        <div className="border-2 border-[#333] rounded-lg bg-[#0A0A0A] overflow-hidden focus-within:border-[#bf953f] transition-all duration-300">
                                            {/* Editor Toolbar */}
                                            <EditorToolbar editor={editor} />

                                            {/* Editor Content */}
                                            <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
                                                {editor && (
                                                    <EditorContent
                                                        editor={editor}
                                                        className="min-h-[300px]"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                                        <Mail size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Contact Information</h2>
                                        <p className="text-gray-400 text-sm">Update contact details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email (Read-only) */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center justify-between">
                                            <span className="flex items-center">
                                                <Mail size={14} className="mr-2 text-gray-400" />
                                                Email Address
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(publisher.userId.email, 'email')}
                                                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                                            >
                                                {copied === 'email' ? (
                                                    <>
                                                        <Check size={12} />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </label>
                                        <div className="px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-gray-300 text-sm cursor-not-allowed">
                                            {publisher.userId.email}
                                        </div>
                                        <p className="text-gray-400 text-xs">Email cannot be changed</p>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-text-primary/70 mb-3">
                                            Phone Number *
                                        </label>
                                        <div className="flex gap-2 items-center mt-2">
                                            {/* Country Code Dropdown */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                    className="flex items-center gap-2 px-3 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] min-w-[100px]"
                                                >
                                                    <span className="text-sm">{selectedCountry.flag}</span>
                                                    <span className="text-sm text-text-primary/80 font-medium">{selectedCountry.code}</span>
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
                                                            <div className="p-3 border-b  border-[#333]">
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
                                                    className="w-full pl-12 flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Telegram */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <MessageCircle size={14} className="mr-2 text-gray-400" />
                                            Telegram Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</div>
                                            <input
                                                type="text"
                                                name="telegramUsername"
                                                value={formData.telegramUsername?.replace('@', '')}
                                                onChange={(e) => setFormData(prev => ({ ...prev, telegramUsername: e.target.value }))}
                                                placeholder="username"
                                                className="w-full pl-8 pr-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                            />
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <Shield size={14} className="mr-2 text-gray-400" />
                                            Verification Status
                                        </label>
                                        <select
                                            name="verificationStatus"
                                            value={formData.verificationStatus}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="verified">Verified</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="hold">On Hold</option>
                                            <option value="pause">Paused</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Website & Links Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                                        <Globe size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Website & Links</h2>
                                        <p className="text-gray-400 text-sm">Update website and social links</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Website URL */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center justify-between">
                                            <span className="flex items-center">
                                                <Globe size={14} className="mr-2 text-green-400" />
                                                Website URL
                                            </span>
                                            {formData.website && (
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(formData.website, '_blank')}
                                                    className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                                                >
                                                    <ExternalLink size={12} />
                                                    <span>Visit</span>
                                                </button>
                                            )}
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                        />
                                    </div>

                                    {/* Profile Link */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <LinkIcon size={14} className="mr-2 text-purple-400" />
                                            Profile Link
                                        </label>
                                        <input
                                            type="url"
                                            name="profileLink"
                                            value={formData.profileLink}
                                            onChange={handleInputChange}
                                            placeholder="https://socialplatform.com/profile"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f]"
                                        />
                                    </div>

                                    {/* Verification Token */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center justify-between">
                                            <span className="flex items-center">
                                                <Shield size={14} className="mr-2 text-[#bf953f]" />
                                                Verification Token
                                            </span>
                                            {formData.verificationToken && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(formData.verificationToken, 'token')}
                                                    className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                                                >
                                                    {copied === 'token' ? (
                                                        <>
                                                            <Check size={12} />
                                                            <span>Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                name="verificationToken"
                                                value={formData.verificationToken}
                                                onChange={handleInputChange}
                                                placeholder="Verification token..."
                                                className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] font-mono text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // const newToken = `meta_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                                                    // setFormData(prev => ({ ...prev, verificationToken: newToken }))
                                                    handleGenerateToken()
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] text-black font-medium rounded-lg transition-all duration-200 text-sm"
                                            >
                                                {tokenLoading ? "Generating.." : "Generate"}
                                            </button>
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            This token must be added as a meta tag to the website for verification
                                        </p>
                                    </div>

                                    {/* Website Verification Button */}
                                    <VerifyWebsiteButton
                                        publisherId={publisher._id}
                                        website={formData.website}
                                        verificationToken={formData.verificationToken}
                                        userId={publisher.userId._id}
                                        authedUserEmail={authedUser?.email}
                                        onVerificationComplete={(success, message) => {
                                            if (success) {
                                                setFormData(prev => ({ ...prev, verificationStatus: 'verified' }))
                                            }
                                        }}
                                    />

                                    {/* Publisher Info */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-white flex items-center">
                                            <FileText size={14} className="mr-2 text-gray-400" />
                                            Additional Information
                                        </label>
                                        <textarea
                                            name="publisherInfo"
                                            value={formData.publisherInfo}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Enter any additional information about the publisher..."
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats, Categories & Actions */}
                        <div className="space-y-6">
                            {/* Publisher Stats Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                        <BarChart size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Publisher Stats</h2>
                                        <p className="text-gray-400 text-sm">Performance metrics</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Page Views */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Eye size={14} className="text-blue-400" />
                                                <span className="text-sm text-gray-300">Page Views</span>
                                            </div>
                                            <span className="text-white font-semibold">{formData.pageViews || "0"}</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="pageViews"
                                            value={formData.pageViews}
                                            onChange={handleInputChange}
                                            placeholder="Enter page views"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] text-sm"
                                        />
                                    </div>

                                    {/* Subscribers */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Users size={14} className="text-green-400" />
                                                <span className="text-sm text-gray-300">Subscribers</span>
                                            </div>
                                            <span className="text-white font-semibold">{formData.subscribers || "0"}</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="subscribers"
                                            value={formData.subscribers}
                                            onChange={handleInputChange}
                                            placeholder="Enter subscribers count"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] text-sm"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign size={14} className="text-[#bf953f]" />
                                                <span className="text-sm text-gray-300">Price</span>
                                            </div>
                                            <span className="text-white font-semibold">{formData.price || "0"}</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="Enter price"
                                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f] focus:border-[#bf953f] text-sm"
                                        />
                                    </div>

                                    <MembershipDropdown
                                        value={formData.membershipType}
                                        onChange={(value) => setFormData(prev => ({ ...prev, membershipType: value }))}
                                        required
                                    />

                                    {/* Top GEO */}
                                    <div className="space-y-2">
                                        <CountriesMultiSelect
                                            value={formData.topGEO}
                                            onChange={(value) => setFormData(prev => ({ ...prev, topGEO: value }))}
                                            label="Top GEO"
                                            placeholder="e.g US, UK, IN"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location & Categories Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                        <MapPin size={20} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Location & Categories</h2>
                                        <p className="text-gray-400 text-sm">Geographic and content info</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Country Dropdown */}
                                    <CountryDropdown
                                        value={formData.country}
                                        onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                                        label="Country"
                                        placeholder="Select country"
                                        required
                                    />

                                    {/* Language Dropdown */}
                                    <LanguageDropdown
                                        value={formData.language}
                                        onChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                                        label="Language"
                                        placeholder="Select language"
                                        required
                                    />

                                    {/* Niche Dropdown */}
                                    <NicheDropdown
                                        value={formData.niches}
                                        onChange={(value) => setFormData(prev => ({ ...prev, niches: value }))}
                                        niches={nichesData}
                                        label="Niche"
                                        placeholder="Select niche"
                                        loading={loadingData.niches}
                                        required
                                        multiple
                                    />

                                    {/* Categories Multi Select */}
                                    <CategoryMultiSelect
                                        value={formData.marketplaceCategory}
                                        onChange={(value) => setFormData(prev => ({ ...prev, marketplaceCategory: value }))}
                                        categories={categoriesData}
                                        label="Categories"
                                        placeholder="Select categories"
                                        loading={loadingData.categories}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons Card */}
                            <div className="bg-[#121212] rounded-xl border border-[#333] p-6">
                                <div className="space-y-4">
                                    {/* Save Button */}
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e6c064] disabled:from-[#bf953f]/50 disabled:to-[#d4af37]/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-all duration-200"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Discard Changes */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to discard all changes?')) {
                                                router.back()
                                            }
                                        }}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                        <span>Discard Changes</span>
                                    </button>

                                    {/* Delete Publisher */}
                                    <button
                                        type="button"
                                        onClick={handleDeletePublisher}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        <span>{loading ? 'Deleting...' : 'Delete Publisher'}</span>
                                    </button>

                                    {/* Metadata Section */}
                                    <div className="pt-4 border-t border-[#333]">
                                        <div className="text-gray-400 text-xs space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={12} />
                                                <div className="flex-1 flex justify-between">
                                                    <span>Created:</span>
                                                    <span className="text-white">
                                                        {new Date(publisher.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={12} />
                                                <div className="flex-1 flex justify-between">
                                                    <span>Last Updated:</span>
                                                    <span className="text-white">
                                                        {new Date(publisher.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {publisher.actionTakenBy && (
                                                <div className="flex items-center space-x-2">
                                                    <User size={12} />
                                                    <div className="flex-1 flex justify-between">
                                                        <span>Last Action By:</span>
                                                        <span className="text-white truncate max-w-[120px]">
                                                            {publisher.actionTakenBy.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {publisher.actionNote && (
                                                <div className="mt-2 p-2 bg-[#1a1a1a] rounded border border-[#333]">
                                                    <div className="text-xs text-gray-400 mb-1">Last Action Note:</div>
                                                    <div className="text-white text-xs">{publisher.actionNote}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPublisherPage