// src/components/ProjectForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { calculateEstimate, getPriceRangeForType, getTypeLabel, availableAddOns } from "../utils/priceEngine";
import { submitProject } from "../utils/api";
import jsPDF from "jspdf";

const Chip = ({ children, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[var(--text-sm)] ${active ? "bg-[var(--color-primary)] text-white border-transparent" : "bg-white text-[var(--color-tx-muted)] border-[var(--color-border)]"} cursor-pointer`}
    >
        {children}
    </button>
);

export default function ProjectForm({ typeKey, onSubmitComplete, onEstimateChange, onMetaUpdate }) {
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            // client info
            name: "",
            email: "",
            phone: "",
            company: "",
            // project
            projectName: "",
            description: "",
            techStack: "",
            resources: [],
            modules: [],
            addons: [],
            hosting: "cloud",
            cms: "",
            budget: 0,
            estimatedTimeWeeks: 4,
            wantQuotationEmail: true
        }
    });

    const [submitting, setSubmitting] = useState(false);
    const watchAll = watch();

    // suggested budget range from engine
    useEffect(() => {
        if (!typeKey) return;
        const [min, max] = getPriceRangeForType(typeKey);
        setValue("budget", Math.round((min + max) / 2));
        const stacks = {
            portfolio: "React",
            corporate: "React",
            ecommerce: "Next.js + Node",
            "basic-app": "Flutter",
            saas: "React + Node",
            "smart-contract": "Solidity"
        };
        setValue("techStack", stacks[typeKey] || "");
    }, [typeKey, setValue]);

    // tech options
    const techOptions = useMemo(() => {
        const map = {
            portfolio: ["React", "Next.js", "Gatsby"],
            corporate: ["React", "Next.js"],
            ecommerce: ["Next.js + Node", "Magento", "Shopify (managed)"],
            "basic-app": ["Flutter"],
            "enterprise-app": ["Flutter + Node", "React Native + Node"],
            saas: ["React + Node", "Next.js + Nest.js"],
            "smart-contract": ["Solidity", "Hardhat", "Truffle"]
        };
        return map[typeKey] || ["React"];
    }, [typeKey]);

    const addonList = Object.entries(availableAddOns).map(([k, v]) => ({ key: k, label: v.label }));

    const moduleOptions = [
        "Authentication",
        "Admin Panel",
        "Payments",
        "Product Management",
        "Analytics",
        "Notifications",
        "Multi-language",
        "Integrations (3rd-party)",
        "User Dashboard"
    ];

    // compute estimate (pure) whenever inputs change
    const estimate = useMemo(() => {
        if (!typeKey) return {};
        return calculateEstimate({
            typeKey,
            selectedTech: watchAll.techStack,
            addons: watchAll.addons || [],
            customMultiplier: 1,
            modules: watchAll.modules || []
        });
    }, [watchAll.addons, watchAll.techStack, watchAll.modules, typeKey]);

    // notify parent when estimate changes
    useEffect(() => {
        try {
            onEstimateChange?.(estimate);
        } catch (err) {
            console.error("onEstimateChange threw:", err);
        }
    }, [estimate, onEstimateChange]);

    // notify parent when projectName changes
    useEffect(() => {
        if (onMetaUpdate) {
            onMetaUpdate({ projectName: watchAll.projectName || "" });
        }
    }, [watchAll.projectName, onMetaUpdate]);

    // the async submit handler that calls the backend
    const onSubmit = async (data) => {
        const payload = {
            ...data,
            typeKey,
            typeLabel: getTypeLabel(typeKey),
            estimate,
            createdAt: new Date().toISOString(),
            status: "Submitted"
        };

        // optionally generate PDF (client-side) before sending
        if (data.wantQuotationEmail) {
            try {
                const doc = new jsPDF({ unit: "pt", format: "a4" });
                doc.setFontSize(14);
                doc.text("Quotation", 40, 60);
                doc.setFontSize(11);
                doc.text(`Client: ${data.name || "-"} (${data.email || "-"})`, 40, 90);
                doc.text(`Project: ${data.projectName || "-"}`, 40, 110);
                doc.text(`Type: ${getTypeLabel(typeKey)}`, 40, 130);
                doc.text(`Tech: ${data.techStack || "-"}`, 40, 150);
                doc.text(`Estimate: ₹ ${estimate.final?.toLocaleString() || 0}`, 40, 170);
                const deliverables = (estimate.addonsApplied || []).map((a) => a.label).join(", ");
                doc.text(`Deliverables: ${deliverables || "-"}`, 40, 190);
                // Save PDF locally for the user (non-blocking)
                doc.save(`${(data.projectName || "quotation").replace(/\s+/g, "_")}.pdf`);
            } catch (e) {
                console.error("PDF generation failed:", e);
                // continue: don't block submission
            }
        }

        // send to server
        setSubmitting(true);
        try {
            const resp = await submitProject(payload);
            // resp should be the JSON returned by server (we expect { ok:true, project: {...} })
            const projectRecord = resp?.project ?? resp;
            onSubmitComplete?.(projectRecord);
            alert("Project submitted and saved to server ✅");
            // clear the form (optional) — you can remove reset() if you prefer to keep inputs
            reset();
        } catch (err) {
            console.error("submitProject failed", err);
            // if err has message from API, show it
            const msg = err?.message || (err?.toString && err.toString()) || "Failed to submit project";
            alert(`Failed to submit: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--color-bg-card)] p-6 rounded-lg border border-[var(--color-border)] shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
                {/* CLIENT INFO */}
                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Full Name <span className="text-red-500">*</span></label>
                    <input {...register("name", { required: "Name is required" })} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                    {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Email <span className="text-red-500">*</span></label>
                    <input {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                    {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Phone <span className="text-red-500">*</span></label>
                    <input {...register("phone", { required: "Phone required" })} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                    {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Company (optional)</label>
                    <input {...register("company")} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
            </div>

            <hr className="my-4 border-[var(--color-border)]" />

            <div className="space-y-4">
                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Project Name <span className="text-red-500">*</span></label>
                    <input {...register("projectName", { required: "Project name required" })} placeholder="e.g., Marketing site revamp" className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3" />
                    {errors.projectName && <p className="text-red-500 text-[12px] mt-1">{errors.projectName.message}</p>}
                </div>

                <div>
                    <label className="block text-[var(--text-sm)] font-[var(--font-heading)]">Short Description <span className="text-red-500">*</span></label>
                    <textarea {...register("description", { required: "Give a short brief" })} rows={3} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3" />
                    {errors.description && <p className="text-red-500 text-[12px] mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[var(--text-sm)]">Preferred Tech Stack <span className="text-red-500">*</span></label>
                        <select {...register("techStack", { required: "Choose tech stack" })} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3">
                            <option value="">Select technology stack</option>
                            {techOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors.techStack && <p className="text-red-500 text-[12px] mt-1">{errors.techStack.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[var(--text-sm)]">Hosting Preference</label>
                        <select {...register("hosting")} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3">
                            <option value="shared">Shared Hosting (cheap)</option>
                            <option value="vps">VPS</option>
                            <option value="cloud">Cloud (AWS/GCP/Azure)</option>
                            <option value="managed">Managed (Vercel/Kinsta)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[var(--text-sm)]">Required Resources (choose)</label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {["Frontend Engineer", "Backend Engineer", "DevOps", "DBA", "UI/UX Designer", "Business Analyst"].map((r) => {
                            const active = (watchAll.resources || []).includes(r);
                            return <Chip key={r} active={active} onClick={() => {
                                const current = watchAll.resources || [];
                                if (current.includes(r)) setValue("resources", current.filter(c => c !== r));
                                else setValue("resources", [...current, r]);
                            }}>{r}</Chip>;
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[var(--text-sm)]">Functional Modules (optional)</label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {moduleOptions.map((m) => {
                            const active = (watchAll.modules || []).includes(m);
                            return <Chip key={m} active={active} onClick={() => {
                                const current = watchAll.modules || [];
                                if (current.includes(m)) setValue("modules", current.filter(c => c !== m));
                                else setValue("modules", [...current, m]);
                            }}>{m}</Chip>;
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[var(--text-sm)]">Add-ons</label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {addonList.map(a => {
                            const active = (watchAll.addons || []).includes(a.key);
                            return <Chip key={a.key} active={active} onClick={() => {
                                const current = watchAll.addons || [];
                                if (current.includes(a.key)) setValue("addons", current.filter(c => c !== a.key));
                                else setValue("addons", [...current, a.key]);
                            }}>{a.label}</Chip>;
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[var(--text-sm)]">Budget (INR)</label>
                    <div className="flex items-center gap-4 mt-2">
                        <Controller
                            name="budget"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="range"
                                    min={getPriceRangeForType(typeKey)[0] || 0}
                                    max={getPriceRangeForType(typeKey)[1] || 100000}
                                    step={1000}
                                    {...field}
                                    className="w-full"
                                />
                            )}
                        />
                        <div className="min-w-[120px] text-right">
                            <div className="text-sm text-[var(--color-tx-muted)]">Selected</div>
                            <div className="font-[var(--font-heading)] font-[var(--font-weight-md)]">₹ {Number(watchAll.budget || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                        Suggested: ₹ {getPriceRangeForType(typeKey)[0]?.toLocaleString() || 0} - ₹ {getPriceRangeForType(typeKey)[1]?.toLocaleString() || 0}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="block text-[var(--text-sm)]">Estimated Time (weeks)</label>
                        <input type="number" {...register("estimatedTimeWeeks")} min={1} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3" />
                    </div>

                    <div>
                        <label className="block text-[var(--text-sm)]">CMS / Backend (optional)</label>
                        <select {...register("cms")} className="mt-2 w-full rounded-md border border-[var(--color-border)] p-3">
                            <option value="">Select CMS / Backend</option>
                            <option>WordPress</option>
                            <option>Sanity</option>
                            <option>Strapi</option>
                            <option>Shopify</option>
                            <option>Custom</option>
                        </select>
                    </div>
                </div>

                {/* live estimate box */}
                <div className="rounded-md border border-[var(--color-border)] p-4 bg-[var(--color-bg-main)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Live Price Suggestion</div>
                            <div className="text-[var(--text-lg)] font-[var(--font-heading)] font-[var(--font-weight-lg)]">₹ {estimate.final?.toLocaleString() ?? 0}</div>
                            <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Base: ₹ {estimate.base?.toLocaleString() ?? 0}</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Range</span>
                            <span className="font-[var(--font-heading)]">₹ {estimate.suggestedMin?.toLocaleString() ?? 0} - ₹ {estimate.suggestedMax?.toLocaleString() ?? 0}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={submitting} className={`px-6 py-3 ${submitting ? "bg-[var(--color-bg-card)] text-[var(--color-tx-muted)]" : "bg-[var(--color-primary)] text-white"} rounded-md cursor-pointer`}>
                        {submitting ? "Submitting..." : "Submit Project"}
                    </button>
                    <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 border border-[var(--color-border)] rounded-md cursor-pointer">Reset</button>
                    <button type="button" onClick={() => {
                        // quick download the quote (same as submit PDF but not saving)
                        try {
                            const doc = new jsPDF({ unit: "pt", format: "a4" });
                            doc.setFontSize(14);
                            doc.text("Quick Quote", 40, 60);
                            doc.setFontSize(11);
                            doc.text(`Client: ${watchAll.name || "-"}`, 40, 90);
                            doc.text(`Project: ${watchAll.projectName || "-"}`, 40, 110);
                            doc.text(`Type: ${getTypeLabel(typeKey)}`, 40, 130);
                            doc.text(`Estimate: ₹ ${estimate.final?.toLocaleString() || 0}`, 40, 150);
                            doc.save(`${(watchAll.projectName || "quote").replace(/\s+/g, "_")}_quick.pdf`);
                        } catch (e) {
                            console.error("Quick quote failed:", e);
                            alert("Quick quote generation failed. Check console for details.");
                        }
                    }} className="px-4 py-2 border border-[var(--color-border)] rounded-md cursor-pointer">Download Quick Quote</button>
                </div>
            </div>
        </form>
    );
}
