import React, { useState, useEffect } from "react";
import { LogIn, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // === Detect scroll direction ===
    const controlHeader = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            // scroll down → hide header
            setShowHeader(false);
        } else {
            // scroll up → show header
            setShowHeader(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlHeader);
        return () => window.removeEventListener("scroll", controlHeader);
    }, [lastScrollY]);

    return (
        <header
            className={`fixed top-0 left-0 w-full bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] transition-all duration-500 z-50 ${showHeader ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
                {/* ---- Left: Logo ---- */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link to="/" >
                    <img
                        src="logo.svg"
                        alt="ProjectPort Logo"
                        className="h-12 w-auto select-none"
                    />
                    </Link>
                    {/* <h1 className="text-[var(--color-text-heading)] text-lg font-[var(--font-weight-lg)] tracking-tight">
                        ProjectPort
                    </h1> */}
                </div>

                {/* ---- Right: Buttons ---- */}
                <div className="flex items-center gap-3">
                    {/* Sign In button */}
                    <button
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] 
            text-[var(--color-text-heading)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] 
            transition-all duration-300 text-sm font-[var(--font-weight-md)]"
                    >
                        <LogIn size={16} />
                        Sign In
                    </button>

                    {/* Open Console button */}
                    <Link to="/start-project" className="cursor-pointer">
                    <button
                        className=" cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-white 
            bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] 
            transition-all duration-300 text-sm font-[var(--font-weight-md)] shadow-md hover:shadow-[var(--shadow-medium)]"
                    >
                        <LayoutDashboard size={16} />
                        Open Console
                    </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
