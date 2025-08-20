'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CompanyConfig } from '@/types';
import { companyConfigApi } from '@/lib/api';

interface CompanyConfigContextType {
  config: CompanyConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CompanyConfigContext = createContext<CompanyConfigContextType | undefined>(undefined);

export function CompanyConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<CompanyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyConfigApi.get();
      setConfig(response.data);
    } catch (err) {
      console.error('Failed to fetch company config:', err);
      setError('Failed to load company configuration');
      // Set default config on error
      setConfig({
        hero_headline: 'We Build Software That Moves Markets',
        hero_subtitle: 'Transform your business with cutting-edge software solutions. From web applications to AI-powered systems, we deliver results that drive growth.',
        hero_features: [
          'Custom Software Development',
          'Web & Mobile Applications',
          'Cloud Infrastructure',
          'AI & Machine Learning',
        ],
        cta_headline: 'Ready to Transform Your Business?',
        cta_subtitle: "Let's discuss how our innovative software solutions can drive growth, streamline operations, and create competitive advantages for your business.",
        cta_benefits: [
          'Free initial consultation and project assessment',
          'Transparent pricing with no hidden fees',
          'Dedicated project manager and development team',
          'Regular progress updates and milestone reviews',
          'Post-launch support and maintenance',
          'Scalable solutions that grow with your business',
        ],
        company_phone: '+1 (555) 123-4567',
        company_email: 'hello@kkevo.com',
        company_address: '',
        live_chat_enabled: true,
        trust_companies: ['TechCorp', 'FinanceBank', 'DataFlow', 'InsightMetrics'],
        linkedin_url: '',
        twitter_url: '',
        github_url: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchConfig();
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const value: CompanyConfigContextType = {
    config,
    loading,
    error,
    refresh,
  };

  return (
    <CompanyConfigContext.Provider value={value}>
      {children}
    </CompanyConfigContext.Provider>
  );
}

export function useCompanyConfig() {
  const context = useContext(CompanyConfigContext);
  if (context === undefined) {
    throw new Error('useCompanyConfig must be used within a CompanyConfigProvider');
  }
  return context;
}
