import {
    Layout,
    Code2,
    Palette,
    Terminal,
    Cpu,
    ShieldCheck,
    Database,
    Zap,
    Layers,
    Component,
    Paintbrush,
    Crown,
    Github,
    Linkedin,
    Globe,
    Mail,
    Phone,
    Briefcase
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DeveloperData {
    name: string;
    slug: string;
    role: string;
    bio: string;
    objective: string;
    contact: {
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        instagram: string;
        portfolio?: string;
    };
    education: {
        school: string;
        degree: string;
        year: string;
    };
    technicalSkills: {
        name: string;
        icon?: string; // Optional URL or key
        color: string;
    }[];
    softSkills: string[];
    skillSet: string[];
    interests: string[];
    languages: string[];
    icon: LucideIcon;
    brandColor: string;
}

export const developersData: Record<string, DeveloperData> = {
    simit: {
        name: "Simit Modi",
        slug: "simit",
        role: "Frontend & Backend",
        bio: "The visionary leader of the Stride development team, specializing in end-to-end architecture and high-performance system design.",
        objective: "To redefine the banking experience by merging secure backend infrastructure with elite, intuitive frontend aesthetics.",
        contact: {
            email: "simitmodi@stride.in",
            phone: "+91 98765 43210", // Placeholder
            linkedin: "https://www.linkedin.com/in/simitmodi/",
            github: "https://github.com/simitmodi",
            instagram: "https://www.instagram.com/simit.io/",
            portfolio: "https://simitmodi.vercel.app/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Computer Engineering",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "React", color: "bg-blue-500" },
            { name: "Next.js", color: "bg-black" },
            { name: "Node.js", color: "bg-green-600" },
            { name: "Firebase", color: "bg-amber-500" },
            { name: "PostgreSQL", color: "bg-indigo-600" },
            { name: "TypeScript", color: "bg-blue-600" }
        ],
        softSkills: ["Team Leadership", "Strategic Planning", "Problem Solving", "Communication"],
        skillSet: ["System Design", "Cloud Architecture", "Fullstack Development", "API Security"],
        interests: ["FinTech", "AI Research", "System Performance"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Crown,
        brandColor: "from-amber-500 to-orange-600"
    },
    hardi: {
        name: "Hardi Patel",
        slug: "hardi",
        role: "Frontend & UI Design",
        bio: "Spearheaded the visual identity of Stride, focusing on the seamless blend of intuitive UI layouts and responsive frontend components.",
        objective: "Crafting visually stunning, user-centric interfaces that make complex banking tasks feel effortless and premium.",
        contact: {
            email: "hardipatel@stride.in",
            phone: "+91 87654 32109",
            linkedin: "https://www.linkedin.com/in/hardipatel2510/",
            github: "https://github.com/hardipatel2510",
            instagram: "https://www.instagram.com/hardiptl.io/",
            portfolio: "https://hardipatel.vercel.app/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Information Technology",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "Figma", color: "bg-purple-600" },
            { name: "React", color: "bg-blue-500" },
            { name: "Tailwind", color: "bg-cyan-500" },
            { name: "Framer", color: "bg-pink-600" },
            { name: "UI Design", color: "bg-indigo-500" },
            { name: "JavaScript", color: "bg-yellow-500" }
        ],
        softSkills: ["UI/UX Strategy", "Visual Thinking", "Adaptability", "Time Management"],
        skillSet: ["Wireframing", "Prototyping", "Component Design", "Responsive Web"],
        interests: ["Interaction Design", "Typography", "Motion UI"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Layout,
        brandColor: "from-indigo-500 to-purple-600"
    },
    bansari: {
        name: "Bansari Makwana",
        slug: "bansari",
        role: "Frontend & UI Design",
        bio: "Crafted the elegant glassmorphic components and ensured a consistent, high-fidelity user experience across all platform interfaces.",
        objective: "Achieving pixel-perfect implementation and premium visual consistency through specialized frontend components.",
        contact: {
            email: "bansari@stride.in",
            phone: "+91 76543 21098",
            linkedin: "https://www.linkedin.com/in/bansimakwana/",
            github: "https://github.com/MakwBansari",
            instagram: "https://www.instagram.com/bansiiii_._/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Computer Engineering",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "React", color: "bg-blue-500" },
            { name: "Glassmorphism", color: "bg-white/20" },
            { name: "Tailwind", color: "bg-cyan-500" },
            { name: "Next.js", color: "bg-black" },
            { name: "CSS3", color: "bg-blue-600" },
            { name: "HTML5", color: "bg-orange-600" }
        ],
        softSkills: ["Attention to Detail", "Collaboration", "Creative Design", "Resourcefulness"],
        skillSet: ["Glass UI Systems", "Layout Design", "Frontend Implementation", "Design Ops"],
        interests: ["Modern UI Trends", "Glassmorphism", "Brand Identity"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Layers,
        brandColor: "from-blue-500 to-cyan-600"
    },
    ankit: {
        name: "Ankit Nandoliya",
        slug: "ankit",
        role: "Frontend & UI Design",
        bio: "Specialized in bridge-building between design and code, implementing precise layouts and fluid interactive elements.",
        objective: "To translate complex aesthetic visions into functional, interactive code that feels alive and responsive.",
        contact: {
            email: "ankit@stride.in",
            phone: "+91 65432 10987",
            linkedin: "https://www.linkedin.com/in/ankit-nandoliya-425a1429b/",
            github: "https://github.com/ankit5287",
            instagram: "https://www.instagram.com/ankit_n2/",
            portfolio: "https://ankit52.vercel.app/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Information Technology",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "Frontend", color: "bg-emerald-500" },
            { name: "UI Design", color: "bg-indigo-500" },
            { name: "React", color: "bg-blue-500" },
            { name: "Tailwind", color: "bg-cyan-500" },
            { name: "Motion", color: "bg-pink-600" },
            { name: "Git", color: "bg-orange-600" }
        ],
        softSkills: ["Critical Thinking", "Self Learning", "Communication", "Efficiency"],
        skillSet: ["Interactive Layouts", "Code Architecture", "UI Polish", "Responsive Flow"],
        interests: ["Bridging Tech & Art", "Performance", "Clean Code"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Zap,
        brandColor: "from-emerald-500 to-teal-600"
    },
    sharvi: {
        name: "Sharvi Bhavsar",
        slug: "sharvi",
        role: "Frontend & UI Design",
        bio: "Focused on the structural integrity of the frontend, ensuring that the bespoke UI designs translated perfectly into functional, high-performance code.",
        objective: "Delivering high-performance, maintainable frontend structures that support elite-scale platform expansion.",
        contact: {
            email: "sharvi@stride.in",
            phone: "+91 54321 09876",
            linkedin: "https://www.linkedin.com/in/sharvi-bhavsar-914344344/",
            github: "https://github.com/sharvibhavsar",
            instagram: "https://www.instagram.com/sharvi1206/",
            portfolio: "https://sharvi-bhavsar-portfolio.vercel.app/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Computer Engineering",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "Logic Architecture", color: "bg-purple-600" },
            { name: "React", color: "bg-blue-500" },
            { name: "Structure", color: "bg-slate-700" },
            { name: "Tailwind", color: "bg-cyan-500" },
            { name: "JavaScript", color: "bg-yellow-500" },
            { name: "State Mgmt", color: "bg-indigo-600" }
        ],
        softSkills: ["Quality Control", "Structural Analysis", "Resilience", "Logic"],
        skillSet: ["Optimization", "Scalable UI", "Performance Audits", "Bug Squashing"],
        interests: ["Architecture", "Scalability", "Clean UI"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Component,
        brandColor: "from-purple-500 to-pink-600"
    },
    krishna: {
        name: "Krishna Patel",
        slug: "krishna",
        role: "Canvas",
        bio: "Dedicated to the creative 'Canvas' of the project, focusing on the artistic layout and visual storytelling elements that make Stride unique.",
        objective: "To elevate the platform's visual narrative through artistic expression and elegant storytelling layouts.",
        contact: {
            email: "krishna@stride.in",
            phone: "+91 43210 98765",
            linkedin: "https://www.linkedin.com/in/krishna-patel-900523387",
            github: "https://github.com/krishna276-cloud",
            instagram: "https://www.instagram.com/__krishna276/"
        },
        education: {
            school: "LDRP Institute",
            degree: "Information Technology",
            year: "2021 - Present"
        },
        technicalSkills: [
            { name: "Visual Art", color: "bg-rose-500" },
            { name: "Canvas UI", color: "bg-orange-500" },
            { name: "Layout Art", color: "bg-indigo-500" },
            { name: "Styling", color: "bg-pink-500" },
            { name: "Design Narr.", color: "bg-amber-500" },
            { name: "UI Flow", color: "bg-cyan-500" }
        ],
        softSkills: ["Storytelling", "Visual Empathy", "Patience", "Innovative Thinking"],
        skillSet: ["Canvas Narratives", "Creative Direction", "Thematic Layouts", "Aesthetic Flow"],
        interests: ["Visual Arts", "Design Heritage", "Digital Expression"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Paintbrush,
        brandColor: "from-rose-500 to-red-600"
    }
};
