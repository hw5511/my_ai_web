import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAuth } from '../../contexts/AuthContext';
import ImageSlider from './ImageSlider';

/**
 * FeedItem 컴포넌트
 *
 * 타임라인의 개별 게시물 카드
 *
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {function} onLike - 좋아요 토글 함수 [Optional]
 * @param {function} onSave - 저장 토글 함수 [Optional]
 * @param {function} onDelete - 삭제 함수 [Optional]
 */
function FeedItem({ post, onLike, onSave, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const isOwner = user?.id === post.user?.id;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id, !isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post.id, !isSaved);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(post.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.user?.nickname}님의 게시물`,
          url: `${window.location.origin}/post/${post.id}`,
        });
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 0, boxShadow: 'none', borderBottom: '1px solid', borderColor: 'divider' }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user?.profile_image}
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.user?.id}`)}
          >
            {post.user?.nickname?.[0]}
          </Avatar>
        }
        action={
          <IconButton onClick={handleMenuOpen}>
            <MoreHorizIcon />
          </IconButton>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${post.user?.id}`)}
            >
              {post.user?.nickname}
            </Typography>
            {post.location && (
              <Typography variant="caption" color="text.secondary">
                {post.location}
              </Typography>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isOwner && <MenuItem onClick={() => { handleMenuClose(); navigate(`/post/${post.id}/edit`); }}>수정</MenuItem>}
        {isOwner && <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>삭제</MenuItem>}
        <MenuItem onClick={handleMenuClose}>신고</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleShare(); }}>링크 복사</MenuItem>
      </Menu>

      {post.images && post.images.length > 0 && (
        <ImageSlider images={post.images} />
      )}

      <CardActions disableSpacing sx={{ px: 2 }}>
        <IconButton onClick={handleLike} sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={() => navigate(`/post/${post.id}`)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton onClick={handleShare}>
          <ShareOutlinedIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleSave}>
          {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>

      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          좋아요 {likeCount}개
        </Typography>

        {post.caption && (
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 1 }}>
              {post.user?.nickname}
            </Typography>
            <Typography variant="body2" component="span">
              {post.caption}
            </Typography>
          </Box>
        )}

        {post.commentCount > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: 'pointer', mb: 0.5 }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            댓글 {post.commentCount}개 모두 보기
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {formatTime(post.created_at)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default FeedItem;
