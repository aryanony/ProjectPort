import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle2, User } from 'lucide-react';

const ClientProjectDetail = ({ user }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`https://projectport-8w1j.onrender.com/api/projects/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) {
                    setProject(data.project);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    if (!project) return <div className="min-h-screen flex items-center justify-center">Project not found</div>;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-blue-100 text-blue-800 border-blue-200',
            in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getMilestoneProgress = () => {
        if (!project.milestones?.length) return 0;
        const completed = project.milestones.filter(m => m.status === 'completed').length;
        return Math.round((completed / project.milestones.length) * 100);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-main)] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        to="/client/projects"
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Header */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h1 className="text-[28px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                                        {project.project_name}
                                    </h1>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                                        {project.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-tx-muted)]">Budget</p>
                                            <p className="font-medium">₹ {project.estimate_final?.toLocaleString() || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-tx-muted)]">Duration</p>
                                            <p className="font-medium">{project.estimated_weeks} weeks</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-tx-muted)]">Start Date</p>
                                            <p className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-tx-muted)]">Priority</p>
                                            <p className="font-medium capitalize">{project.priority}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Project Description</h3>
                                    <p className="text-[var(--color-tx-muted)] text-sm">{project.description}</p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-[var(--color-tx-muted)] mb-1">Type</p>
                                        <p className="text-sm font-medium">{project.type_label}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-tx-muted)] mb-1">Technology</p>
                                        <p className="text-sm font-medium">{project.tech_stack}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Project Progress
                                </h2>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span>Overall Completion</span>
                                    <span className="font-medium">{getMilestoneProgress()}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${getMilestoneProgress()}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Milestones
                                </h2>
                                {project.milestones?.length > 0 ? (
                                    <div className="space-y-3">
                                        {project.milestones.map(m => (
                                            <div key={m.id} className="p-4 rounded-lg border border-[var(--color-border)] hover:shadow-md transition">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-[var(--color-accent2)]">{m.title}</h3>
                                                        <p className="text-sm text-[var(--color-tx-muted)] mt-1">{m.description}</p>
                                                        <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-tx-muted)]">
                                                            <span>Due: {new Date(m.due_date).toLocaleDateString()}</span>
                                                            {m.completed_at && <span>Completed: {new Date(m.completed_at).toLocaleDateString()}</span>}
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            m.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {m.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-[var(--color-tx-muted)]">No milestones defined yet</p>
                                )}
                            </div>

                            {/* Updates Timeline */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Project Updates
                                </h2>
                                {project.updates?.length > 0 ? (
                                    <div className="space-y-4">
                                        {project.updates.map(u => (
                                            <div key={u.id} className="relative pl-8 pb-6 border-l-2 border-[var(--color-border)] last:pb-0">
                                                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[var(--color-primary)] border-2 border-white"></div>
                                                <div className="bg-[var(--color-bg-main)] rounded-lg p-4 border border-[var(--color-border)]">
                                                    <h3 className="font-medium text-[var(--color-accent2)]">{u.title}</h3>
                                                    <p className="text-sm text-[var(--color-tx-muted)] mt-2">{u.message}</p>
                                                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-tx-muted)]">
                                                        <span>{u.updated_by_name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(u.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-[var(--color-tx-muted)]">No updates yet</p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Team */}
                            {project.assignments?.length > 0 && (
                                <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                    <h2 className="text-[18px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                        Project Team
                                    </h2>
                                    <div className="space-y-3">
                                        {project.assignments.map(a => (
                                            <div key={a.id} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-medium">
                                                    {a.admin_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{a.admin_name}</p>
                                                    <p className="text-xs text-[var(--color-tx-muted)]">{a.role || 'Team Member'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payments */}
                            {project.payments?.length > 0 && (
                                <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                    <h2 className="text-[18px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                        Payment Schedule
                                    </h2>
                                    <div className="space-y-3">
                                        {project.payments.map(p => (
                                            <div key={p.id} className="p-3 rounded-lg border border-[var(--color-border)]">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium capitalize">{p.payment_type}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                            p.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-bold text-[var(--color-accent2)]">₹ {p.amount?.toLocaleString()}</p>
                                                {p.due_date && (
                                                    <p className="text-xs text-[var(--color-tx-muted)] mt-1">
                                                        Due: {new Date(p.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Support */}
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6">
                                <h2 className="text-[18px] font-[var(--font-heading)] font-[var(--font-weight-lg)] mb-4">
                                    Need Help?
                                </h2>
                                <p className="text-sm text-[var(--color-tx-muted)] mb-4">
                                    Have questions about your project? Contact our support team.
                                </p>
                                <button className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ClientProjectDetail;