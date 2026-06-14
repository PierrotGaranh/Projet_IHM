import { motion } from 'framer-motion';
import { Card } from '@/components/atoms/Card';
import { HorizontalScroll } from '@/components/molecules/HorizontalScroll';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
}

interface FeaturesSectionProps {
  isMobile: boolean;
  features: Feature[];
}

export function FeaturesSection({ isMobile, features }: FeaturesSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (isMobile) {
    return (
      <section className="py-2">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold">Fonctionnalités clés</h2>
          <p className="text-sm text-muted-foreground">Tout ce dont vous avez besoin pour une gestion optimale</p>
        </div>
        <HorizontalScroll gap={4}>
          {features.map((feature, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[280px]">
              <Card className="p-5 h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </div>
          ))}
        </HorizontalScroll>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Fonctionnalités clés</h2>
        <p className="text-muted-foreground">Tout ce dont vous avez besoin pour une gestion optimale</p>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}