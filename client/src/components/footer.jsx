"use client";
import { setNavigation } from "@/redux/slices/navigationSlice";
import { HomeIcon } from "lucide-react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbSmartHome } from "react-icons/tb";
import { PiHandDepositFill } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import { PiHandDepositDuotone } from "react-icons/pi";
import { PiHandWithdrawDuotone } from "react-icons/pi";
import { IoCardOutline } from "react-icons/io5";

const Footer = () => {
  const { navigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };

  return (
    <>
      {navigation !== null && (
        <footer className="bg-main fixed bottom-0 z-40 w-full border-t md:hidden p-4">
          <div className="grid grid-cols-4 md:hidden">
            <div
              className="w-full grid place-items-center"
              onClick={() => handleNavigation("/")}
            >
              <TbSmartHome className="h-6 w-6" />
              <div className="text-xs font-bold">Home</div>
            </div>
            <div
              className="w-full grid place-items-center"
              onClick={() => handleNavigation("/deposit")}
            >
              <PiHandDepositDuotone className="h-6 w-6" />
              <div className="text-xs font-bold">Deposit</div>
            </div>
            <div
              className="w-full grid place-items-center"
              onClick={() => handleNavigation("/pay")}
            >
              <IoCardOutline className="h-6 w-6" />
              <div className="text-xs font-bold">Pay</div>
            </div>
            <div
              className="w-full grid place-items-center"
              onClick={() => handleNavigation("/withdraw")}
            >
              <PiHandWithdrawDuotone className="h-6 w-6" />
              <div className="text-xs font-bold">Withdraw</div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
