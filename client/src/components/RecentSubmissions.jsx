// src/components/RecentSubmissions.jsx
import React from "react";
import { Folder } from "lucide-react";

export default function RecentSubmissions({ submissions = [] }) {
    return (
        <div className="max-w-3xl mx-auto mt-8">
            {submissions?.length ? (
                <div className="grid gap-4">
                    {submissions.map((s, idx) => (
                        <div key={idx} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--text-md)]">{s.projectName || "Untitled Project"}</div>
                                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-1">{s.typeLabel} • {s.techStack}</div>
                                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">{new Date(s.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2">
                                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">{s.status}</span>
                                    </div>
                                    <div className="text-[var(--text-md)] font-[var(--font-heading)] mt-3">₹ {s.estimate?.final?.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-[var(--color-border)] rounded-lg p-12 text-center">
                    <Folder className="mx-auto w-10 h-10 text-[var(--color-tx-muted)]" />
                    <p className="mt-4 font-[var(--font-heading)] font-[var(--font-weight-md)]">No projects yet</p>
                    <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">Start by creating your first project above</p>
                </div>
            )}
        </div>
    );
}
