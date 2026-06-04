import React from 'react';
import { motion } from 'motion/react';
import { Music, Mic2, Disc, Radio, Guitar, Piano, Drum, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Vocalists', icon: Mic2, count: '1.2k+', color: 'bg-brand-purple' },
  { name: 'Producers', icon: Disc, count: '800+', color: 'bg-brand-purple/80' },
  { name: 'Instrumentalists', icon: Guitar, count: '2.5k+', color: 'bg-brand-purple/60' },
  { name: 'DJs', icon: Radio, count: '400+', color: 'bg-brand-purple/40' },
  { name: 'Songwriters', icon: Music, count: '600+', color: 'bg-brand-purple/90' },
  { name: 'Mixing/Mastering', icon: Headphones, count: '300+', color: 'bg-brand-purple/70' },
  { name: 'Pianists', icon: Piano, count: '450+', color: 'bg-brand-purple/50' },
  { name: 'Drummers', icon: Drum, count: '550+', color: 'bg-brand-purple/30' },
];

const Categories: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-brand-dark transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-brand-black dark:text-white tracking-tighter mb-4">
              Explore by <span className="text-brand-purple">Category</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Find the specific talent you need for your next musical masterpiece.
            </p>
          </div>
          <Link 
            to="/browse" 
            className="text-brand-purple font-black hover:underline flex items-center gap-2 group"
          >
            Browse all categories
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              →
            </motion.span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={`/browse?category=${cat.name}`}
                className="group block p-8 bg-brand-light dark:bg-brand-dark-card rounded-[2.5rem] border border-transparent hover:border-brand-purple/20 hover:shadow-2xl hover:shadow-brand-purple/5 transition-all duration-500"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-brand-black dark:text-white mb-2 group-hover:text-brand-purple transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm font-bold text-gray-400">
                  {cat.count} Professionals
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
