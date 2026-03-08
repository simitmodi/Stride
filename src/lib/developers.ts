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
    Briefcase,
    Coffee,
    Flame,
    PenTool,
    Compass,
    Sparkles,
    Atom,
    Webhook,
    Box,
    Binary
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DeveloperData {
    name: string;
    slug: string;
    role: string;
    bio: string;
    summary: string; // Brief 3-4 line summary for main grid
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
        icon: LucideIcon; // Required Lucide icon
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
        role: "Project Lead & Product Architect",
        bio: "Project Lead and Product Architect behind Stride, responsible for conceptualizing the platform and leading its development. He designed the core idea of the product and guided the team in building a system that simplifies how users interact with banking services. His work focuses on translating complex real-world processes into intuitive digital experiences, combining product thinking with scalable system design. Within the Stride project, he leads architectural decisions, product direction, and overall development strategy.",
        summary: "Visionary Fullstack Developer and PR Head at ISTE. Expert in C, Java, and Python, specializing in Data-Driven Optimization and user-centric banking infrastructure.",
        objective: "To build impactful digital products that simplify the real-world process through thought full system design, intuitive user experience and reliable technology.",
        contact: {
            email: "simitmodi@gostride.online",
            phone: "+91 97232 87331",
            linkedin: "https://www.linkedin.com/in/simitmodi/",
            github: "https://github.com/simitmodi",
            instagram: "https://www.instagram.com/simit.io/",
            portfolio: "https://simitmodi.vercel.app/"
        },
        education: {
            school: "SAL Institute of Technology and Engineering Research",
            degree: "Computer Engineering",
            year: "2023 - Present"
        },
        technicalSkills: [
            { name: "C", icon: Terminal, color: "bg-blue-600" },
            { name: "Java", icon: Coffee, color: "bg-red-600" },
            { name: "Python", icon: Binary, color: "bg-yellow-600" },
            { name: "TypeScript", icon: Code2, color: "bg-blue-500" },
            { name: "React", icon: Atom, color: "bg-cyan-500" },
            { name: "Next.js", icon: Layers, color: "bg-indigo-400" },
            { name: "Node.js", icon: Zap, color: "bg-green-600" },
            { name: "Firebase", icon: Flame, color: "bg-orange-500" },
            { name: "Figma", icon: PenTool, color: "bg-purple-500" }
        ],
        softSkills: ["Team Leadership", "Strategic Planning", "Problem Solving", "Communication"],
        skillSet: ["System Design", "Cloud Architecture", "Fullstack Development", "API Security"],
        interests: ["AI Research", "Algorithm Desing", "System Performance", "Formula 1", "Aviation"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Crown,
        brandColor: "from-amber-500 to-orange-600"
    },
    hardi: {
        name: "Hardi Patel",
        slug: "hardi",
        role: "Frontend & UI Design",
        bio: "I’m a computer engineering student with a curious mindset and a willingness to explore new opportunities. While I’m still discovering my path, I enjoy being part of collaborative environments where I can learn, contribute, and grow. I believe in showing up, asking questions, and doing my best – no matter the challenge. I’m someone who values consistency, teamwork, and self-improvement. I may not have everything figured out yet, but I’m committed to learning, trying new things, and becoming the best version of myself – one step at a time.",
        summary: "Creative Frontend Developer focused on UI/UX excellence. Passionate about learning, collaboration, and crafting premium banking interfaces.",
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
            school: "SAL Institute of Technology and Engineering Research (GTU)",
            degree: "Computer Engineering",
            year: "2023 - 2027"
        },
        technicalSkills: [
            { name: "Figma", icon: PenTool, color: "bg-purple-500" },
            { name: "React", icon: Atom, color: "bg-cyan-500" },
            { name: "Next.js", icon: Layers, color: "bg-indigo-400" },
            { name: "TypeScript", icon: Code2, color: "bg-blue-500" },
            { name: "Tailwind", icon: Palette, color: "bg-sky-500" },
            { name: "C", icon: Terminal, color: "bg-blue-600" },
            { name: "Java", icon: Coffee, color: "bg-red-600" },
            { name: "Python", icon: Binary, color: "bg-yellow-600" },
            { name: "Node.js", icon: Zap, color: "bg-green-600" },
            { name: "Firebase", icon: Flame, color: "bg-orange-500" }
        ],
        softSkills: ["Curiosity", "Collaboration", "Self-Improvement", "Teamwork", "Consistency"],
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
        summary: "Specialist in Glassmorphism and UI consistency. Expert in React and Tailwind, delivering high-fidelity platform components.",
        objective: "Achieving pixel-perfect implementation and premium visual consistency through specialized frontend components.",
        contact: {
            email: "bansari@stride.in",
            phone: "+91 76543 21098",
            linkedin: "https://www.linkedin.com/in/bansimakwana/",
            github: "https://github.com/MakwBansari",
            instagram: "https://www.instagram.com/bansiiii_._/",
            portfolio: "https://bansarimakwana.vercel.app"
        },
        education: {
            school: "SAL Institute of Technology and Engineering Research (GTU)",
            degree: "Computer Engineering",
            year: "2023 - 2027"
        },
        technicalSkills: [
            { name: "React", icon: Atom, color: "bg-blue-500" },
            { name: "Glassmorphism", icon: Layers, color: "bg-indigo-400" },
            { name: "Tailwind", icon: Palette, color: "bg-cyan-500" },
            { name: "Next.js", icon: Code2, color: "bg-slate-300" },
            { name: "CSS3", icon: Compass, color: "bg-blue-600" },
            { name: "HTML5", icon: Globe, color: "bg-orange-600" }
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
        summary: "Bridging tech and art with fluid motion and responsive code. Expert in Framer Motion and interaction design.",
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
            school: "SAL Institute of Technology and Engineering Research (GTU)",
            degree: "Computer Engineering",
            year: "2023 - 2027"
        },
        technicalSkills: [
            { name: "Frontend", icon: Layout, color: "bg-emerald-500" },
            { name: "UI Design", icon: PenTool, color: "bg-indigo-500" },
            { name: "React", icon: Atom, color: "bg-blue-500" },
            { name: "Tailwind", icon: Palette, color: "bg-cyan-500" },
            { name: "Motion", icon: Sparkles, color: "bg-pink-600" },
            { name: "Git", icon: Github, color: "bg-orange-600" }
        ],
        softSkills: ["Critical Thinking", "Self Learning", "Communication", "Efficiency"],
        skillSet: ["Interactive Layouts", "Code Architecture", "UI Polish", "Responsive Flow"],
        interests: ["Bridging Tech & Art", "Performance", "Clean Code"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Binary,
        brandColor: "from-emerald-500 to-teal-600"
    },
    sharvi: {
        name: "Sharvi Bhavsar",
        slug: "sharvi",
        role: "Frontend & UI Design",
        bio: "Focused on the structural integrity of the frontend, ensuring that the bespoke UI designs translated perfectly into functional, high-performance code.",
        summary: "Frontend Architect focused on logic and structural integrity. Specializes in scalable UI and performant web systems.",
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
            school: "SAL Institute of Technology and Engineering Research (GTU)",
            degree: "Computer Engineering",
            year: "2023 - 2027"
        },
        technicalSkills: [
            { name: "Logic Architecture", icon: Cpu, color: "bg-purple-600" },
            { name: "React", icon: Atom, color: "bg-blue-500" },
            { name: "Structure", icon: Layers, color: "bg-indigo-400" },
            { name: "Tailwind", icon: Palette, color: "bg-cyan-500" },
            { name: "JavaScript", icon: Code2, color: "bg-yellow-500" },
            { name: "State Mgmt", icon: Database, color: "bg-indigo-600" }
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
        role: "Canvas & Documentation",
        bio: "Created pre-devopment canvas for the platform and documented the entire process. Gathered all the requirements from the bank users and created a detailed canvas which gave the direction for the development of the platform.",
        summary: "Creative Canvas Maker. Made necessary canvas for the approval of the project by the Faculty",
        objective: "To show the canvas to the Faculty for the approval of the project",
        contact: {
            email: "krishna@stride.in",
            phone: "+91 43210 98765",
            linkedin: "https://www.linkedin.com/in/krishna-patel-900523387",
            github: "https://github.com/krishna276-cloud",
            instagram: "https://www.instagram.com/__krishna276/",
            portfolio: "https://krishna276-portfolio.netlify.app"
        },
        education: {
            school: "SAL Institute of Technology and Engineering Research (GTU)",
            degree: "Computer Engineering",
            year: "2023 - 2027"
        },
        technicalSkills: [
            { name: "Visual Art", icon: Paintbrush, color: "bg-rose-500" },
            { name: "Canvas UI", icon: Layout, color: "bg-orange-500" },
            { name: "Layout Art", icon: Palette, color: "bg-indigo-500" },
            { name: "Styling", icon: Sparkles, color: "bg-pink-500" },
            { name: "Design Narr.", icon: Layers, color: "bg-amber-500" },
            { name: "UI Flow", icon: Component, color: "bg-cyan-500" }
        ],
        softSkills: ["Storytelling", "Visual Empathy", "Patience", "Innovative Thinking"],
        skillSet: ["Canvas Narratives", "Creative Direction", "Thematic Layouts", "Aesthetic Flow"],
        interests: ["Visual Arts", "Design Heritage", "Digital Expression"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Paintbrush,
        brandColor: "from-rose-500 to-red-600"
    }
};
