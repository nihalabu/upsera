import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Magnetic Button Component with spring-physics cursor tracking + scale feedback
export default function MagneticButton({ children, className = '', as: Tag = 'button', strength = 0.3, ...props }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const springConfig = { stiffness: 250, damping: 18, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`inline-block ${className}`}
        >
            <Tag {...props}>{children}</Tag>
        </motion.div>
    );
}
