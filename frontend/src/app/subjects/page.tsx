'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import Link from 'next/link';

export default function SubjectsPage() {
    const { user } = useAuthStore();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const { data } = await api.get('/courses');
                setSubjects(data);
            } catch (error) {
                console.error('Failed to load subjects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">All Subjects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((s) => (
                    <Link key={s.id} href={`/subjects/${s.id}`} className="group block h-full">
                        <div className="h-full border bg-card hover:border-primary/50 transition duration-300 rounded-2xl p-6 shadow-sm group-hover:shadow-md flex flex-col justify-between cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition">{s.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-end items-center text-sm font-medium text-primary">
                                View Details
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
