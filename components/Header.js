import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';

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
                // Section is in view if top is within viewport upper half
                if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        }

        // If no section in view and at top, set Home as active
        if (!currentSection && window.scrollY < 100) {
            currentSection = '';
        }

        setActiveSection(currentSection);
    }, [navigation]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const isActive = (href) => {
        if (href === '/') return activeSection === '';
        if (href.startsWith('#')) return activeSection === href.slice(1);
        return false;
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 py-3'
                : 'bg-transparent py-6'
                }`}
        >
            <nav className="section-container">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex flex-col items-start group transition-all duration-300 hover:scale-105"
                    >
                        <span className="font-logo text-3xl md:text-4xl text-brand-blue-500 italic tracking-tight leading-none">
                            Upsera<span className="text-brand-blue-500 not-italic">.</span>
                        </span>
                        <span className="text-[0.5rem] uppercase tracking-wide text-gray-600 font-medium -mt-1 ml-12">We build. You rise.</span>
                    </Link>

                    {/* Navigation - Centered with active indicators */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`nav-link text-sm font-medium transition-all duration-300 ${isActive(item.href)
                                    ? 'active text-brand-blue-500'
                                    : 'text-gray-600 hover:text-brand-blue-500'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA with glow effect */}
                    <div className="hidden lg:block">
                        <Link href="#contact" className="btn-pill">
                            <span>Call Now</span>
                        </Link>
                    </div>

                    {/* Mobile menu */}
                    <button className="lg:hidden p-2 text-brand-dark hover:bg-gray-50 rounded-lg transition-colors" aria-label="Menu">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
}
