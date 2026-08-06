const fs = require('fs');
let content = fs.readFileSync('src/context/SubscriptionContext.tsx', 'utf-8');

const target = `  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    refreshSubscription();
  }, [user]);`;

const replacement = `  useEffect(() => {
    // Sequence the calls to prevent concurrent Supabase network requests
    // which can cause "Lock broken" token refresh race conditions
    fetchPlans().then(() => {
      refreshSubscription();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/context/SubscriptionContext.tsx', content, 'utf-8');
  console.log('Successfully patched SubscriptionContext.tsx');
} else {
  console.log('Target string not found');
}
