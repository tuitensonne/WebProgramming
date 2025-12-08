import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-travel-dark-bg py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[73px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Logo />
            <p className="text-[#EEE] font-manrope text-base font-medium leading-7 mb-6 mt-6">
              Travel helps companies manage payments easily.
            </p>
            <SocialIcons />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-manrope text-xl sm:text-[21px] font-bold mb-6 sm:mb-12">
              Company
            </h3>
            <ul className="flex flex-col gap-4 sm:gap-[18px]">
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-manrope text-xl sm:text-[21px] font-bold mb-6 sm:mb-12">
              Destinations
            </h3>
            <ul className="flex flex-col gap-3 sm:gap-[12px]">
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Maldives
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Los Angelas
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Las Vegas
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white font-manrope text-base font-medium hover:text-travel-orange transition-colors"
                >
                  Torronto
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-manrope text-xl sm:text-[21px] font-bold mb-6 sm:mb-12">
              Join Our Newsletter
            </h3>
            <div className="flex items-center mb-6 bg-white rounded-[10px] overflow-hidden h-[52px]">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 text-base font-manrope text-[#1A1010] placeholder:text-[#1A1010] placeholder:opacity-20 outline-none"
              />
              <button className="bg-travel-orange px-6 h-full text-white font-manrope text-base font-medium hover:bg-travel-orange-light transition-colors shadow-[0_20px_35px_0_rgba(223,105,81,0.15)]">
                Subscribe
              </button>
            </div>
            <p className="text-white font-manrope text-base font-medium opacity-50 leading-[26px]">
              * Will send you weekly updates for your better tour packages.
            </p>
          </motion.div>
        </div>

        <div className="w-full h-[2px] bg-[#E5E5EA] mb-8 sm:mb-10" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-white font-manrope text-base font-medium text-center"
        >
          Copyright @ Xpro 2022. All Rights Reserved.
        </motion.p>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className="relative w-[136px] h-[64px]">
      <h1 className="text-white font-volkhov text-[32px] font-bold capitalize">
        Travel
      </h1>
      <svg
        className="absolute left-[30px] top-[26px]"
        width="107"
        height="39"
        viewBox="0 0 107 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_536_6682)">
          <path
            d="M-5.39153e-06 15.0878C6.00063 23.0703 32.1079 31.016 49.6682 30.5173C68.649 30.0183 79.0432 26.5277 99.2792 13.6923C99.2205 15.0977 99.0422 16.2413 99.071 17.2846C99.0502 18.4748 99.0411 19.7331 99.312 20.8803C99.3703 21.2209 100.131 21.7369 100.581 21.7404C101.03 21.7439 101.678 21.1594 101.765 20.7973C102.519 17.334 103.127 13.8922 103.796 10.3716C103.974 9.22789 103.397 8.47517 102.099 8.31772C97.1721 7.92806 92.2338 7.4703 87.2459 7.15953C86.117 7.11676 84.8509 7.5831 83.3924 7.79854C85.06 10.555 87.6272 9.8267 89.6514 10.2959C91.7602 10.8224 93.9566 10.9868 96.6488 11.4272C91.2481 16.1355 85.5298 19.4243 79.2955 21.8815C56.4762 30.9783 33.806 29.5781 11.4854 20.1652C8.58052 18.9183 5.84781 17.3666 3.00418 16.0408C2.14375 15.8187 1.35623 15.5859 -5.39153e-06 15.0878Z"
            fill="#DF6951"
          />
        </g>
        <defs>
          <clipPath id="clip0_536_6682">
            <rect
              width="103.258"
              height="23.3913"
              fill="white"
              transform="matrix(0.989267 -0.146118 -0.168545 -0.985694 3.94248 38.1445)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="flex items-center gap-[19px]">
      <motion.a
        whileHover={{ scale: 1.1, y: -2 }}
        href="#"
        className="transition-transform"
      >
        <svg
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_536_6672)">
            <path
              d="M21.5137 20.0008V20H21.5191V12.665C21.5191 9.07667 20.6879 6.3125 16.1743 6.3125C14.0045 6.3125 12.5483 7.41917 11.9539 8.46833H11.8911V6.6475H7.61151V20H12.0677V13.3883C12.0677 11.6475 12.4228 9.96417 14.7424 9.96417C17.0279 9.96417 17.0619 11.9508 17.0619 13.5V20.0008H21.5137Z"
              fill="#DF6951"
            />
            <path
              d="M0.355278 6.64844H4.81689V20.0009H0.355278V6.64844Z"
              fill="#DF6951"
            />
            <path
              d="M2.58408 0C1.15754 0 0 1.07583 0 2.40167C0 3.7275 1.15754 4.82583 2.58408 4.82583C4.01061 4.82583 5.16815 3.7275 5.16815 2.40167C5.16726 1.07583 4.00971 0 2.58408 0V0Z"
              fill="#DF6951"
            />
          </g>
          <defs>
            <clipPath id="clip0_536_6672">
              <rect width="21.519" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </motion.a>

      <motion.a
        whileHover={{ scale: 1.1, y: -2 }}
        href="#"
        className="transition-transform"
      >
        <svg
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_536_6676)">
            <path
              d="M19.3079 5.9275C20.183 5.35 20.9191 4.62917 21.519 3.79917V3.79833C20.7183 4.12417 19.8665 4.34083 18.9771 4.44583C19.8916 3.93833 20.5901 3.14083 20.9182 2.18C20.0656 2.6525 19.1241 2.98583 18.1208 3.1725C17.3111 2.37083 16.1572 1.875 14.8983 1.875C12.4559 1.875 10.4896 3.7175 10.4896 5.97583C10.4896 6.30083 10.5192 6.61333 10.5918 6.91083C6.9246 6.74417 3.67882 5.11083 1.49822 2.62167C1.11805 3.23583 0.893894 3.93833 0.893894 4.69417C0.893894 6.11417 1.68024 7.3725 2.85392 8.10167C2.14469 8.08917 1.4498 7.8975 0.860719 7.59667V7.64167C0.860719 9.63417 2.38947 11.2892 4.39522 11.6708C4.03567 11.7625 3.64474 11.8058 3.23857 11.8058C2.95613 11.8058 2.67101 11.7908 2.40381 11.7358C2.97496 13.3592 4.59786 14.5533 6.5256 14.5925C5.02465 15.6833 3.11842 16.3408 1.05529 16.3408C0.693947 16.3408 0.346952 16.3258 -4.19617e-05 16.285C1.9546 17.4558 4.26969 18.125 6.76769 18.125C14.5531 18.125 19.6271 12.0883 19.3079 5.9275V5.9275Z"
              fill="#DF6951"
            />
          </g>
          <defs>
            <clipPath id="clip0_536_6676">
              <rect width="21.519" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </motion.a>

      <motion.a
        whileHover={{ scale: 1.1, y: -2 }}
        href="#"
        className="transition-transform"
      >
        <svg
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_536_6670)">
            <path
              d="M0 9.25917C0 12.1725 1.56372 14.7717 4.00882 16.4692V20L7.67243 18.1317C8.64975 18.3825 9.68536 18.5192 10.7586 18.5192C16.7006 18.5192 21.5181 14.3742 21.5181 9.26C21.519 4.14583 16.7015 0 10.7595 0C4.81757 0 0 4.145 0 9.25917H0ZM9.62439 6.66583L12.4308 9.38167L17.7093 6.66583L11.8274 12.4675L9.0882 9.7525L3.74162 12.4683L9.62439 6.66583Z"
              fill="#DF6951"
            />
          </g>
          <defs>
            <clipPath id="clip0_536_6670">
              <rect width="21.519" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </motion.a>

      <motion.a
        whileHover={{ scale: 1.1, y: -2 }}
        href="#"
        className="transition-transform"
      >
        <svg
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_536_6678)">
            <path
              d="M9.07098 14.0984C9.12836 14.0534 9.18664 14.0067 9.24044 13.9576C6.24481 16.6892 1.35999 15.4142 0.215001 11.5617V11.5559C-1.32092 6.31422 5.15541 2.33256 9.23865 5.99922C9.32383 6.08339 14.9645 11.6742 14.6058 11.3184H14.622C15.4639 12.1251 16.6815 12.0367 17.406 11.3317C18.1852 10.5751 18.213 9.34006 17.4482 8.57089C16.2404 7.27839 13.8688 8.24422 14.0957 10.1601L12.7382 8.87506L11.1637 7.47589C11.4883 6.87672 11.9142 6.35256 12.4477 5.89922C12.3903 5.94506 12.332 5.99256 12.2782 6.04006C15.2855 3.29839 20.1667 4.60339 21.3036 8.43922V8.44422C22.8432 13.6851 16.3597 17.6667 12.28 14.0001C12.1966 13.9167 6.55953 8.29089 6.91638 8.64756L6.9128 8.63506C6.89845 8.63506 6.89845 8.62256 6.89845 8.62256C6.01438 7.77506 4.81559 7.90256 4.11443 8.59672C3.33436 9.35339 3.30746 10.5884 4.07408 11.3459C5.22893 12.6084 7.65162 11.6726 7.42387 9.71839C7.51174 9.80256 10.5522 12.7034 10.3585 12.5192C9.86628 13.4317 9.31576 13.8509 9.07098 14.0984V14.0984Z"
              fill="#DF6951"
            />
          </g>
          <defs>
            <clipPath id="clip0_536_6678">
              <rect width="21.519" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </motion.a>
    </div>
  );
}
