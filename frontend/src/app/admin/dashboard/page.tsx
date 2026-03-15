'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Users, BookOpen, UserCheck, ShieldCheck, Plus, Settings, BarChart3, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ users: 0, subjects: 0, enrollments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const metrics = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Active Courses', value: stats.subjects, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Enrollments', value: stats.enrollments, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                        <ShieldCheck size={16} /> Admin Portal
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">System <span className="text-gradient">Intelligence</span></h1>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-semibold">
                        <BarChart3 size={18} /> Reports
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:scale-105 transition-all font-bold shadow-xl shadow-primary/20">
                        <Plus size={18} /> Create New
                    </button>
                </div>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metrics.map((m, i) => (
                    <div key={i} className="glass-card rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                        <div className={m.bg + " absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"} />
                        <div className="relative z-10">
                            <div className={m.bg + " " + m.color + " w-12 h-12 rounded-xl flex items-center justify-center mb-6"}>
                                <m.icon size={24} />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium mb-1">{m.label}</p>
                            <p className="text-4xl font-black tracking-tight">{m.value}</p>
                            <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                                <ArrowUpRight size={12} /> +12% from last month
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Management Sections */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-[2.5rem] p-10 border border-white/5">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Settings className="text-primary" size={24} /> Quick Management
                    </h2>
                    <div className="space-y-4">
                        {['Manage Subjects', 'System Users', 'User Access Tokens', 'Course Categories'].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <span className="font-medium group-hover:text-primary transition-colors">{item}</span>
                                <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-indigo-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-6">
                        <BarChart3 size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Analytics Breakdown</h3>
                    <p className="text-muted-foreground font-light mb-8 max-w-xs">Detailed student engagement and revenue metrics are currently being compiled.</p>
                    <button className="px-8 py-3 rounded-2xl border border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all">
                        View Detailed Insights
                    </button>
                </div>
            </section>
        </div>
    );
}

