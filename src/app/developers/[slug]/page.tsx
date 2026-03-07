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
    Hexagon,
    Target,
    Compass,
    Sparkles,
    Users2,
    Zap,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";

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

    const Icon = dev.icon;

    // Helper to split bio into paragraphs if it's long
    const bioParagraphs = dev.bio.split(". ").map((p, i, arr) =>
        p + (i === arr.length - 1 ? "" : ".")
    );

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-x-hidden pt-24 pb-20 px-4 md:px-8">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0 opacity-40">
                <FloatingDoodles />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto space-y-20">
                {/* Header Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                >
                    <Button
                        onClick={() => router.push("/developers")}
                        variant="ghost"
                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Team
                    </Button>
                    <div className="flex gap-4">
                        {dev.contact.github && (
                            <Link href={dev.contact.github} target="_blank" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                        )}
                        {dev.contact.linkedin && (
                            <Link href={dev.contact.linkedin} target="_blank" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Hero / About Me Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Portrait Left */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-2xl rounded-3xl" />
                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-purple-500/30 bg-slate-900 group-hover:border-purple-500/60 transition-colors duration-500 shadow-2xl">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-gradient-to-tr from-purple-600/10 to-transparent">
                                    <Icon className="w-32 h-32" />
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Creator</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bio Right */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
                                About me:
                            </h1>
                            <div className="space-y-6 text-xl text-slate-400 font-medium leading-relaxed max-w-3xl">
                                {bioParagraphs.map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Education Module */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <h2 className="text-4xl font-black text-white mb-10 tracking-tight italic">Education</h2>
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <GraduationCap className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">{dev.education.degree}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 font-semibold">
                                    <span>{dev.education.school}</span>
                                    <div className="hidden md:block w-2 h-2 rounded-full bg-white/10" />
                                    <span className="text-purple-400">({dev.education.year})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Highlights / Soft Skills Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dev.softSkills.slice(0, 3).map((skill, idx) => {
                        const Icons = [Compass, Users2, Sparkles, Target, Zap];
                        const SpecificIcon = Icons[idx % Icons.length];
                        return (
                            <motion.div
                                key={skill}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 group hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                    <SpecificIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4">{skill}</h4>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Dedicated to maintaining high standards of {skill.toLowerCase()} in every phase of the project cycle.
                                </p>
                            </motion.div>
                        );
                    })}
                </section>

                {/* Tech Stack Bento Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden p-1 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/30 to-purple-500/30"
                >
                    <div className="bg-[#0f0c29] rounded-[3.4rem] p-10 md:p-16 space-y-16">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">Technical Stack</h2>
                                <p className="text-slate-400 font-medium">Expertise in modern web technologies and infrastructure.</p>
                            </div>
                            {dev.contact.portfolio && (
                                <Button asChild className="rounded-full bg-white text-black hover:bg-slate-200 px-8 h-12">
                                    <Link href={dev.contact.portfolio} target="_blank">
                                        View Portfolio <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.05 }
                                }
                            }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {dev.technicalSkills.map((skill, idx) => (
                                <motion.div
                                    key={skill.name}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="relative group cursor-default"
                                >
                                    {/* Glass Base */}
                                    <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
                                        {/* Colored Accent Strip */}
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${skill.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                        <div className="flex flex-col gap-4 pl-4">
                                            {/* Logo & Abbr */}
                                            <div className="flex justify-between items-start">
                                                <div className={`p-2 rounded-lg ${skill.color}/20 ${skill.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
                                                    <skill.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                                    {skill.name.substring(0, 3).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Name */}
                                            <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                                {skill.name}
                                            </span>
                                        </div>

                                        {/* Subtle Glow on Hover */}
                                        <div className={`absolute -inset-px rounded-3xl ${skill.color}/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Interests & Contact quick footer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white italic">Interests</h3>
                                <div className="flex flex-wrap gap-3">
                                    {dev.interests.map(interest => (
                                        <span key={interest} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white italic">Languages</h3>
                                <div className="flex gap-6">
                                    {dev.languages.map(lang => (
                                        <div key={lang} className="flex flex-col">
                                            <span className="text-white font-bold">{lang}</span>
                                            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Native</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div >
    );
}
