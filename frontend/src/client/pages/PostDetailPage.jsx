import { useState } from "react";
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

const postData = {
  id: 1,
  location: "Mumbai, India",
  date: "Feb 27, 2023",
  readTime: "8 min read",
  title: "A Wonderful Journey to India",
  author: "John Doe",
  authorAvatar: "https://i.pravatar.cc/150?img=12",
  image:
    "https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBpbmRpYSUyMGNpdHl8ZW58MXx8fHwxNzY0OTkyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  tags: ["Travel", "India", "Spirituality", "Culture"],
  content: `
    I had always been interested in spirituality, so I decided to take a year-long journey to India to explore various religious practices and traditions.

    My journey began in the holy city of Varanasi, where I witnessed the daily rituals along the Ganges River. The sight of pilgrims bathing in the sacred waters at sunrise was truly mesmerizing. I spent weeks here, learning about Hindu philosophy and meditation practices from local priests and spiritual teachers.

    From Varanasi, I traveled south to Rishikesh, nestled in the foothills of the Himalayas. This yoga capital of the world offered me the perfect environment to deepen my practice. I attended daily yoga classes at various ashrams and learned about different meditation techniques.

    The Golden Temple in Amritsar was my next stop. The Sikh community's hospitality and their practice of serving free meals to thousands of people daily, regardless of their faith or background, left a profound impact on me. It was a beautiful example of selfless service and equality.

    As I journeyed through different regions, I discovered that India's spiritual wealth lies not just in its temples and rituals, but in the everyday lives of its people. The warmth of strangers, the vibrant festivals, the colorful markets, and the delicious street food all contributed to my transformative experience.

    My year in India taught me that spirituality isn't confined to religious places. It's in the simple acts of kindness, in the connections we make with others, and in our ability to find peace within ourselves regardless of our external circumstances.

    This journey changed my perspective on life and helped me understand that true fulfillment comes from within. India, with all its chaos and beauty, showed me that the path to self-discovery is as important as the destination itself.
  `,
};

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
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState([]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Current User",
        avatar: "https://i.pravatar.cc/150?img=1",
        date: "Just now",
        content: newComment,
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter((id) => id !== commentId));
    } else {
      setLikedComments([...likedComments, commentId]);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button & Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
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
            <Link to="/" style={{ textDecoration: "none", color: "#5b5b5b" }}>
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
            src={postData.image}
            alt={postData.title}
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
                  {postData.location}
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
                  {postData.date}
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
                  {postData.readTime}
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
              {postData.title}
            </Typography>

            {/* Author */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
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
            </Box>

            {/* Tags */}
            <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
              {postData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Content */}
            <Box sx={{ mb: 6 }}>
              {postData.content.split("\n\n").map(
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
