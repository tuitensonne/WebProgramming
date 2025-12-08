import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight } from "lucide-react";

const travelCards = [
  {
    id: 1,
    title: "Fun Trip to the Pyramid of Giza, Egypt",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/07be1cb1af196ae7d415eaca768da054891bdc8d?width=960",
  },
  {
    id: 2,
    title: "Fun fact about Bay of Islands, New Zealand.",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/171a959a60bd0faafd7b28b4c618596adc0d9dba?width=960",
  },
  {
    id: 3,
    title: "Unmissable places to visit on your next Travel to Jamaica",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/7343dc1304ba514c6a6e641314a51b72c6556bda?width=960",
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-0 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0">
          {travelCards.map((card, index) => (
            <TravelCard key={card.id} card={card} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative -mt-8 sm:-mt-16 lg:-mt-32 z-20 flex justify-center px-4"
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}

function TravelCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className="relative h-[400px] sm:h-[500px] lg:h-[783px] overflow-hidden group cursor-pointer"
    >
      <img
        src={card.image}
        alt={card.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

      <div className="absolute bottom-8 sm:bottom-12 lg:bottom-24 left-4 sm:left-6 lg:left-10 right-4 sm:right-6 lg:right-10 flex justify-between items-end">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
          className="text-white font-urbanist text-2xl sm:text-3xl lg:text-[42px] font-semibold leading-tight max-w-[85%]"
        >
          {card.title}
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.1, rotate: -45 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[76px] lg:h-[76px] text-white flex-shrink-0" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function SearchBar() {
  return (
    <div className="w-full max-w-[470px] bg-white rounded-full shadow-lg flex items-center px-2 py-2 sm:px-3 sm:py-3 h-[60px] sm:h-[70px]">
      <div className="flex items-center flex-1 px-3 sm:px-6">
        <MapPin className="w-5 h-5 text-travel-dark flex-shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm du lịch"
          className="flex-1 ml-3 sm:ml-4 text-sm sm:text-[15px] text-travel-gray font-inter placeholder:text-gray-400 outline-none bg-transparent"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] bg-travel-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-shadow"
      >
        <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </motion.button>
    </div>
  );
}
