import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Enhanced reveal animation wrapper with section highlight
function Reveal({ children, delay = 0, className = '', highlight = false }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`${className} ${highlight && isInView ? 'section-reveal in-view' : ''}`}
        >
            {children}
        </motion.div>
    );
}

// Staggered children animation
function StaggerContainer({ children, className = '', staggerDelay = 0.1 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const staggerItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

// Project data
const projects = [
    {
        id: 1,
        name: 'Route Care',
        category: 'Web Application',
        description: 'A comprehensive NRI property management platform connecting homeowners with trusted caretakers. Features role-based dashboards, service management, and remote property monitoring.',
        tags: ['Next.js', 'Firebase', 'Dashboard'],
        color: 'from-amber-500 to-amber-700',
        image: '/projects/routecare.png',
        url: 'https://routecare.netlify.app/'
    },
    {
        id: 2,
        name: 'Heavy Duty Hub',
        category: 'Equipment Rental',
        description: 'A platform connecting construction businesses with verified heavy equipment owners. Book JCBs, cranes, bulldozers, and excavators instantly for your projects.',
        tags: ['Next.js', 'Marketplace', 'Booking'],
        color: 'from-gray-700 to-gray-900',
        image: '/projects/heavyduty.png',
        url: 'https://heavydutyhub.vercel.app/'
    },
    {
        id: 3,
        name: 'Edusity',
        category: 'Education Platform',
        description: 'An educational institution website with cutting-edge curriculum showcase, campus information, testimonials, and program details for students.',
        tags: ['React', 'Education', 'Responsive'],
        color: 'from-indigo-600 to-purple-800',
        image: '/projects/edusity.png',
        url: 'https://myapp-2uie.vercel.app/'
    }
];

// Project Modal Component
function ProjectModal({ project, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="modal-container rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-brand-blue-500 font-semibold text-sm uppercase tracking-wider mb-1">
                                    {project.category}
                                </p>
                                <h3 className="text-2xl font-bold text-brand-dark">{project.name}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Project Preview */}
                        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                                    <div className="text-white/90 text-center">
                                        <svg className="w-12 h-12 mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-medium opacity-80">Project Preview</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-xs font-medium text-brand-blue-600 bg-brand-blue-50 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-pill flex-1 text-center"
                                >
                                    <span>View Live Site</span>
                                    <svg className="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                            <Link
                                href="#contact"
                                className="btn-pill-outline flex-1 text-center"
                                onClick={onClose}
                            >
                                <span>Start a Similar Project</span>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Project Card Component
function ProjectCard({ project, onClick }) {
    return (
        <motion.div
            variants={staggerItem}
            className="project-card group"
            onClick={() => onClick(project)}
        >
            {/* Image area with actual screenshot */}
            <div className="project-card-image h-48 relative overflow-hidden">
                {project.image ? (
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`}>
                        {/* Grid pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }}
                        />
                    </div>
                )}

                {/* Overlay with content */}
                <div className="project-card-overlay">
                    <div className="project-card-content text-white">
                        <p className="text-sm opacity-80 mb-1">{project.category}</p>
                        <h4 className="font-bold text-lg">{project.name}</h4>
                    </div>
                </div>
            </div>

            {/* Card content */}
            <div className="p-5">
                <h4 className="font-bold text-brand-dark mb-2 group-hover:text-brand-blue-500 transition-colors">
                    {project.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>

                {/* View details indicator */}
                <div className="mt-4 flex items-center text-brand-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}

// Contact Section Component with EmailJS
function ContactSection() {
    const formRef = useRef(null);
    const [formState, setFormState] = useState({
        name: '',
        company: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            console.log('EmailJS Config:', { serviceId, templateId, publicKey: publicKey ? 'exists' : 'missing' });

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('Email service is not configured. Check your .env.local file.');
            }

            const result = await emailjs.sendForm(
                serviceId,
                templateId,
                formRef.current,
                publicKey
            );

            console.log('EmailJS result:', result);

            if (result.status === 200) {
                setIsSubmitted(true);
                setFormState({ name: '', company: '', email: '', message: '' });
            } else {
                throw new Error('Failed to send message. Status: ' + result.status);
            }
        } catch (err) {
            console.error('EmailJS error:', err);
            // Show actual error message from EmailJS
            const errorMessage = err.text || err.message || 'Failed to send message. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section id="contact" className="py-32 bg-white border-t border-gray-100">
                <div className="section-container">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="w-20 h-20 bg-brand-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Message Sent!</h2>
                        <p className="text-gray-500 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="btn-pill"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-32 bg-white border-t border-gray-100">
            <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Left: Contact info */}
                    <Reveal highlight>
                        <div>
                            <p className="text-brand-blue-500 font-bold text-sm tracking-widest uppercase mb-4">Get Started</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">
                                Let's Build Something
                            </h2>
                            <div className="space-y-3 text-gray-500 mb-10">
                                <p>Remote-first. Available for projects worldwide.</p>
                                <a href="mailto:upseramedia@gmail.com" className="block hover:text-brand-blue-500 transition-colors">upseramedia@gmail.com</a>
                                <a href="tel:+918714731305" className="block hover:text-brand-blue-500 transition-colors">+91 8714731305</a>
                                <p>Response within 24 hours</p>
                            </div>
                            {/* Social icons */}
                            <div className="flex gap-5">
                                {['in', 'f', 'twitter'].map((icon, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 flex items-center justify-center text-brand-dark hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-full transition-all duration-300 cursor-pointer"
                                    >
                                        {icon === 'in' && <span className="font-bold text-sm">in</span>}
                                        {icon === 'f' && <span className="font-bold text-lg">f</span>}
                                        {icon === 'twitter' && (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    {/* Right: Contact form */}
                    <Reveal delay={0.2}>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 glass-card p-8 rounded-2xl">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Your Name *</label>
                                    <input
                                        type="text"
                                        name="from_name"
                                        required
                                        className="input-underline"
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Company / Brand</label>
                                    <input
                                        type="text"
                                        name="company"
                                        className="input-underline"
                                        value={formState.company}
                                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="reply_to"
                                    required
                                    className="input-underline"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Tell us about your project... *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={3}
                                    className="input-underline resize-none"
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div
                                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm cursor-pointer hover:bg-red-100 transition-colors"
                                    onClick={() => setError('')}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-pill mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

export default function Home({ navigation, footerData }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    // Cursor proximity effect for hero
    const handleMouseMove = useCallback((e) => {
        if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    }, []);

    useEffect(() => {
        const hero = heroRef.current;
        if (hero) {
            hero.addEventListener('mousemove', handleMouseMove);
            return () => hero.removeEventListener('mousemove', handleMouseMove);
        }
    }, [handleMouseMove]);

    return (
        <div className="bg-white overflow-x-hidden">
            <Head>
                <title>UPSERA - Your Digital Growth Partner</title>
                <meta name="description" content="Founder-led digital solutions. We build high-performance websites today, and scale with your business tomorrow." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header navigation={navigation} />

            <main>
                {/* ==================== HERO SECTION ==================== */}
                <section
                    ref={heroRef}
                    className="relative min-h-screen pt-28 overflow-hidden hero-gradient"
                >
                    {/* Cursor proximity glow effect */}
                    <div
                        className="hero-cursor-glow"
                        style={{
                            left: mousePosition.x,
                            top: mousePosition.y,
                            opacity: mousePosition.x > 0 ? 1 : 0
                        }}
                    />

                    {/* Wave Background - Full-scale, part of the environment */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Subtle gradient base */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse 80% 60% at 70% 100%, rgba(199, 224, 255, 0.4) 0%, transparent 60%)'
                            }}
                        />

                        {/* Floating decorative elements */}
                        <div className="absolute top-1/4 left-[15%] w-3 h-3 rounded-full bg-brand-blue-300 animate-float opacity-60" style={{ animationDelay: '0s' }} />
                        <div className="absolute top-1/3 left-[10%] w-2 h-2 rounded-full bg-brand-blue-400 animate-float opacity-40" style={{ animationDelay: '2s' }} />
                        <div className="absolute top-1/2 left-[20%] w-4 h-4 rounded-full bg-brand-blue-200 animate-float opacity-50" style={{ animationDelay: '4s' }} />

                        {/* Main wave SVG - Large scale, blends into background */}
                        <svg
                            className="absolute right-0 bottom-0 w-[70%] h-[80%] animate-drift"
                            viewBox="0 0 800 600"
                            preserveAspectRatio="xMaxYMax slice"
                            style={{ opacity: 0.95 }}
                        >
                            <defs>
                                {/* Blue gradients replacing purple */}
                                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                                </linearGradient>
                                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
                                </linearGradient>
                                <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#c7e0ff" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
                                </linearGradient>
                                {/* Grid dots pattern */}
                                <pattern id="heroGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                                    <circle cx="15" cy="15" r="0.8" fill="#c7e0ff" opacity="0.5" />
                                </pattern>
                            </defs>

                            {/* Grid background */}
                            <rect x="0" y="0" width="800" height="400" fill="url(#heroGrid)" />

                            {/* Back wave - lightest */}
                            <path
                                d="M 100 600 Q 200 520 350 540 T 600 480 T 800 420 L 800 600 Z"
                                fill="url(#waveGrad3)"
                            />

                            {/* Middle wave */}
                            <path
                                d="M 200 600 Q 300 500 450 530 T 700 450 T 800 380 L 800 600 Z"
                                fill="url(#waveGrad2)"
                            />

                            {/* Front wave - darkest */}
                            <path
                                d="M 300 600 Q 400 480 550 520 T 750 420 T 800 340 L 800 600 Z"
                                fill="url(#waveGrad1)"
                            />

                            {/* Highlight line */}
                            <path
                                d="M 300 600 Q 400 480 550 520 T 750 420 T 800 340"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                opacity="0.4"
                            />

                            {/* Accent dot with pulse */}
                            <circle cx="600" cy="420" r="8" fill="white" opacity="0.9" />
                            <circle cx="600" cy="420" r="16" fill="none" stroke="white" strokeWidth="2" opacity="0.3" className="animate-pulse-ring" />
                        </svg>
                    </div>

                    {/* Hero Content */}
                    <div className="section-container relative z-10 flex items-center min-h-[calc(100vh-112px)]">
                        <motion.div
                            className="max-w-xl"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.h1
                                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-[1.1] tracking-tight mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                Build Software.<br />Scale Smarter.
                            </motion.h1>
                            <motion.div
                                className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <p className="mb-4">
                                    UPSERA builds software solutions for businesses—focused on solving real operational problems.
                                    We start with high-performance websites and grow into SaaS products, internal systems, and automation that help businesses run better, faster, and smarter.
                                </p>
                                <p className="font-medium text-brand-dark">
                                    Founder-led. Problem-driven. Built for long-term growth.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link href="#contact" className="btn-hero">
                                    Let's Talk
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ==================== SERVICES SECTION ==================== */}
                <section id="services" className="py-32 bg-white">

                    <div className="section-container">
                        <Reveal className="text-center mb-20" highlight>
                            <p className="text-brand-blue-500 font-bold text-sm tracking-widest uppercase mb-4">What We Do</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
                                Websites Today.<br />Full Digital Stack Tomorrow.
                            </h2>
                        </Reveal>

                        {/* Service Icons - with enhanced hover effects */}
                        <StaggerContainer className="grid md:grid-cols-3 gap-16 text-center">
                            {/* Business Plans - Circle icon */}
                            <motion.div variants={staggerItem} className="flex flex-col items-center group">
                                <div className="relative w-28 h-28 mb-8 transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute top-4 left-4 w-14 h-14 rounded-full bg-brand-blue-500 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
                                    <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-brand-blue-100 transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-brand-dark" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-blue-500 transition-colors">High-Performance Websites</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                                    Fast, responsive, SEO-optimized websites built with modern frameworks. Designed to load quickly and convert visitors into customers.
                                </p>
                            </motion.div>

                            {/* Accounting Services - Checkmark icon */}
                            <motion.div variants={staggerItem} className="flex flex-col items-center group">
                                <div className="relative w-28 h-28 mb-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-dark" />
                                    <svg className="w-16 h-16 text-brand-blue-500 transition-all duration-500 group-hover:text-brand-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="absolute bottom-2 left-8 w-10 h-10 bg-brand-blue-100 -z-10 transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-blue-500 transition-colors">Software Systems</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                                    Custom dashboards, internal tools, and web applications. Coming soon as we expand our capabilities to serve growing businesses.
                                </p>
                            </motion.div>

                            {/* Finance Optimization - Square icon */}
                            <motion.div variants={staggerItem} className="flex flex-col items-center group">
                                <div className="relative w-28 h-28 mb-8 transition-transform duration-500 group-hover:scale-110">
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-brand-blue-500 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
                                    <div className="absolute bottom-2 left-4 w-14 h-14 bg-brand-blue-100 transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-dark" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-brand-dark" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-blue-500 transition-colors">Automation & Infrastructure</h3>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                                    Workflow automation, content systems, and digital infrastructure. On our roadmap to help you scale efficiently.
                                </p>
                            </motion.div>
                        </StaggerContainer>
                    </div>
                </section>

                {/* ==================== ABOUT SECTION ==================== */}
                <section id="about" className="py-32 bg-white overflow-hidden">
                    <div className="section-container">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left: Text content */}
                            <Reveal highlight>
                                <div className="max-w-lg">
                                    <p className="text-brand-blue-500 font-bold text-sm tracking-widest uppercase mb-4">Why UPSERA</p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-8">
                                        Founder-Led.<br />Quality-Focused.
                                    </h2>
                                    <div className="space-y-6 text-gray-500 leading-relaxed">
                                        <p>
                                            UPSERA isn't a faceless agency. Every project is handled directly by the founder—ensuring clear communication, consistent quality, and genuine investment in your success. No layers. No handoffs. Just focused work.
                                        </p>
                                        <p>
                                            We're building this studio to grow with our clients. What starts as a website today becomes a full digital ecosystem tomorrow. Transparent pricing, honest timelines, and work we're proud to put our name on.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Right: Graph/Chart visual */}
                            <Reveal delay={0.2}>
                                <div className="relative bg-gradient-to-br from-brand-blue-50 to-brand-blue-100/50 rounded-2xl p-8 min-h-[400px] glass-card">
                                    {/* Y-axis labels */}
                                    <div className="absolute left-6 top-8 bottom-20 flex flex-col justify-between text-xs text-gray-400 font-medium">
                                        <span>6M</span>
                                        <span>5M</span>
                                        <span>4M</span>
                                        <span>3M</span>
                                        <span>2M</span>
                                    </div>

                                    {/* Grid lines */}
                                    <div className="absolute left-12 right-8 top-8 bottom-20 flex flex-col justify-between">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-px bg-gray-200/50" />
                                        ))}
                                    </div>

                                    {/* Wave/curve graph */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#c7e0ff" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M 80 280 Q 150 270 200 250 T 300 150 T 380 80 L 400 300 L 0 300 Z"
                                            fill="url(#aboutGrad)"
                                        />
                                        <path
                                            d="M 80 280 Q 150 270 200 250 T 300 150 T 380 80"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            opacity="0.5"
                                        />
                                        {/* Accent dot */}
                                        <circle cx="360" cy="100" r="8" fill="white" />
                                        <circle cx="360" cy="100" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.4" className="animate-pulse-ring" />
                                    </svg>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ==================== SELECTED PROJECTS SECTION ==================== */}
                <section id="projects" className="py-32 bg-gradient-to-b from-white to-brand-blue-50/30">
                    <div className="section-container">
                        <Reveal className="text-center mb-16" highlight>
                            <p className="text-brand-blue-500 font-bold text-sm tracking-widest uppercase mb-4">Our Work</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
                                Selected Projects
                            </h2>
                            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                                A showcase of our recent work. Click on any project to learn more about our approach and solutions.
                            </p>
                        </Reveal>

                        <StaggerContainer className="grid md:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={setSelectedProject}
                                />
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* ==================== TESTIMONIALS SECTION ==================== */}
                <section id="testimonials" className="py-32 bg-brand-blue-500 text-white relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-white/10 animate-float" style={{ animationDelay: '0s' }} />
                        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-white/5 animate-float" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="section-container max-w-4xl text-center relative z-10">
                        <Reveal>
                            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-10 opacity-90">Our Approach</p>
                            <h2 className="text-3xl md:text-4xl font-bold leading-relaxed italic mb-12">
                                "We don't chase trends or cut corners.<br />We build things that last."
                            </h2>
                            <div className="mb-10">
                                <p className="font-bold text-lg">3 Projects Delivered</p>
                                <p className="text-sm opacity-80">And counting, one client at a time</p>
                            </div>
                            {/* Dots indicator */}
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                                <div className="w-2 h-2 rounded-full bg-white" />
                                <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ==================== CLIENTS SECTION ==================== */}
                <section id="clients" className="py-24 bg-white">
                    <div className="section-container text-center">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-10">Recent Projects</p>
                        <div className="flex flex-wrap justify-center items-center gap-12">
                            {projects.map((project, i) => (
                                <motion.span
                                    key={i}
                                    className="text-lg font-bold text-brand-dark tracking-wide cursor-pointer hover:text-brand-blue-500 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    {project.name}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== CONTACT SECTION ==================== */}
                <ContactSection />
            </main>

            <Footer footerData={footerData} />

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />

            {/* Chat Button - Opens WhatsApp */}
            <motion.a
                href="https://wa.me/919876543210?text=Hi%20UPSERA!%20I'm%20interested%20in%20discussing%20a%20project.%20Can%20we%20chat%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                aria-label="Chat on WhatsApp"
                whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(26, 26, 46, 0.3)' }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </motion.a>
        </div>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            navigation: [
                { name: 'Home', href: '/' },
                { name: 'What We Do', href: '#services' },
                { name: 'Why UPSERA', href: '#about' },
                { name: 'Projects', href: '#projects' },
                { name: 'Our Approach', href: '#testimonials' },
                { name: 'Contact', href: '#contact' },
            ],
            footerData: {
                description: 'Founder-led digital solutions. Websites, systems, and digital infrastructure—built to grow with your business.',
                contact: { email: 'upseramedia@gmail.com', phone: '8714731305' },
                quickLinks: [
                    { name: 'What We Do', href: '#services' },
                    { name: 'Why UPSERA', href: '#about' },
                    { name: 'Contact', href: '#contact' },
                ],
            },
        },
    };
}
