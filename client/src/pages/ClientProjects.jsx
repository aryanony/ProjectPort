import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';

const ClientProjects = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:4000/api/projects', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.ok) setProjects(data.projects);
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
                        <h1 className="text-[32px] font-[var(--font-heading)] font-[var(--font-weight-lg)] text-[var(--color-accent2)]">
                            My Projects
                        </h1>
                        <Link
                            to="/start-project"
                            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                        >
                            New Project
                        </Link>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <Link
                                    key={project.id}
                                    to={`/client/projects/${project.id}`}
                                    className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-[var(--font-heading)] font-medium text-[var(--color-accent2)] text-lg">
                                            {project.project_name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--color-tx-muted)] mb-4">
                                        {project.type_label} • {project.tech_stack}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[var(--color-tx-muted)]">
                                            Created: {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="font-medium text-[var(--color-accent2)]">
                                            ₹ {project.estimate_final?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <FolderKanban className="w-20 h-20 text-[var(--color-tx-muted)] mx-auto mb-6" />
                            <h2 className="text-2xl font-[var(--font-heading)] font-medium mb-2">No Projects Yet</h2>
                            <p className="text-[var(--color-tx-muted)] mb-6">Start by creating your first project</p>
                            <Link
                                to="/start-project"
                                className="inline-block px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
                            >
                                Create Project
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ClientProjects;