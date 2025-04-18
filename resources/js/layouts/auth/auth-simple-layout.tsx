import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white md:p-10">
            <motion.div
                className="w-full max-w-sm md:rounded-lg md:bg-white/10 md:p-8 md:shadow-xl md:backdrop-blur-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="flex flex-col gap-8">
                    <motion.div
                        className="flex flex-col items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <AppLogoIcon />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="space-y-2 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <motion.h1
                                className="text-2xl font-bold"
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                            >
                                {title}
                            </motion.h1>
                            <p className="text-center text-sm text-gray-100">{description}</p>
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
                        {children}
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                className="text-center text-sm text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                &copy; {new Date().getFullYear()} Built with ❤️ by {" "}
                <a href="https://github.com/osamfrimpong" className="hover:underline">
                    Osam-Frimpong
                </a>
            </motion.div>
        </div>
    );
}
