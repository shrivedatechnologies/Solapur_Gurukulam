import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Animation variants for social icons
    const iconVariants = {
        hover: { scale: 1.2, rotate: 5, transition: { type: 'spring', stiffness: 300 } }
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-auto border-t border-amber-500/20">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <motion.span
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="text-amber-400 mr-2 inline-block"
                            >
                                ॐ
                            </motion.span>
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Solapur Gurukulam
                            </span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Discover the divine power of ancient mantras, shlokas, and shotrams for a peaceful and prosperous life.
                        </p>
                        <div className="flex space-x-4 mt-5">
                            {[
                                { Icon: FaFacebook, href: '#' },
                                { Icon: FaTwitter, href: '#' },
                                { Icon: FaYoutube, href: '#' },
                                { Icon: FaInstagram, href: '#' },
                            ].map(({ Icon, href }, idx) => (
                                <motion.a
                                    key={idx}
                                    href={href}
                                    variants={iconVariants}
                                    whileHover="hover"
                                    className="text-gray-400 hover:text-amber-400 transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links – all normal Links (no login condition) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support – all normal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-amber-400">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                                    Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info – static */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <FiMapPin className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-400">Varanasi, Uttar Pradesh, India</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiPhone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                                <span className="text-gray-400">+91 1234567890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiMail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                                <span className="text-gray-400">contact@solapurgurukulam.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-amber-500/20 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {currentYear} Solapur Gurukulam. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;