import React from 'react';
import { ShieldCheck, Globe, CreditCard, Music, Users, Smartphone } from 'lucide-react';
import { PricingRegion, Feature } from './types';

export const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
];

// TODO: Replace this URL with your direct image link (e.g. from a public hosting service)
// The provided Google Drive folder link cannot be accessed directly by the application.
export const LOGO_URL = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop&q=80";

export const FEATURES: Feature[] = [
  {
    title: 'Verified Artists',
    description: 'We vet every profile to ensure talent authenticity and quality for organizers.',
    icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
  },
  {
    title: 'Secure Payments',
    description: 'Guaranteed payments for completed gigs. No more chasing invoices.',
    icon: <CreditCard className="w-6 h-6 text-brand-600" />,
  },
  {
    title: 'Pan-African Reach',
    description: 'Access opportunities beyond your city. Connect with organizers across the continent.',
    icon: <Globe className="w-6 h-6 text-brand-600" />,
  },
  {
    title: 'Solo & Bands',
    description: 'Whether you are a solo vocalist or a full jazz band, there is a space for you.',
    icon: <Users className="w-6 h-6 text-brand-600" />,
  },
  {
    title: 'Easy Bookings',
    description: 'Streamlined booking process from inquiry to performance agreement.',
    icon: <Smartphone className="w-6 h-6 text-brand-600" />,
  },
  {
    title: 'Career Growth',
    description: 'Build your portfolio with verified reviews and climb the ranks.',
    icon: <Music className="w-6 h-6 text-brand-600" />,
  },
];

export const PRICING_DATA: Record<'nigeria' | 'international', PricingRegion> = {
  nigeria: {
    regionName: 'Nigeria',
    currency: '₦',
    tiers: [
      {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for artists just starting out.',
        features: ['Basic Artist Profile', 'Search for Gigs', 'Community Support'],
      },
      {
        name: 'Gold',
        price: '₦1,000',
        subPrice: '/mo + ₦1,500 verification',
        description: 'For serious musicians ready to get booked.',
        features: ['Verified Badge', 'Apply to Unlimited Gigs', 'Secure Payments', 'Priority Support'],
        recommended: true,
      },
      {
        name: 'Diamond',
        price: '₦2,500',
        subPrice: '/month',
        description: 'Maximum visibility and premium opportunities.',
        features: ['Featured Profile', '0% Service Fees', 'Dedicated Talent Manager', 'International Exposure', 'All Gold Features'],
      },
    ],
  },
  international: {
    regionName: 'International (Africa)',
    currency: '$',
    tiers: [
      {
        name: 'Starter',
        price: 'Free',
        description: 'Explore the marketplace and set up your profile.',
        features: ['Basic Artist Profile', 'Search for Gigs', 'Community Support'],
      },
      {
        name: 'Gold',
        price: '$2.00',
        subPrice: '/mo + $2.00 verification',
        description: 'Unlock full access to gig applications.',
        features: ['Verified Badge', 'Apply to Unlimited Gigs', 'Secure Payments', 'Priority Support'],
        recommended: true,
      },
      {
        name: 'Diamond',
        price: 'Premium',
        subPrice: 'Coming Soon',
        description: 'Elite access for established acts.',
        features: ['Featured Profile', 'Lower Commissions', 'Cross-border Gig Access', 'All Gold Features'],
      },
    ],
  },
};
