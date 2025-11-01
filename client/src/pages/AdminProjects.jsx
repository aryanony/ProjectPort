import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const AdminProjects = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredProjects = projects.filter(p =>
        p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            All Projects
                        </h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-tx-muted)]" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-80"
                            />
                        </div>
                    </div>

                    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--color-bg-main)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-tx-muted)] uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {filteredProjects.map(project => (
                                        <tr key={project.id} className="hover:bg-[var(--color-bg-main)] transition">
                                            <td className="px-6 py-4 text-sm">#{project.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{project.project_name}</div>
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
                                            <td className="px-6 py-4 font-medium">₹ {project.estimate_final?.toLocaleString() || 0}</td>
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

export default AdminProjects;