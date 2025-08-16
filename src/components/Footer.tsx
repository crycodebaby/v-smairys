// src/components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-gray-400 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Smairys Netz-Manufaktur. Alle Rechte
          vorbehalten.
        </p>
        {/* Links wie Impressum etc. kommen später hier rein */}
      </div>
    </footer>
  );
};

export default Footer;
