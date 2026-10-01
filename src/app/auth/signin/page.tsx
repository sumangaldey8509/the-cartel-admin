"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useState } from "react";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import appClient from "@/lib/appClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks/hooks";
import { signin } from "@/store/slices/authSlice";


type FormData = { email: string; password: string }

const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password too short")
        .required("Password is required"),
});

export default function AdminSignInPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    const dispatch = useAppDispatch()

    const searchParams = useSearchParams()
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";


    const initials = { email: "", password: "", remember: false }

    const handleSubmit = async (values: FormData) => {
        setLoading(true)
        const toastId = toastLoading("Logging you in...", {
            description: "Checking your credentials, please wait.",
        });

        try {
            const res = await appClient.post("/api/auth/signin", values);

            if (res.data.status) {
                const user = res.data.user
                user.accessToken = res.data.accessToken
                toastUpdate(toastId, "success", "You're signed in", {
                    description: res.data?.message || "Welcome back!"
                })
                setLoading(false)

                if (user.role.length === 0) {
                    toastUpdate(toastId, "error", "Access denied", {
                        description: "You do not have permission to access"
                    })

                    return;
                }

                dispatch(signin({ user }))
                router.replace(callbackUrl)
            } else {
                toastUpdate(toastId, "error", "Sign in failed", {
                    description: res.data?.message || "Something went wrong. Please try again."
                })
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
        }



    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#000] px-4 relative overflow-hidden">
            {/* Aggressive background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Diagonal lines for aggressive look */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_49%,_#c9303020_50%,_transparent_51%)] bg-[length:10px_10px]"></div>

                {/* Chain link pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M5MzAzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M5MzAzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M5MzAzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M5MzAzMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjM1IiB5MT0iMjAiIHgyPSI0NSIgeTI9IjIwIiBzdHJva2U9IiNjOTMwMzAiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIzNSIgeTE9IjYwIiB4Mj0iNDUiIHkyPSI2MCIgc3Ryb2tlPSIjYzkzMDMwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]"></div>

                {/* Sharp corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#c93030]"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#c93030]"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#c93030]"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#c93030]"></div>

                {/* Aggressive diagonal bars */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#c93030] transform -skew-y-3 origin-left"></div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[#c93030] transform skew-y-3 origin-left"></div>
            </div>

            <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-[#c93030] rounded-none shadow-2xl p-6 sm:p-8 relative z-10 transform transition-all hover:shadow-red">
                {/* Barbed wire top and bottom */}
                <div className="absolute -top-2 left-0 right-0 h-4 flex justify-between">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-4 h-4 relative">
                            <div className="absolute w-4 h-4 border-2 border-[#c93030] rounded-full"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c93030]"></div>
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#c93030]"></div>
                        </div>
                    ))}
                </div>

                <div className="absolute -bottom-2 left-0 right-0 h-4 flex justify-between">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-4 h-4 relative">
                            <div className="absolute w-4 h-4 border-2 border-[#c93030] rounded-full"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#c93030]"></div>
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#c93030]"></div>
                        </div>
                    ))}
                </div>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative p-1 bg-[#c93030] rounded-full">
                        <div className="bg-black p-2 rounded-full">
                            <Image
                                src="/assets/logo_svg.png"
                                alt="The Cartel"
                                width={70}
                                height={70}
                                className="filter brightness-125"
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#c93030] mt-4 uppercase tracking-wider border-b-2 border-[#c93030] pb-2">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-[#c0c0c0] mt-2 uppercase tracking-widest">
                        The Cartel • Restricted Access
                    </p>
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={initials}
                    validationSchema={SignInSchema}
                    onSubmit={async (values) => {
                        handleSubmit(values)
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            {/* Email */}
                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="admin@thecoincartel.com"
                                    className="w-full px-4 py-3 bg-black text-[#c0c0c0] placeholder-[#555] border-2 border-[#333] focus:outline-none focus:border-[#c93030] transition-all uppercase text-sm"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-[#ff6b6b] text-xs mt-1 font-bold"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-black text-[#c0c0c0] placeholder-[#555] border-2 border-[#333] focus:outline-none focus:border-[#c93030] transition-all uppercase pr-12 text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c93030] hover:text-[#ff5252]"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-[#ff6b6b] text-xs mt-1 font-bold"
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-end text-sm">
                                <a
                                    href="#"
                                    className="text-[#c93030] hover:text-[#ff5252] transition font-bold uppercase tracking-wider"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Aggressive Sign In Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full py-3 bg-[#c93030] text-black font-bold uppercase tracking-widest border-2 border-[#c93030] hover:bg-black hover:text-[#c93030] transition-all duration-300 disabled:opacity-50 relative overflow-hidden group shadow-lg shadow-[#c9303050]"
                            >
                                <span className="relative z-10 text-sm">
                                    {loading ? "ACCESSING..." : "SIGN IN"}
                                </span>
                                <div className="absolute inset-0 bg-black transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Warning message */}
                <div className="mt-6 p-3 border-2 border-[#c93030] bg-[#c9303010] text-center">
                    <p className="text-xs text-[#c93030] font-bold uppercase tracking-widest">
                        ⚠️ UNAUTHORIZED ACCESS WILL BE DEALT WITH SEVERELY ⚠️
                    </p>
                </div>
            </div>

            {/* Add custom styles */}
            <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .hover\:shadow-red:hover {
          box-shadow: 0 0 20px #c93030, 0 0 30px #c9303040;
        }
      `}</style>
        </div>
    );
}