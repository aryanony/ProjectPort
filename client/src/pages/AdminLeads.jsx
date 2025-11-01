import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Building, Calendar, CheckCircle, X, Eye, User } from 'lucide-react';

const AdminLeads = ({ user }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [password, setPassword] = useState('');
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:4000/api/leads', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) setLeads(data.leads);
            })
            .finally(() => setLoading(false));
    };

    const handleConvert = async () => {
        if (!password) {
            alert('Please enter a password');
            return;
        }

        setConverting(true);
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
                alert(`Success! Client account created.\nEmail: ${data.user.email}\nPassword: ${password}\n\nSend these credentials to the client.`);
                setShowConvertModal(false);
                setPassword('');
                setSelectedLead(null);
                loadLeads();
            } else {
                alert(data.error || 'Failed to convert lead');
            }
        } catch (err) {
            alert('Error converting lead');
        } finally {
            setConverting(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            converted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-[32px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                                Lead Inquiries
                            </h1>
                            <p className="text-[var(--color-tx-muted)] mt-1">
                                Manage incoming project inquiries and convert to clients
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">{leads.filter(l => l.status === 'new').length} New Leads</span>
                        </div>
                    </div>

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
                                                <td className="px-6 py-4 text-sm">#{lead.id}</td>
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
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(lead.status)}`}>
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
                                                            className="text-[var(--color-primary)] hover:underline text-sm flex items-center gap-1"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </button>
                                                        {lead.status !== 'converted' && lead.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedLead(lead);
                                                                    setShowConvertModal(true);
                                                                }}
                                                                className="text-green-600 hover:underline text-sm flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Convert
                                                            </button>
                                                        )}
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
                            <h2 className="text-2xl font-[var(--font-heading)] font-bold">Lead Details</h2>
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
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5" />
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
                                <h3 className="font-medium mb-3">Project Information</h3>
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
                                {selectedLead.status !== 'converted' && (
                                    <button
                                        onClick={() => setShowConvertModal(true)}
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
                        <h2 className="text-2xl font-[var(--font-heading)] font-bold mb-4">Convert to Client</h2>
                        <p className="text-[var(--color-tx-muted)] mb-6">
                            Create a client account for <strong>{selectedLead.full_name}</strong>
                        </p>

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
                                <input
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password for client"
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <p className="text-xs text-[var(--color-tx-muted)] mt-1">
                                    This password will be sent to the client
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
                                onClick={() => {
                                    setShowConvertModal(false);
                                    setPassword('');
                                }}
                                className="px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminLeads;