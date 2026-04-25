// src/components/ProjectTypeCard.jsx
import React from "react";
import { Globe, ShoppingCart, Grid, Box, Code, ServerCog, Cpu } from "lucide-react";

const iconMap = {
    portfolio: <Globe className="w-6 h-6" />,
    corporate: <Grid className="w-6 h-6" />,
    ecommerce: <ShoppingCart className="w-6 h-6" />,
    transactional: <ServerCog className="w-6 h-6" />,
    saas: <Cpu className="w-6 h-6" />,
    "basic-app": <Code className="w-6 h-6" />,
    "enterprise-app": <ServerCog className="w-6 h-6" />,
    "smart-contract": <Box className="w-6 h-6" />
};

export default function ProjectTypeCard({ type, selected, onSelect }) {
    return (
        <button
            onClick={() => onSelect(type.key)}
            className={`group w-full text-left rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${selected ? "ring-4 ring-[var(--color-primary)] bg-[var(--color-bg-card)]" : "border border-[var(--color-border)] bg-white"} cursor-pointer`}
            aria-pressed={selected}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className="rounded-full p-2 bg-[var(--color-bg-main)]" style={{ color: "var(--color-primary)" }} aria-hidden>
                        {iconMap[type.key] ?? <Globe className="w-6 h-6" />}
                    </span>
                    <div>
                        <div className="text-sm font-[var(--font-heading)] font-[var(--font-weight-lg)]">{type.label}</div>
                        <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-1">{type.tag}</div>
                    </div>
                </div>

                <div className="text-xs font-semibold text-[var(--color-tx-muted)] self-start">{type.tag}</div>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <button className="w-full px-3 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm hover:opacity-95 transition cursor-pointer">
                    Configure Project
                </button>
            </div>
        </button>
    );
}
