"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { developersData } from "@/lib/developers";
import {
    Github,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    Globe,
    ArrowLeft,
    GraduationCap,
    Lightbulb,
    Code2,
    Heart,
    Languages
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import Image from "next/image";

export default function DeveloperAboutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const dev = developersData[slug];

    if (!dev) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <h1 className="text-4xl font-black mb-4">Developer Not Found</h1>
                <Button onClick={() => router.push("/developers")} variant="outline" className="rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
                </Button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-x-hidden pt-24 pb-20 px-4 md:px-8">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0 opacity-40">
                <FloatingDoodles />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Button
                        onClick={() => router.push("/developers")}
                        variant="ghost"
                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Team
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Intro & Contact */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* About Me Header Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 blur-2xl opacity-40 rounded-full" />
                            <div className="relative px-12 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">About me</h1>
                            </div>
                        </motion.div>

                        {/* Bio Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <p className="text-lg text-slate-400 font-medium">Hi!</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                My name is <span className="text-purple-400">{dev.name}</span>.
                            </h2>
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                                I am a <span className="text-indigo-400">{dev.role}</span> {dev.bio}
                            </p>
                            <div className="space-y-3">
                                <p className="text-lg text-slate-400 font-bold uppercase tracking-widest text-sm">My objective:</p>
                                <p className="text-lg text-slate-300 leading-relaxed italic">
                                    "{dev.objective}"
                                </p>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <h3 className="text-2xl font-black text-white italic tracking-tight underline decoration-purple-500/50 underline-offset-8">Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-medium truncate">{dev.contact.email}</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-300 font-medium">{dev.contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 group text-slate-300 hover:text-white transition-colors">
                                    <Link href={dev.contact.linkedin} target="_blank" className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">LinkedIn Profile</span>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4 group text-slate-300 hover:text-white transition-colors">
                                    <Link href={dev.contact.github} target="_blank" className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-all">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">GitHub Repository</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Portrait */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                            className="relative w-full max-w-sm aspect-[4/5]"
                        >
                            {/* Organic Background Blobs */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-3xl rounded-full" />
                            <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-xl rounded-[3rem]" />

                            {/* The Portrait Container */}
                            <div className="relative h-full w-full rounded-[4rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                    {/* Placeholder for actual image */}
                                    <dev.icon className="w-32 h-32 opacity-20" />
                                    <span className="absolute bottom-10 left-0 right-0 text-center text-white/40 font-black uppercase tracking-[0.3em] text-xs">Portrait</span>
                                </div>
                                {dev.contact.portfolio && (
                                    <Link
                                        href={dev.contact.portfolio}
                                        target="_blank"
                                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white text-slate-950 px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                                    >
                                        Visit site
                                    </Link>
                                )}
                            </div>

                            {/* Decorative Waves */}
                            <svg className="absolute -right-12 top-12 w-32 h-32 text-purple-500/20 overflow-visible" viewBox="0 0 100 100">
                                <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50" />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Section: Skills & Education (The large gradient box) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 relative p-1 rounded-[4rem] bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-slate-900/30"
                >
                    <div className="bg-gradient-to-br from-[#1e1a4d] to-[#0f0c29] rounded-[3.9rem] p-8 md:p-16 overflow-hidden relative">
                        {/* Background Glows */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                            {/* Left Side: Education & Tech Skills */}
                            <div className="space-y-16">
                                {/* Education */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-3xl font-black text-white italic">Education</h3>
                                        <div className="px-4 py-1 bg-white/10 rounded-full border border-white/20">
                                            <span className="text-xs font-bold text-slate-300">{dev.education.year}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg text-slate-200 font-bold">{dev.education.school}</p>
                                        <p className="text-slate-400 font-medium">{dev.education.degree}</p>
                                    </div>
                                </div>

                                {/* Technical Skills */}
                                <div className="space-y-8">
                                    <h3 className="text-3xl font-black text-white italic">Technical skill</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                        {dev.technicalSkills.map((skill, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5 }}
                                                className={`w-14 h-14 rounded-2xl ${skill.color} flex items-center justify-center shadow-xl group cursor-help`}
                                            >
                                                <span className="text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs font-black text-white uppercase tracking-tighter text-center px-1">
                                                    {skill.name.substring(0, 2)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Interests */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-white italic">Interest</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {dev.interests.map((interest, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-lg text-slate-300 font-medium">{interest}</span>
                                                {i < dev.interests.length - 1 && <div className="w-px h-6 bg-white/20" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Soft Skills, Skill Set, Languages */}
                            <div className="space-y-16">
                                {/* Soft Skills */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-white italic">Soft skill</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {dev.softSkills.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-1 h-8 bg-white/10 group-hover:bg-purple-500 transition-colors" />
                                                <span className="text-lg text-slate-300 font-medium">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skill Set */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-white italic">Skill set</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {dev.skillSet.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-1 h-8 bg-white/10 group-hover:bg-indigo-500 transition-colors" />
                                                <span className="text-lg text-slate-300 font-medium">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-white italic">Language</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {dev.languages.map((lang, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-lg text-slate-300 font-medium">{lang}</span>
                                                {i < dev.languages.length - 1 && <div className="w-px h-6 bg-white/20" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
