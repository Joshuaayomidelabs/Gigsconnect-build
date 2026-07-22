const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const plans = [
    {
      name: 'Starter',
      price_naira: 0,
      price_usd: 0,
      duration: 'monthly',
      description: 'Perfect for getting started.',
      is_active: true,
      display_order: 1,
      features: {
        community_access: true,
        professional_profile: true,
        portfolio: true,
        basic_messaging: true,
        apply_for_opportunities: true,
        basic_search: true,
        verified_profile: false,
        priority_search_ranking: false,
        unlimited_applications: false,
        profile_analytics: false,
        priority_support: false,
        featured_profile: false,
        featured_listings: false,
        promotional_boosts: false,
        business_tools: false,
        advanced_analytics: false,
        early_access_new_features: false
      }
    },
    {
      name: 'Pro',
      price_naira: 1000,
      price_usd: 1,
      duration: 'monthly',
      description: 'Supercharge your creator journey.',
      is_active: true,
      display_order: 2,
      features: {
        community_access: true,
        professional_profile: true,
        portfolio: true,
        basic_messaging: true,
        apply_for_opportunities: true,
        basic_search: true,
        verified_profile: true,
        priority_search_ranking: true,
        unlimited_applications: true,
        profile_analytics: true,
        priority_support: true,
        featured_profile: false,
        featured_listings: false,
        promotional_boosts: false,
        business_tools: false,
        advanced_analytics: false,
        early_access_new_features: false
      }
    },
    {
      name: 'Premium',
      price_naira: 2500,
      price_usd: 2,
      duration: 'monthly',
      description: 'The ultimate toolkit for top creators.',
      is_active: true,
      display_order: 3,
      features: {
        community_access: true,
        professional_profile: true,
        portfolio: true,
        basic_messaging: true,
        apply_for_opportunities: true,
        basic_search: true,
        verified_profile: true,
        priority_search_ranking: true,
        unlimited_applications: true,
        profile_analytics: true,
        priority_support: true,
        featured_profile: true,
        featured_listings: true,
        promotional_boosts: true,
        business_tools: true,
        advanced_analytics: true,
        early_access_new_features: true
      }
    }
  ];

  for (const plan of plans) {
    // Check if exists
    const { data: existing } = await supabase.from('subscription_plans').select('id').eq('name', plan.name).single();
    if (existing) {
      await supabase.from('subscription_plans').update(plan).eq('id', existing.id);
      console.log(`Updated ${plan.name}`);
    } else {
      await supabase.from('subscription_plans').insert(plan);
      console.log(`Inserted ${plan.name}`);
    }
  }
}
run();
