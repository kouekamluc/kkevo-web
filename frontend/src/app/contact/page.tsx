'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactApi } from '@/lib/api';
import { FadeInSection } from '@/components/animations';
import { AnimatedButton } from '@/components/ui';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
    action: 'mailto:hello@kkevo.com'
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'Call us during business hours',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    title: 'Office',
    description: 'Visit our headquarters',
    contact: '123 Tech Street, San Francisco, CA 94105',
    action: 'https://maps.google.com'
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



export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      await contactApi.submit(data);
      setIsSubmitted(true);
      reset();
      toast.success('Message sent successfully! We\'ll get back to you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <main className="min-h-screen">
          <Header />
          
          <section className="pt-32 pb-16">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <FadeInSection>
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Message Sent!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/'}
                  >
                    Back to Home
                  </AnimatedButton>
                </div>
              </FadeInSection>
            </div>
          </section>

          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Get in Touch
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Ready to start your project? Have a question? We'd love to hear from you. 
                  Let's discuss how we can help bring your vision to life.
                </p>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Choose your preferred way to reach us or fill out the form below.
                </p>
              </div>
            </FadeInSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <method.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </p>
                  <a
                    href={method.action}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {method.contact}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <FadeInSection>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          {...register('name', { required: 'Name is required' })}
                          type="text"
                          id="name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                            errors.name
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          } text-gray-900 dark:text-white`}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                            errors.email
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          } text-gray-900 dark:text-white`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          errors.subject
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        } text-gray-900 dark:text-white`}
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>
                            {subjectLabels[subject as keyof typeof subjectLabels]}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { required: 'Message is required' })}
                        id="message"
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          errors.message
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        } text-gray-900 dark:text-white`}
                        placeholder="Tell us about your project or inquiry..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Message
                        </div>
                      )}
                    </AnimatedButton>
                  </form>
                </div>
              </FadeInSection>
              
              {/* Map */}
              <FadeInSection delay={0.2}>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Our Location
                  </h2>
                  
                  <div className="relative">
                    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {/* Animated Map Placeholder */}
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                            San Francisco, CA
                          </h3>
                          <p className="text-indigo-700 dark:text-indigo-300">
                            123 Tech Street<br />
                            San Francisco, CA 94105
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Info Card */}
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Open Now
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Mon-Fri: 9AM-6PM PST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Email Support
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          support@kkevo.com
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Phone Support
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Quick answers to common questions about working with us.
                </p>
              </div>
            </FadeInSection>
            
            <div className="space-y-6">
              {[
                {
                  question: 'How quickly can you start a project?',
                  answer: 'We can typically begin a project within 1-2 weeks of contract signing, depending on project complexity and our current capacity.'
                },
                {
                  question: 'What is your typical project timeline?',
                  answer: 'Project timelines vary based on scope and complexity. Small projects take 4-8 weeks, medium projects 8-16 weeks, and large projects 16+ weeks.'
                },
                {
                  question: 'Do you provide ongoing support after launch?',
                  answer: 'Yes, we offer various support packages including maintenance, updates, and technical support to ensure your solution continues to perform optimally.'
                },
                {
                  question: 'What industries do you specialize in?',
                  answer: 'We work across various industries including fintech, healthcare, e-commerce, education, and enterprise software, with expertise in modern web and mobile technologies.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
