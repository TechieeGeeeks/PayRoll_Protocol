"use client";
import { HomeIcon } from "lucide-react";

import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { navigation } = useSelector((state) => state.navigation);
  console.log(navigation);
  return (
    <footer className="bg-main fixed bottom-0 z-40 w-full border-t md:hidden p-4">
      <div className="grid grid-cols-3 md:hidden">
        <div className="w-full grid place-items-center">
          <HomeIcon />
          <div className="text-xs font-bold">Home</div>
        </div>
        <div className="w-full grid place-items-center">
          <HomeIcon />
          <div className="text-xs font-bold">Home</div>
        </div>
        <div className="w-full grid place-items-center">
          <HomeIcon />
          <div className="text-xs font-bold">Home</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
