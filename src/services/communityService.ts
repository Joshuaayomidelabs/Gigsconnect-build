import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const communityService = {
  async getFeed(userId?: string) {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*, user:profiles!user_id(*)')
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return { data: null, error: postsError };
    }

    let followedUserIds = new Set<string>();
    let userLikedPostIds = new Set<string>();

    if (userId) {
      const [followsRes, likesRes] = await Promise.all([
        supabase.from('follows').select('following_id').eq('follower_id', userId),
        supabase.from('likes').select('post_id').eq('user_id', userId)
      ]);
      
      if (followsRes.data) {
        followedUserIds = new Set(followsRes.data.map(f => f.following_id));
      }
      if (likesRes.data) {
        userLikedPostIds = new Set(likesRes.data.map(l => l.post_id));
      }
    }

    // Sort: followed users first, then by date, and map is_liked
    const sortedPosts = [...(posts || [])].sort((a, b) => {
      const aFollowed = followedUserIds.has(a.user_id);
      const bFollowed = followedUserIds.has(b.user_id);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }).map(post => ({
      ...post,
      is_liked: userLikedPostIds.has(post.id)
    }));

    return { data: sortedPosts, error: null };
  },

  async getUserPosts(userId: string, currentUserId?: string) {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, user:profiles!user_id(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };

    let userLikedPostIds = new Set<string>();
    if (currentUserId) {
      const { data: likesRes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', currentUserId);
      if (likesRes) {
        userLikedPostIds = new Set(likesRes.map(l => l.post_id));
      }
    }

    const processedPosts = posts.map(post => ({
      ...post,
      is_liked: userLikedPostIds.has(post.id)
    }));

    return { data: processedPosts, error: null };
  },

  async createPost(postData: { 
    user_id: string, 
    text: string, 
    image_urls?: string[], 
    video_url?: string,
    audio_url?: string,
    is_available_for_gigs: boolean 
  }) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();
    
    return { data, error };
  },

  async updatePostText(postId: string, newText: string) {
    const { data, error } = await supabase
      .from('posts')
      .update({ text: newText })
      .eq('id', postId);
    
    return { data, error };
  },

  async deletePost(postId: string) {
    console.log(`[deletePost] Executing delete on posts table...`);
    // Delete the post directly. Foreign keys with ON DELETE CASCADE will handle likes and comments automatically.
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error("[deletePost] Error deleting post:", error);
    } else {
      console.log(`[deletePost] Delete command successful. Data:`, data);
      
      // Verification check to ensure RLS actually allowed the deletion
      const verify = await supabase.from('posts').select('id').eq('id', postId).maybeSingle();
      if (verify.data) {
        console.warn("[deletePost] RLS ISSUE: Post is still in database!");
        return { data: null, error: new Error('Post could not be deleted from the database. Make sure you have permissions to delete this post.') };
      }
    }

    return { data, error };
  },

  async toggleLike(postId: string, userId: string, postOwnerId: string) {
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (existingLike) {
      // UNLIKE
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      
      // Decrement count fallback if no rpc available
      supabase.from('posts').select('likes_count').eq('id', postId).single().then(({ data }) => {
        if (data) supabase.from('posts').update({ likes_count: Math.max(0, (data.likes_count || 1) - 1) }).eq('id', postId).then();
      });

      return { liked: false };
    } else {
      // LIKE
      await supabase
        .from('likes')
        .insert([{ user_id: userId, post_id: postId }]);
      
      // Increment count fallback if no rpc available
      supabase.from('posts').select('likes_count').eq('id', postId).single().then(({ data }) => {
        if (data) supabase.from('posts').update({ likes_count: (data.likes_count || 0) + 1 }).eq('id', postId).then();
      });

      // Notify
      if (userId !== postOwnerId) {
        await notificationsService.createNotification({
          user_id: postOwnerId,
          type: 'system',
          title: 'New Like',
          message: 'Someone liked your post',
          reference_id: postId,
        });
      }

      return { liked: true };
    }
  },

  async addComment(postId: string, userId: string, text: string) {
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_id: userId,
        text: text
      }
    ]).select();

    if (!error) {
      // Increment count fallback
      supabase.from('posts').select('comments_count').eq('id', postId).single().then(({ data: postData }) => {
        if (postData) {
          supabase.from('posts').update({ comments_count: (postData.comments_count || 0) + 1 }).eq('id', postId).then();
        }
      });
    }

    return { data, error };
  },

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles!user_id(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  async checkIsFollowing(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
    
    return { isFollowing: !!data, error };
  },

  async toggleFollow(followerId: string, followingId: string) {
    const { isFollowing } = await this.checkIsFollowing(followerId, followingId);

    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
      return { isFollowing: false, error };
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }]);
      
      if (!error) {
        // Notify
        const { data: profileObj } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', followerId).maybeSingle();
        
        await notificationsService.createNotification({
          user_id: followingId,
          type: 'follow',
          title: 'New Follower',
          message: `${profileObj?.full_name || 'Someone'} started following you`,
          link: `/profile/${followerId}`,
          reference_id: followerId,
          metadata: {
            applicant_name: profileObj?.full_name,
            applicant_avatar: profileObj?.avatar_url
          }
        });
      }
      
      return { isFollowing: true, error };
    }
  }
};
