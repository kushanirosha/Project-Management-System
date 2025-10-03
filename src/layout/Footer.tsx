import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t  py-4 text-center text-sm text-gray-600 bg-white">
      <p>
        © {new Date().getFullYear()} All rights reserved | Powered by{" "}
        <a
          href="https://www.ceylonecreative.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Ceylone Creative (Pvt) Ltd
        </a>
      </p>
    </footer>
  );
};

export default Footer;
