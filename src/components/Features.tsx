import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Target, Zap, BarChart, Users, Clock, Shield, Brain, FileText, Globe, Repeat, Workflow } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Client Acquisition',
    description: 'Autonomous agents that identify, engage, and qualify your ideal prospects, creating predictable revenue growth.',
  },
  {
    icon: Workflow,
    title: 'Process Automation',
    description: 'Streamline operations with intelligent workflows for data transformation, document processing, and task automation.',
  },
  {
    icon: FileText,
    title: 'Content Creation',
    description: 'Generate high-quality content at scale, from marketing materials to technical documentation and translations.',
  },
  {
    icon: Globe,
    title: 'Language Services',
    description: 'Automated translation and localization services that maintain context and brand voice across languages.',
  },
  {
    icon: Shield,
    title: 'Data Processing',
    description: 'Transform, analyze, and extract insights from complex data sets with intelligent automation.',
  },
  {
    icon: MessageSquare,
    title: 'Transcription',
    description: 'Convert audio and video content into accurate, formatted text with speaker detection and timestamps.',
  },
  {
    icon: Repeat,
    title: 'Workflow Integration',
    description: 'Seamlessly connect your existing tools and processes with our agentic systems for end-to-end automation.',
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Comprehensive insights and reporting across all automated processes and client interactions.',
  }
];

const process = [
  {
    step: 1,
    title: 'Discovery',
    description: 'We analyze your current processes and identify opportunities for automation and optimization.',
    icon: Target,
  },
  {
    step: 2,
    title: 'Strategy',
    description: 'Our experts design a custom solution combining client acquisition and process automation.',
    icon: Brain,
  },
  {
    step: 3,
    title: 'Implementation',
    description: 'We deploy and configure your agentic systems, integrating them with your existing workflow.',
    icon: Workflow,
  },
  {
    step: 4,
    title: 'Optimization',
    description: 'Continuous monitoring and refinement ensure optimal performance and ROI.',
    icon: BarChart,
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-600 text-transparent bg-clip-text">
            Comprehensive Business Solutions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From client acquisition to business process automation, our agentic systems transform every aspect of your operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-blue-900/20 to-transparent p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all"
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-600 text-transparent bg-clip-text">
            Our Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A proven methodology for implementing intelligent automation in your business.
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced connection lines with animated gradient */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 hidden lg:block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600 to-blue-600/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Animated connecting dots */}
          <div className="hidden lg:block">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 w-3 h-3 rounded-full bg-blue-500"
                style={{
                  left: `${(i + 1) * 25}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-b from-blue-900/20 to-transparent p-8 rounded-2xl border border-blue-500/20"
              >
                {/* Step number with gradient ring */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                        <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text">
                          {step.step}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Icon with pulse effect */}
                <div className="mt-8 mb-4 relative">
                  <step.icon className="w-8 h-8 text-blue-400 mx-auto relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500/20 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white text-center">{step.title}</h3>
                <p className="text-gray-400 text-sm text-center">{step.description}</p>

                {/* Enhanced glow effect */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl -z-10"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;