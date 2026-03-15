'use client';

import { useState } from 'react';
import api from '../../../lib/axios';

export default function AdminCoursesPage() {
    const [tab, setTab] = useState('subject'); // subject, section, video

    // Forms
    const [sTitle, setSTitle] = useState('');
    const [sDesc, setSDesc] = useState('');

    const [secSubId, setSecSubId] = useState('');
    const [secTitle, setSecTitle] = useState('');

    const [vSecId, setVSecId] = useState('');
    const [vTitle, setVTitle] = useState('');
    const [vUrl, setVUrl] = useState('');
    const [vDur, setVDur] = useState('');

    const submitSubject = async (e: any) => {
        e.preventDefault();
        try { await api.post('/admin/subjects', { title: sTitle, description: sDesc }); alert('Created'); setSTitle(''); setSDesc(''); }
        catch (e) { alert('Error'); }
    };

    const submitSection = async (e: any) => {
        e.preventDefault();
        try { await api.post('/admin/sections', { subjectId: secSubId, title: secTitle }); alert('Created'); setSecSubId(''); setSecTitle(''); }
        catch (e) { alert('Error'); }
    };

    const submitVideo = async (e: any) => {
        e.preventDefault();
        try { await api.post('/admin/videos', { sectionId: vSecId, title: vTitle, videoUrl: vUrl, duration: Number(vDur) }); alert('Created'); setVSecId(''); setVTitle(''); setVUrl(''); setVDur(''); }
        catch (e) { alert('Error'); }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Manage Course Content</h1>

            <div className="flex gap-4 mb-8">
                <button onClick={() => setTab('subject')} className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'subject' ? 'bg-primary text-white' : 'bg-muted'}`}>Create Subject</button>
                <button onClick={() => setTab('section')} className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'section' ? 'bg-primary text-white' : 'bg-muted'}`}>Create Section</button>
                <button onClick={() => setTab('video')} className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'video' ? 'bg-primary text-white' : 'bg-muted'}`}>Create Video</button>
            </div>

            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                {tab === 'subject' && (
                    <form onSubmit={submitSubject} className="space-y-4">
                        <input placeholder="Subject Title" className="w-full p-3 bg-input rounded-lg" value={sTitle} onChange={e => setSTitle(e.target.value)} required />
                        <textarea placeholder="Description" className="w-full p-3 bg-input rounded-lg" value={sDesc} onChange={e => setSDesc(e.target.value)} />
                        <button className="px-6 py-3 bg-primary text-white rounded-lg">Create Subject</button>
                    </form>
                )}

                {tab === 'section' && (
                    <form onSubmit={submitSection} className="space-y-4">
                        <input placeholder="Subject ID (Numeric)" type="number" className="w-full p-3 bg-input rounded-lg" value={secSubId} onChange={e => setSecSubId(e.target.value)} required />
                        <input placeholder="Section Title" className="w-full p-3 bg-input rounded-lg" value={secTitle} onChange={e => setSecTitle(e.target.value)} required />
                        <button className="px-6 py-3 bg-primary text-white rounded-lg">Create Section</button>
                    </form>
                )}

                {tab === 'video' && (
                    <form onSubmit={submitVideo} className="space-y-4">
                        <input placeholder="Section ID (Numeric)" type="number" className="w-full p-3 bg-input rounded-lg" value={vSecId} onChange={e => setVSecId(e.target.value)} required />
                        <input placeholder="Video Title" className="w-full p-3 bg-input rounded-lg" value={vTitle} onChange={e => setVTitle(e.target.value)} required />
                        <input placeholder="YouTube URL" className="w-full p-3 bg-input rounded-lg" value={vUrl} onChange={e => setVUrl(e.target.value)} required />
                        <input placeholder="Duration in seconds" type="number" className="w-full p-3 bg-input rounded-lg" value={vDur} onChange={e => setVDur(e.target.value)} required />
                        <button className="px-6 py-3 bg-primary text-white rounded-lg">Create Video</button>
                    </form>
                )}
            </div>
        </div>
    );
}
