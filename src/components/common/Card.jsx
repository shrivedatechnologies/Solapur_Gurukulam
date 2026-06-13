import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${hover ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default Card;