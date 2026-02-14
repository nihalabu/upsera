import Link from 'next/link';


export default function Footer({ footerData }) {
    return (
        <footer className="py-16 bg-white border-t border-gray-100">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-6 flex flex-col items-start group hover:opacity-80 transition-opacity">
                            <span className="font-logo text-3xl md:text-4xl text-brand-blue-500 italic tracking-tight leading-none">
                                Upsera<span className="text-brand-blue-500 not-italic">.</span>
                            </span>
                            <span className="text-[0.5rem] uppercase tracking-wide text-gray-600 font-medium -mt-1 ml-12">We build. You rise.</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                            {footerData.description}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-5">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerData.quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-brand-blue-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-brand-dark text-sm mb-5">Contact</h4>
                        <div className="space-y-3">
                            <a
                                href={`mailto:${footerData.contact.email}`}
                                className="block text-sm text-gray-500 hover:text-brand-blue-500 transition-colors"
                            >
                                {footerData.contact.email}
                            </a>
                            {footerData.contact.phone && (
                                <a
                                    href={`tel:${footerData.contact.phone}`}
                                    className="block text-sm text-gray-500 hover:text-brand-blue-500 transition-colors"
                                >
                                    +91 {footerData.contact.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Upsera. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <Link href="/privacy" className="hover:text-brand-blue-500 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-brand-blue-500 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
