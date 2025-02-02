import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-8 z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">The Agent Factory</span>
        </div>
      </motion.div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-8 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <MessageSquare className="w-10 h-10" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-600 text-transparent bg-clip-text"
          >
            Get More Done Without Hiring Anyone New
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Our intelligent agents work 24/7 to find you new clients and handle your tasks. Most businesses see results in just 2 weeks, with zero extra staff needed.
          </motion.p>
          
          <motion.a
            href="https://cal.com/theagentfactory/disco"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Free Discovery Call
          </motion.a>

          {/* Dashboard Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="max-w-5xl mx-auto bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Money Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 p-6 rounded-xl border border-blue-500/20"
                >
                  <h3 className="text-gray-400 mb-2">Money Saved</h3>
                  <div className="text-3xl font-bold text-white">$8,442</div>
                  <div className="text-green-400 text-sm mt-2">Per Month</div>
                </motion.div>

                {/* Time Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 p-6 rounded-xl border border-blue-500/20"
                >
                  <h3 className="text-gray-400 mb-2">Hours Saved</h3>
                  <div className="text-3xl font-bold text-white">120</div>
                  <div className="text-blue-400 text-sm mt-2">Every Week</div>
                </motion.div>

                {/* Tasks Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 p-6 rounded-xl border border-blue-500/20"
                >
                  <h3 className="text-gray-400 mb-2">Tasks Done</h3>
                  <div className="text-3xl font-bold text-white">1,000+</div>
                  <div className="text-green-400 text-sm mt-2">Each Month</div>
                </motion.div>
              </div>

              {/* Shine Effect */}
              <motion.div
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0, 0.1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 2, 1],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Hero