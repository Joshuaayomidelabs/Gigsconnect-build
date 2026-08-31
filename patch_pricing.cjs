const fs = require('fs');
const path = 'src/components/PricingSection.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('useEffect')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
}

code = code.replace(
  "const { plans, subscription, isLoading } = useSubscription();",
  "const { plans, subscription, isLoading, refreshSubscription } = useSubscription();"
);

const effectCode = `
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('reference') || searchParams.has('trxref')) {
      toast.success('Payment successful! Your plan is being updated.');
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // Initial refresh
      refreshSubscription();
      
      // Poll a few times in case the webhook is slightly delayed
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        refreshSubscription();
        if (attempts >= 2) {
          clearInterval(interval);
        }
      }, 2500);
    }
  }, [refreshSubscription]);
`;

code = code.replace(
  "const handleUpgradeClick = (planId: number) => {",
  effectCode + "\n  const handleUpgradeClick = (planId: number) => {"
);

fs.writeFileSync(path, code, 'utf8');
console.log("Patched successfully");
