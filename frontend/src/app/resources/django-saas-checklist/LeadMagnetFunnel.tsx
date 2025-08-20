'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, ArrowRight, BookOpen, Clock, Users, Zap } from 'lucide-react';
import { AnimatedButton, KkevoLogo } from '@/components/ui';
import { leadMagnetApi } from '@/lib/api';
import toast from 'react-hot-toast';

const LeadMagnetFunnel = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const benefits = [
    '12-page comprehensive checklist',
    'Proven SaaS launch strategies',
    'Technical architecture guidelines',
    'Marketing and growth tactics',
    'Funding and monetization tips',
    'Team building and hiring advice'
  ];

  const stats = [
    { icon: BookOpen, value: '12', label: 'Pages of Content' },
    { icon: Clock, value: '90', label: 'Days to Launch' },
    { icon: Users, value: '500+', label: 'Founders Helped' },
    { icon: Zap, value: '95%', label: 'Success Rate' }
  ];

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || '',
      };
      
      // Prepare submission data
      const submissionData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        role: formData.get('role') as string,
        lead_magnet_type: 'django-saas-checklist',
        source: 'website',
        ...utmParams
      };
      
      // Submit to backend
      const response = await leadMagnetApi.submit(submissionData);
      
      if (response.data.success) {
        // Store submission ID for tracking
        localStorage.setItem('lead_magnet_submission_id', response.data.submission_id);
        
        // Show success message
        toast.success('Thank you! Your checklist is ready.');
        
        setIsFormSubmitted(true);
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Get submission ID from localStorage
      const submissionId = localStorage.getItem('lead_magnet_submission_id');
      
      if (submissionId) {
        // Mark PDF as downloaded in backend
        await leadMagnetApi.markPdfDownloaded(submissionId);
      }
      
      // TODO: Implement PDF delivery via AWS S3 presigned URL
      // For now, simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a dummy download link
      const link = document.createElement('a');
      link.href = '/static/resources/django-saas-checklist.pdf';
      link.download = 'django-saas-checklist.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      toast.success('Checklist downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isFormSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You! Your Checklist is Ready
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Check your email for the download link. If you don't see it, check your spam folder.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Download & Review
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Go through the checklist and identify your current progress
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Schedule Consultation
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Book a free call to discuss your specific needs
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={handleDownload}
            disabled={isDownloading}
            className="group"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Checklist
              </>
            )}
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/contact'}
            className="group"
          >
            Get Free Consultation
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </AnimatedButton>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
                 {/* Company Logo */}
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="flex justify-center mb-8"
         >
           <KkevoLogo 
             width={120} 
             height={40} 
             variant="default"
             className="drop-shadow-lg"
           />
         </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-theme-primary mb-6 leading-tight">
          Launch Your SaaS in{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            90 Days
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-theme-secondary mb-8 max-w-3xl mx-auto">
          Get our proven 12-page Django SaaS checklist used by 500+ founders to launch successful businesses
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
                           <div className="w-16 h-16 bg-theme-card rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
               <stat.icon className="w-8 h-8 text-theme-accent" />
             </div>
             <div className="text-2xl font-bold text-theme-primary mb-1">{stat.value}</div>
             <div className="text-sm text-theme-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Form */}
                 <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-theme-card rounded-2xl p-8 border border-theme-border-primary shadow-lg"
         >
          <h2 className="text-2xl font-bold text-theme-primary mb-6">
            Get Your Free Checklist
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-theme-secondary mb-2">
                Full Name *
              </label>
                             <input
                 type="text"
                 id="name"
                 name="name"
                 required
                 className="w-full px-4 py-3 bg-theme-secondary border border-theme-border-primary rounded-lg text-theme-primary placeholder-theme-tertiary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                 placeholder="Enter your full name"
               />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-secondary mb-2">
                Email Address *
              </label>
                             <input
                 type="email"
                 id="email"
                 name="email"
                 required
                 className="w-full px-4 py-3 bg-theme-secondary border border-theme-border-primary rounded-lg text-theme-primary placeholder-theme-primary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                 placeholder="Enter your email address"
               />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-theme-secondary mb-2">
                Company Name
              </label>
                             <input
                 type="text"
                 id="company"
                 name="company"
                 className="w-full px-4 py-3 bg-theme-secondary border border-theme-border-primary rounded-lg text-theme-primary placeholder-theme-primary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                 placeholder="Enter your company name"
               />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-theme-secondary mb-2">
                Your Role
              </label>
                             <select
                 id="role"
                 name="role"
                 className="w-full px-4 py-3 bg-theme-secondary border border-theme-border-primary rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
               >
                <option value="">Select your role</option>
                <option value="founder">Founder</option>
                <option value="ceo">CEO</option>
                <option value="cto">CTO</option>
                <option value="developer">Developer</option>
                <option value="product-manager">Product Manager</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full group"
            >
              Get Free Checklist
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>
          </form>
          
          <p className="text-xs text-gray-400 mt-4 text-center">
            By submitting this form, you agree to receive marketing emails from KKEVO. 
            You can unsubscribe at any time.
          </p>
        </motion.div>

        {/* Right Column - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-theme-primary mb-6">
              What You'll Get
            </h3>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-theme-secondary">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
                     <div className="bg-theme-card rounded-xl p-6 border border-theme-border-primary shadow-lg">
            <h4 className="text-lg font-semibold text-theme-primary mb-3">
              🚀 Ready to Build?
            </h4>
            <p className="text-theme-secondary mb-4">
              After reviewing the checklist, book a free consultation to discuss your specific project needs.
            </p>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/contact'}
              className="w-full"
            >
              Book Free Consultation
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadMagnetFunnel;
