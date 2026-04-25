// src/pages/ClientConsole.jsx - For leads (no authentication required)
import React, { useState, useCallback } from "react";
import ProjectTypeCard from "../components/ProjectTypeCard";
import ProjectForm from "../components/ProjectForm";
import SidebarPricing from "../components/SidebarPricing";
import SEO from "../components/SEO";
import { listProjectTypes, getTypeLabel } from "../utils/priceEngine";
import { HelpCircle, CheckCircle } from "lucide-react";

export default function ClientConsole() {
    const projectTypes = listProjectTypes();
    const [selected, setSelected] = useState(projectTypes[0]?.key ?? null);
    const [currentEstimate, setCurrentEstimate] = useState({});
    const [currentMeta, setCurrentMeta] = useState({});
    const [currentFormData, setCurrentFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = useCallback((k) => setSelected(k), []);

    const handleSubmitComplete = useCallback((payload) => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleEstimateChange = useCallback((est) => setCurrentEstimate(est || {}), []);
    const handleMetaUpdate = useCallback((meta) => {
        setCurrentMeta(meta || {});
        setCurrentFormData(meta || {});
    }, []);

    const handleDownload = useCallback(() => {
        const body = `
      <h1>Quotation for ${currentMeta.projectName || "Project"}</h1>
      <p>Type: ${getTypeLabel(selected)}</p>
      <p>Estimate: ₹ ${currentEstimate.final?.toLocaleString() ?? 0}</p>
      <p>Range: ₹ ${currentEstimate.suggestedMin?.toLocaleString() ?? 0} - ₹ ${currentEstimate.suggestedMax?.toLocaleString() ?? 0}</p>
    `;
        const w = window.open("", "_blank");
        if (w) {
            w.document.write(body);
            w.document.close();
        } else {
            alert("Popup blocked. Please allow popups to download the quote.");
        }
    }, [currentEstimate, currentMeta, selected]);

    if (submitted) {
        return (
            <main className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-tx-main)] font-[var(--font-body)] pt-20">
                <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-12 border border-[var(--color-border)]">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-[32px] font-[var(--font-heading)] font-[var(--font-weight-xl)] text-[var(--color-accent2)] mb-4">
                            Thank You for Your Inquiry!
                        </h1>
                        <p className="text-[18px] text-[var(--color-tx-muted)] mb-6">
                            We've received your project details and will review them shortly.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <h3 className="font-[var(--font-heading)] font-medium mb-2">What Happens Next?</h3>
                            <ul className="text-sm text-left space-y-2 text-[var(--color-tx-muted)]">
                                <li>✓ Our team will review your project requirements</li>
                                <li>✓ We'll send you a detailed quotation within 24 hours</li>
                                <li>✓ Once approved, we'll create your client account</li>
                                <li>✓ You'll receive login credentials to track your project</li>
                            </ul>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                            >
                                Submit Another Inquiry
                            </button>
                            <a
                                href="/"
                                className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-main)] transition"
                            >
                                Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <SEO
                page="startProject"
                schemaType="service"
            />

            <main className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-tx-main)] font-[var(--font-body)]">
                <div className="max-w-7xl mx-auto px-6 py-6 pt-24">
                    <div className="text-center mb-8">
                        <h1 className="text-[34px] md:text-[42px] font-[var(--font-heading)] text-[var(--color-accent2)] leading-tight font-[var(--font-weight-xl)]">
                            Start Your Project
                        </h1>
                        <p className="mt-2 text-[18px] md:text-[20px] text-[var(--color-tx-muted)]">
                            Tell us about your project and get a free quote within 24 hours
                        </p>
                    </div>
                </div>

                <section className="max-w-7xl mx-auto px-6 py-6">
                    <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)] text-center mb-6">
                        Choose Your Project Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {projectTypes.map((t) => (
                            <ProjectTypeCard key={t.key} type={t} selected={t.key === selected} onSelect={handleSelect} />
                        ))}
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-[var(--font-weight-lg)] font-[var(--font-heading)] text-[18px] md:text-[20px]">
                            Project Details
                        </h3>
                        <div className="flex items-center gap-2 text-[var(--color-tx-muted)]">
                            <HelpCircle className="w-5 h-5" />
                            <span>Fill in the details for your {getTypeLabel(selected)} project</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ProjectForm
                                typeKey={selected}
                                onSubmitComplete={handleSubmitComplete}
                                onEstimateChange={handleEstimateChange}
                                onMetaUpdate={handleMetaUpdate}
                                isLead={true}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <SidebarPricing
                                estimate={currentEstimate}
                                projectMeta={{ projectName: currentMeta.projectName }}
                                onDownload={handleDownload}
                            />
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)">
                                    <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">Fast Response</div>
                            <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                                Get your quote within 24 hours
                            </p>
                        </div>

                        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)">
                                    <path d="M12 12v9" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">Expert Team</div>
                            <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                                Experienced professionals ready to help
                            </p>
                        </div>

                        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="green">
                                    <path d="M12 2v4" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">No Commitment</div>
                            <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                                Free quote with no obligations
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="mt-12 pb-12"></footer>
            </main>
        </>
    );
}