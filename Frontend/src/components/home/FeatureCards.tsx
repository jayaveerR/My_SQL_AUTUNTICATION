import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, BadgeCheck, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Every transaction is encrypted and secured by industry-leading payment processors.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your products delivered quickly with our global network of shipping partners.'
  },
  {
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'We rigorously vet all our sellers to ensure you only get the highest quality products.'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any issues.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-24 bg-brand-darkest relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose EcommHub?</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            We provide a premium, seamless, and secure shopping experience designed to give you peace of mind.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 flex flex-col items-start border-[#076653]/20 hover:border-[#E3EF26]/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#076653]/20 rounded-2xl flex items-center justify-center text-[#E3EF26] mb-6 group-hover:scale-110 group-hover:bg-[#E3EF26]/20 transition-all duration-300">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
