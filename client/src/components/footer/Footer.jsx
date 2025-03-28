import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-8 md:px-16 lg:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold text-primary">ManoVie</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Empowering mental well-being through AI-driven insights.
            </p>
          </div>

          {/* Navigation Links - Now Centered & Professional */}
          <div className="flex justify-center md:justify-center space-x-6 font-medium text-gray-600 dark:text-gray-300">
            <a href="#" className="hover:text-primary">
              Home
            </a>
            <a href="#" className="hover:text-primary">
              About
            </a>
            <a href="#" className="hover:text-primary">
              Features
            </a>
            <a href="#" className="hover:text-primary">
              Contact
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} ManoVie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
