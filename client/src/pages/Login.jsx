import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                navigate(data.user.role === 'admin' ? '/admin' : '/client');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] pt-24 pb-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-lg border border-[var(--color-border)] p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                            Welcome Back
                        </h1>
                        <p className="text-[var(--color-tx-muted)] mt-2">Sign in to your ProjectPort account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-tx-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-tx-muted)]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--color-tx-muted)]">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-tx-muted)] text-center">
                            Demo Credentials:<br />
                            Admin: admin@projectport.com / admin123<br />
                            Client: client@example.com / client123
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;