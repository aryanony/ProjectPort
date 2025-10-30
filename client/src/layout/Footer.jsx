import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[var(--color-bg-card)] text-[var(--color-text-body)] border-t border-[var(--color-border)] ">
            {/* ===== Top Footer ===== */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* ---- Brand Column ---- */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Link to="/">
                        <img src="/logo.svg" alt="ProjectPort" className="h-16 w-auto" />
                        </Link>
                    </div>
                    <p className="text-[var(--color-accent2)] text-sm leading-relaxed max-w-sm">
                        Streamlining digital project workflows — from client onboarding to
                        delivery. Simple. Smart. Seamless.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-3 mt-4">
                        <a
                            href="#"
                            className="p-2 rounded-full bg-[var(--color-bg-main)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        >
                            <Facebook size={16} />
                        </a>
                        <a
                            href="#"
                            className="p-2 rounded-full bg-[var(--color-bg-main)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        >
                            <Twitter size={16} />
                        </a>
                        <a
                            href="#"
                            className="p-2 rounded-full bg-[var(--color-bg-main)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        >
                            <Linkedin size={16} />
                        </a>
                    </div>
                </div>

                {/* ---- Quick Links ---- */}
                <div>
                    <h3 className="text-[var(--color-text-heading)] font-[var(--font-weight-lg)] mb-3">
                        Platform
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a
                                href="#features"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Features
                            </a>
                        </li>
                        <li>
                            <a
                                href="#pricing"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Pricing
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/start-project"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Client Console
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Admin Demo
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ---- Resources ---- */}
                <div>
                    <h3 className="text-[var(--color-text-heading)] font-[var(--font-weight-lg)] mb-3">
                        Resources
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a
                                href="#"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Terms & Privacy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                className="hover:text-[var(--color-primary)] transition-colors"
                            >
                                Contact Support
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ---- Contact ---- */}
                <div>
                    <h3 className="text-[var(--color-text-heading)] font-[var(--font-weight-lg)] mb-3">
                        Contact Us
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail size={15} className="text-[var(--color-primary)]" />
                            <span>aryanraj@engineer.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={15} className="text-[var(--color-primary)]" />
                            <span>+91 62056 50368</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin size={15} className="text-[var(--color-primary)] mt-1" />
                            <span>Noida, UP, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ===== Bottom Bar ===== */}
            <div className="bg-[var(--color-primary)] text-white text-sm py-4 px-5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-center md:text-left opacity-90">
                        © {new Date().getFullYear()} ProjectPort — All rights reserved.
                    </p>
                    <p className="text-center md:text-right text-[var(--color-accent2)] font-[var(--font-weight-md)] tracking-wide animate-pulse">
                        Empowering Digital Service Ecosystems
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
