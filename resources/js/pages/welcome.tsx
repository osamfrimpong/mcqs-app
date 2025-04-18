import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Auth } from '@/types';

export default function Welcome() {

  const { auth } = usePage<{ auth: Auth }>().props;

  console.log(auth);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div 
          className="text-center w-full max-w-sm mx-auto md:max-w-xl md:bg-white/10 md:backdrop-blur-lg md:p-8 md:rounded-lg md:shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-5xl font-bold mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            Test Me
          </motion.h1>
          
          <motion.p 
            className="text-xl max-w-sm mx-auto mb-8 text-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Challenge your knowledge, expand your mind. Take on carefully crafted quizzes 
            that adapt to your skill level, compete with friends, and track your progress 
            on the go. Your pocket learning companion just got smarter.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {auth.user ?  <Link href={route('dashboard')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-medium px-8 py-6  shadow-lg">
                Goto Dashboard
              </Button>
            </Link> :  <Link href={route('login')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-medium px-8 py-6  shadow-lg">
                Get Started
              </Button>
            </Link>}
           
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 w-full max-w-md mx-auto md:max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg md:border md:border-white/20">
            <p className="text-center text-sm">
              Join thousands of quiz enthusiasts already challenging themselves daily
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-white/20">
        <div className="container mx-auto text-center text-sm text-white/70">
          &copy; {new Date().getFullYear()} Test Me Quiz App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}