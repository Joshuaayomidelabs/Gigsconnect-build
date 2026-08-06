import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { notifyError } from '../utils/errorHandler';

export const pushNotificationService = {
  /**
   * Initialize and register push notifications
   * @param navigate React Router Navigation function
   */
  async initPushNotifications(navigate: (path: string) => void) {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications are only available on native platforms (Android/iOS).');
      return;
    }

    try {
      // 1. Request and verify permissions
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission denied by user.');
        return;
      }

      // 2. Register for push notifications
      await PushNotifications.register();

      // 3. Setup listeners
      
      // On registration success
      await PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Mobile Push registration succeeded. Token:', token.value);
        localStorage.setItem('gigsconnect_fcm_token', token.value);

        // Securely sync token with Supabase Auth metadata or database profile
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // A. Store in Supabase Auth user metadata
            await supabase.auth.updateUser({
              data: { push_token: token.value }
            });

            // B. Also attempt to save to profiles table if push_token column is available
            const { error: dbError } = await supabase
              .from('profiles')
              .update({ push_token: token.value } as any)
              .eq('user_id', user.id);

            if (dbError) {
              console.log('Note: could not update push_token column in profiles table (expected if column does not exist). Auth metadata updated instead.');
            } else {
              console.log('Successfully saved device push token to profiles Table.');
            }
          }
        } catch (authErr) {
          console.error('Failed to sync push token with Supabase profiles:', authErr);
        }
      });

      // On registration error
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Capacitor Push Registration Error:', JSON.stringify(error));
        notifyError('Failed to register for push notifications. Check device settings.');
      });

      // On foreground notification received
      await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push Notification Received in Foreground:', notification);
          
          // Display a interactive high-contrast mobile toast
          const link = notification.data?.link || notification.data?.route;
          toast.info(notification.title || 'New GigsConnect Alert', {
            description: notification.body || 'You have a new update.',
            duration: 6000,
            action: link ? {
              label: 'View',
              onClick: () => {
                navigate(link);
              }
            } : undefined
          });
        }
      );

      // On background/foreground notification clicked (action performed)
      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action: ActionPerformed) => {
          console.log('User performed push notification action:', action);
          
          const rawData = action.notification.data;
          const link = rawData?.link || rawData?.route || rawData?.urlString;
          
          if (link) {
            console.log('Deep linking via push notification to:', link);
            navigate(link);
          } else {
            // Default fallbacks based on message/category types
            const type = action.notification.data?.type;
            if (type === 'message_new' || type === 'message') {
              toast('Messaging is coming soon.', { description: "We're working on bringing messaging to GigsConnect." });
            } else if (type === 'gig_application' || type === 'application_received') {
              navigate('/applications');
            } else {
              navigate('/notifications');
            }
          }
        }
      );

      console.log('Push notification listeners and registered callbacks successfully set.');
    } catch (err) {
      console.error('Inability to initialize Push Notifications service:', err);
    }
  },

  /**
   * Programmatically trigger an simulated message/gig notification inside the app.
   * This is extremely valuable for local testing/debugging processes.
   */
  simulatePushNotification(
    navigate: (path: string) => void,
    options: { title: string; body: string; link?: string; type?: string }
  ) {
    const { title, body, link, type } = options;
    console.log('Simulating incoming push notification:', title, body, link);

    toast.info(title, {
      description: body,
      duration: 6000,
      action: link ? {
        label: 'View',
        onClick: () => {
          navigate(link);
        }
      } : undefined
    });
  }
};
