import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from './MagneticButton';

export default function Header({ navigation }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Handle scroll effects
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);

        // Active section detection
        const sections = navigation
            .filter(item => item.href.startsWith('#'))
            .map(item => item.href.slice(1));

        let currentSection = '';

        for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        }

        if (!currentSection && window.scrollY < 100) {
            currentSection = '';
        }

        setActiveSection(currentSection);
    }, [navigation]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const isActive = (href) => {
        if (href === '/') return activeSection === '';
        if (href.startsWith('#')) return activeSection === href.slice(1);
        return false;
    };

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 py-3'
                : 'bg-transparent py-6'
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
            <nav className="section-container">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            href="/"
                            className="flex flex-col items-start group transition-all duration-300 hover:scale-105"
                        >
                            <span className="font-logo text-3xl md:text-4xl text-brand-blue-500 italic tracking-tight leading-none">
                                Upsera<span className="text-brand-blue-500 not-italic">.</span>
                            </span>
                            <span className="text-[0.5rem] uppercase tracking-wide text-gray-600 font-medium -mt-1 ml-12">We build. You rise.</span>
                        </Link>
                    </motion.div>

                    {/* Navigation - Staggered entrance with animated active indicator */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navigation.map((item, index) => (
                            <motion.div
                                key={item.name}
                                className="relative"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.07 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`nav-link text-sm font-medium transition-all duration-300 ${isActive(item.href)
                                        ? 'active text-brand-blue-500'
                                        : 'text-gray-600 hover:text-brand-blue-500'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                                {/* Animated active indicator using layoutId */}
                                {isActive(item.href) && (
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-blue-500 rounded-full"
                                        layoutId="activeNavIndicator"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 380,
                                            damping: 30
                                        }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA with magnetic + glow effect */}
                    <motion.div
                        className="hidden lg:block"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <MagneticButton as="div" strength={0.35}>
                            <Link href="#contact" className="btn-pill">
                                <span>Call Now</span>
                            </Link>
                        </MagneticButton>
                    </motion.div>

                    {/* Mobile menu */}
                    <button className="lg:hidden p-2 text-brand-dark hover:bg-gray-50 rounded-lg transition-colors" aria-label="Menu">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>
        </motion.header>
    );
}
