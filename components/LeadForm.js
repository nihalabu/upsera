import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function LeadForm({ formData }) {
    const formRef = useRef();
    const [formState, setFormState] = useState({
        name: '',
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
            // EmailJS configuration from environment variables
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('Email service is not configured. Please contact us directly.');
            }

            // Send email using EmailJS
            const result = await emailjs.sendForm(
                serviceId,
                templateId,
                formRef.current,
                publicKey
            );

            if (result.status === 200) {
                setIsSubmitted(true);
                setFormState({ name: '', email: '', message: '' });
            } else {
                throw new Error('Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('EmailJS error:', err);
            setError(err.message || 'Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-12 rounded-3xl text-center shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-brand-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{formData.successTitle}</h3>
                <p className="text-gray-500">{formData.successMessage}</p>
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-10 lg:p-12 rounded-3xl shadow-2xl shadow-blue-500/5 border border-gray-100">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">Name</label>
                    <input
                        type="text"
                        name="from_name"
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue-500 transition-all outline-none"
                        placeholder="Your full name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">Email</label>
                    <input
                        type="email"
                        name="reply_to"
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue-500 transition-all outline-none"
                        placeholder="you@company.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-brand-dark mb-2 ml-1">Message</label>
                    <textarea
                        name="message"
                        required
                        rows={4}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue-500 transition-all outline-none resize-none"
                        placeholder="How can we help?"
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
                    className="w-full btn-pill btn-pill-primary py-5 text-base mt-4"
                >
                    {isSubmitting ? "Sending..." : formData.buttonText}
                </button>

                <p className="text-center text-xs text-gray-400 mt-6">
                    {formData.disclaimer}
                </p>
            </div>
        </form>
    );
}
