"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { developersData } from "@/lib/developers";
import { useState, useEffect } from "react";
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
    ArrowRight,
    Star,
    GitPullRequest,
    Box
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingDoodles } from "@/components/landing/FloatingDoodles";
import { BackgroundWaves } from "@/components/landing/BackgroundWaves";
import Image from "next/image";

export default function DeveloperAboutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const dev = developersData[slug];

    const [githubStats, setGithubStats] = useState<{ repos: number; stars: number; prs: number; commits: number; avatarUrl: string | null } | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);

    useEffect(() => {
        if (dev?.contact.github && dev.contact.github !== "#") {
            const username = dev.contact.github.split("/").filter(Boolean).pop();
            if (username) {
                fetchGithubStats(username);
            }
        }
    }, [dev]);

    const fetchGithubStats = async (username: string) => {
        setIsStatsLoading(true);
        try {
            const [userRes, reposRes, prsRes, commitsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
                fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`),
                fetch(`https://api.github.com/search/commits?q=author:${username}`, {
                    headers: {
                        "Accept": "application/vnd.github.cloak-preview"
                    }
                })
            ]);

            const userData = await userRes.json();
            const reposData = await reposRes.json();
            const prsData = await prsRes.json();
            const commitsData = await commitsRes.json();

            const totalStars = Array.isArray(reposData)
                ? reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
                : 0;

            setGithubStats({
                repos: userData.public_repos || 0,
                stars: totalStars,
                prs: prsData.total_count || 0,
                commits: commitsData.total_count || 0,
                avatarUrl: userData.avatar_url || null
            });
        } catch (error) {
            console.error("Error fetching GitHub stats:", error);
        } finally {
            setIsStatsLoading(false);
        }
    };

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

    // Helper to split bio into paragraphs. Supports both ". " and "\n\n"
    const bioParagraphs = dev.bio.split(/\n\n|\. /).map((p, i, arr) => {
        const trimmed = p.trim();
        if (!trimmed) return null;
        // Add back the dot if we split by ". "
        return trimmed + (trimmed.endsWith(".") || i === arr.length - 1 ? "" : ".");
    }).filter(Boolean);

    return (
        <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden pt-24 pb-20 px-4 md:px-8">
            {/* Background Layers matching Landing Page */}
            <BackgroundWaves />
            <FloatingDoodles />

            <main className="relative z-10 max-w-6xl mx-auto space-y-20">
                {/* Header Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex justify-between items-center"
                >
                    <Button
                        onClick={() => router.push("/developers")}
                        variant="ghost"
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-6"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Team
                    </Button>
                    <div className="flex gap-4">
                        {dev.contact.github && (
                            <Link href={dev.contact.github} target="_blank" className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                        )}
                        {dev.contact.linkedin && (
                            <Link href={dev.contact.linkedin} target="_blank" className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all">
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
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative aspect-square group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl group-hover:border-indigo-500/50 transition-colors duration-500 shadow-2xl flex items-center justify-center">
                                {githubStats?.avatarUrl ? (
                                    <img
                                        src={githubStats.avatarUrl}
                                        alt={dev.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-gradient-to-tr from-indigo-600/10 to-transparent">
                                        <Icon className="w-32 h-32 text-indigo-500" />
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <span className="text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.4em] text-[10px] bg-white/10 dark:bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">Creator</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bio Right */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                                About me:
                            </h1>
                            <div className="space-y-6 text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                                {bioParagraphs.map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* GitHub Stats Section */}
                {(isStatsLoading || githubStats) && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative"
                    >
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-10 tracking-tight italic">GitHub Presence</h2>

                        {isStatsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-40 rounded-[2rem] bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10" />
                                ))}
                            </div>
                        ) : githubStats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: "Repositories", value: githubStats.repos, icon: Box, color: "text-blue-500" },
                                    { label: "Total Stars", value: githubStats.stars, icon: Star, color: "text-amber-500" },
                                    { label: "Pull Requests", value: githubStats.prs, icon: GitPullRequest, color: "text-emerald-500" },
                                    { label: "Total Commits", value: githubStats.commits, icon: Zap, color: "text-purple-500" }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-3xl group hover:border-indigo-500/50 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl shadow-indigo-500/5"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}

                {/* Education Module */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative"
                >
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-10 tracking-tight italic">Education</h2>
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-3xl relative overflow-hidden group hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-500 shadow-xl shadow-indigo-500/5">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <GraduationCap className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-purple-500/20 flex items-center justify-center text-indigo-500 dark:text-purple-400 border border-indigo-500/20">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{dev.education.degree}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 dark:text-slate-400 font-bold">
                                    <span>{dev.education.school}</span>
                                    <div className="hidden md:block w-2 h-2 rounded-full bg-slate-200 dark:bg-white/10" />
                                    <span className="text-indigo-600 dark:text-purple-400">({dev.education.year})</span>
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
                                className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-3xl group hover:border-indigo-500/50 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl shadow-indigo-500/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                                    <SpecificIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight">{skill}</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    Dedicated to maintaining high standards of {skill.toLowerCase()} in every phase of the project cycle.
                                </p>
                            </motion.div>
                        );
                    })}
                </section>

                {/* Tech Stack Bento Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative overflow-hidden p-1 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 shadow-2xl"
                >
                    <div className="bg-white/90 dark:bg-[#0f0c29] rounded-[3.4rem] p-10 md:p-16 space-y-16 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">Technical Stack</h2>
                                <p className="text-slate-600 dark:text-slate-400 font-bold">Expertise in modern web technologies and infrastructure.</p>
                            </div>
                            {dev.contact.portfolio && (
                                <Button asChild className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 px-8 h-12 font-bold shadow-lg shadow-indigo-500/20 border-none transition-all hover:scale-105 active:scale-95">
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
                                    <div className="relative p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:bg-white/80 dark:group-hover:bg-white/10 group-hover:border-indigo-500/30 shadow-sm group-hover:shadow-indigo-500/10">
                                        {/* Colored Accent Strip */}
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${skill.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                        <div className="flex flex-col gap-4 pl-4">
                                            {/* Logo & Abbr */}
                                            <div className="flex justify-between items-start">
                                                <div className={`p-2 rounded-lg ${skill.color}/10 ${skill.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform border border-current/10`}>
                                                    <skill.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">
                                                    {skill.name.substring(0, 3).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Name */}
                                            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-200 dark:border-white/5">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">Interests</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {dev.interests.map((interest, idx) => {
                                        const isObject = typeof interest === "object";
                                        const title = isObject ? interest.title : interest;
                                        const desc = isObject ? interest.description : null;
                                        const InterestIcon = isObject ? interest.icon : Sparkles;

                                        return (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ y: -5 }}
                                                className="relative group/interest p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/10 hover:border-indigo-500/30 overflow-hidden shadow-lg shadow-black/5"
                                            >
                                                {/* Card Glow Effect */}
                                                <div className="absolute -inset-24 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover/interest:opacity-100 transition-opacity pointer-events-none" />

                                                <div className="relative z-10 flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 group-hover/interest:scale-110 transition-transform">
                                                        <InterestIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="space-y-1.5 pt-0.5">
                                                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                                                            {title}
                                                        </h4>
                                                        {desc && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed line-clamp-2">
                                                                {desc}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">Languages</h3>
                                <div className="flex gap-10">
                                    {dev.languages.map(lang => (
                                        <div key={lang} className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white font-black text-lg tracking-tight">{lang}</span>
                                            <span className="text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Native</span>
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
