import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Home,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const blogArticles = [
  {
    id: 1,
    location: "Mumbai, India",
    date: "Feb 27, 2023",
    readTime: "8 min read",
    title: "A Wonderful Journey to India",
    excerpt:
      "I had always been interested in spirituality, so I decided to take a year-long journey to India to explore various religious practices and traditions.",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/744fa14f7fa6d105a54363f3a9ac797bdfa07b4e?width=1262",
  },
  {
    id: 2,
    location: "Mumbai, India",
    date: "Feb 27, 2023",
    readTime: "8 min read",
    title: "A Wonderful Journey to India",
    excerpt:
      "I had always been interested in spirituality, so I decided to take a year-long journey to India to explore various religious practices and traditions.",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/d5503118f1825236f1674e8a244a1d6cfde3c968?width=1488",
  },
];

export default function BlogSection() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[60px]">
        <Breadcrumb />
        <SearchAndFilters />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-travel-dark font-inter text-2xl sm:text-[29px] font-bold text-center mb-8 sm:mb-12 lg:mb-16"
        >
          Cẩm nang du lịch
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[58px] mb-12 lg:mb-20">
          {blogArticles.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>

        <Pagination />
      </div>
    </section>
  );
}

function Breadcrumb() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-8 sm:mb-12 py-4 px-4 sm:px-8 lg:px-14 bg-gray-100 rounded-lg shadow-sm max-w-fit"
    >
      <Home className="w-6 h-6 text-gray-700" />
      <ChevronRight className="w-6 h-6 text-gray-700" />
      <span className="text-gray-700 font-inter text-lg sm:text-xl font-semibold">
        Cẩm nang du lịch
      </span>
    </motion.div>
  );
}

function SearchAndFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <h3 className="text-black font-urbanist text-lg font-medium mb-4">
          Tìm kiếm
        </h3>
        <div className="flex items-center gap-3 px-6 py-4 rounded-full border border-travel-gray-lighter">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết"
            className="flex-1 text-base font-urbanist text-travel-gray-lighter placeholder:text-travel-gray-lighter outline-none bg-transparent"
          />
          <Search className="w-6 h-6 text-travel-orange flex-shrink-0" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-1"
      >
        <h3 className="text-black font-urbanist text-lg font-medium mb-4">
          Lọc
        </h3>
        <button className="w-full flex items-center justify-between px-6 py-4 rounded-full border border-travel-gray-lighter hover:border-travel-orange transition-colors">
          <span className="text-base font-urbanist text-black">Tất cả</span>
          <ChevronDown className="w-7 h-7 text-black" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-1"
      >
        <h3 className="text-black font-urbanist text-lg font-medium mb-4">
          Sắp xếp theo
        </h3>
        <button className="w-full flex items-center justify-between px-6 py-4 rounded-full border border-travel-gray-lighter hover:border-travel-orange transition-colors">
          <span className="text-base font-urbanist text-black">Mới nhất</span>
          <ChevronDown className="w-7 h-7 text-black" />
        </button>
      </motion.div>
    </div>
  );
}

function BlogCard({ article, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex flex-col group cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full aspect-[631/491] rounded-[32px] overflow-hidden mb-7"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </motion.div>

      <div className="flex flex-col gap-6 sm:gap-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-travel-gray font-urbanist text-xl sm:text-2xl font-medium">
                {article.location}
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-travel-gray font-urbanist text-xl sm:text-2xl font-medium">
                  {article.date}
                </span>
                <div className="w-[11px] h-[11px] rounded-full bg-[#767676]" />
                <span className="text-travel-gray font-urbanist text-xl sm:text-2xl font-medium">
                  {article.readTime}
                </span>
              </div>
            </div>

            <h3 className="text-black font-urbanist text-2xl sm:text-4xl font-bold leading-tight group-hover:text-travel-orange transition-colors">
              {article.title}
            </h3>
          </div>

          <p className="text-black font-urbanist text-xl sm:text-2xl font-medium leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-4 text-travel-blue font-urbanist text-xl sm:text-2xl font-semibold hover:gap-6 transition-all duration-300"
        >
          Read Full Post
          <motion.div
            whileHover={{ rotate: 45 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="w-7 h-7 text-travel-blue" />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
}

function Pagination() {
  const pages = [1, 2, 3, 4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-4"
    >
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 24L11 16L19 8L20.8667 9.86667L14.7333 16L20.8667 22.1333L19 24Z"
            fill="#5B5B5B"
          />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        {pages.map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-[58px] h-[57px] rounded-lg flex items-center justify-center font-urbanist text-2xl font-bold transition-colors ${
              page === 1
                ? "bg-travel-blue text-white"
                : "border border-travel-gray text-travel-gray hover:border-travel-blue hover:text-travel-blue"
            }`}
          >
            {page}
          </motion.button>
        ))}

        <button className="w-[58px] h-[57px] rounded-lg border border-travel-gray flex items-center justify-center gap-1 hover:border-travel-blue transition-colors">
          <div className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
          <div className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
          <div className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
        </button>
      </div>

      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 24L21 16L13 8L11.1333 9.86667L17.2667 16L11.1333 22.1333L13 24Z"
            fill="#5B5B5B"
          />
        </svg>
      </button>
    </motion.div>
  );
}
