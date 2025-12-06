// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   CardActions,
//   Button,
//   TextField,
//   MenuItem,
//   Container,
//   Pagination,
//   CircularProgress,
// } from "@mui/material";

// import { Search as SearchIcon } from "@mui/icons-material";
// import api from "../../api/api";
// import LoadingComponent from "../components/LoadingComponent";

// const TravelGuidePage = () => {
//   const navigate = useNavigate();
//   const [guides, setGuides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [locations, setLocations] = useState([]);

//   // Filter & Search state
//   const [search, setSearch] = useState("");
//   const [location, setLocation] = useState("");
//   const [sort, setSort] = useState("latest");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   const limit = 12;

//   // Fetch locations for filter dropdown
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const res = await api.get("/posts/locations");
//         if (res.data?.success) {
//           setLocations(res.data.data || []);
//         }
//       } catch (err) {
//         console.error("Error fetching locations:", err);
//       }
//     };
//     fetchLocations();
//   }, []);

//   // Fetch guides with filters
//   useEffect(() => {
//     const fetchGuides = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams();
//         if (search) params.append("search", search);
//         if (location) params.append("location", location);
//         params.append("sort", sort);
//         params.append("page", currentPage);
//         params.append("limit", limit);

//         const res = await api.get(`/posts?${params.toString()}`);
//         if (res.data?.success) {
//           setGuides(res.data.data.posts || []);
//           setTotal(res.data.data.total || 0);
//           setTotalPages(res.data.data.pages || 1);
//         } else {
//           console.error("Failed to fetch guides:", res.data);
//         }
//       } catch (err) {
//         console.error("Error fetching guides:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGuides();
//   }, [search, location, sort, currentPage]);

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (e) => {
//     setSort(e.target.value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (e, value) => {
//     setCurrentPage(value);
//     window.scrollTo(0, 0);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   if (loading && guides.length === 0) return <LoadingComponent />;

//   return (
//     <Box sx={{ py: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
//       <Container maxWidth="xl">
//         {/* Breadcrumb */}
//         <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             Trang chủ
//           </Typography>
//           <Typography variant="body2" sx={{ color: "text.secondary" }}>
//             /
//           </Typography>
//           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//             Cẩm nang du lịch
//           </Typography>
//         </Box>

//         {/* Title */}
//         <Typography
//           variant="h4"
//           sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}
//         >
//           Cẩm nang du lịch
//         </Typography>

//         {/* Filter & Search Section */}
//         <Box
//           sx={{
//             backgroundColor: "#fff",
//             p: 3,
//             borderRadius: 2,
//             mb: 4,
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             {/* Search */}
//             <Grid xs={12} sm={6} md={4}>
//               <TextField
//                 fullWidth
//                 placeholder="Tìm kiếm bài viết"
//                 value={search}
//                 onChange={handleSearchChange}
//                 size="small"
//                 InputProps={{
//                   startAdornment: (
//                     <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
//                   ),
//                 }}
//                 variant="outlined"
//               />
//             </Grid>

//             {/* Location Filter */}
//             <Grid xs={12} sm={6} md={4}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Địa điểm"
//                 value={location}
//                 onChange={handleLocationChange}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="">Tất cả địa điểm</MenuItem>
//                 {locations.map((loc) => (
//                   <MenuItem key={loc.location} value={loc.location}>
//                     {loc.location}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* Sort */}
//             <Grid xs={12} sm={6} md={4}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Sắp xếp theo"
//                 value={sort}
//                 onChange={handleSortChange}
//                 size="small"
//                 variant="outlined"
//               >
//                 <MenuItem value="latest">Mới nhất</MenuItem>
//                 <MenuItem value="oldest">Cũ nhất</MenuItem>
//                 <MenuItem value="readTime">Thời gian đọc</MenuItem>
//               </TextField>
//             </Grid>
//           </Grid>

//           {/* Results count */}
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" sx={{ color: "text.secondary" }}>
//               Tìm thấy <strong>{total}</strong> bài viết
//             </Typography>
//           </Box>
//         </Box>

//         {/* Posts Grid */}
//         {guides.length === 0 ? (
//           <Box sx={{ textAlign: "center", py: 6 }}>
//             <Typography variant="body1" sx={{ color: "text.secondary" }}>
//               Chưa có cẩm nang nào phù hợp với tiêu chí tìm kiếm.
//             </Typography>
//           </Box>
//         ) : (
//           <>
//             <Grid container spacing={3}>
//               {guides.map((guide) => (
//                 <Grid xs={12} sm={6} md={4} key={guide.id}>
//                   <Card
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//                         transform: "translateY(-4px)",
//                       },
//                     }}
//                   >
//                     {guide.thumbnailUrl && (
//                       <CardMedia
//                         component="img"
//                         height="200"
//                         image={guide.thumbnailUrl}
//                         alt={guide.title}
//                         sx={{ objectFit: "cover" }}
//                       />
//                     )}
//                     <CardContent sx={{ flexGrow: 1 }}>
//                       {/* Location Badge */}
//                       {guide.location && (
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             display: "inline-block",
//                             backgroundColor: "#e3f2fd",
//                             color: "#1976d2",
//                             px: 1.5,
//                             py: 0.5,
//                             borderRadius: 1,
//                             mb: 1,
//                           }}
//                         >
//                           📍 {guide.location}
//                         </Typography>
//                       )}

//                       {/* Title */}
//                       <Typography
//                         variant="h6"
//                         sx={{ mt: 1, mb: 1, fontWeight: 700 }}
//                       >
//                         {guide.title}
//                       </Typography>

//                       {/* Description */}
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "text.secondary",
//                           mb: 2,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {guide.description}
//                       </Typography>

//                       {/* Meta info: date & read time */}
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           pt: 1,
//                           borderTop: "1px solid #e0e0e0",
//                           mt: 1,
//                         }}
//                       >
//                         <Typography
//                           variant="caption"
//                           sx={{ color: "text.secondary" }}
//                         >
//                           📅 {formatDate(guide.createdAt)}
//                         </Typography>
//                         {guide.readTime && (
//                           <Typography
//                             variant="caption"
//                             sx={{ color: "text.secondary" }}
//                           >
//                             ⏱ {guide.readTime} phút
//                           </Typography>
//                         )}
//                       </Box>
//                     </CardContent>

//                     {/* Action Button */}
//                     <CardActions>
//                       <Button
//                         size="small"
//                         variant="contained"
//                         sx={{
//                           backgroundColor: "#ff6b35",
//                           color: "#fff",
//                           textTransform: "none",
//                           "&:hover": {
//                             backgroundColor: "#ff5722",
//                           },
//                         }}
//                         onClick={() => navigate(`/travel-guides/${guide.id}`)}
//                       >
//                         Xem chi tiết
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   mt: 6,
//                 }}
//               >
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size="large"
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default TravelGuidePage;

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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, ArrowForward, KeyboardArrowDown } from "@mui/icons-material";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";
import Thumbnail from "../components/Thumbnail";
import Breadcrumb from "../components/Breadcrump";
const posts = [
  {
    id: 1,
    location: "Mumbai, India",
    date: "Feb 27, 2023",
    readTime: "8 min read",
    title: "A Wonderful Journey to India",
    description:
      "I had always been interested in spirituality, so I decided to take a year-long journey to India to explore various religious practices and traditions.",
    image:
      "https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBpbmRpYSUyMGNpdHl8ZW58MXx8fHwxNzY0OTkyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    location: "Mumbai, India",
    date: "Feb 27, 2023",
    readTime: "8 min read",
    title: "A Wonderful Journey to India",
    description:
      "I had always been interested in spirituality, so I decided to take a year-long journey to India to explore various religious practices and traditions.",
    image:
      "https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBpbmRpYSUyMGNpdHl8ZW58MXx8fHwxNzY0OTkyODAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function TravelGuidePage() {
  const [currentSlide] = useState(0);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 6;

  // Fetch locations for filter dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/posts/locations");
        if (res.data?.success) {
          setLocations(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (location) params.append("location", location);
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
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [search, location, sort, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
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
      {/* Hero Section */}

      {/* <Thumbnail /> */}
      <Breadcrumb />
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

        <Box sx={{ display: "flex", gap: 3, mb: 6 }}>
          <TextField
            placeholder="Tìm kiếm nội dung..."
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
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Loại</InputLabel>
            <Select
              value={category}
              label="Loại"
              onChange={(e) => setCategory(e.target.value)}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="asia">Châu Á</MenuItem>
              <MenuItem value="europe">Châu Âu</MenuItem>
              <MenuItem value="america">Châu Mỹ</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={sortBy}
              label="Sắp xếp theo"
              onChange={(e) => setSortBy(e.target.value)}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="">Mới nhất</MenuItem>
              <MenuItem value="oldest">Cũ nhất</MenuItem>
              <MenuItem value="popular">Phổ biến</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Posts Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            mb: 6,
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/travel-guides/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: "32px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="491"
                  image={post.image}
                  alt={post.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ color: "#5b5b5b" }}>
                      {post.location}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ color: "#5b5b5b" }}>
                        {post.date}
                      </Typography>
                      <Box
                        sx={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          bgcolor: "#767676",
                        }}
                      />
                      <Typography sx={{ color: "#5b5b5b" }}>
                        {post.readTime}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      mb: 3,
                      lineHeight: 1.6,
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
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      Read Full Post
                    </Typography>
                    <ArrowForward />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
          <Pagination
            count={5}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </Box>
  );
}
