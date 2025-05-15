import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  Paper,
  useTheme,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreIcon,
  ThumbUp as LikeIcon,
  ThumbUpOutlined as LikeOutlinedIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';

const Comment = ({
  comment,
  currentUserId,
  onLike,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  maxDepth = 3,
  isReplying = false,
  onCancelReply,
  onSubmitReply
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReplies, setShowReplies] = useState(depth < 1);
  const [replyText, setReplyText] = useState('');

  // Check if comment is by current user
  const isCurrentUserComment = comment.user.id === currentUserId;

  // Format date
  const formattedDate = formatDistance(
    new Date(comment.created_at),
    new Date(),
    { addSuffix: true, locale: id }
  );

  // Handle menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle edit
  const handleEdit = () => {
    onEdit(comment.id);
    handleMenuClose();
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(comment.id);
    handleMenuClose();
  };

  // Handle reply
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSubmitReply(comment.id, replyText);
      setReplyText('');
    }
  };

  return (
    <Box sx={{ mt: depth === 0 ? 3 : 1 }}>
      <Box sx={{ display: 'flex', ml: depth * 3 }}>
        <Avatar
          src={comment.user.avatar}
          alt={comment.user.name}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between' 
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {comment.user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
            {isCurrentUserComment && (
              <Box>
                <IconButton 
                  size="small" 
                  onClick={handleMenuOpen} 
                  aria-label="more options"
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete}>Hapus</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </Typography>

          <Box sx={{ display: 'flex', mt: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => onLike(comment.id)} 
              color={comment.isLiked ? 'primary' : 'default'}
            >
              {comment.isLiked ? <LikeIcon fontSize="small" /> : <LikeOutlinedIcon fontSize="small" />}
            </IconButton>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              {comment.likes > 0 ? comment.likes : ''}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => onReply(comment.id)} 
              sx={{ ml: 1 }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Box>

          {isReplying && (
            <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tulis balasan..."
                variant="outlined"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onCancelReply} size="small">
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  size="small" 
                  variant="contained" 
                  disabled={!replyText.trim()}
                  startIcon={<SendIcon />}
                  sx={{ ml: 1 }}
                >
                  Kirim
                </Button>
              </Box>
            </Box>
          )}

          {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 1,
                  cursor: 'pointer'
                }}
                onClick={() => setShowReplies(!showReplies)}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  {showReplies ? 'Sembunyikan balasan' : `Lihat ${comment.replies.length} balasan`}
                </Typography>
                {showReplies ? 
                  <CollapseIcon fontSize="small" sx={{ ml: 0.5, color: theme.palette.primary.main }} /> : 
                  <ExpandIcon fontSize="small" sx={{ ml: 0.5, color: theme.palette.primary.main }} />
                }
              </Box>
              <Collapse in={showReplies}>
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onLike={onLike}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    isReplying={reply.id === isReplying}
                    onCancelReply={onCancelReply}
                    onSubmitReply={onSubmitReply}
                  />
                ))}
              </Collapse>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const CommentSection = ({
  comments,
  currentUserId,
  onSubmitComment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onSubmitReply,
  isLoading = false,
  sx = {}
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmitComment(commentText);
      setCommentText('');
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmitReply = (commentId, text) => {
    onSubmitReply(commentId, text);
    setReplyingTo(null);
  };

  return (
    <Box sx={{ mt: 4, ...sx }}>
      <Typography variant="h6" gutterBottom>
        Komentar ({comments.length})
      </Typography>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Tulis komentar..."
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!commentText.trim() || isLoading}
              startIcon={<SendIcon />}
            >
              Kirim Komentar
            </Button>
          </Box>
        </Box>
      </Paper>

      <List disablePadding>
        {comments.map((comment) => (
          <ListItem key={comment.id} disablePadding sx={{ display: 'block' }}>
            <Comment
              comment={comment}
              currentUserId={currentUserId}
              onLike={onLike}
              onReply={handleReply}
              onEdit={onEdit}
              onDelete={onDelete}
              isReplying={replyingTo === comment.id}
              onCancelReply={handleCancelReply}
              onSubmitReply={handleSubmitReply}
            />
            {comment !== comments[comments.length - 1] && (
              <Divider sx={{ my: 2 }} />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    isLiked: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired,
    replies: PropTypes.array
  }).isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLike: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  depth: PropTypes.number,
  maxDepth: PropTypes.number,
  isReplying: PropTypes.bool,
  onCancelReply: PropTypes.func,
  onSubmitReply: PropTypes.func
};

CommentSection.propTypes = {
  comments: PropTypes.array.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmitComment: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmitReply: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  sx: PropTypes.object
};

export default CommentSection;
