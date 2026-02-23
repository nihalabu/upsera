import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const linkHover = {
    x: 4,
    color: '#3b82f6',
    transition: { duration: 0.2 }
};

export default function Footer({ footerData }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <footer className="py-16 bg-white border-t border-gray-100">
            <div className="section-container">
                <motion.div
                    ref={ref}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Brand */}
                    <motion.div variants={columnVariants}>
                        <Link href="/" className="inline-block mb-6 flex flex-col items-start group hover:opacity-80 transition-opacity">
                            <span className="font-logo text-3xl md:text-4xl text-brand-blue-500 italic tracking-tight leading-none">
                                Upsera<span className="text-brand-blue-500 not-italic">.</span>
                            </span>
                            <span className="text-[0.5rem] uppercase tracking-wide text-gray-600 font-medium -mt-1 ml-12">We build. You rise.</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                            {footerData.description}
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={columnVariants}>
                        <h4 className="font-bold text-brand-dark text-sm mb-5">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerData.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <motion.div whileHover={linkHover}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-500 transition-colors inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div variants={columnVariants}>
                        <h4 className="font-bold text-brand-dark text-sm mb-5">Contact</h4>
                        <div className="space-y-3">
                            <motion.a
                                href={`mailto:${footerData.contact.email}`}
                                className="block text-sm text-gray-500 transition-colors"
                                whileHover={linkHover}
                            >
                                {footerData.contact.email}
                            </motion.a>
                            {footerData.contact.phone && (
                                <motion.a
                                    href={`tel:${footerData.contact.phone}`}
                                    className="block text-sm text-gray-500 transition-colors"
                                    whileHover={linkHover}
                                >
                                    +91 {footerData.contact.phone}
                                </motion.a>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom */}
                <motion.div
                    className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Upsera. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <Link href="/privacy" className="hover:text-brand-blue-500 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-brand-blue-500 transition-colors">Terms</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
