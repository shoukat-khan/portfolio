import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import {
    Mail,
    Phone,
    MapPin,
    Github,
    Linkedin,
    ExternalLink,
    Code2,
    Brain,
    Container,
    ChevronDown,
    Menu,
    X,
    Eye,
    Bot,
    Server,
    Sparkles,
    Database,
    Shield,
    MessageSquare,
    Home,
    Dumbbell,
    Car,
    Coffee,
    Activity,
    Headphones,
    Music,
    Cog,
    Film,
    Trophy,
    Clock,
    Download,
    FileText,
    Instagram,
    GraduationCap,
    Briefcase,
    Award,
    Send
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 3D PARTICLE WAVE - MOUSE REACTIVE
// ═══════════════════════════════════════════════════════════════════════════════

function ParticleWave({ mouse }) {
    const ref = useRef();
    const { viewport } = useThree();

    const [positions, basePositions] = useMemo(() => {
        const count = 2500; // Reduced from 5000 for better performance
        const positions = new Float32Array(count * 3);
        const basePositions = new Float32Array(count * 3);
        const gridSize = Math.sqrt(count);
        const spacing = 0.2;

        for (let i = 0; i < count; i++) {
            const x = ((i % gridSize) - gridSize / 2) * spacing;
            const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing;
            positions[i * 3] = x;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = z;
            basePositions[i * 3] = x;
            basePositions[i * 3 + 1] = 0;
            basePositions[i * 3 + 2] = z;
        }
        return [positions, basePositions];
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.getElapsedTime();
        const positionArray = ref.current.geometry.attributes.position.array;
        const mouseX = (mouse.current.x / window.innerWidth) * 2 - 1;
        const mouseY = -(mouse.current.y / window.innerHeight) * 2 + 1;
        const mouseVec = new THREE.Vector3(mouseX * viewport.width / 2, mouseY * viewport.height / 2, 0);

        for (let i = 0; i < positionArray.length / 3; i++) {
            const baseX = basePositions[i * 3];
            const baseZ = basePositions[i * 3 + 2];
            const dx = baseX - mouseVec.x * 0.8;
            const dz = baseZ - mouseVec.y * 0.8;
            const distance = Math.sqrt(dx * dx + dz * dz);
            const waveHeight = Math.sin(baseX * 2 + time * 0.8) * 0.1 + Math.cos(baseZ * 2 + time * 0.6) * 0.1;
            const mouseInfluence = Math.max(0, 1 - distance / 3);
            const mouseWave = Math.sin(distance * 3 - time * 4) * mouseInfluence * 0.35;
            positionArray[i * 3 + 1] = waveHeight + mouseWave;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
        ref.current.rotation.y = time * 0.025;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#22d3ee" size={0.018} sizeAttenuation depthWrite={false} opacity={0.7} blending={THREE.AdditiveBlending} />
        </Points>
    );
}

function FloatingParticles() {
    const ref = useRef();
    const positions = useMemo(() => {
        const count = 600; // Reduced from 1200 for better performance
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.getElapsedTime();
        ref.current.rotation.y = time * 0.012;
        ref.current.rotation.x = Math.sin(time * 0.06) * 0.06;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#a855f7" size={0.01} sizeAttenuation depthWrite={false} opacity={0.35} blending={THREE.AdditiveBlending} />
        </Points>
    );
}

function Scene({ mouse }) {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.4} color="#22d3ee" />
            <pointLight position={[-10, -10, -10]} intensity={0.2} color="#a855f7" />
            <ParticleWave mouse={mouse} />
            <FloatingParticles />
        </>
    );
}

const Background3D = ({ mouse }) => (
    <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <Canvas camera={{ position: [0, 4, 8], fov: 60 }} style={{ position: 'absolute', inset: 0 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
                <Scene mouse={mouse} />
            </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = ['About', 'Timeline', 'Certifications', 'Projects', 'Skills', 'Contact'];
    const scrollTo = (id) => {
        document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
        setIsMobileOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/70 backdrop-blur-xl border-b border-cyan-500/10' : 'bg-transparent'}`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.a href="#" whileHover={{ scale: 1.05 }} className="text-xl font-bold tracking-tighter">
                        <span className="text-cyan-400">SK</span><span className="text-white/40">.</span>
                    </motion.a>
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((item, i) => (
                            <motion.button key={item} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => scrollTo(item)} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
                            </motion.button>
                        ))}
                    </div>
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2 text-slate-400">
                        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                {isMobileOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden mt-4 pb-4 space-y-2">
                        {links.map((item) => (
                            <button key={item} onClick={() => scrollTo(item)} className="block w-full text-left px-4 py-3 text-slate-300 hover:bg-cyan-500/10 rounded-xl transition-colors">{item}</button>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLASSMORPHIC CARD
// ═══════════════════════════════════════════════════════════════════════════════

const GlassCard = ({ children, className = '', hover = true }) => (
    <motion.div
        whileHover={hover ? { y: -6, scale: 1.02 } : {}}
        className={`relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-500 ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">{children}</div>
    </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
            {/* Profile Picture */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mb-8"
            >
                <div className="relative inline-block">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                        <img
                            src="/images/shoukat-khan.jpg"
                            alt="Shoukat Khan"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Available for opportunities</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className="text-white">Shoukat</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">Khan</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-xl md:text-2xl text-slate-300 mb-4">
                Software Engineer <span className="text-slate-600">|</span> Full Stack & AI Specialist
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-8">
                "Final-year Software Engineering student at FAST-NUCES. Merging scalable backend architectures with intelligent computer vision and secure real-time systems."
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center justify-center gap-2 text-slate-500 mb-10">
                <MapPin className="w-4 h-4" />
                <span>Rawalpindi, Pakistan</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34, 211, 238, 0.3)' }} whileTap={{ scale: 0.98 }} onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl text-slate-950 font-semibold flex items-center gap-2">
                    View Projects <ExternalLink className="w-4 h-4" />
                </motion.button>
                <motion.a
                    href="/shoukat-khan-resume.pdf"
                    download="Shoukat_Khan_Resume.pdf"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-medium flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download Resume
                </motion.a>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium">
                    Get In Touch
                </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center text-slate-600">
                    <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.div>
        </div>
    </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const AboutSection = () => (
    <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="text-cyan-400 text-sm tracking-widest uppercase">About Me</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-8">
                    Building <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">The Future</span>
                </h2>
                <GlassCard className="p-8" hover={false}>
                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                        Final-year Software Engineering student at <span className="text-cyan-400">FAST-NUCES</span> with a CGPA of 3.4. Specialized in building enterprise-grade backends, intelligent AI systems, and secure distributed architectures.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-slate-700/50">
                        {[
                            { icon: Code2, label: 'Frontend', desc: 'React / React Native' },
                            { icon: Server, label: 'Backend', desc: 'Django / Spring' },
                            { icon: Brain, label: 'AI/ML', desc: 'CV / NLP / RAG' },
                            { icon: Container, label: 'DevOps', desc: 'Docker / K8s' },
                            { icon: Shield, label: 'Security', desc: 'E2E Encryption' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                <div className="text-white font-medium">{item.label}</div>
                                <div className="text-xs text-slate-500">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ORBITAL TIMELINE SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const timelineData = [
    { id: 1, year: '2018', title: 'Matriculation', desc: 'Completed Matriculation in Sciences with distinction.', icon: GraduationCap, color: 'cyan', status: 'completed' },
    { id: 2, year: '2020', title: 'FSc Pre-Engineering', desc: 'Completed Intermediate in Pre-Engineering, building foundation for software engineering.', icon: GraduationCap, color: 'purple', status: 'completed' },
    { id: 3, year: 'Aug 2022', title: 'FAST-NUCES Islamabad', desc: 'Started Bachelor\'s in Software Engineering at one of Pakistan\'s top CS universities.', icon: GraduationCap, color: 'cyan', status: 'in-progress' },
    { id: 4, year: 'Jun-Aug 2025', title: 'Software Internship', desc: 'First professional internship experience, working on real-world projects.', icon: Briefcase, color: 'green', status: 'completed' },
    { id: 5, year: '7th Sem', title: 'Leadership at IICT', desc: 'Took leadership role in IICT department, managing tech initiatives.', icon: Award, color: 'amber', status: 'in-progress' },
];

const TimelineSection = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);

    // Auto rotation effect
    useEffect(() => {
        let timer;
        if (autoRotate) {
            timer = setInterval(() => {
                setRotationAngle(prev => (prev + 0.4) % 360);
            }, 50);
        }
        return () => clearInterval(timer);
    }, [autoRotate]);

    const handleNodeClick = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            setAutoRotate(true);
        } else {
            setExpandedId(id);
            setAutoRotate(false);
            // Center the clicked node at top
            const nodeIndex = timelineData.findIndex(item => item.id === id);
            const targetAngle = 270 - (nodeIndex / timelineData.length) * 360;
            setRotationAngle(targetAngle);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setExpandedId(null);
            setAutoRotate(true);
        }
    };

    const calculatePosition = (index, total) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 160; // Orbit radius
        const radian = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);
        const scale = 0.7 + 0.3 * ((1 + Math.sin(radian)) / 2);
        const zIndex = Math.round(50 + 50 * Math.sin(radian));
        const opacity = 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2);
        return { x, y, scale, zIndex, opacity, angle };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in-progress': return 'bg-cyan-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <section id="timeline" className="py-24 px-6" onClick={handleBackgroundClick}>
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-8">
                    <span className="text-cyan-400 text-sm tracking-widest uppercase">Journey</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">Education & Experience</h2>
                    <p className="text-slate-400 mt-4 text-sm">Click on any node to see details</p>
                </motion.div>

                {/* Orbital Container */}
                <div className="relative h-[500px] flex items-center justify-center" onClick={handleBackgroundClick}>

                    {/* Center Core */}
                    <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-amber-500 flex items-center justify-center z-20 shadow-lg shadow-cyan-500/30">
                        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
                        <div className="absolute w-28 h-28 rounded-full border border-purple-500/20 animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
                        <div className="w-12 h-12 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>

                    {/* Orbit Ring */}
                    <div className="absolute w-80 h-80 rounded-full border border-slate-700/50" />
                    <div className="absolute w-80 h-80 rounded-full border border-cyan-500/10" style={{ transform: 'rotate(45deg)' }} />

                    {/* Orbital Nodes */}
                    {timelineData.map((item, index) => {
                        const pos = calculatePosition(index, timelineData.length);
                        const isExpanded = expandedId === item.id;
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.id}
                                className="absolute cursor-pointer"
                                style={{
                                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${isExpanded ? 1.2 : pos.scale})`,
                                    zIndex: isExpanded ? 100 : pos.zIndex,
                                    opacity: isExpanded ? 1 : pos.opacity,
                                }}
                                onClick={(e) => { e.stopPropagation(); handleNodeClick(item.id); }}
                                whileHover={{ scale: isExpanded ? 1.2 : pos.scale * 1.15 }}
                            >
                                {/* Energy Glow */}
                                <div
                                    className={`absolute -inset-2 rounded-full bg-${item.color}-500/20 blur-md ${isExpanded ? 'opacity-100' : 'opacity-50'}`}
                                    style={{ animation: isExpanded ? 'pulse 2s infinite' : 'none' }}
                                />

                                {/* Node Circle */}
                                <div className={`
                                    relative w-14 h-14 rounded-full flex items-center justify-center
                                    ${isExpanded ? 'bg-white text-slate-900' : `bg-slate-900 text-${item.color}-400`}
                                    border-2 ${isExpanded ? 'border-white shadow-lg shadow-white/30' : `border-${item.color}-500/50`}
                                    transition-all duration-300
                                `}>
                                    <Icon className="w-6 h-6" />

                                    {/* Status Indicator */}
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(item.status)} border-2 border-slate-950`} />
                                </div>

                                {/* Title Label */}
                                <div className={`
                                    absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap
                                    text-xs font-semibold tracking-wide
                                    ${isExpanded ? 'text-white scale-110' : 'text-slate-400'}
                                    transition-all duration-300
                                `}>
                                    {item.title}
                                </div>

                                {/* Expanded Card */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute top-24 left-1/2 -translate-x-1/2 w-64"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <GlassCard className="p-5" hover={false}>
                                            {/* Connector Line */}
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-transparent to-cyan-500/50" />

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'
                                                    }`}>
                                                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                                                </span>
                                                <span className="text-xs font-mono text-slate-500">{item.year}</span>
                                            </div>

                                            {/* Content */}
                                            <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                        </GlassCard>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        <span>In Progress</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATIONS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const certificationsData = [
    { title: 'HTML, CSS & Web Basics', issuer: 'IBM', color: 'from-blue-500 to-cyan-500' },
    { title: '100 Days of Code: Python', issuer: 'Angela Yu - Udemy', color: 'from-yellow-500 to-orange-500' },
    { title: 'Web Development Bootcamp', issuer: 'Angela Yu - Udemy', color: 'from-purple-500 to-pink-500' },
];

const CertificationsSection = () => (
    <section id="certifications" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <span className="text-cyan-400 text-sm tracking-widest uppercase">Credentials</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">Certifications</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {certificationsData.map((cert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard className="p-6 h-full">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-4`}>
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{cert.title}</h3>
                            <p className="text-sm text-slate-400">{cert.issuer}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS DATA (14 Projects with Real Links)
// ═══════════════════════════════════════════════════════════════════════════════

const projectsData = [
    // Enterprise & Backend
    {
        title: 'Multi-Tenant Task Backend',
        type: 'Backend Only',
        tech: ['Django', 'PostgreSQL', 'Docker', 'Tenant Schemas'],
        desc: 'SaaS architecture with shared-database, separate-schema tenant isolation.',
        icon: Database,
        gradient: 'from-blue-500 to-cyan-500',
        link: 'https://github.com/shoukat-khan/Multi-Tenant-Task-Management-Platform-Backend-Only-',
        image: '/images/multi-tenant-task.png'
    },
    {
        title: 'Auto Hub',
        type: 'Full System',
        tech: ['Java', 'Spring Boot', 'REST APIs', 'MySQL'],
        desc: 'Comprehensive workshop management with automated billing and inventory APIs.',
        icon: Cog,
        gradient: 'from-orange-500 to-amber-500',
        link: 'https://github.com/shoukat-khan/AutoHub',
        image: '/images/auto-hub.png'
    },
    {
        title: 'Movie Recommendation System',
        type: 'Backend Only',
        tech: ['MERN Stack', 'MongoDB', 'Algorithms'],
        desc: 'Intelligent recommendation engine using collaborative filtering.',
        icon: Film,
        gradient: 'from-pink-500 to-rose-500',
        link: 'https://github.com/shoukat-khan/MovieRecommendationSystem-',
        image: '/images/movie-recommendation.png'
    },
    {
        title: 'Cafe Management System',
        type: 'Desktop/DB',
        tech: ['C#', '.NET Web Forms', 'SQL Server'],
        desc: 'Relational DB app for managing orders, inventory, and staff scheduling.',
        icon: Coffee,
        gradient: 'from-amber-600 to-yellow-500',
        link: 'https://github.com/shoukat-khan/Cafe-managment-system',
        image: 'public/images/cafe-management.png'
    },
    {
        title: 'Kubernetes CI/CD Pipeline',
        type: 'DevOps',
        tech: ['Docker', 'K8s', 'GitHub Actions', 'Nginx'],
        desc: 'Automated microservices deployment with self-hosted runners.',
        icon: Container,
        gradient: 'from-cyan-500 to-teal-500',
        link: 'https://github.com/shoukat-khan/Project-SCD',
        image: '/images/kubernetes-cicd.png'
    },
    // AI & Research
    {
        title: 'AI Bias Mitigation (RAG)',
        type: 'Research/AI',
        tech: ['RAG', 'Vector DB', 'LangChain', 'React'],
        desc: 'Ethical AI reducing hallucination via verified document grounding.',
        icon: Shield,
        gradient: 'from-violet-500 to-purple-500',
        link: 'https://github.com/shoukat-khan/llm-biasness-mitigation-using-rag',
        image: '/images/rag-bias-mitigation.png'
    },
    {
        title: 'Early Stress Warning Agent',
        type: 'AI Agent',
        tech: ['Python', 'LangChain', 'OpenAI API'],
        desc: 'Intelligent agent predicting burnout using trend-based reasoning.',
        icon: Brain,
        gradient: 'from-purple-500 to-indigo-500',
        link: 'https://github.com/shoukat-khan/StressEarlyWarningAgent',
        image: '/images/stress-warning-agent.png'
    },
    {
        title: 'Resume Ranking System',
        type: 'HR Tech',
        tech: ['Python', 'Scikit-learn', 'NLP', 'React'],
        desc: 'HR tool scoring resumes using NLP and cosine similarity.',
        icon: Bot,
        gradient: 'from-fuchsia-500 to-pink-500',
        link: 'https://github.com/shoukat-khan/AI-based-resume-ranking-grouping-and-sentiment-matching-flask-app',
        image: '/images/resume-ranking.png'
    },
    {
        title: 'Drowsiness Detection (FYP)',
        type: 'Computer Vision',
        tech: ['Python', 'OpenCV', 'IoT Alerting'],
        desc: 'Real-time CV system detecting driver fatigue with SMS alerts.',
        icon: Eye,
        gradient: 'from-rose-500 to-orange-500',
        link: 'https://github.com/Shoukat-khan1/SafeDrive',
        image: '/images/drowsiness-detection.png'
    },
    // Full Stack
    {
        title: 'Secure E2E Chat App',
        type: 'Security/Web',
        tech: ['React', 'Node.js', 'Socket.io', 'AES-256'],
        desc: 'Real-time messaging with client-side end-to-end encryption.',
        icon: MessageSquare,
        gradient: 'from-green-500 to-emerald-500',
        link: 'https://github.com/shoukat-khan/info_sec_project',
        image: '/images/e2e-chat.png'
    },
    {
        title: 'Estate Sphere',
        type: 'MERN Marketplace',
        tech: ['React', 'Redux', 'MongoDB'],
        desc: 'Property portal with advanced filtering and user dashboards.',
        icon: Home,
        gradient: 'from-teal-500 to-cyan-500',
        link: 'https://github.com/shoukat-khan/Estate-Sphere-Property-Managment-System-',
        image: '/images/estate-sphere.png'
    },
    {
        title: 'Workout App Prototype',
        type: 'Mobile/UI',
        tech: ['React Native', 'Figma'],
        desc: 'Mobile fitness tracker with Figma-designed UI.',
        icon: Dumbbell,
        gradient: 'from-lime-500 to-green-500',
        link: 'https://github.com/shoukat-khan/human-computer-interaction-course',
        image: '/images/workout-app.jpg'
    },
    // Core Programming
    {
        title: 'Car Racing Game',
        type: 'Game Dev',
        tech: ['C++', 'Data Structures', 'Trees/Graphs'],
        desc: 'Console racing using Trees for obstacle pathfinding.',
        icon: Car,
        gradient: 'from-red-500 to-orange-500',
        link: 'https://github.com/shoukat-khan/semester-3-project',
        image: '/images/car-racing-game.png'
    },
    // Web App
    {
        title: 'Weather App',
        type: 'Web App',
        tech: ['JavaScript', 'Gemini AI', 'OpenWeather API'],
        desc: 'AI-powered weather application with real-time forecasts and intelligent insights.',
        icon: Sparkles,
        gradient: 'from-sky-500 to-blue-500',
        link: 'https://github.com/shoukat-khan/weather-app',
        demo: 'https://shoukat-khan.github.io/weather-app/',
        image: '/images/weather-app.png'
    },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ProjectCard = ({ project, index }) => {
    const hasLink = project.link && project.link !== '';
    const hasDemo = project.demo && project.demo !== '';
    const hasImage = project.image && project.image !== '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <GlassCard className="h-full flex flex-col">
                {/* Image/Gradient Header */}
                <div className={`h-44 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                    {hasImage && (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm rounded-full z-10">
                        {project.type}
                    </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{project.desc}</p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.slice(0, 4).map((t) => (
                            <span key={t} className="px-2 py-1 text-[10px] font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex gap-2 ${hasDemo ? 'flex-row' : ''}`}>
                        {hasLink ? (
                            <motion.a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center justify-center gap-2 py-2.5 bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/30 border border-transparent rounded-xl text-sm text-slate-300 hover:text-cyan-300 font-medium transition-all ${hasDemo ? 'flex-1' : 'w-full'}`}
                            >
                                <Github className="w-4 h-4" />
                                View Code
                            </motion.a>
                        ) : (
                            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/40 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed">
                                <Clock className="w-4 h-4" />
                                Coming Soon
                            </div>
                        )}
                        {hasDemo && (
                            <motion.a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl text-sm text-slate-950 font-semibold transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                            </motion.a>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ProjectsSection = () => (
    <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <span className="text-cyan-400 text-sm tracking-widest uppercase">Portfolio</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">Featured Projects</h2>
                <p className="text-slate-400 mt-4 max-w-xl mx-auto">13 projects spanning Backend, AI/ML, Full Stack, and Systems Programming</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsData.map((project, index) => (
                    <ProjectCard key={project.title} project={project} index={index} />
                ))}
            </div>
        </div>
    </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
// INFINITE MARQUEE SKILLS
// ═══════════════════════════════════════════════════════════════════════════════

const skillsRow1 = ['Python', 'C++', 'Java', 'JavaScript', 'SQL', 'C#', 'TypeScript'];
const skillsRow2 = ['React', 'Node.js', 'Django', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Express.js'];
const skillsRow3 = ['OpenCV', 'LangChain', 'RAG', 'Docker', 'Kubernetes', 'GitHub Actions', 'Linux'];

const MarqueeRow = ({ skills, direction = 'left', speed = 25 }) => {
    const duplicated = [...skills, ...skills, ...skills, ...skills];

    return (
        <div className="relative overflow-hidden py-2">
            {/* Edge masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <motion.div
                animate={{ x: direction === 'left' ? [0, -1400] : [-1400, 0] }}
                transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                className="flex gap-4"
            >
                {duplicated.map((skill, i) => (
                    <div key={`${skill}-${i}`} className="flex-shrink-0 px-5 py-2.5 bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-full text-sm text-white font-medium whitespace-nowrap hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all cursor-default">
                        {skill}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTERESTS BENTO CARDS
// ═══════════════════════════════════════════════════════════════════════════════

const InterestsSection = () => (
    <div className="grid md:grid-cols-2 gap-6 mt-16">
        {/* Cricket Card */}
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-teal-600/20 border border-emerald-500/20 p-8"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            <Trophy className="w-12 h-12 text-emerald-400 mb-4" />
            <span className="text-xs text-emerald-400 tracking-widest uppercase">Competitive Sports</span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">Cricket</h3>
            <p className="text-slate-400">Captain of the local team. Strategic leadership on the field.</p>
        </motion.div>

        {/* Music Card - Spotify Style */}
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 border border-violet-500/20 p-8"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
            <Headphones className="w-12 h-12 text-violet-400 mb-4" />
            <span className="text-xs text-violet-400 tracking-widest uppercase">Audio Audiophile</span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">Music</h3>
            <p className="text-slate-400">Listening to Lo-Fi & Rock helps me enter the flow state.</p>
            <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: ['0%', '70%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const SkillsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="skills" className="py-24 px-6" ref={ref}>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <span className="text-cyan-400 text-sm tracking-widest uppercase">Expertise</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">Skills & Interests</h2>
                </motion.div>

                {/* Marquee Rows */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <MarqueeRow skills={skillsRow1} direction="left" speed={35} />
                    <MarqueeRow skills={skillsRow2} direction="right" speed={40} />
                    <MarqueeRow skills={skillsRow3} direction="left" speed={32} />
                </motion.div>

                {/* Interests Bento */}
                <InterestsSection />
            </div>
        </section>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create mailto link with form data
        const mailtoLink = `mailto:shoukatkhang71@gmail.com?subject=${encodeURIComponent(formData.subject || 'Portfolio Contact')}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        }, 1000);
    };

    return (
        <section id="contact" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                    <div className="text-center mb-12">
                        <span className="text-cyan-400 text-sm tracking-widest uppercase">Contact</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Let's Connect</h2>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">Have a project in mind or want to discuss opportunities? Feel free to reach out!</p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            <GlassCard className="p-6" hover={false}>
                                <Mail className="w-8 h-8 text-cyan-400 mb-4" />
                                <p className="text-slate-500 text-sm mb-1">Email</p>
                                <a href="mailto:shoukatkhang71@gmail.com" className="text-white hover:text-cyan-400 transition-colors font-medium">shoukatkhang71@gmail.com</a>
                            </GlassCard>
                            <GlassCard className="p-6" hover={false}>
                                <Phone className="w-8 h-8 text-cyan-400 mb-4" />
                                <p className="text-slate-500 text-sm mb-1">Phone</p>
                                <a href="tel:+923175134074" className="text-white hover:text-cyan-400 transition-colors font-medium">+92 317 513 4074</a>
                            </GlassCard>
                            <GlassCard className="p-6" hover={false}>
                                <MapPin className="w-8 h-8 text-cyan-400 mb-4" />
                                <p className="text-slate-500 text-sm mb-1">Location</p>
                                <p className="text-white font-medium">Rawalpindi, Pakistan</p>
                            </GlassCard>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                <motion.a href="https://github.com/shoukat-khan" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, scale: 1.1 }} className="flex-1 p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2" aria-label="GitHub">
                                    <Github className="w-5 h-5" />
                                    <span className="text-sm font-medium">GitHub</span>
                                </motion.a>
                                <motion.a href="https://www.linkedin.com/in/shoukat-khan-67539628a/" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, scale: 1.1 }} className="flex-1 p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2" aria-label="LinkedIn">
                                    <Linkedin className="w-5 h-5" />
                                    <span className="text-sm font-medium">LinkedIn</span>
                                </motion.a>
                                <motion.a href="https://www.instagram.com/shoukat6090/" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, scale: 1.1 }} className="flex-1 p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-pink-500/30 text-slate-400 hover:text-pink-400 transition-all flex items-center justify-center gap-2" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                    <span className="text-sm font-medium">Instagram</span>
                                </motion.a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <GlassCard className="p-8" hover={false}>
                                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <Mail className="w-8 h-8 text-cyan-400" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Email Client Opened!</h4>
                                        <p className="text-slate-400">Complete sending the email in your mail app.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="name" className="block text-sm text-slate-400 mb-2">Your Name *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="name"
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm text-slate-400 mb-2">Your Email *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="name@gmail.com"
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm text-slate-400 mb-2">Subject</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Project Collaboration"
                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm text-slate-400 mb-2">Message *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="Tell me about your project or opportunity..."
                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                                            />
                                        </div>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 rounded-xl text-slate-950 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                                    Opening Email...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                )}
                            </GlassCard>
                        </div>
                    </div>

                    <div className="text-center text-slate-600 text-sm pt-12 mt-12 border-t border-slate-800/50">
                        <p>© 2025 Shoukat Khan. Built with React, Three.js & Framer Motion.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AI CHATBOT COMPONENT (Groq-Powered)
// ═══════════════════════════════════════════════════════════════════════════════

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! 👋 I'm Shoukat's AI assistant. Ask me anything about his skills, projects (including the Z3 Tool), or experience!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please try again or contact Shoukat directly at shoukatkhang71@gmail.com"
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                >
                    <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Shoukat's AI Assistant</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400" /> Online
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-cyan-500 text-white rounded-br-md'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-md'
                                    }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 px-4 py-3 rounded-2xl">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-700/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about Shoukat..."
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50"
                            />
                            <motion.button
                                onClick={sendMessage}
                                disabled={!input.trim() || isTyping}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PORTFOLIO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const Portfolio3D = () => {
    const mouse = useRef({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener('mousemove', handleMouseMove);

        // Simulate loading time for 3D assets
        const timer = setTimeout(() => setIsLoading(false), 1500);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #020617; overflow-x: hidden; }
        ::selection { background: rgba(34, 211, 238, 0.3); color: white; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

            {/* Loading Screen */}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center"
                >
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                    <p className="mt-4 text-cyan-400 text-sm tracking-wider" style={{ animation: 'pulse 2s ease-in-out infinite' }}>Loading...</p>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="relative min-h-screen text-white antialiased"
            >
                <Background3D mouse={mouse} />
                <Navigation />
                <main>
                    <HeroSection />
                    <AboutSection />
                    <TimelineSection />
                    <CertificationsSection />
                    <ProjectsSection />
                    <SkillsSection />
                    <ContactSection />
                </main>
                <AIChatbot />
            </motion.div>
        </>
    );
};

export default Portfolio3D;
