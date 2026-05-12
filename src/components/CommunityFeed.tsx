import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { communityService } from '../services/communityService';
import { supabase } from '../services/supabaseClient';

interface PostUser {
  full_name: string;
  avatar_url: string;
}

export interface Post {
  id: string;
  text: string;
  created_at: string;
  image_urls?: string[];
  video_url?: string;
  audio_url?: string;
  user_id: string;
  user: PostUser;
  likes_count: number;
  comments_count?: number;
  is_liked: boolean;
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts(isBackgroundRefresh = false) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        const { data, error } = await communityService.getFeed(userId);
        
        if (!isMounted) return;

        if (error) {
          console.error("Error fetching posts:", error);
          if (!isBackgroundRefresh) setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error in fetchPosts:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    // REAL-TIME UPDATES (CRITICAL FIX)
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) => prev.map((p) => {
              if (p.id === payload.new.id) {
                return { ...p, ...payload.new };
              }
              return p;
            }));
          } else if (payload.eventType === 'INSERT') {
            // For insert, it's safer to fetch the specific post or just refetch to get the user relation
            fetchPosts(true); 
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col pb-12 w-full max-w-[600px] mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] sm:rounded-[16px] border-b sm:border border-gray-100 dark:border-[#2a2a2a] mb-6 animate-pulse">
            <div className="flex items-center gap-3 p-4">
              <div className="w-[40px] h-[40px] rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
              </div>
            </div>
            <div className="px-4 pb-3 space-y-2">
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-[80%]"></div>
            </div>
            <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-800 mt-2"></div>
            <div className="p-4 flex gap-4">
              <div className="w-[26px] h-[26px] rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-[26px] h-[26px] rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div className="w-[26px] h-[26px] rounded-full bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col py-20 text-center items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-800" />
        </div>
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">Be the first to share something with the community.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-12 w-full max-w-[600px] mx-auto">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))} 
        />
      ))}
    </div>
  );
}
