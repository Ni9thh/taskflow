import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface SubscriptionConfig {
  table: string;
  schema?: string;
  event?: SubscriptionEvent | '*';
  filter?: string;
}

export function useRealtimeSubscription(
  config: SubscriptionConfig,
  callback: () => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        // Clean up existing subscription
        if (channelRef.current) {
          await channelRef.current.unsubscribe();
        }

        // Create unique channel name
        const channelName = `${config.table}_changes_${Date.now()}`;
        
        // Set up new subscription
        channelRef.current = supabase.channel(channelName);
        
        channelRef.current
          .on(
            'postgres_changes',
            {
              event: config.event || '*',
              schema: config.schema || 'public',
              table: config.table,
              filter: config.filter,
            },
            () => {
              callback();
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              // Clear retry timeout on successful subscription
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = undefined;
              }
            } else if (status === 'CLOSED') {
              // Attempt to reconnect after a delay
              retryTimeoutRef.current = setTimeout(() => {
                setupSubscription();
              }, 2000);
            }
          });
      } catch (error) {
        console.error('Subscription setup failed:', error);
        // Attempt to reconnect after error
        retryTimeoutRef.current = setTimeout(() => {
          setupSubscription();
        }, 2000);
      }
    };

    setupSubscription();

    return () => {
      // Clean up on unmount
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [config.table, config.schema, config.event, config.filter, callback]);
}