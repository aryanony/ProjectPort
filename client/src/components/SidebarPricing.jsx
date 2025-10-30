// src/components/SidebarPricing.jsx
import React from "react";

export default function SidebarPricing({ estimate = {}, projectMeta = {}, onDownload }) {
    // estimate fields: base, addonsFlat, addonsPct, moduleFlat, pctAmount, final, suggestedMin, suggestedMax
    return (
        <aside className="w-full md:w-80 sticky top-20 self-start">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm">
                <h4 className="mb-2 font-[var(--font-weight-lg)] font-[var(--font-heading)] text-[18px] md:text-[20px]">Pricing Summary</h4>

                <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mb-3">Live estimate based on your selections</div>

                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Base</span>
                        <span className="font-[var(--font-heading)]">₹ {estimate.base?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Add-ons (flat)</span>
                        <span>₹ {estimate.addonsFlat?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Add-ons (%)</span>
                        <span>{estimate.addonsPct ?? 0}% (₹ {estimate.pctAmount?.toLocaleString() ?? 0})</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Modules</span>
                        <span>₹ {estimate.moduleFlat?.toLocaleString() ?? 0}</span>
                    </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3 mb-3">
                    <div className="flex justify-between items-center">
                        <span className="font-[var(--font-heading)]">Estimated Total</span>
                        <span className="text-[var(--text-lg)] font-[var(--font-weight-lg)]">₹ {estimate.final?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                        Range: ₹ {estimate.suggestedMin?.toLocaleString() ?? 0} - ₹ {estimate.suggestedMax?.toLocaleString() ?? 0}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onDownload && onDownload()}
                        className="flex-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-md cursor-pointer hover:opacity-95 transition"
                        title="Download Quotation"
                    >
                        Download Quote
                    </button>
                    <button
                        onClick={() => navigator.share ? navigator.share({
                            title: `Quote for ${projectMeta.projectName || "project"}`,
                            text: `Estimated: ₹ ${estimate.final?.toLocaleString() ?? 0}`,
                        }) : alert("Share not supported")}
                        className="px-3 py-2 border border-[var(--color-border)] rounded-md cursor-pointer"
                        title="Share quote"
                    >
                        Share
                    </button>
                </div>
            </div>

            <div className="mt-4 text-[var(--text-sm)] text-[var(--color-tx-muted)]">
                <strong>Tip:</strong> Add more modules or design options to refine your quote.
            </div>
        </aside>
    );
}
