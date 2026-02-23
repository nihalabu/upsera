import '@/styles/globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

const pageTransition = {
    initial: { opacity: 0, scale: 0.96, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.04, y: -20 },
};

export default function App({ Component, pageProps }) {
    const router = useRouter();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={router.asPath}
                {...pageTransition}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'center center' }}
            >
                <Component {...pageProps} />
            </motion.div>
        </AnimatePresence>
    );
}
