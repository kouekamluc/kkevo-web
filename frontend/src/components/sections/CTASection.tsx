'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Star, Users, Zap, Award, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard } from '@/components/ui';

const CTASection = () => {
  const router = useRouter();
  
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      action: 'Call Now',
      href: 'tel:+15551234567',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'hello@kkevo.com',
      action: 'Send Email',
      href: 'mailto:hello@kkevo.com',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Available 24/7',
      action: 'Start Chat',
      href: '#',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Calendar,
      title: 'Schedule Call',
      description: 'Free consultation',
      action: 'Book Now',
      href: '/contact',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'Free initial consultation and project assessment',
    'Transparent pricing with no hidden fees',
    'Dedicated project manager and development team',
    'Regular progress updates and milestone reviews',
    'Post-launch support and maintenance',
    'Scalable solutions that grow with your business',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-violet-600/90 to-indigo-700/90"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Content */}
        <div className="text-center mb-16">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Let's discuss how our innovative software solutions can drive growth, 
              streamline operations, and create competitive advantages for your business.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => router.push('/contact')}
                className="group"
              >
                Get Free Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </AnimatedButton>
              
              <AnimatedButton
                variant="outline"
                size="lg"
                onClick={() => router.push('/services')}
                className="group"
              >
                Explore Our Services
              </AnimatedButton>
            </div>
          </FadeInSection>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StaggerList className="contents">
            {contactMethods.map((method, index) => (
              <FadeInSection key={method.title} delay={index * 0.1}>
                <AnimatedCard className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                    <p className="text-indigo-100 mb-4 text-sm">{method.description}</p>
                    <a
                      href={method.href}
                      className="inline-flex items-center text-sm font-medium text-white hover:text-indigo-200 transition-colors duration-200"
                    >
                      {method.action}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </AnimatedCard>
              </FadeInSection>
            ))}
          </StaggerList>
        </div>

        {/* Benefits Section */}
        <FadeInSection delay={0.4}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Choose KKEVO?
              </h3>
              <p className="text-indigo-100 max-w-2xl mx-auto">
                We're committed to delivering exceptional value and building long-term partnerships 
                with our clients through transparent communication and proven results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-indigo-100">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Trust Indicators */}
        <FadeInSection delay={0.6}>
          <div className="text-center mt-16">
            <p className="text-indigo-200 mb-6">
              Trusted by leading companies worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white text-lg font-semibold">TechCorp</div>
              <div className="text-white text-lg font-semibold">FinanceBank</div>
              <div className="text-white text-lg font-semibold">DataFlow</div>
              <div className="text-white text-lg font-semibold">InsightMetrics</div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default CTASection;
