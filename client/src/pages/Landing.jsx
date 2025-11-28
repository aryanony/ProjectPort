import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Rocket,
    Layers,
    Users,
    Settings,
    Briefcase,
    ClipboardCheck,
    BarChart3,
    MessageSquare,
    Mail,
    Phone,
    FileText,
    Send,
} from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import SEO from "../components/SEO";

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: "easeOut" },
    viewport: { once: true },
});

const Landing = () => {
    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
        file: null,
    });
    const [status, setStatus] = useState(null);

    function handleChange(e) {
        const { name, value, files } = e.target;
        if (files) {
            setContact((s) => ({ ...s, [name]: files[0] }));
        } else {
            setContact((s) => ({ ...s, [name]: value }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        // UI-only demo handler — replace with API call
        console.log("Contact submit:", contact);
        setStatus("Sending...");
        setTimeout(() => {
            setStatus("Your message has been sent. We will contact you soon.");
            setContact({
                name: "",
                email: "",
                phone: "",
                projectType: "",
                message: "",
                file: null,
            });
            setTimeout(() => setStatus(null), 6000);
        }, 900);
    }

    return (
        <>
            <SEO
                page="home"
                schemaType="website"
            />
            {/* <Header /> */}
            <main className=" pt-20 bg-[var(--color-bg-main)] text-[var(--color-tx-main)] font-[var(--font-body)]">
                {/* ================= HERO SECTION ================= */}
                <section className="max-w-6xl mx-auto px-6 py-20 text-center lg:text-left relative overflow-hidden">
                    <motion.div {...fadeIn()}>
                        <h1 className="text-[34px] md:text-[42px] font-[var(--font-heading)] font-[var(--font-weight-xl)] mb-4 text-[var(--color-accent2)] leading-tight">
                            Empowering Digital{" "}
                            <span className="text-[var(--color-secondary)]">Service</span>{" "}
                            Ecosystems
                        </h1>
                        <p className="text-[18px] md:text-[20px] text-[var(--color-tx-muted)] max-w-2xl mb-6">
                            One platform to plan projects, pick tech stacks, hire teams, and
                            deliver faster — all in one connected ecosystem.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                            <Link
                                to="/start-project"
                                className="px-6 py-3 text-white font-[var(--font-weight-md)] rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:scale-105 shadow-md transition"
                            >
                                Open Client Console
                            </Link>
                            <a
                                href="#admin"
                                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-accent2)] rounded-md hover:bg-[var(--color-bg-card)] hover:text-[var(--color-secondary)] transition"
                            >
                                View Admin Demo
                            </a>
                        </div>

                        <ul className="text-[var(--text-sm)] text-[var(--color-tx-muted)] space-y-2">
                            <li>⭐ Start a project in minutes</li>
                            <li>⭐ Transparent workflow & communication</li>
                            <li>⭐ Real-time status & milestone tracking</li>
                        </ul>
                    </motion.div>
                </section>

                {/* ================= SIMPLE PROJECT MANAGEMENT ================= */}
                <section id="features" className="bg-[var(--color-bg-card)] py-20 border-t border-[var(--color-border)]">
                    <motion.div {...fadeIn(0.1)} className="max-w-6xl mx-auto px-6 text-center">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">
                            Simple Project Management
                        </h2>
                        <p className="text-[var(--color-tx-muted)] max-w-2xl mx-auto mb-12">
                            Everything you need to start and manage digital projects in one place — powerful yet easy to use.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Briefcase size={26} />,
                                    title: "Project Types",
                                    items: ["Portfolio, SaaS, E-commerce, Hire", "Custom Platforms", "Crypto & Web3 Services", "Business Automation"],
                                },
                                {
                                    icon: <Layers size={26} />,
                                    title: "Tech Stack & Scale",
                                    items: ["React, Next, Vue, Angular", "Node, Python, PHP", "Scalable Backends", "Cloud-ready builds"],
                                },
                                {
                                    icon: <Users size={26} />,
                                    title: "Resources",
                                    items: ["Hire Developers, Designers", "Dedicated Managers", "Flexible Teams", "Custom Integrations"],
                                },
                                {
                                    icon: <Settings size={26} />,
                                    title: "Simple Admin",
                                    items: ["Approval Workflow", "Team Assignment", "Auto Reporting", "Integrated Payments"],
                                },
                            ].map((box, i) => (
                                <motion.div key={i} {...fadeIn(i * 0.1)} className="bg-[var(--color-bg-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex justify-center mb-3 text-[var(--color-primary)]">{box.icon}</div>
                                    <h3 className="font-[var(--font-heading)] text-[18px] md:text-[20px] font-[var(--font-weight-lg)] mb-3">{box.title}</h3>
                                    <ul className="text-[var(--text-sm)] text-[var(--color-tx-muted)] space-y-1">
                                        {box.items.map((item, j) => (
                                            <li key={j}>• {item}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ================= HOW IT WORKS ================= */}
                <section className="py-20 text-center bg-[var(--color-bg-main)]">
                    <motion.div {...fadeIn()} className="max-w-5xl mx-auto px-6">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">
                            How It Works
                        </h2>
                        <p className="text-[var(--color-tx-muted)] mb-12">Get started in three simple steps.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: <Rocket size={28} />, title: "Choose a Project Type", desc: "Select from Portfolio, SaaS, Web3, or E-commerce to begin." },
                                { icon: <ClipboardCheck size={28} />, title: "Fill Requirements", desc: "Add your tech stack, goals, and resource preferences." },
                                { icon: <BarChart3 size={28} />, title: "Get Quotation", desc: "Receive transparent pricing and milestones instantly." },
                            ].map((step, i) => (
                                <motion.div key={i} {...fadeIn(i * 0.15)} className="bg-[var(--color-bg-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-lg transition">
                                    <div className="text-[var(--color-secondary)] flex justify-center mb-3">{step.icon}</div>
                                    <h3 className="font-[var(--font-heading)] text-[18px] md:text-[20px] font-[var(--font-weight-lg)] mb-2">{step.title}</h3>
                                    <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <Link to="/start-project" className="mt-10 inline-block px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md font-[var(--font-weight-md)] shadow-md hover:scale-105 transition">
                            Start Your Project
                        </Link>
                    </motion.div>
                </section>

                {/* ================= TRANSPARENT PRICING ================= */}
                <section id="pricing" className="bg-[var(--color-bg-card)] py-20 border-t border-[var(--color-border)] text-center">
                    <motion.div {...fadeIn()} className="max-w-xl mx-auto px-6">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">
                            Transparent Pricing
                        </h2>
                        <p className="text-[var(--color-tx-muted)] mb-8">Transparent, project-based pricing with milestone control.</p>

                        <div className="border border-[var(--color-border)] rounded-xl p-10 shadow-sm hover:shadow-lg transition">
                            <h3 className="text-[18px] md:text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4 text-[var(--color-primary)]">Custom Project</h3>
                            <ul className="text-[var(--text-sm)] text-[var(--color-tx-muted)] space-y-2 mb-6">
                                <li>✓ Tailored pricing</li>
                                <li>✓ Milestone-based billing</li>
                                <li>✓ Zero hidden charges</li>
                            </ul>
                            <Link to="/start-project" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)]">Start a Project</Link>
                        </div>
                    </motion.div>
                </section>

                {/* ================= ADMIN DASHBOARD ================= */}
                <section id="admin" className="py-20 max-w-6xl mx-auto px-6">
                    <motion.div {...fadeIn()} className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">Admin Dashboard</h2>
                            <p className="text-[var(--color-tx-muted)] mb-6">
                                Full visibility for admins and developers — monitor progress, assign teams, and control payments with ease.
                            </p>
                            <ul className="text-[var(--text-sm)] text-[var(--color-tx-muted)] space-y-2">
                                <li>• Project Approval & Tracking</li>
                                <li>• Developer Assignment</li>
                                <li>• Payment Milestones</li>
                            </ul>
                        </div>

                        <div className="bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition">
                            <h3 className="font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 flex items-center gap-2 text-[var(--color-primary)]"><MessageSquare size={20} /> Project Queue</h3>
                            <ul className="text-[var(--text-sm)] text-[var(--color-tx-muted)] space-y-2">
                                <li>E-commerce Platform – Pending</li>
                                <li>Portfolio Website – Approved</li>
                                <li>Meme Coin Launch – 75% Complete</li>
                                <li>React Dashboard – 50% Complete</li>
                            </ul>
                        </div>
                    </motion.div>
                </section>

                {/* ================= FAQ SECTION ================= */}
                <section className="bg-[var(--color-bg-card)] py-20 border-t border-[var(--color-border)]">
                    <motion.div {...fadeIn()} className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">Frequently Asked Questions</h2>
                        <p className="text-[var(--color-tx-muted)] mb-12">Quick answers to common questions about ProjectPort.</p>

                        <div className="space-y-4 text-left">
                            {[
                                { q: "Can I hire only developers or designers?", a: "Yes, you can hire any specific role or a complete team as needed." },
                                { q: "Which stacks are supported?", a: "We support React, Next.js, Node, Python, PHP, and custom integrations." },
                                { q: "How do payments work?", a: "Payments are milestone-based and transparent through our secure system." },
                                { q: "Can I scale my project later?", a: "Yes, easily scale resources, timelines, and teams anytime." },
                            ].map((item, i) => (
                                <motion.details key={i} {...fadeIn(i * 0.1)} className="border border-[var(--color-border)] rounded-md p-4 bg-[var(--color-bg-card)]">
                                    <summary className="cursor-pointer font-[var(--font-heading)] text-[var(--text-md)]">{item.q}</summary>
                                    <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">{item.a}</p>
                                </motion.details>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ================= CLIENT TESTIMONIALS ================= */}
                <section className="py-20 text-center">
                    <motion.div {...fadeIn()} className="max-w-6xl mx-auto px-6">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">What Our Clients Say</h2>
                        <p className="text-[var(--color-tx-muted)] mb-12">Real feedback from clients using ProjectPort.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Sarah Chen", role: "E-commerce Startup", text: "ProjectPort made launching our platform easy and transparent. The process was seamless." },
                                { name: "Marcus Johnson", role: "Crypto Founder", text: "Excellent support and delivery speed. Loved the real-time progress updates." },
                                { name: "Emily Rodriguez", role: "Portfolio Client", text: "A professional experience from start to finish. Highly recommended." },
                            ].map((client, i) => (
                                <motion.div key={i} {...fadeIn(i * 0.15)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                    <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mb-4">“{client.text}”</p>
                                    <h4 className="font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--text-md)]">{client.name}</h4>
                                    <p className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">{client.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ================= CONTACT FORM ================= */}
                <section id="contact" className="py-20 bg-[var(--color-bg-card)] border-t border-[var(--color-border)]">
                    <motion.div {...fadeIn()} className="max-w-4xl mx-auto px-6">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-3 text-[var(--color-accent2)]">Contact Us</h2>
                        <p className="text-[var(--color-tx-muted)] mb-8">Tell us about your project — we’ll reply within 24 hours.</p>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* NAME */}
                            <label className="flex items-center gap-3 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)]">
                                <svg className="w-4 h-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                <input
                                    name="name"
                                    value={contact.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Full name"
                                    required
                                    className="w-full bg-transparent outline-none text-[var(--color-tx-main)]"
                                />
                            </label>

                            {/* EMAIL */}
                            <label className="flex items-center gap-3 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)]">
                                <Mail size={18} className="text-[var(--color-primary)]" />
                                <input
                                    name="email"
                                    value={contact.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full bg-transparent outline-none text-[var(--color-tx-main)]"
                                />
                            </label>

                            {/* PHONE */}
                            <label className="flex items-center gap-3 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)]">
                                <Phone size={18} className="text-[var(--color-primary)]" />
                                <input
                                    name="phone"
                                    value={contact.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    placeholder="Phone (optional)"
                                    className="w-full bg-transparent outline-none text-[var(--color-tx-main)]"
                                />
                            </label>

                            {/* PROJECT TYPE */}
                            <label className="flex items-center gap-3 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)]">
                                <Briefcase size={18} className="text-[var(--color-primary)]" />
                                <select name="projectType" value={contact.projectType} onChange={handleChange} required className="w-full bg-transparent outline-none text-[var(--color-tx-main)]">
                                    <option value="">Select project type</option>
                                    <option value="portfolio">Portfolio / Business</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="saas">SaaS</option>
                                    <option value="mobile">Mobile App</option>
                                    <option value="web3">Web3 / Blockchain</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                </select>
                            </label>

                            {/* MESSAGE */}
                            <label className="md:col-span-2 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)] flex gap-3">
                                <FileText size={18} className="text-[var(--color-primary)] mt-2" />
                                <textarea
                                    name="message"
                                    value={contact.message}
                                    onChange={handleChange}
                                    placeholder="Brief description of your project (goals, timeline, budget)"
                                    rows={5}
                                    required
                                    className="w-full bg-transparent outline-none text-[var(--color-tx-main)]"
                                />
                            </label>

                            {/* FILE */}
                            <label className="flex items-center gap-3 bg-[var(--color-bg-main)] p-3 rounded-md border border-[var(--color-border)]">
                                <input type="file" name="file" onChange={handleChange} className="text-[var(--color-tx-muted)]" />
                            </label>

                            {/* ACTION */}
                            <div className="md:col-span-2 flex items-center justify-between gap-4">
                                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition">
                                    <Send size={16} /> Send Message
                                </button>
                                <div className="text-[var(--color-tx-muted)] text-sm">{status ? status : "We reply within 24 hours."}</div>
                            </div>
                        </form>
                    </motion.div>
                </section>

                {/* ================= FINAL CTA ================= */}
                <section className="bg-[var(--color-primary)] text-white text-center py-20">
                    <motion.div {...fadeIn()} className="max-w-3xl mx-auto px-6">
                        <h2 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">Ready to Start Your Project?</h2>
                        <p className="text-[var(--text-sm)] mb-8 opacity-90">Join hundreds of satisfied clients who’ve built their vision with ProjectPort.</p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/start-project" className="px-6 py-3 bg-white text-[var(--color-primary)] font-[var(--font-weight-md)] rounded-md hover:bg-gray-100">Open Client Console</Link>
                            <a href="#contact" className="px-6 py-3 bg-secondary border border-white rounded-md hover:bg-white hover:text-[var(--color-primary)] transition">Learn More</a>
                        </div>
                    </motion.div>
                </section>

            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Landing;
