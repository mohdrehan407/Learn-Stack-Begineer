'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import Link from 'next/link';
import { BookOpen, LogOut, LayoutDashboard, User, Settings, GraduationCap } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore Courses', href: '/subjects', icon: BookOpen },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ name: 'Admin Control', href: '/admin/dashboard', icon: Settings });
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-light">
            {/* Sidebar */}
            <aside className="w-72 glass border-r shadow-2xl flex flex-col justify-between hidden md:flex relative z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">Learn<span className="text-primary">Stack</span></h1>
                    </div>

                    <nav className="space-y-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 font-semibold"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    )}
                                >
                                    <item.icon size={20} className={clsx(isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 m-4 glass-card rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-5 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="flex w-full items-center justify-center gap-3 py-3 rounded-xl border border-destructive/20 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-all shadow-sm"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto relative">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

