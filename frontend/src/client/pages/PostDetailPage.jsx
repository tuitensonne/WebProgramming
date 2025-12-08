import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  Send,
  ArrowForward,
} from "@mui/icons-material";
import LoadingComponent from "../components/LoadingComponent";
import api from "../../api/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  // Fetch bài viết
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setPost(null);
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/posts/${id}/comments`);
        const list = res.data.data || [];

        // Map dữ liệu từ backend sang format FE
        setComments(
          list.map((c) => ({
            id: c.id,
            author: c.userName || "Anonymous",
            avatar: c.userAvatar || "https://i.pravatar.cc/150?img=1",
            content: c.content,
            likes: c.likes || 0,
            date: formatDate(c.createdAt),
            userId: c.userId,
          }))
        );
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // Fetch related posts (2 random posts)
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Lấy 2 bài viết ngẫu nhiên, loại trừ bài hiện tại
        const res = await api.get(`/posts?limit=10&sort=latest`);
        if (res.data?.success) {
          const allPosts = res.data.data.posts || [];
          // Lọc bỏ bài viết hiện tại
          const filtered = allPosts.filter((p) => p.id !== parseInt(id));
          // Shuffle và lấy 2 bài
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setRelatedPosts(shuffled.slice(0, 2));
        }
      } catch (error) {
        console.error("Error loading related posts:", error);
      }
    };

    if (id) {
      fetchRelatedPosts();
    }
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const formatDateFull = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Thêm comment mới
  const handleAddComment = async () => {
    if (!user) {
      alert("Bạn phải đăng nhập để bình luận!");
      return;
    }

    if (!newComment.trim()) {
      alert("Nội dung bình luận không được để trống!");
      return;
    }

    try {
      const res = await api.post(`/posts/${id}/comments`, {
        userId: user.id,
        content: newComment.trim(),
      });

      if (res.data.success) {
        // Tạo comment mới để thêm vào danh sách
        const addedComment = {
          id: Date.now(), // Temporary ID, sẽ được replace khi refresh
          author: user.fullName || user.fullname || "User",
          avatar: user.avatarUrl || "https://i.pravatar.cc/150?img=2",
          content: newComment.trim(),
          likes: 0,
          date: "Vừa xong",
          userId: user.id,
        };

        setComments([addedComment, ...comments]);
        setNewComment("");

        // Optional: Refresh comments sau 1s để lấy ID thật từ server
        setTimeout(async () => {
          try {
            const refreshRes = await api.get(`/posts/${id}/comments`);
            const list = refreshRes.data.data || [];
            setComments(
              list.map((c) => ({
                id: c.id,
                author: c.userName || "Anonymous",
                avatar: c.userAvatar || "https://i.pravatar.cc/150?img=1",
                content: c.content,
                likes: c.likes || 0,
                date: formatDate(c.createdAt),
                userId: c.userId,
              }))
            );
          } catch (err) {
            console.error("Error refreshing comments:", err);
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Error submitting comment", err);
      alert(
        err.response?.data?.message ||
          "Không thể thêm bình luận. Vui lòng thử lại!"
      );
    }
  };

  // Like comment
  const handleLikeComment = async (commentId) => {
    // Kiểm tra đã like chưa (client-side tracking)
    if (likedComments.includes(commentId)) {
      alert("Bạn đã thích comment này rồi!");
      return;
    }

    try {
      const res = await api.patch(`/comments/${commentId}/like`);

      if (res.data.success) {
        // Cập nhật UI
        setLikedComments([...likedComments, commentId]);

        // Cập nhật số like trong danh sách comments
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          )
        );
      }
    } catch (err) {
      console.error("Error liking comment", err);
      alert("Không thể thích comment. Vui lòng đăng nhập để tiếp tục!");
    }
  };

  if (isLoading) return <LoadingComponent />;

  if (!post && !isLoading) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography>Không tìm thấy bài viết.</Typography>
        <Button component={Link} to="/travel-guides" sx={{ mt: 2 }}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button & Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Link to="/travel-guides" style={{ textDecoration: "none" }}>
            <Button
              startIcon={<ArrowBack />}
              sx={{ color: "#5b5b5b", textTransform: "none", mb: 2 }}
            >
              Quay lại
            </Button>
          </Link>
          <Breadcrumbs>
            <Link to="/" style={{ textDecoration: "none", color: "#5b5b5b" }}>
              Trang chủ
            </Link>
            <Link
              to="/travel-guides"
              style={{ textDecoration: "none", color: "#5b5b5b" }}
            >
              Cẩm nang du lịch
            </Link>
            <Typography color="primary">Chi tiết bài viết</Typography>
          </Breadcrumbs>
        </Box>

        {/* Main Content Card */}
        <Card sx={{ borderRadius: "24px", overflow: "hidden", mb: 4 }}>
          {/* Featured Image */}
          <Box
            component="img"
            src={post.thumbnailUrl}
            alt={post.title}
            sx={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
            }}
          />

          <CardContent sx={{ p: 4 }}>
            {/* Meta Info */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ color: "#5b5b5b" }}>
                  {post.location}
                </Typography>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "#767676",
                  }}
                />
                <Typography sx={{ color: "#5b5b5b" }}>
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "#767676",
                  }}
                />
                <Typography sx={{ color: "#5b5b5b" }}>
                  {post.readTime} phút đọc
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={() => setLiked(!liked)} color="primary">
                  {liked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton
                  onClick={() => setBookmarked(!bookmarked)}
                  color="primary"
                >
                  {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <IconButton color="primary">
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                mb: 3,
              }}
            >
              {post.title}
            </Typography>

            {/* Content */}
            <Box sx={{ mb: 6 }}>
              {post.content.split("\n\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <Typography
                      key={index}
                      sx={{
                        mb: 2.5,
                        lineHeight: 1.8,
                        color: "#333",
                        fontSize: "1.1rem",
                      }}
                    >
                      {paragraph.trim()}
                    </Typography>
                  )
              )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Comments Section */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Bình luận ({comments.length})
              </Typography>

              {/* Add Comment */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Avatar src={user?.avatarUrl} sx={{ width: 40, height: 40 }}>
                  {user?.fullName?.[0] || user?.fullname?.[0] || "U"}
                </Avatar>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={
                    user
                      ? "Viết bình luận của bạn..."
                      : "Đăng nhập để bình luận..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                  disabled={!user}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleAddComment}
                  disabled={!user || !newComment.trim()}
                  sx={{
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Gửi bình luận
                </Button>
              </Box>

              {/* Comments List */}
              {comments.length === 0 ? (
                <Typography
                  sx={{ textAlign: "center", color: "#5b5b5b", py: 4 }}
                >
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {comments.map((comment) => (
                    <Card
                      key={comment.id}
                      variant="outlined"
                      sx={{
                        borderRadius: "16px",
                        p: 2,
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          src={comment.avatar}
                          sx={{ width: 48, height: 48 }}
                        >
                          {comment.author[0]}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>
                                {comment.author}
                              </Typography>
                              <Typography
                                sx={{ color: "#5b5b5b", fontSize: "0.85rem" }}
                              >
                                {comment.date}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => handleLikeComment(comment.id)}
                              sx={{
                                color: likedComments.includes(comment.id)
                                  ? "#4169E1"
                                  : "#5b5b5b",
                              }}
                            >
                              {likedComments.includes(comment.id) ? (
                                <Favorite fontSize="small" />
                              ) : (
                                <FavoriteBorder fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                          <Typography sx={{ color: "#333", lineHeight: 1.6 }}>
                            {comment.content}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#5b5b5b",
                              fontSize: "0.85rem",
                              mt: 1,
                            }}
                          >
                            {comment.likes} lượt thích
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                mb: 3,
              }}
            >
              Có thể bạn quan tâm
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 4,
                mb: 6,
              }}
            >
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/travel-guides/${post.id}`}
                  style={{ textDecoration: "none" }}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Card
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {(post.thumbnailUrl || post.image) && (
                      <Box
                        component="img"
                        src={post.thumbnailUrl || post.image}
                        alt={post.title}
                        sx={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{ color: "#5b5b5b", fontSize: "0.875rem" }}
                        >
                          📍 {post.location || "Chưa xác định"}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            sx={{ color: "#5b5b5b", fontSize: "0.875rem" }}
                          >
                            📅 {formatDateFull(post.createdAt)}
                          </Typography>
                          {post.readTime && (
                            <>
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  bgcolor: "#767676",
                                }}
                              />
                              <Typography
                                sx={{ color: "#5b5b5b", fontSize: "0.875rem" }}
                              >
                                ⏱ {post.readTime} phút
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Urbanist', sans-serif",
                          fontWeight: 700,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#000",
                          mb: 3,
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "0.9rem",
                        }}
                      >
                        {post.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#4169E1",
                          cursor: "pointer",
                          mt: "auto",
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>
                          Xem chi tiết
                        </Typography>
                        <ArrowForward fontSize="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
