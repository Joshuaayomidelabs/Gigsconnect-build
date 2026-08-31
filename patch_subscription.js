const fs = require('fs');

const path = 'src/services/subscriptionService.ts';
let code = fs.readFileSync(path, 'utf8');

const replacement = `  async initiatePayment(userId: string, planId: number): Promise<string> {
    const { data, error } = await supabase.functions.invoke('paystack-initialize', {
      body: { user_id: userId, plan_id: planId }
    });

    if (error) {
      console.error('paystack-initialize error:', error);
      throw new Error('Unable to initialize payment. Please try again.');
    }

    if (!data?.authorization_url) {
      throw new Error('No authorization URL received from payment provider.');
    }

    return data.authorization_url;
  },

  async ensureStarterSubscription`;

code = code.replace('  async ensureStarterSubscription', replacement);
fs.writeFileSync(path, code, 'utf8');
