import React from "react";

const Footer = () => {
  return (
    <footer className="footer text-center">
      <div className="container">
        <p className="mb-0">
           {new Date().getFullYear()} Scholarship Eligibility Checker — By Aryan Shinde 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
