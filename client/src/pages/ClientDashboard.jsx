import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Clock, CheckCircle, Plus, ArrowRight, Bell } from 'lucide-react';

const ClientDashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        Promise.all([
            fetch('http://localhost:4000/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json()),

            fetch('http://localhost:4000/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json()),

            fetch('http://localhost:4000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json())
        ])
            .then(([statsData, projectsData, notifData]) => {
                if (statsData.ok) setStats(statsData.stats);
                if (projectsData.ok) setProjects(projectsData.projects.slice(0, 5));
                if (notifData.ok) setNotifications(notifData.notifications.slice(0, 5));
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
                                Welcome back, {user.full_name}!
                            </h1>
                            <p className="text-[var(--color-tx-muted)] mt-1">Here's your project overview</p>
                        </div>
                        <Link
                            to="/start-project"
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">Total Projects</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.myProjects || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FolderKanban className="w-7 h-7 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--color-tx-muted)] text-sm">In Progress</p>
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
                                    <p className="text-[var(--color-tx-muted)] text-sm">Completed</p>
                                    <p className="text-3xl font-bold text-[var(--color-accent2)] mt-2">{stats?.completedProjects || 0}</p>
                                </div>
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Projects */}
                        <div className="lg:col-span-2">
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                                    <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)]">
                                        Recent Projects
                                    </h2>
                                    <Link to="/client/projects" className="text-[var(--color-primary)] hover:underline text-sm flex items-center gap-1">
                                        View All <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="p-6">
                                    {projects.length > 0 ? (
                                        <div className="space-y-4">
                                            {projects.map(project => (
                                                <Link
                                                    key={project.id}
                                                    to={`/client/projects/${project.id}`}
                                                    className="block p-4 rounded-lg border border-[var(--color-border)] hover:shadow-md transition"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-[var(--font-heading)] font-medium text-[var(--color-accent2)]">
                                                                {project.project_name}
                                                            </h3>
                                                            <p className="text-sm text-[var(--color-tx-muted)] mt-1">
                                                                {project.type_label} • {project.tech_stack}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                            {project.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-tx-muted)]">
                                                        <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                                                        <span className="font-medium text-[var(--color-accent2)]">
                                                            ₹ {project.estimate_final?.toLocaleString() || 0}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FolderKanban className="w-16 h-16 text-[var(--color-tx-muted)] mx-auto mb-4" />
                                            <p className="text-[var(--color-tx-muted)]">No projects yet</p>
                                            <Link
                                                to="/start-project"
                                                className="inline-block mt-4 text-[var(--color-primary)] hover:underline"
                                            >
                                                Create your first project
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="lg:col-span-1">
                            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                                <div className="p-6 border-b border-[var(--color-border)]">
                                    <h2 className="text-[20px] font-[var(--font-heading)] font-[var(--font-weight-lg)] flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notifications
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {notifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className={`p-3 rounded-lg border ${notif.is_read ? 'bg-white border-[var(--color-border)]' : 'bg-blue-50 border-blue-200'}`}
                                                >
                                                    <h4 className="font-medium text-sm">{notif.title}</h4>
                                                    <p className="text-xs text-[var(--color-tx-muted)] mt-1">{notif.message}</p>
                                                    <p className="text-xs text-[var(--color-tx-muted)] mt-2">
                                                        {new Date(notif.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center py-8 text-[var(--color-tx-muted)]">No notifications</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ClientDashboard;