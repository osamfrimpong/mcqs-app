import { Button } from '@/components/ui/button';
import { Auth } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome() {
    const { auth } = usePage<{ auth: Auth }>().props;

    console.log(auth);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
            {/* Main content */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <motion.div
                    className="mx-auto w-full max-w-sm text-center md:max-w-xl md:rounded-lg md:bg-white/10 md:p-8 md:shadow-xl md:backdrop-blur-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.h1
                        className="mb-6 text-5xl font-bold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    >
                        Test Me
                    </motion.h1>

                    <motion.p
                        className="mx-auto mb-8 max-w-sm text-xl text-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Challenge your knowledge, expand your mind. Take on carefully crafted quizzes that adapt to your skill level, compete with
                        friends, and track your progress on the go. Your pocket learning companion just got smarter.
                    </motion.p>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button size="lg" className="bg-white px-8 py-6 text-lg font-medium text-purple-600 shadow-lg hover:bg-gray-100">
                                    Goto Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('login')}>
                                <Button size="lg" className="bg-white px-8 py-6 text-lg font-medium text-purple-600 shadow-lg hover:bg-gray-100">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mx-auto mt-12 w-full max-w-md md:max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <div className="rounded-lg bg-white/10 p-4 shadow-lg backdrop-blur-lg md:border md:border-white/20">
                        <p className="text-center text-sm">Join thousands of quiz enthusiasts already challenging themselves daily</p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/20 py-4">
                <div className="container mx-auto text-center text-sm text-white/70">
                    &copy; {new Date().getFullYear()} Built with ❤️ by {" "}
                    <a href="https://github.com/osamfrimpong" className="hover:underline">
                        Osam-Frimpong
                    </a>
                </div>
            </footer>
        </div>
    );
}
