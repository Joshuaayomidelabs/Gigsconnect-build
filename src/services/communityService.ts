import { supabase } from './supabaseClient';
import { notificationsService } from './notificationsService';

export const communityService = {
  async getFeed(userId?: string) {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*, profiles(*), _likes:likes(count), _comments:comments(count)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return { data: null, error: postsError };
    }

    let userLikedPostIds = new Set<string>();

    if (userId) {
      const { data: likesRes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);
        
      if (likesRes) {
        userLikedPostIds = new Set(likesRes.map(l => l.post_id));
      }
    }

    const processedPosts = (posts || []).map(post => ({
      ...post,
      user: post.profiles,
      likes_count: post._likes?.[0]?.count || post.likes_count || 0,
      comments_count: post._comments?.[0]?.count || post.comments_count || 0,
      is_liked: userLikedPostIds.has(post.id)
    }));

    return { data: processedPosts, error: null };
  },

  async getUserPosts(userId: string, currentUserId?: string) {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, profiles(*), _likes:likes(count), _comments:comments(count)')
      .is('deleted_at', null)
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
      user: post.profiles,
      likes_count: post._likes?.[0]?.count || post.likes_count || 0,
      comments_count: post._comments?.[0]?.count || post.comments_count || 0,
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
    console.log(`[deletePost] Executing soft delete on posts table...`);
    // Instead of real deletion, we set deleted_at
    const { data, error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)
      .select(); // Add select to verify the row was actually updated

    if (error) {
      console.error("[deletePost] Error deleting post:", error);
      return { error };
    } 
    
    if (!data || data.length === 0) {
      console.warn("[deletePost] RLS ISSUE: Post was not deleted! (Could be missing permissions or post already deleted)");
      return { data: null, error: new Error('Post could not be deleted from the database. Make sure you have permissions or the post exists.') };
    }

    console.log(`[deletePost] Delete command successful. Soft-deleted rows:`, data.length);
    return { data, error: null };
  },

  async toggleLike(postId: string, userId: string, postOwnerId: string) {
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (existingLike) {
      // UNLIKE (DELETE)
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error unliking post:", error);
      } else {
        // Fallback: manually update the post count as trigger may not exist
        supabase.from('posts').select('likes_count').eq('id', postId).single().then(({ data }) => {
          if (data) supabase.from('posts').update({ likes_count: Math.max(0, (data.likes_count || 1) - 1) }).eq('id', postId).then();
        });
      }

      return { liked: false, error };
    } else {
      // LIKE (INSERT)
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
      
      if (error) {
        console.error("Error liking post:", error);
      } else {
        // Fallback: manually update the post count as trigger may not exist
        supabase.from('posts').select('likes_count').eq('id', postId).single().then(({ data }) => {
          if (data) supabase.from('posts').update({ likes_count: (data.likes_count || 0) + 1 }).eq('id', postId).then();
        });

        // Notify
        if (userId !== postOwnerId) {
          notificationsService.createNotification({
            user_id: postOwnerId,
            type: 'system',
            title: 'New Like',
            message: 'Someone liked your post',
            reference_id: postId,
          }).catch(console.error);
        }
      }

      return { liked: true, error };
    }
  },

  async addComment(post_id: string, userId: string, content: string, parentId?: string | null) {
    try {
      console.log("STEP 1: function started");
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      console.log("USER:", user);
      console.log("USER ERROR:", userError);

      if (!user) {
        console.error("NO USER LOGGED IN");
        return { data: null, error: new Error("No user logged in") };
      }

      console.log("PAYLOAD:", { post_id, user_id: user.id, content, parent_id: parentId });

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id,
          user_id: user.id,
          content,
          ...(parentId ? { parent_id: parentId } : {})
        })
        .select();

      console.log("SUPABASE RESPONSE DATA:", data);
      console.log("SUPABASE ERROR:", error);

      if (error) {
        console.error("Error adding comment:", error);
      } else {
        // Fallback: manually update the post count as trigger may not exist
        supabase.from('posts').select('comments_count').eq('id', post_id).single().then(({ data: postData }) => {
          if (postData) {
            supabase.from('posts').update({ comments_count: (postData.comments_count || 0) + 1 }).eq('id', post_id).then();
          }
        });
      }

      return { data, error };
    } catch (err: any) {
      console.error("CATCH ERROR:", err);
      return { data: null, error: err };
    }
  },

  async editComment(commentId: string, newContent: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content: newContent })
        .eq('id', commentId)
        .select();
      return { data, error };
    } catch (err: any) {
      console.error("Error editing comment:", err);
      return { data: null, error: err };
    }
  },

  async deleteComment(commentId: string, postId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error("Error deleting comment:", error);
      } else {
        // Fallback: manually update the post count as trigger may not exist
        supabase.from('posts').select('comments_count').eq('id', postId).single().then(({ data: postData }) => {
          if (postData) {
            supabase.from('posts').update({ comments_count: Math.max(0, (postData.comments_count || 1) - 1) }).eq('id', postId).then();
          }
        });
      }

      return { error };
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      return { error: err };
    }
  },

  async likeComment(commentId: string, userId: string) {
    try {
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase.from('comment_likes').delete().eq('id', existingLike.id);
        return { liked: false, error };
      } else {
        const { error } = await supabase.from('comment_likes').insert({ user_id: userId, comment_id: commentId });
        return { liked: true, error };
      }
    } catch (e) {
      return { liked: false, error: e };
    }
  },

  async getComments(postId: string, currentUserId?: string) {
    let res: { data: any, error: any } = { data: null, error: null };
    try {
      res = await supabase
        .from('comments')
        .select('*, user:profiles!user_id(*), _comment_likes:comment_likes(count)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    } catch (e) {
      res = { data: null, error: e };
    }

    // Fallback if the comment_likes or parent_id columns don't exist yet
    if (res.error) {
      try {
        res = await supabase
          .from('comments')
          .select('*, user:profiles!user_id(*)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
      } catch (e) {
        res = { data: null, error: e };
      }
    }

    let userLikedComments = new Set<string>();
    if (!res.error && currentUserId) {
      try {
        const { data: likesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', currentUserId);
        
        if (likesData) {
          likesData.forEach((like: any) => userLikedComments.add(like.comment_id));
        }
      } catch (e) {
        // ignore if table doesn't exist
      }
    }

    const processedData = res.data?.map((comment: any) => ({
      ...comment,
      likes_count: comment._comment_likes?.[0]?.count || 0,
      is_liked: userLikedComments.has(comment.id)
    })) || [];

    return { data: processedData, error: res.error };
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
        .insert({ follower_id: followerId, following_id: followingId });
      
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
