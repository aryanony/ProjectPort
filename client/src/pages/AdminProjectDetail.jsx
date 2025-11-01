import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, CheckCircle, Clock, DollarSign } from 'lucide-react';

const AdminProjectDetail = ({ user }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        status: '',
        priority: '',
        start_date: '',
        end_date: ''
    });
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        due_date: ''
    });
    const [newUpdate, setNewUpdate] = useState({
        title: '',
        message: ''
    });

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:4000/api/projects/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) {
                    setProject(data.project);
                    setFormData({
                        status: data.project.status,
                        priority: data.project.priority,
                        start_date: data.project.start_date || '',
                        end_date: data.project.end_date || ''
                    });
                }
            })
            .finally(() => setLoading(false));
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Project updated successfully!');
                loadProject();
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:4000/api/projects/${id}/milestones`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMilestone)
        });

        if (res.ok) {
            setNewMilestone({ title: '', description: '', due_date: '' });
            loadProject();
        }
    };

    const handleAddUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:4000/api/projects/${id}/updates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUpdate)
        });

        if (res.ok) {
            setNewUpdate({ title: '', message: '' });
            loadProject();
        }
    };

    const updateMilestoneStatus = async (milestoneId, status) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/api/milestones/${milestoneId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        loadProject();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!project) return <div className="min-h-screen flex items-center justify-center">Project not found</div>;

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        to="/admin/projects"
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Info */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h1 className="text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)] mb-4">
                                    {project.project_name}
                                </h1>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-[var(--color-tx-muted)]">Client</p>
                                        <p className="font-medium mt-1">{project.client_name}</p>
                                        <p className="text-sm text-[var(--color-tx-muted)]">{project.client_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-tx-muted)]">Type</p>
                                        <p className="font-medium mt-1">{project.type_label}</p>
                                        <p className="text-sm text-[var(--color-tx-muted)]">{project.tech_stack}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-tx-muted)]">Budget</p>
                                        <p className="font-medium mt-1">₹ {project.estimate_final?.toLocaleString() || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-tx-muted)]">Duration</p>
                                        <p className="font-medium mt-1">{project.estimated_weeks} weeks</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-[var(--color-tx-muted)] mb-2">Description</p>
                                    <p className="text-sm">{project.description}</p>
                                </div>
                            </div>

                            {/* Update Form */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Update Project
                                </h2>
                                <form onSubmit={handleUpdateProject} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Priority</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>

                            {/* Milestones */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Milestones
                                </h2>

                                <div className="space-y-3 mb-6">
                                    {project.milestones?.map(m => (
                                        <div key={m.id} className="p-4 rounded-lg border border-[var(--color-border)] flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium">{m.title}</h3>
                                                <p className="text-sm text-[var(--color-tx-muted)] mt-1">{m.description}</p>
                                                <p className="text-xs text-[var(--color-tx-muted)] mt-2">
                                                    Due: {new Date(m.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <select
                                                value={m.status}
                                                onChange={(e) => updateMilestoneStatus(m.id, e.target.value)}
                                                className="ml-4 px-3 py-1 text-sm rounded border border-[var(--color-border)]"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddMilestone} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Milestone title"
                                        value={newMilestone.title}
                                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newMilestone.description}
                                        onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <div className="flex gap-3">
                                        <input
                                            type="date"
                                            value={newMilestone.due_date}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                                            required
                                            className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Add Update */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Post Update
                                </h2>
                                <form onSubmit={handleAddUpdate} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Update title"
                                        value={newUpdate.title}
                                        onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <textarea
                                        placeholder="Message for client..."
                                        value={newUpdate.message}
                                        onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)]"
                                    >
                                        Post Update
                                    </button>
                                </form>
                            </div>

                            {/* Recent Updates */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Recent Updates
                                </h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {project.updates?.map(u => (
                                        <div key={u.id} className="p-3 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)]">
                                            <h3 className="font-medium text-sm">{u.title}</h3>
                                            <p className="text-xs text-[var(--color-tx-muted)] mt-1">{u.message}</p>
                                            <p className="text-xs text-[var(--color-tx-muted)] mt-2">
                                                {u.updated_by_name} • {new Date(u.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payments */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Payments
                                </h2>
                                <div className="space-y-2">
                                    {project.payments?.map(p => (
                                        <div key={p.id} className="flex justify-between items-center p-2 rounded border border-[var(--color-border)]">
                                            <div>
                                                <p className="text-sm font-medium">{p.payment_type}</p>
                                                <p className="text-xs text-[var(--color-tx-muted)]">{p.status}</p>
                                            </div>
                                            <p className="font-medium">₹ {p.amount?.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminProjectDetail;