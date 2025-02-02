import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Target, Zap, ArrowRight, BarChart } from 'lucide-react';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
}

export default App;