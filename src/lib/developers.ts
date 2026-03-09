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
    summary: string;
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
        icon: LucideIcon;
        color: string;
    }[];
    softSkills: string[];
    skillSet: string[];
    interests: (string | { title: string; description: string; icon: LucideIcon })[];
    languages: string[];
    icon: LucideIcon;
    image?: string;
    brandColor: string;
    currentFocus?: {
        title: string;
        description: string;
        icon: LucideIcon;
    }[];
    highlights?: {
        text: string;
        icon: LucideIcon;
    }[];
    tools?: {
        name: string;
        icon: LucideIcon;
        color: string;
    }[];
    quote?: string;
    resumeUrl?: string;
}

export const developersData: Record<string, DeveloperData> = {
    simit: {
        name: "Simit Modi",
        slug: "simit",
        role: "Project Lead & Product Architect",
        bio: "Project Lead and Product Architect behind Stride, responsible for conceptualizing the platform and leading its development. He designed the core idea of the product and guided the team in building a system that simplifies how users interact with banking services. His work focuses on translating complex real-world processes into intuitive digital experiences, combining product thinking with scalable system design. Within the Stride project, he leads architectural decisions, product direction, and overall development strategy.",
        summary: "Visionary Fullstack Developer and PR Head at ISTE. Expert in C, Java, and Python, specializing in Data-Driven Optimization and user-centric banking infrastructure.",
        objective: "To build impactful digital products that simplify the real-world process through thoughtful system design, intuitive user experience and reliable technology.",
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
        interests: ["AI Research", "Algorithm Design", "System Performance", "Formula 1", "Aviation"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Crown,
        brandColor: "from-amber-500 to-orange-600"
    },
    hardi: {
        name: "Hardi Patel",
        slug: "hardi",
        role: "Frontend & UI Design",
        bio: "I am a Computer Engineering student with a strong curiosity for technology and problem-solving. I enjoy building modern web applications and exploring tools that improve user experience and system efficiency.\n\nDuring my learning journey, I have worked with technologies such as React, Next.js, Java, Firebase, and modern frontend tools to develop practical projects and strengthen my development skills.\n\nI enjoy working in collaborative environments where ideas are shared, challenges are solved creatively, and teams grow together through learning and experimentation.\n\nMy goal is to become a skilled software developer who builds efficient, scalable, and user-focused digital solutions.\n\nI believe in consistency, continuous learning, and improving a little every day as I grow in my engineering journey.",
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
            { name: "React", icon: Atom, color: "bg-cyan-500" },
            { name: "Next.js", icon: Layers, color: "bg-indigo-400" },
            { name: "TypeScript", icon: Code2, color: "bg-blue-500" },
            { name: "C", icon: Terminal, color: "bg-blue-600" },
            { name: "Java", icon: Coffee, color: "bg-red-600" },
            { name: "Python", icon: Binary, color: "bg-yellow-600" },
            { name: "Node.js", icon: Zap, color: "bg-green-600" },
            { name: "Firebase", icon: Flame, color: "bg-orange-500" }
        ],
        softSkills: ["Curiosity", "Collaboration", "Self-Improvement", "Teamwork", "Consistency"],
        skillSet: ["Wireframing", "Prototyping", "Component Design", "Responsive Web"],
        interests: [
            { title: "Web Development", description: "Building responsive and modern web applications using contemporary technologies.", icon: Globe },
            { title: "Software Development", description: "Designing efficient software solutions while continuously improving programming skills.", icon: Cpu },
            { title: "Problem Solving", description: "Enjoy solving logical challenges and developing optimized solutions using programming.", icon: Terminal },
            { title: "Learning New Technologies", description: "Exploring modern frameworks, tools, and development practices to expand technical knowledge.", icon: Zap }
        ],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Layout,
        brandColor: "from-indigo-500 to-purple-600",
        currentFocus: [
            {
                title: "Modern Web Apps",
                description: "Building modern web applications using React and Next.js",
                icon: Atom
            },
            {
                title: "Backend Dev",
                description: "Learning backend development with Node.js and Firebase",
                icon: Zap
            },
            {
                title: "Problem Solving",
                description: "Improving Java programming and problem-solving skills",
                icon: Terminal
            }
        ],
        highlights: [
            {
                text: "Built Stride – a smart bank queue management system improving customer experience",
                icon: Box
            },
            {
                text: "Developed multiple projects using Java, React, and Firebase",
                icon: Layers
            },
            {
                text: "Continuously improving development skills and learning new technologies",
                icon: Sparkles
            }
        ],
        tools: [
            { name: "VS Code", icon: Code2, color: "bg-blue-500" },
            { name: "Git & GitHub", icon: Github, color: "bg-slate-800" },
            { name: "Figma", icon: PenTool, color: "bg-purple-500" },
            { name: "Postman", icon: Webhook, color: "bg-orange-500" },
            { name: "Firebase Console", icon: Flame, color: "bg-amber-500" }
        ],
        quote: "Building technology that solves real-world problems and improves user experiences.",
        resumeUrl: "/hardi_cv.html"
    },
    bansari: {
        name: "Bansari Makwana",
        slug: "bansari",
        role: "Frontend & UI Design",
        bio: "I am a passionate developer with a deep love for unraveling complex puzzles and building elegant digital solutions. For me, coding transcends mere instructions; it is a creative medium for crafting meaningful, user-centric experiences.\n\nDriven by a curiosity for how technology can bridge human needs with digital efficiency, I focus on building platforms that are not only functional but also secure and intuitive. My journey in Computer Engineering has fueled my commitment to pixel-perfect design and robust system architectures.\n\nI thrive in collaborative environments where innovation meets purpose, believing that the best solutions come from a blend of technical precision and creative exploration. My goal is to continuously expand my technical horizons while leaving a positive impact through every line of code I write.",
        summary: "Passionate developer focused on crafting elegant, user-centric digital experiences. Expert in bridging complex technical puzzles with intuitive UI solutions.",
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
        interests: ["Complex Puzzles", "Digital Solutions", "User-Centric Design", "System Architecture", "Meaningful Experiences"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Layers,
        brandColor: "from-blue-500 to-cyan-600"
    },
    ankit: {
        name: "Ankit Nandoliya",
        slug: "ankit",
        role: "Frontend & UI Design",
        bio: "I am Ankit Nandoliya. During the development of Stride, I personally led the design phase, taking the project from a high-level concept to a finished, user-centric appointment system.\n\nI focus on building robust applications that solve real-world problems. My work is centered on technical precision and creating fluid interactive elements to deliver efficient, high-quality digital experiences.",
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
            { name: "Git", icon: Github, color: "bg-orange-600" },
            { name: "HTML", icon: Globe, color: "bg-orange-500" },
            { name: "CSS", icon: Compass, color: "bg-blue-500" },
            { name: "JavaScript", icon: Code2, color: "bg-yellow-500" },
            { name: "C", icon: Terminal, color: "bg-slate-600" },
            { name: "C++", icon: Binary, color: "bg-indigo-600" },
            { name: "Java", icon: Coffee, color: "bg-red-600" },
            { name: "Python", icon: Webhook, color: "bg-green-600" },
            { name: "DBMS", icon: Database, color: "bg-purple-600" },
            { name: "Data Structures", icon: Layers, color: "bg-cyan-600" }
        ],
        softSkills: ["Critical Thinking", "Self Learning", "Communication", "Efficiency"],
        skillSet: ["Interactive Layouts", "Code Architecture", "UI Polish", "Responsive Flow"],
        interests: ["Bridging Tech & Art", "Performance", "Bikes", "Tech Devices"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Binary,
        image: "/developers/ankit.jpg",
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
        bio: "I am a passionate and motivated developer who thrives on building modern, impactful web applications. My focus is on writing simple, efficient, and maintainable code that brings visually appealing designs to life.\n\nI believe that continuous learning is the cornerstone of great development. I am always curious about emerging technologies and trends, constantly working on projects to refine my technical and problem-solving skills.\n\nMy goal is to contribute to digital solutions that are both functional and visually engaging, ensuring a smooth and intuitive user experience. I enjoy the process of translating creative concepts into interactive code and am dedicated to growing as a professional developer who builds software that matters.",
        summary: "Motivated developer dedicated to simple, maintainable code and clean web interfaces. Expert in translating creative vision into functional reality.",
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
            { name: "HTML5", icon: Globe, color: "bg-orange-600" },
            { name: "CSS3", icon: Compass, color: "bg-blue-600" },
            { name: "JavaScript", icon: Code2, color: "bg-yellow-500" },
            { name: "React", icon: Atom, color: "bg-blue-500" },
            { name: "C", icon: Terminal, color: "bg-blue-600" },
            { name: "Java", icon: Coffee, color: "bg-red-600" },
            { name: "Python", icon: Binary, color: "bg-yellow-600" },
            { name: "UI/UX Design", icon: PenTool, color: "bg-purple-500" }
        ],
        softSkills: ["Motivated", "Problem Solving", "Continuous Learning", "Attention to Detail", "Collaborative"],
        skillSet: ["Clean Code", "Efficient Dev", "Responsive UI", "Maintainable Systems"],
        interests: ["Modern Web", "Software Dev", "UI/UX Design", "Problem Solving", "Learning Tech"],
        languages: ["English", "Gujarati", "Hindi"],
        icon: Paintbrush,
        brandColor: "from-rose-500 to-red-600"
    }
};
