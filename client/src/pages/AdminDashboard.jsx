import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Clock, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        Promise.all([
            fetch('https://projectport-8w1j.onrender.com/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json()),

            fetch('https://projectport-8w1j.onrender.com/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json())
        ])
            .then(([statsData, projectsData]) => {
                if (statsData.ok) setStats(statsData.stats);
                if (projectsData.ok) setProjects(projectsData.projects.slice(0, 8));
            })
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-green-600',
            medium: 'text-yellow-600',
            high: 'text-red-600'
        };
        return colors[priority] || 'text-gray-600';
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
                    <div className='flex justify-between'>
                        <div className="mb-8">
                            <h1 className="text-[32px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                                Admin Dashboard
                            </h1>
                            <p className="text-[var(--color-tx-muted)] mt-1">Manage projects and monitor performance</p>
                        </div>

                        {/* View lead button  */}
                        <div>

                            <Link
                                to="/admin/leads"
                                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                            >
                                View Lead Inquiries
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">Total Projects</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.totalProjects || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FolderKanban className="w-7 h-7 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">Pending Approval</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.pendingProjects || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-7 h-7 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">Active Projects</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.activeProjects || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-7 h-7 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">Total Clients</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.totalClients || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                                    <Users className="w-7 h-7 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                            <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)]">
                                Recent Projects
                            </h2>
                            <Link to="/admin/projects" className="text-[var(--color-primary)] hover:underline text-sm flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--color-bg-main)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {projects.map(project => (
                                        <tr key={project.id} className="hover:bg-[var(--color-bg-main)] transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[var(--color-accent2)]">{project.project_name}</div>
                                                <div className="text-xs text-[var(--color-tx-muted)] mt-1">{project.tech_stack}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{project.client_name}</div>
                                                <div className="text-xs text-[var(--color-tx-muted)]">{project.client_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{project.type_label}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-medium capitalize ${getPriorityColor(project.priority)}`}>
                                                    {project.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-sm">
                                                ₹ {project.estimate_final?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/admin/projects/${project.id}`}
                                                    className="text-[var(--color-primary)] hover:underline text-sm"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;