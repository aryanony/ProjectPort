// src/pages/ClientConsole.jsx
import React, { useState, useCallback } from "react";
import ProjectTypeCard from "../components/ProjectTypeCard";
import ProjectForm from "../components/ProjectForm";
import RecentSubmissions from "../components/RecentSubmissions";
import SidebarPricing from "../components/SidebarPricing";
import { listProjectTypes, getTypeLabel } from "../utils/priceEngine";
import { Bell, HelpCircle } from "lucide-react";

export default function ClientConsole() {
    const projectTypes = listProjectTypes();
    const [selected, setSelected] = useState(projectTypes[0]?.key ?? null);
    const [submissions, setSubmissions] = useState([]);
    const [currentEstimate, setCurrentEstimate] = useState({});
    const [currentMeta, setCurrentMeta] = useState({});

    // stable handlers to avoid re-render loops
    const handleSelect = useCallback((k) => setSelected(k), []);
    const handleSubmitComplete = useCallback((payload) => {
        setSubmissions((s) => [payload, ...s]);
        alert("Project submitted successfully! A quote (PDF) has been provided if opted.");
    }, []);
    const handleEstimateChange = useCallback((est) => setCurrentEstimate(est || {}), []);
    const handleMetaUpdate = useCallback((meta) => setCurrentMeta(meta || {}), []);

    // download handler (delegate to sidebar button)
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

    return (
        <main className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-tx-main)] font-[var(--font-body)]">
            <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="text-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--text-lg)]">ProjectPort</div>
                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Empowering Digital Service Ecosystems</div>
                </div>
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[var(--color-tx-muted)]" />
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden">
                        <img alt="avatar" src="/src/assets/logo/icon.png" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <section className="max-w-4xl mx-auto px-6 text-center py-8">
                <h1 className=" text-[34px] md:text-[42px] font-[var(--font-heading)] text-[var(--color-accent2)] leading-tight font-[var(--font-weight-xl)]">Welcome to Your Project Hub</h1>
                <p className="mt-2 text-[18px] md:text-[20px] text-[var(--color-tx-muted)]">Choose your project type and configure it in minutes. Our team will handle the rest.</p>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-6">
                <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)]  text-[var(--color-accent2)] text-center mb-6">Start a New Project</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {projectTypes.map((t) => (
                        <ProjectTypeCard key={t.key} type={t} selected={t.key === selected} onSelect={handleSelect} />
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-[var(--font-weight-lg)] font-[var(--font-heading)] text-[18px] md:text-[20px] ">Project Configuration</h3>
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
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <SidebarPricing estimate={currentEstimate} projectMeta={{ projectName: currentMeta.projectName }} onDownload={handleDownload} />
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-8">
                <h3 className="font-[var(--font-weight-lg)] font-[var(--font-heading)] text-[18px] md:text-[20px] text-center">Recent Submissions</h3>
                <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] text-center mb-6">Track your submitted projects and their current status</p>
                <RecentSubmissions submissions={submissions} />
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)"><path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">Fast Delivery</div>
                        <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">Quick turnaround times without compromising on quality</p>
                    </div>

                    <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)"><path d="M12 12v9" strokeWidth="2" /></svg>
                        </div>
                        <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">Expert Team</div>
                        <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">Skilled professionals with years of industry experience</p>
                    </div>

                    <div className="p-6 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="green"><path d="M12 2v4" strokeWidth="2" /></svg>
                        </div>
                        <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)]">Secure & Reliable</div>
                        <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">Enterprise-grade security and 99.9% uptime guarantee</p>
                    </div>
                </div>
            </section>

            <footer className="mt-12 pb-12"></footer>
        </main>
    );
}
