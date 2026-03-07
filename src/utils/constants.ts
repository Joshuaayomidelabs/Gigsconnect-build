export const PRICING_DATA = {
  nigeria: {
    tiers: [
      {
        name: 'Free',
        price: '₦0',
        description: 'Perfect for getting started',
        features: ['Apply to 5 gigs/month', 'Basic profile', 'Community support'],
        recommended: false
      },
      {
        name: 'Pro',
        price: '₦15,000',
        subPrice: '/month',
        description: 'For serious musicians',
        features: ['Unlimited applications', 'Verified Badge', 'Priority support', 'Early access to gigs'],
        recommended: true
      },
      {
        name: 'Premium',
        price: '₦40,000',
        subPrice: '/month',
        description: 'The ultimate talent package',
        features: ['All Pro features', 'Featured profile', 'Direct messaging', 'Dedicated account manager'],
        recommended: false
      }
    ]
  },
  international: {
    tiers: [
      {
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started',
        features: ['Apply to 5 gigs/month', 'Basic profile', 'Community support'],
        recommended: false
      },
      {
        name: 'Pro',
        price: '$19',
        subPrice: '/month',
        description: 'For serious musicians',
        features: ['Unlimited applications', 'Verified Badge', 'Priority support', 'Early access to gigs'],
        recommended: true
      },
      {
        name: 'Premium',
        price: '$49',
        subPrice: '/month',
        description: 'The ultimate talent package',
        features: ['All Pro features', 'Featured profile', 'Direct messaging', 'Dedicated account manager'],
        recommended: false
      }
    ]
  }
};

export const LOGO_URL = 'https://picsum.photos/seed/music/200/200';

export const APP_NAME = 'GigsConnect';

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium'
};

export const GIG_CATEGORIES = [
  'Live Performance',
  'Studio Session',
  'Music Production',
  'Songwriting',
  'Mixing & Mastering',
  'Music Lessons',
  'Other'
];
