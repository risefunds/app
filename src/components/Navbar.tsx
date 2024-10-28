import Image from "next/image";
import React from "react";


const Navbar = () => {
  return (
    <nav className="container pt-6">
      <div className="flex justify-between items-center">
        <Image src="/images/logo.jpeg" width={50} height={50} alt="logo" />
        <ul className="md:flex gap-8 items-center font-semibold text-[14px] hidden">
          <li>Home</li>
          <li>Explore</li>
          <li>Start Campaign</li>
          <li>FAQs</li>
          <li>Contact Us</li>
          <button className="bg-foreground text-black px-6 py-2 rounded-3xl">
            Login/SignUp
          </button>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;