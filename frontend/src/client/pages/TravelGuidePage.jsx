import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { Search, ArrowForward, KeyboardArrowDown } from "@mui/icons-material";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";

const REGION_LABELS = {
  all: "Tất cả khu vực",
  vietnam: "Trong nước",
  asia: "Châu Á",
  europe: "Châu Âu",
};

export default function TravelGuidePage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 6;

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get("/posts/regions");
        if (res.data?.success) {
          const data = res.data.data || [];
          const normalized = data
            .map((r) => {
              if (typeof r === "string") return r;
              if (r.region) return r.region;
              if (r.name) return r.name;
              return Object.values(r)[0];
            })
            .filter(Boolean);
          setRegions(normalized);
        } else {
          setRegions(["vietnam", "asia", "europe"]);
        }
      } catch {
        setRegions(["vietnam", "asia", "europe"]);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (region !== "all") params.append("region", region);
        params.append("sort", sort);
        params.append("page", currentPage);
        params.append("limit", limit);

        const res = await api.get(`/posts?${params.toString()}`);
        if (res.data?.success) {
          setGuides(res.data.data.posts || []);
          setTotal(res.data.data.total || 0);
          setTotalPages(res.data.data.pages || 1);
        } else {
          setGuides([]);
          setTotal(0);
          setTotalPages(1);
        }
      } catch {
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [search, region, sort, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading && guides.length === 0) return <LoadingComponent />;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            textAlign: "center",
            mb: { xs: 3, md: 4 },
            fontSize: { xs: "1.8rem", md: "2.2rem" },
          }}
        >
          Cẩm nang du lịch
        </Typography>

        {/* FILTER WRAPPER */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, md: 6 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            placeholder="Tìm theo tên bài viết..."
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: 220, md: 260 },
            }}
          />

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel>Khu vực</InputLabel>
            <Select
              value={region}
              label="Khu vực"
              onChange={handleRegionChange}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="all">{REGION_LABELS.all}</MenuItem>
              {regions.map((r) => (
                <MenuItem key={r} value={r}>
                  {REGION_LABELS[r] ?? r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={sort}
              label="Sắp xếp theo"
              onChange={handleSortChange}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="latest">Mới nhất</MenuItem>
              <MenuItem value="oldest">Cũ nhất</MenuItem>
              <MenuItem value="readTime">Thời gian đọc</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* RESULTS COUNT */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Tìm thấy <strong>{total}</strong> bài viết
          </Typography>
        </Box>

        {/* POSTS GRID */}
        {!loading && guides.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Chưa có cẩm nang nào phù hợp với tiêu chí tìm kiếm.
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gap: { xs: 3, md: 4 },
                mb: { xs: 4, md: 6 },
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(3, 1fr)",
                },
              }}
            >
              {guides.map((post) => (
                <Link
                  key={post.id}
                  to={`/travel-guides/${post.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 8px 28px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {(post.thumbnailUrl || post.image) && (
                      <CardMedia
                        component="img"
                        image={post.thumbnailUrl || post.image}
                        alt={post.title}
                        sx={{
                          height: { xs: 180, sm: 200, md: 220 },
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <CardContent sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "0.8rem", md: "0.875rem" },
                            color: "#5b5b5b",
                          }}
                        >
                          📍 {post.location || "Chưa xác định"}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "0.8rem", md: "0.875rem" },
                              color: "#5b5b5b",
                            }}
                          >
                            📅 {formatDate(post.createdAt)}
                          </Typography>

                          {post.readTime && (
                            <>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  bgcolor: "#767676",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                                  color: "#5b5b5b",
                                }}
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
                          mb: 1.5,
                          lineHeight: 1.3,
                          fontSize: { xs: "1rem", md: "1.15rem" },
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
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          mb: 2.5,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
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

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
