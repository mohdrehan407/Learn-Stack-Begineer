'use client';

import React, { useEffect, useState } from 'react';
import {
    Cpu,
    Database,
    Layout,
    Code2,
    Zap,
    GraduationCap,
    MousePointer2,
    ChevronRight
} from 'lucide-react';

export default function HuggingFaceReel() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setScrollProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
        }, 20);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
            {/* Reel Container (9:16 Aspect Ratio) */}
            <div className="w-full max-w-[400px] aspect-[9/16] bg-white shadow-2xl rounded-[2.5rem] overflow-hidden relative border-[8px] border-black">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
                    <div
                        className="h-full bg-black transition-all duration-100"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                {/* Floating Mouse Cursor Animation */}
                <div
                    className="absolute z-40 pointer-events-none transition-all duration-700 ease-in-out"
                    style={{
                        top: `${20 + Math.sin(scrollProgress * 0.1) * 30}%`,
                        left: `${30 + Math.cos(scrollProgress * 0.1) * 40}%`,
                    }}
                >
                    <MousePointer2 className="text-black fill-white" size={24} />
                </div>

                {/* Content Layer */}
                <div
                    className="h-full overflow-y-auto no-scrollbar py-20 px-8 space-y-24 transition-transform duration-500"
                    style={{ transform: `translateY(-${scrollProgress * 0.5}%)` }}
                >

                    {/* Section 1: Introduction */}
                    <section className="space-y-6">
                        <h1 className="text-5xl font-black tracking-tighter leading-none">
                            HUGGING <br /> FACE
                        </h1>
                        <p className="text-xl font-bold uppercase tracking-widest text-gray-400">
                            The GitHub of AI
                        </p>
                        <div className="h-1 w-20 bg-black" />
                        <p className="text-lg leading-relaxed text-gray-800">
                            The world's leading open platform for <span className="font-bold underline">Machine Learning</span>.
                            Built for the community, by the community.
                        </p>
                    </section>

                    {/* Section 2: AI Models */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-black text-white rounded-xl">
                                <Cpu size={28} />
                            </div>
                            <h2 className="text-3xl font-black italic">MODELS</h2>
                        </div>
                        <p className="text-lg text-gray-700">
                            Access 500,000+ pre-trained models.
                            <br /><br />
                            From <span className="font-bold">NLP (LLMs)</span> to <span className="font-bold">Computer Vision</span> and <span className="font-bold">Audio Recognition</span>.
                        </p>
                    </section>

                    {/* Section 3: Datasets */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-black text-white rounded-xl">
                                <Database size={28} />
                            </div>
                            <h2 className="text-3xl font-black italic">DATASETS</h2>
                        </div>
                        <p className="text-lg text-gray-700">
                            Need data? Download massive, curated datasets for training.
                            Standardized formats mean <span className="font-bold">one-line loading</span>.
                        </p>
                    </section>

                    {/* Section 4: Spaces */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-black text-white rounded-xl">
                                <Layout size={28} />
                            </div>
                            <h2 className="text-3xl font-black italic">SPACES</h2>
                        </div>
                        <p className="text-lg text-gray-700">
                            Host your AI demos for free. Showcase your work to the world with a few clicks.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border-2 border-black rounded-2xl font-bold text-center">Gradio</div>
                            <div className="p-4 border-2 border-black rounded-2xl font-bold text-center">Streamlit</div>
                        </div>
                    </section>

                    {/* Section 5: APIs */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-black text-white rounded-xl">
                                <Zap size={28} />
                            </div>
                            <h2 className="text-3xl font-black italic">APIs</h2>
                        </div>
                        <p className="text-lg text-gray-700">
                            <span className="font-bold">Inference Endpoints</span>.
                            Integrate SOTA models into your apps in seconds.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm border border-gray-200">
                            pip install huggingface_hub
                        </div>
                    </section>

                    {/* Section 6: Student Benefits */}
                    <section className="bg-black text-white p-8 rounded-[2rem] space-y-6">
                        <div className="flex items-center gap-3">
                            <GraduationCap size={32} />
                            <h2 className="text-3xl font-black">FOR STUDENTS</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2 italic">
                                <ChevronRight className="mt-1" size={16} />
                                Free education resources
                            </li>
                            <li className="flex items-start gap-2 italic">
                                <ChevronRight className="mt-1" size={16} />
                                Community support
                            </li>
                            <li className="flex items-start gap-2 italic">
                                <ChevronRight className="mt-1" size={16} />
                                Build your Portfolio
                            </li>
                        </ul>
                    </section>

                    {/* Footer */}
                    <footer className="text-center py-10 opacity-30">
                        <p className="font-black text-2xl">@HuggingFace</p>
                    </footer>

                </div>

                {/* Interactive Elements Overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-black rounded-full flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-2xl animate-bounce">
                    JOIN THE REVOLUTION
                </div>

            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
}
