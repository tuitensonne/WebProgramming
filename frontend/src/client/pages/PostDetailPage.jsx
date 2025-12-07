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
  Chip,
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
} from "@mui/icons-material";
import LoadingComponent from "../components/LoadingComponent";
import api from "../../api/api";

const initialComments = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    date: "2 days ago",
    content:
      "What an incredible journey! Your description of the Golden Temple really resonates with me. I had a similar experience there last year.",
    likes: 12,
  },
  {
    id: 2,
    author: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=8",
    date: "3 days ago",
    content:
      "Thank you for sharing this. I'm planning a trip to India next month and your insights are invaluable!",
    likes: 8,
  },
  {
    id: 3,
    author: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?img=9",
    date: "5 days ago",
    content:
      "As an Indian, it makes me so happy to see how much you appreciated our culture and spirituality. Welcome back anytime!",
    likes: 25,
  },
];

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  // const handleAddComment = () => {
  //   if (!newComment.trim()) return;

  //   const newCmt = {
  //     id: comments.length + 1,
  //     author: "User",
  //     avatar: "https://i.pravatar.cc/150?img=2",
  //     date: "Just now",
  //     content: newComment,
  //     likes: 0,
  //   };
  //   setComments([newCmt, ...comments]);
  //   setNewComment("");
  // };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comment-post/${id}`);
        setComments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };

    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!user) {
      alert("Bạn phải đăng nhập để bình luận!");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/comment-post/${id}`, {
        userId: user.id,
        content: newComment,
      });

      // Lấy comment vừa tạo để append vào danh sách
      const addedComment = {
        id: res.data.data.id,
        author: user.fullname || "User",
        avatar: user.avatarUrl || "",
        date: "Vừa xong",
        content: newComment,
        likes: 0,
      };

      setComments([addedComment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  const handleLikeComment = (commentId) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter((id) => id !== commentId));
    } else {
      setLikedComments([...likedComments, commentId]);
    }
  };

  // --- Fetch bài viết
  useEffect(() => {
    const fetchPost = async () => {
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

  if (isLoading) return <LoadingComponent />;

  if (!post)
    return (
      <Container sx={{ py: 5 }}>
        <Typography>Không tìm thấy bài viết.</Typography>
      </Container>
    );

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

            {/* Author */}
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                src={postData.authorAvatar}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {postData.author}
                </Typography>
                <Typography sx={{ color: "#5b5b5b", fontSize: "0.9rem" }}>
                  Travel Blogger
                </Typography>
              </Box>
            </Box> */}

            {/* Tags */}
            {/* <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
              {postData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box> */}

            {/* <Divider sx={{ mb: 4 }} /> */}

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
                <Avatar sx={{ width: 40, height: 40 }}>U</Avatar>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Viết bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Gửi bình luận
                </Button>
              </Box>

              {/* Comments List */}
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
                      />
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
                          {comment.likes +
                            (likedComments.includes(comment.id) ? 1 : 0)}{" "}
                          lượt thích
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            mb: 3,
          }}
        >
          Bài viết liên quan
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            mb: 6,
          }}
        >
          {[1, 2].map((item) => (
            <Link
              key={item}
              to={`/travel-guides/${item + 1}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?w=400"
                  alt="Related post"
                  sx={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography
                    sx={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    A Wonderful Journey to India
                  </Typography>
                  <Typography
                    sx={{ color: "#5b5b5b", fontSize: "0.9rem", mt: 1 }}
                  >
                    Feb 27, 2023 • 8 min read
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
