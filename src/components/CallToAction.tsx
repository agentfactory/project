import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-600 text-transparent bg-clip-text">
            Triple Your Team's Output Without Adding Staff
          </h2>
          
          <p className="text-xl text-gray-300 mb-12">
            Let's talk about how our intelligent agents can automate your tasks and find new clients - all in the next 14 days. No tech skills needed!
          </p>
          
          <motion.a
            href="https://cal.com/theagentfactory/disco"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Free Discovery Call
            <ArrowRight className="w-5 h-5" />
          </motion.a>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <h3 className="text-3xl font-bold text-white mb-2">3x</h3>
              <p className="text-gray-400">More Work Done</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-bold text-white mb-2">14</h3>
              <p className="text-gray-400">Days to Results</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-bold text-white mb-2">$0</h3>
              <p className="text-gray-400">Extra Staff Needed</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.5, 1],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default CallToAction