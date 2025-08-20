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
  Award,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactApi, leadMagnetApi } from '@/lib/api';
import { FadeInSection, StaggerList } from '@/components/animations';
import { AnimatedButton, AnimatedCard, KkevoLogo } from '@/components/ui';
import Header from '@/components/layout/Header';

import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  project_budget?: string;
  timeline?: string;
  team_size?: string;
  industry?: string;
  urgency?: string;
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
  'consultation',
  'quote',
  'other'
];

const subjectLabels = {
  general: 'General Inquiry',
  project: 'Project Request',
  partnership: 'Partnership',
  career: 'Career Opportunity',
  support: 'Technical Support',
  consultation: 'Free Consultation',
  quote: 'Get a Quote',
  other: 'Other'
};

const projectBudgets = [
  'under-10k',
  '10k-25k',
  '25k-50k',
  '50k-100k',
  '100k-250k',
  '250k+',
  'not-sure'
];

const budgetLabels = {
  'under-10k': 'Under $10,000',
  '10k-25k': '$10,000 - $25,000',
  '25k-50k': '$25,000 - $50,000',
  '50k-100k': '$50,000 - $100,000',
  '100k-250k': '$100,000 - $250,000',
  '250k+': '$250,000+',
  'not-sure': 'Not sure yet'
};

const timelines = [
  'asap',
  '1-3-months',
  '3-6-months',
  '6-12-months',
  '12-months+',
  'flexible'
];

const timelineLabels = {
  'asap': 'ASAP (Within 1 month)',
  '1-3-months': '1-3 months',
  '3-6-months': '3-6 months',
  '6-12-months': '6-12 months',
  '12-months+': '12+ months',
  'flexible': 'Flexible timeline'
};

const teamSizes = [
  'solo',
  '2-5',
  '6-10',
  '11-25',
  '26-50',
  '50+'
];

const teamSizeLabels = {
  'solo': 'Solo founder/developer',
  '2-5': '2-5 people',
  '6-10': '6-10 people',
  '11-25': '11-25 people',
  '26-50': '26-50 people',
  '50+': '50+ people'
};

const industries = [
  'fintech',
  'healthcare',
  'ecommerce',
  'saas',
  'education',
  'real-estate',
  'manufacturing',
  'consulting',
  'other'
];

const industryLabels = {
  'fintech': 'Financial Technology',
  'healthcare': 'Healthcare',
  'ecommerce': 'E-commerce',
  'saas': 'SaaS/Software',
  'education': 'Education',
  'real-estate': 'Real Estate',
  'manufacturing': 'Manufacturing',
  'consulting': 'Consulting',
  'other': 'Other'
};

const urgencyLevels = [
  'low',
  'medium',
  'high',
  'critical'
];

const urgencyLabels = {
  'low': 'Low - Just exploring options',
  'medium': 'Medium - Planning phase',
  'high': 'High - Ready to start soon',
  'critical': 'Critical - Need immediate help'
};

const stats = [
  { number: '500+', label: 'Projects Delivered', color: 'text-indigo-600 dark:text-indigo-400' },
  { number: '98%', label: 'Client Satisfaction', color: 'text-green-600 dark:text-green-400' },
  { number: '24/7', label: 'Support Available', color: 'text-purple-600 dark:text-purple-400' },
  { number: '90', label: 'Days Average Delivery', color: 'text-pink-600 dark:text-pink-400' }
];

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
    answer: 'Yes, we offer comprehensive post-launch support including maintenance, updates, and technical assistance to ensure your project continues to perform optimally.',
    icon: Shield,
    color: 'from-purple-500 to-pink-600'
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'We specialize in modern web technologies including React, Next.js, Django, Python, Node.js, and cloud platforms like AWS and Azure.',
    icon: Globe,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    question: 'How do you handle project communication?',
    answer: 'We maintain regular communication through scheduled meetings, progress reports, and dedicated project management tools to keep you informed every step of the way.',
    icon: MessageCircle,
    color: 'from-red-500 to-pink-600'
  },
  {
    question: 'What is your pricing structure?',
    answer: 'We offer flexible pricing models including fixed-price projects, time and materials, and retainer agreements. We\'ll work with you to find the best fit for your budget and needs.',
    icon: Star,
    color: 'from-indigo-500 to-purple-600'
  }
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactForm>();

  // Watch form values for lead scoring
  const watchedValues = watch();

  // Calculate lead score based on form data
  const calculateLeadScore = (data: ContactForm): number => {
    let score = 0;
    
    // Basic information (0-20 points)
    if (data.name) score += 5;
    if (data.email) score += 5;
    if (data.phone) score += 5;
    if (data.company) score += 5;
    
    // Project details (0-40 points)
    if (data.project_budget) {
      const budgetScore = {
        'under-10k': 5,
        '10k-25k': 10,
        '25k-50k': 15,
        '50k-100k': 20,
        '100k-250k': 25,
        '250k+': 30,
        'not-sure': 10
      };
      score += budgetScore[data.project_budget as keyof typeof budgetScore] || 0;
    }
    
    if (data.timeline) {
      const timelineScore = {
        'asap': 20,
        '1-3-months': 15,
        '3-6-months': 10,
        '6-12-months': 5,
        '12-months+': 0,
        'flexible': 10
      };
      score += timelineScore[data.timeline as keyof typeof timelineScore] || 0;
    }
    
    if (data.team_size) {
      const teamScore = {
        'solo': 10,
        '2-5': 15,
        '6-10': 20,
        '11-25': 25,
        '26-50': 30,
        '50+': 35
      };
      score += teamScore[data.team_size as keyof typeof teamScore] || 0;
    }
    
    if (data.industry) {
      const industryScore = {
        'fintech': 20,
        'healthcare': 20,
        'ecommerce': 15,
        'saas': 25,
        'education': 15,
        'real-estate': 10,
        'manufacturing': 15,
        'consulting': 10,
        'other': 10
      };
      score += industryScore[data.industry as keyof typeof industryScore] || 0;
    }
    
    if (data.urgency) {
      const urgencyScore = {
        'low': 5,
        'medium': 10,
        'high': 20,
        'critical': 25
      };
      score += urgencyScore[data.urgency as keyof typeof urgencyScore] || 0;
    }
    
    // Subject priority (0-20 points)
    if (data.subject) {
      const subjectScore = {
        'project': 20,
        'consultation': 15,
        'quote': 15,
        'partnership': 10,
        'general': 5,
        'support': 10,
        'career': 5,
        'other': 5
      };
      score += subjectScore[data.subject as keyof typeof subjectScore] || 0;
    }
    
    return Math.min(score, 100); // Cap at 100
  };

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // Calculate lead score
      const leadScore = calculateLeadScore(data);
      
      // Submit to contact API
      await contactApi.submit(data);
      
      // Also create a lead magnet submission for tracking
      try {
        await leadMagnetApi.submit({
          name: data.name,
          email: data.email,
          company: data.company,
          role: 'contact-form',
          lead_magnet_type: 'contact-inquiry',
          source: 'website',
          utm_source: 'contact-page',
          utm_medium: 'form',
          utm_campaign: 'contact-form'
        });
      } catch (leadError) {
        console.warn('Failed to create lead tracking:', leadError);
        // Don't fail the main submission for this
      }
      
      setSubmitted(true);
      reset();
      
      // Show lead score in success message
      const scoreMessage = leadScore >= 75 ? ' (High Priority Lead!)' : 
                          leadScore >= 50 ? ' (Qualified Lead)' : 
                          ' (New Lead)';
      
      toast.success(`Message sent successfully! Lead Score: ${leadScore}/100${scoreMessage}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current lead score for display
  const currentLeadScore = calculateLeadScore(watchedValues);

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
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Company Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <KkevoLogo 
                width={120} 
                height={40} 
                variant="default"
                className="drop-shadow-lg"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-theme-primary mb-6"
            >
              Let's Build Something
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Amazing Together
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-theme-secondary max-w-3xl mx-auto mb-8"
            >
              Ready to transform your ideas into reality? We're here to help you build, scale, and succeed. 
              Get in touch and let's discuss how we can bring your vision to life.
            </motion.p>

            {/* Lead Score Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Lead Score:
              </span>
              <span className={`text-lg font-bold ${
                currentLeadScore >= 75 ? 'text-green-600' :
                currentLeadScore >= 50 ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {currentLeadScore}/100
              </span>
              {currentLeadScore >= 75 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  High Priority
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-theme-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-theme-primary mb-4">
                  Send Us a Message
                </h2>
                <p className="text-theme-secondary">
                  Fill out the form below and we'll get back to you within 24 hours. 
                  The more details you provide, the better we can assist you.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-theme-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-theme-border-primary rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-theme-card text-theme-primary transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register('subject', { required: 'Subject is required' })}
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subjectLabels[subject as keyof typeof subjectLabels]}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Advanced Fields Toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    {showAdvancedFields ? 'Hide' : 'Show'} Advanced Fields
                    <ArrowRight className={`w-4 h-4 transition-transform ${showAdvancedFields ? 'rotate-90' : ''}`} />
                  </button>
                  <p className="text-sm text-gray-500 mt-1">
                    {showAdvancedFields ? 'Hide additional project details' : 'Add project details for better lead scoring'}
                  </p>
                </div>

                {/* Advanced Fields */}
                <AnimatePresence>
                  {showAdvancedFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Project Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="project_budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Budget
                          </label>
                          <select
                            {...register('project_budget')}
                            id="project_budget"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                          >
                            <option value="">Select budget range</option>
                            {projectBudgets.map((budget) => (
                              <option key={budget} value={budget}>
                                {budgetLabels[budget as keyof typeof budgetLabels]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Timeline
                          </label>
                          <select
                            {...register('timeline')}
                            id="timeline"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                          >
                            <option value="">Select timeline</option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline}>
                                {timelineLabels[timeline as keyof typeof timelineLabels]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="team_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Team Size
                          </label>
                          <select
                            {...register('team_size')}
                            id="team_size"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                          >
                            <option value="">Select team size</option>
                            {teamSizes.map((size) => (
                              <option key={size} value={size}>
                                {teamSizeLabels[size as keyof typeof teamSizeLabels]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Industry
                          </label>
                          <select
                            {...register('industry')}
                            id="industry"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                          >
                            <option value="">Select industry</option>
                            {industries.map((industry) => (
                              <option key={industry} value={industry}>
                                {industryLabels[industry as keyof typeof industryLabels]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Urgency Level
                        </label>
                        <select
                          {...register('urgency')}
                          id="urgency"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                        >
                          <option value="">Select urgency level</option>
                          {urgencyLevels.map((urgency) => (
                            <option key={urgency} value={urgency}>
                              {urgencyLabels[urgency as keyof typeof urgencyLabels]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none"
                    placeholder="Tell us about your project, goals, or any questions you have..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Your information is secure and confidential</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-theme-primary mb-4">
                  Get in Touch
                </h2>
                <p className="text-theme-secondary">
                  We're here to help you succeed. Choose the method that works best for you.
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <a
                      href={method.action}
                      className="block p-6 bg-theme-card rounded-2xl border border-theme-border-primary hover:border-transparent hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${method.color} shadow-lg`}>
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-theme-primary mb-2 group-hover:text-theme-accent transition-colors">
                            {method.title}
                          </h3>
                          <p className="text-theme-secondary mb-3">
                            {method.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-theme-accent font-medium">
                              {method.contact}
                            </span>
                            <span className="text-sm text-theme-tertiary bg-theme-secondary px-3 py-1 rounded-full">
                              {method.delay}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="bg-theme-secondary rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-theme-primary mb-6 text-center">
                  Why Choose KKEVO?
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-theme-secondary">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-theme-tertiary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-theme-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
              Get answers to common questions about working with KKEVO. 
              Can't find what you're looking for? Just ask!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-theme-card rounded-2xl p-8 shadow-lg border border-theme-border-primary hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${faq.color} shadow-lg`}>
                    <faq.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-primary">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-theme-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-theme-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-theme-inverse mb-6"
          >
            Ready to Start Your Project?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-theme-inverse/80 mb-8 max-w-2xl mx-auto"
          >
            Let's discuss your vision and create something extraordinary together. 
            Our team is ready to bring your ideas to life.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-theme-inverse text-theme-primary font-semibold rounded-xl hover:bg-theme-inverse/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Project
            </button>
            
            <Link href="/portfolio">
              <AnimatedButton
                variant="outline"
                size="lg"
                className="px-8 py-4 border-2 border-theme-inverse text-theme-inverse font-semibold rounded-xl hover:bg-theme-inverse hover:text-theme-primary transition-all duration-200"
              >
                View Our Work
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
