import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MainLayout from '../components/common/MainLayout';
import FeedItem from '../components/ui/FeedItem';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * HomePage 컴포넌트
 *
 * 메인페이지 (피드/타임라인)
 * - 팔로잉하는 사용자들의 게시물 표시
 * - 게시물 좋아요, 저장, 삭제 기능
 */
function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // 모든 게시물을 최신순으로 표시 (전체 타임라인)
      const { data: postsData, error } = await supabase
        .from('sns_posts')
        .select(`
          *,
          user:sns_users(id, nickname, profile_image),
          images:sns_post_images(id, image_url, display_order)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          const { count: likeCount } = await supabase
            .from('sns_likes')
            .select('*', { count: 'exact', head: true })
            .eq('target_type', 'post')
            .eq('target_id', post.id);

          const { count: commentCount } = await supabase
            .from('sns_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          let isLiked = false;
          let isSaved = false;

          if (user) {
            const { data: likeData } = await supabase
              .from('sns_likes')
              .select('id')
              .eq('user_id', user.id)
              .eq('target_type', 'post')
              .eq('target_id', post.id)
              .maybeSingle();

            isLiked = !!likeData;

            const { data: savedData } = await supabase
              .from('sns_saved_posts')
              .select('id')
              .eq('user_id', user.id)
              .eq('post_id', post.id)
              .maybeSingle();

            isSaved = !!savedData;
          }

          return {
            ...post,
            likeCount: likeCount || 0,
            commentCount: commentCount || 0,
            isLiked,
            isSaved,
            images: post.images?.sort((a, b) => a.display_order - b.display_order) || [],
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, liked) => {
    if (!user) return;

    try {
      if (liked) {
        await supabase
          .from('sns_likes')
          .insert({ user_id: user.id, target_type: 'post', target_id: postId });
      } else {
        await supabase
          .from('sns_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('target_type', 'post')
          .eq('target_id', postId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async (postId, saved) => {
    if (!user) return;

    try {
      if (saved) {
        await supabase
          .from('sns_saved_posts')
          .insert({ user_id: user.id, post_id: postId });
      } else {
        await supabase
          .from('sns_saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return;

    try {
      await supabase.from('sns_posts').delete().eq('id', postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              게시물이 없습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              다른 사용자를 팔로우하거나 첫 게시물을 올려보세요!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <FeedItem
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>
    </MainLayout>
  );
}

export default HomePage;
