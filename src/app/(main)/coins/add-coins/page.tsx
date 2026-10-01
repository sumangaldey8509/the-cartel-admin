"use client";

import { useState } from "react";
import Heading from "@/components/common/heading/heading";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Rocket, Calendar, Clock, FileText, Hash, CheckCircle, AlertCircle, Info } from "lucide-react";
import appClient from "@/lib/appClient";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import { useRouter } from "next/navigation";

// Validation Schema
const CoinSchema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[A-Za-z0-9 ]{3,30}$/, "Name must be 3–30 characters (letters & numbers only)")
        .required("Coin name is required"),
    symbol: Yup.string()
        .matches(/^[A-Z0-9]{2,10}$/, "Symbol must be 2–10 characters (uppercase letters and numbers only)")
        .required("Symbol is required"),
    launchDate: Yup.date().required("Launch date is required"),
    time: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format")
        .required("Time is required"),
    description: Yup.string().max(300, "Description must be under 300 characters"),
});

interface CoinFormValues {
    name: string;
    symbol: string;
    launchDate: string;
    time: string;
    description: string;
    status: string;
}

const Page = () => {

    const router = useRouter()

    const initialValues: CoinFormValues = {
        name: "",
        symbol: "",
        launchDate: "",
        time: "",
        description: "",
        status: "upcoming"
    };

    const handleSubmit = async (values: CoinFormValues) => {

        const toastId = toastLoading("Creating Coin...", {
            description: "Please wait while we create the Coin"
        })

        try {
            // Combine date and time
            const launchDateTime = new Date(`${values.launchDate}T${values.time}`);
            const coinData = {
                ...values,
                launchDate: launchDateTime.toISOString()
            };

            console.log({ coinData })

            const res = await appClient.post("/api/coins/create", coinData);

            console.log({ res })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Coin Added", {
                    description: res?.data.message || "Coin is added"
                })

                router.push("/coins")

            }

        } catch (err) {
            console.error(err);
            alert("Error creating coin");
        }
    };

    return (
        <div className="p-4">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Heading
                        heading="🚀 Create Coin Listing"
                        subHeading="Provide coin details, launch date, and description to list it on the community platform."
                    />
                </div>

                <div className="mx-auto max-w-3xl">
                    {/* Form Panel */}
                    <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-2xl border border-[#333] p-6 md:p-8">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={CoinSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-[#C0C0C0] flex items-center">
                                                <Hash size={16} className="mr-2 text-[#bf953f]" />
                                                Coin Name *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="name"
                                                    type="text"
                                                    placeholder="e.g., Bitcoin"
                                                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-text-heading placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent transition-all"
                                                />
                                                {values.name && values.name.length >= 3 && (
                                                    <CheckCircle size={16} className="absolute right-3 top-3.5 text-green-400" />
                                                )}
                                            </div>
                                            <ErrorMessage name="name" component="div" className="text-red-400 text-sm flex items-center mt-1" />
                                        </div>

                                        {/* Symbol */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-[#C0C0C0] flex items-center">
                                                <Rocket size={16} className="mr-2 text-[#bf953f]" />
                                                Symbol *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="symbol"
                                                    type="text"
                                                    placeholder="e.g., BTC"
                                                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-text-heading placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent transition-all uppercase"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setFieldValue("symbol", e.target.value.toUpperCase());
                                                    }}
                                                />
                                                {values.symbol && /^[A-Z0-9]{2,10}$/.test(values.symbol) && (
                                                    <CheckCircle size={16} className="absolute right-3 top-3.5 text-green-400" />
                                                )}
                                            </div>
                                            <ErrorMessage name="symbol" component="div" className="text-red-400 text-sm flex items-center mt-1" />
                                        </div>

                                        {/* Launch Date */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#C0C0C0] flex items-center">
                                                <Calendar size={16} className="mr-2 text-[#bf953f]" />
                                                Launch Date *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="launchDate"
                                                    type="date"
                                                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-text-heading focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent transition-all"
                                                />
                                                {values.launchDate && (
                                                    <CheckCircle size={16} className="absolute right-3 top-3.5 text-green-400" />
                                                )}
                                            </div>
                                            <ErrorMessage name="launchDate" component="div" className="text-red-400 text-sm flex items-center mt-1" />
                                        </div>

                                        {/* Time */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#C0C0C0] flex items-center">
                                                <Clock size={16} className="mr-2 text-[#bf953f]" />
                                                Launch Time (UTC) *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="time"
                                                    type="time"
                                                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-text-heading focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent transition-all"
                                                />
                                                {values.time && (
                                                    <CheckCircle size={16} className="absolute right-3 top-3.5 text-green-400" />
                                                )}
                                            </div>
                                            <ErrorMessage name="time" component="div" className="text-red-400 text-sm flex items-center mt-1" />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-[#C0C0C0] flex items-center">
                                                <FileText size={16} className="mr-2 text-[#bf953f]" />
                                                Description
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    rows={4}
                                                    placeholder="Describe your coin (max 300 characters)..."
                                                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-text-heading placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent transition-all resize-none"
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-[#666]">
                                                    {values.description.length}/300
                                                </div>
                                            </div>
                                            <ErrorMessage name="description" component="div" className="text-red-400 text-sm flex items-center mt-1" />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 px-6 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-text-heading rounded-lg font-bold hover:from-[#d4af37] hover:to-[#bf953f] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:from-[#bf953f] disabled:hover:to-[#aa771c] flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Creating Coin...
                                                </>
                                            ) : (
                                                <>
                                                    <Rocket size={18} className="mr-2" />
                                                    Launch Coin Listing
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Form Status */}
                                    {isSubmitting && (
                                        <div className="p-3 bg-[#bf953f]/10 border border-[#bf953f] rounded-lg flex items-center">
                                            <AlertCircle size={16} className="text-[#bf953f] mr-2" />
                                            <span className="text-[#bf953f] text-sm">Submitting your coin listing...</span>
                                        </div>
                                    )}

                                    {/* Required Fields Note */}
                                    <div className="text-center">
                                        <p className="text-[#666] text-sm">* Required fields</p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;