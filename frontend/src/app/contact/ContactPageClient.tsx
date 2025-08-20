'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Globe,
  MessageCircle,
  Building,
  User,
  Calendar,
  Star,
  Heart,
  Zap,
  Shield,
  Award
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Send us a message anytime',
    contact: 'hello@kkevo.com',
    action: 'mailto:hello@kkevo.com',
    color: 'from-blue-500 to-indigo-600',
    delay: '24h'
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'Call us during business hours',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567',
    color: 'from-green-500 to-emerald-600',
    delay: 'Immediate'
  },
  {
    icon: MapPin,
    title: 'Office',
    description: 'Visit our headquarters',
    contact: '123 Tech Street, San Francisco, CA 94105',
    action: 'https://maps.google.com',
    color: 'from-purple-500 to-pink-600',
    delay: 'By Appointment'
  }
];

const subjects = [
  'general',
  'project',
  'partnership',
  'career',
  'support',
  'other'
];

const subjectLabels = {
  general: 'General Inquiry',
  project: 'Project Request',
  partnership: 'Partnership',
  career: 'Career Opportunity',
  support: 'Technical Support',
  other: 'Other'
};

const faqs = [
  {
    question: 'How quickly can you start a project?',
    answer: 'We can typically begin a project within 1-2 weeks of contract signing, depending on project complexity and our current capacity.',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    question: 'What is your typical project timeline?',
    answer: 'Project timelines vary based on scope and complexity. Small projects take 4-8 weeks, medium projects 8-16 weeks, and large projects 16+ weeks.',
    icon: Clock,
    color: 'from-green-500 to-emerald-600'
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Yes, we offer comprehensive support and maintenance packages to ensure your solution continues to perform optimally after launch.',
    icon: Shield,
    color: 'from-purple-500 to-pink-600'
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'We specialize in modern web technologies including React, Next.js, Python, Django, Node.js, and cloud platforms like AWS and Azure.',
    icon: Globe,
    color: 'from-orange-500 to-red-600'
  },
  {
    question: 'How do you handle project communication?',
    answer: 'We maintain transparent communication through regular updates, dedicated project managers, and collaboration tools like Slack and Zoom.',
    icon: MessageCircle,
    color: 'from-indigo-500 to-blue-600'
  },
  {
    question: 'What makes KKEVO different from other agencies?',
    answer: 'Our unique combination of technical expertise, business acumen, and commitment to delivering measurable results sets us apart.',
    icon: Star,
    color: 'from-yellow-500 to-orange-600'
  }
];

const stats = [
  { number: '500+', label: 'Happy Clients', icon: Heart, color: 'text-red-500' },
  { number: '1000+', label: 'Projects Completed', icon: CheckCircle, color: 'text-green-500' },
  { number: '24/7', label: 'Support Available', icon: Shield, color: 'text-blue-500' },
  { number: '99%', label: 'Client Satisfaction', icon: Award, color: 'text-yellow-500' },
];

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await contactApi.submit(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent successfully! We\'ll get back to you soon.');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Message Sent Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Send Another Message
              </button>
              
              <Link href="/">
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200"
                >
                  Back to Home
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <MessageCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Get in{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              
              <div className="flex justify-center mb-8">
                <KkevoLogo 
                  width={120} 
                  height={40} 
                  variant="colored"
                  className="drop-shadow-lg"
                />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                Ready to start your next project? Have a question about our services? 
                We'd love to hear from you. Let's discuss how we can help bring your vision to life.
              </p>

              {/* Contact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the method that works best for you. We're here to help!
            </p>
          </div>
          
          <StaggerList>
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  className="group cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedCard className="h-full text-center group-hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
                    <div className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {method.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {method.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                        {method.contact}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Response time: {method.delay}
                      </div>
                    </div>
                    
                    <a
                      href={method.action}
                      target={method.action.startsWith('http') ? '_blank' : '_self'}
                      rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {method.title === 'Email' ? 'Send Email' : method.title === 'Phone' ? 'Call Now' : 'Get Directions'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </StaggerList>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('company')}
                      type="text"
                      id="company"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  {...register('subject', { required: 'Subject is required' })}
                  id="subject"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subjectLabels[subject as keyof typeof subjectLabels]}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters long'
                    }
                  })}
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                  placeholder="Tell us about your project, question, or how we can help you..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                )}
              </div>
              
              <div className="text-center">
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </AnimatedButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find quick answers to common questions about working with us.
            </p>
          </div>
          
          <StaggerList>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  className="group cursor-pointer"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCard className="p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${faq.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <faq.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </StaggerList>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="mb-12">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                Let's discuss your requirements and find the perfect solution for your needs. 
                Our expert team is ready to help you succeed.
              </p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/services">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  className="px-10 py-5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors duration-200 shadow-xl hover:shadow-2xl text-lg"
                >
                  View Our Services
                  <ArrowRight className="w-6 h-6 ml-3" />
                </AnimatedButton>
              </Link>
              
              <Link href="/about">
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  className="px-10 py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200 text-lg"
                >
                  Learn More About Us
                </AnimatedButton>
              </Link>
            </motion.div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
