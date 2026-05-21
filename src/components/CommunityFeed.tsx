import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { communityService } from '../services/communityService';
import { supabase } from '../services/supabaseClient';

interface PostUser {
  full_name: string;
  avatar_url: string;
  city?: string;
  country?: string;
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
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles(*)
          `)
          .order('created_at', { ascending: false });
        
        if (!isMounted) return;

        if (error) {
          console.error("Error fetching posts:", error);
          if (!isBackgroundRefresh) setPosts([]);
        } else {
          // Normalize to match expected Post type structure
          const processedPosts = (data || []).map((post: any) => ({
            ...post,
            user: post.profiles,
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            is_liked: false
          }));
          setPosts(processedPosts);
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
            // 🔥 ALWAYS put new post at top (INSTANT UI UPDATE)
             supabase
              .from('posts')
              .select(`*, profiles(*)`)
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  const newPost = {
                    ...data,
                    user: data.profiles,
                    likes_count: data.likes_count || 0,
                    comments_count: data.comments_count || 0,
                    is_liked: false
                  };
                  setPosts((prev) => [newPost, ...prev]);
                }
              });
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
      <div className="flex flex-col pb-12 w-full sm:max-w-[600px] mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative w-full sm:max-w-[600px] mx-auto mb-10 sm:mb-14">
            <div className="bg-white dark:bg-[#0F0F12]/90 sm:backdrop-blur-3xl sm:rounded-[40px] sm:border border-gray-200/50 dark:border-[#1F1F23]/80 sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden flex flex-col relative z-0 animate-pulse border-y border-gray-200 dark:border-[#1F1F23]">
              <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-3">
                <div className="w-[44px] h-[44px] rounded-full bg-gray-200 dark:bg-[#1A1A1E]"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 bg-gray-200 dark:bg-[#1A1A1E] rounded w-32"></div>
                  <div className="h-2.5 bg-gray-200 dark:bg-[#1A1A1E] rounded w-20"></div>
                </div>
              </div>
              <div className="px-5 sm:px-7 pb-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-[#1A1A1E] rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#1A1A1E] rounded w-[80%]"></div>
              </div>
              <div className="w-full">
                <div className="w-full aspect-[4/5] sm:rounded-[24px] bg-gray-200 dark:bg-[#1A1A1E] overflow-hidden"></div>
              </div>
              <div className="px-4 sm:px-5 pt-3 pb-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-[#1A1A1E]"></div>
                  <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-[#1A1A1E]"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1A1A1E]"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1A1A1E]"></div>
                </div>
              </div>
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
    <div className="flex flex-col pb-12 w-full sm:max-w-[600px] mx-auto">
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
