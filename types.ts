import React from 'react';

export interface PricingTier {
  name: string;
  price: string;
  subPrice?: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface PricingRegion {
  regionName: string;
  currency: string;
  tiers: PricingTier[];
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}