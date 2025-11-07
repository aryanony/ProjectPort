import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Building, Calendar, CheckCircle, X, Eye, User, ArrowLeft, Trash2, XCircle, Copy, Check } from 'lucide-react';

const AdminLeads = ({ user }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [password, setPassword] = useState('');
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        fetch('http://localhost:4000/api/leads', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) setLeads(data.leads);
            })
            .catch(err => {
                console.error('Failed to load leads:', err);
            })
            .finally(() => setLoading(false));
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
    };

    const handleConvert = async () => {
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setConverting(true);
        setError('');
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:4000/api/leads/${selectedLead.id}/convert`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (data.ok) {
                setGeneratedCredentials({
                    email: data.user.email,
                    password: data.user.password,
                    name: data.user.full_name
                });
                setSuccess(`Client account created successfully!`);
                loadLeads();
                // Don't close modal immediately, show credentials
            } else {
                setError(data.error || 'Failed to convert lead');
            }
        } catch (err) {
            console.error('Convert error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setConverting(false);
        }
    };

    const handleDelete = async (leadId) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:4000/api/leads/${leadId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                loadLeads();
                setSuccess('Lead deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Failed to delete lead');
        }
    };

    const handleReject = async (leadId) => {
        if (!confirm('Are you sure you want to reject this lead?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:4000/api/leads/${leadId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                loadLeads();
                setSuccess('Lead rejected');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Failed to reject lead');
        }
    };

    const closeConvertModal = () => {
        setShowConvertModal(false);
        setGeneratedCredentials(null);
        setPassword('');
        setError('');
        setSelectedLead(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800 border-blue-200',
            contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            converted: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link
                                to="/admin"
                                className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </Link>
                            <h1 className="text-[32px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                                Lead Inquiries
                            </h1>
                            <p className="text-[var(--color-tx-muted)] mt-1">
                                Manage incoming project inquiries and convert to clients
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-900">
                                    {leads.filter(l => l.status === 'new').length} New Leads
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                        >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-700">{success}</span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                        >
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-red-700">{error}</span>
                        </motion.div>
                    )}

                    {/* Leads Table */}
                    {leads.length > 0 ? (
                        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[var(--color-bg-main)]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Budget</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="hover:bg-[var(--color-bg-main)] transition">
                                                <td className="px-6 py-4 text-sm font-medium">#{lead.id}</td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            <User className="w-4 h-4 text-[var(--color-tx-muted)]" />
                                                            {lead.full_name}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-tx-muted)] flex items-center gap-2 mt-1">
                                                            <Mail className="w-3 h-3" />
                                                            {lead.email}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-tx-muted)] flex items-center gap-2 mt-1">
                                                            <Phone className="w-3 h-3" />
                                                            {lead.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{lead.project_name}</div>
                                                    <div className="text-xs text-[var(--color-tx-muted)] mt-1">{lead.type_label}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    ₹ {lead.budget?.toLocaleString() || 0}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[var(--color-tx-muted)]">
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setSelectedLead(lead)}
                                                            className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm flex items-center gap-1 transition"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {lead.status !== 'converted' && lead.status !== 'rejected' && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedLead(lead);
                                                                        setShowConvertModal(true);
                                                                        generatePassword();
                                                                    }}
                                                                    className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 transition"
                                                                    title="Convert to Client"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(lead.id)}
                                                                    className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1 transition"
                                                                    title="Reject Lead"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(lead.id)}
                                                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition"
                                                            title="Delete Lead"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)]">
                            <Users className="w-20 h-20 text-[var(--color-tx-muted)] mx-auto mb-6" />
                            <h2 className="text-2xl font-[var(--font-heading)] font-medium mb-2">No Leads Yet</h2>
                            <p className="text-[var(--color-tx-muted)]">Incoming project inquiries will appear here</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && !showConvertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-[var(--font-heading)] font-bold text-[var(--color-accent2)]">Lead Details</h2>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2 text-[var(--color-accent2)]">
                                    <User className="w-5 h-5 text-[var(--color-primary)]" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Name</p>
                                        <p className="font-medium">{selectedLead.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Email</p>
                                        <p className="font-medium">{selectedLead.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Phone</p>
                                        <p className="font-medium">{selectedLead.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Company</p>
                                        <p className="font-medium">{selectedLead.company || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="border-b pb-4">
                                <h3 className="font-medium mb-3 text-[var(--color-accent2)]">Project Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Project Name</p>
                                        <p className="font-medium text-lg">{selectedLead.project_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Type</p>
                                        <p className="font-medium">{selectedLead.type_label}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Tech Stack</p>
                                        <p className="font-medium">{selectedLead.tech_stack}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--color-tx-muted)]">Description</p>
                                        <p className="font-medium">{selectedLead.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[var(--color-tx-muted)]">Budget</p>
                                            <p className="font-medium text-lg">₹ {selectedLead.budget?.toLocaleString() || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[var(--color-tx-muted)]">Duration</p>
                                            <p className="font-medium">{selectedLead.estimated_weeks} weeks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {selectedLead.status !== 'converted' && selectedLead.status !== 'rejected' && (
                                    <button
                                        onClick={() => {
                                            setShowConvertModal(true);
                                            generatePassword();
                                        }}
                                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Convert to Client
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Convert Modal */}
            {showConvertModal && selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-md w-full p-8"
                    >
                        {!generatedCredentials ? (
                            <>
                                <h2 className="text-2xl font-[var(--font-heading)] font-bold mb-4 text-[var(--color-accent2)]">
                                    Convert to Client
                                </h2>
                                <p className="text-[var(--color-tx-muted)] mb-6">
                                    Create a client account for <strong>{selectedLead.full_name}</strong>
                                </p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span className="text-sm text-red-700">{error}</span>
                                    </div>
                                )}

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email (Login ID)</label>
                                        <input
                                            type="email"
                                            value={selectedLead.email}
                                            disabled
                                            className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Password</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter password (min 6 chars)"
                                                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                            <button
                                                onClick={generatePassword}
                                                className="px-4 py-2 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg hover:bg-gray-100 transition text-sm"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                        <p className="text-xs text-[var(--color-tx-muted)] mt-1">
                                            This password will be shared with the client
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleConvert}
                                        disabled={converting}
                                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                    >
                                        {converting ? 'Converting...' : 'Create Account & Project'}
                                    </button>
                                    <button
                                        onClick={closeConvertModal}
                                        className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-[var(--font-heading)] font-bold text-[var(--color-accent2)]">
                                        Client Created Successfully!
                                    </h2>
                                    <p className="text-[var(--color-tx-muted)] mt-2">
                                        Share these credentials with {generatedCredentials.name}
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-blue-600 mb-1">Email</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-mono text-sm font-medium">{generatedCredentials.email}</p>
                                                <button
                                                    onClick={() => copyToClipboard(generatedCredentials.email)}
                                                    className="p-1 hover:bg-blue-100 rounded transition"
                                                >
                                                    <Copy className="w-4 h-4 text-blue-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 mb-1">Password</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-mono text-sm font-medium">{generatedCredentials.password}</p>
                                                <button
                                                    onClick={() => copyToClipboard(generatedCredentials.password)}
                                                    className="p-1 hover:bg-blue-100 rounded transition"
                                                >
                                                    {copiedPassword ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-blue-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <p className="text-xs text-yellow-800">
                                        ⚠️ Make sure to save these credentials! Send them to the client via email or secure message.
                                    </p>
                                </div>

                                <button
                                    onClick={closeConvertModal}
                                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                                >
                                    Done
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminLeads;