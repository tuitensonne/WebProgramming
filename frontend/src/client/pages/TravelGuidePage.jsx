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

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all"); // 'all' | 'vietnam' | 'asia' | 'europe'
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 6;

  // Fetch regions for filter dropdown
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        // Expect backend endpoint to be /posts/regions (controller.getRegions)
        const res = await api.get("/posts/regions");
        if (res.data?.success) {
          // Accept either array of strings ['vietnam','asia',...] or array of objects
          const data = res.data.data || [];
          // Normalize to array of region keys
          const normalized = data
            .map((r) => {
              if (typeof r === "string") return r;
              // if object like { region: 'vietnam' } or {name: 'vietnam'}
              if (r.region) return r.region;
              if (r.name) return r.name;
              // fallback: try first value
              return Object.values(r)[0];
            })
            .filter(Boolean);
          setRegions(normalized);
        } else {
          console.error("Failed to fetch regions:", res.data);
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
        // Optional fallback: you can hardcode regions if API not available
        setRegions(["vietnam", "asia", "europe"]);
      }
    };
    fetchRegions();
  }, []);

  // Fetch guides with filters
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (region && region !== "all") params.append("region", region);
        params.append("sort", sort);
        params.append("page", currentPage);
        params.append("limit", limit);

        const res = await api.get(`/posts?${params.toString()}`);
        if (res.data?.success) {
          setGuides(res.data.data.posts || []);
          setTotal(res.data.data.total || 0);
          setTotalPages(res.data.data.pages || 1);
        } else {
          console.error("Failed to fetch guides:", res.data);
          setGuides([]);
          setTotal(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
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
      {/* Filters */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            textAlign: "center",
            mb: 4,
          }}
        >
          Cẩm nang du lịch
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 6, flexWrap: "wrap" }}>
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
            sx={{ flex: 1, minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Khu vực</InputLabel>
            <Select
              value={region}
              label="Khu vực"
              onChange={handleRegionChange}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="all">{REGION_LABELS.all}</MenuItem>
              {/* Render from API regions (normalized) */}
              {regions.map((r) => (
                <MenuItem key={r} value={r}>
                  {REGION_LABELS[r] ?? r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
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

        {/* Results count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Tìm thấy <strong>{total}</strong> bài viết
          </Typography>
        </Box>

        {/* Posts Grid */}
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
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                },
                gap: 4,
                mb: 6,
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
                      <CardMedia
                        component="img"
                        height="250"
                        image={post.thumbnailUrl || post.image}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
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
                            📅 {formatDate(post.createdAt)}
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

            {/* Pagination */}
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
