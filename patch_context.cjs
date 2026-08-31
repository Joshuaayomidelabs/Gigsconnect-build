const fs = require('fs');
const path = 'src/context/SubscriptionContext.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace("import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';", "import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';");

const oldRefresh = `  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }
        
    setIsLoading(true);
    try {
      const sub = await subscriptionService.ensureStarterSubscription(user.id);
      setSubscription(sub);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };`;

const newRefresh = `  const processedUserIdRef = useRef<string | null>(null);
  const inFlightUserIdRef = useRef<string | null>(null);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      processedUserIdRef.current = null;
      inFlightUserIdRef.current = null;
      return;
    }
        
    // Prevent duplicate calls for the same user ID in this session
    if (inFlightUserIdRef.current === user.id || processedUserIdRef.current === user.id) {
      return;
    }
    
    inFlightUserIdRef.current = user.id;
    setIsLoading(true);
    try {
      const sub = await subscriptionService.ensureStarterSubscription(user.id);
      setSubscription(sub);
      processedUserIdRef.current = user.id;
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      if (inFlightUserIdRef.current === user.id) {
        inFlightUserIdRef.current = null;
      }
      setIsLoading(false);
    }
  };`;

code = code.replace(oldRefresh, newRefresh);
fs.writeFileSync(path, code, 'utf8');
