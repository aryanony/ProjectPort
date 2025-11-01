import React, { useState, useEffect } from "react";
import { LogIn, LayoutDashboard, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ user, onLogout }) => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // === Detect scroll direction ===
    const controlHeader = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            setShowHeader(false);
        } else {
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
            className={`fixed top-0 left-0 w-full bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] transition-all duration-500 z-50 ${
                showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
                {/* ---- Left: Logo ---- */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link to="/">
                        <img
                            src="/logo.svg"
                            alt="ProjectPort Logo"
                            className="h-12 w-auto select-none"
                        />
                    </Link>
                </div>

                {/* ---- Right: Buttons ---- */}
                <div className="flex items-center gap-3">
                    {user ? (
                        // === Logged In State ===
                        <>
                            {/* Dashboard Link */}
                            <Link 
                                to={user.role === 'admin' ? '/admin' : '/client'} 
                                className="cursor-pointer"
                            >
                                <button
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] 
                                    text-[var(--color-text-heading)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] 
                                    transition-all duration-300 text-sm font-[var(--font-weight-md)]"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </button>
                            </Link>

                            {/* User Info */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-main)] rounded-lg border border-[var(--color-border)]">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-medium text-sm">
                                    {user.full_name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-[var(--color-text-heading)]">
                                        {user.full_name}
                                    </p>
                                    <p className="text-xs text-[var(--color-tx-muted)] capitalize">
                                        {user.role}
                                    </p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 
                                text-red-600 hover:bg-red-50 hover:border-red-300 
                                transition-all duration-300 text-sm font-[var(--font-weight-md)]"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        // === Not Logged In State ===
                        <>
                            {/* Sign In button */}
                            <Link to="/login" className="cursor-pointer">
                                <button
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] 
                                    text-[var(--color-text-heading)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] 
                                    transition-all duration-300 text-sm font-[var(--font-weight-md)]"
                                >
                                    <LogIn size={16} />
                                    Sign In
                                </button>
                            </Link>

                            {/* Open Console button */}
                            <Link to="/start-project" className="cursor-pointer">
                                <button
                                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-white 
                                    bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] 
                                    transition-all duration-300 text-sm font-[var(--font-weight-md)] shadow-md hover:shadow-[var(--shadow-medium)]"
                                >
                                    <LayoutDashboard size={16} />
                                    Start Project
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;