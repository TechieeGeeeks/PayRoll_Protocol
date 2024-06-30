"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { truncateAddress } from "@/utils/webHelpers";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import clsx from "clsx";
import { BanknoteIcon, ChevronDown, CopyIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];

  const address = w0?.address;

  const copyAddress = (address) => {
    try {
      navigator.clipboard.writeText(`${address}`);
    } catch (error) {
      console.log(error);
    }
    toast({
      title: "Copied to clipboard!",
      // description: "Address, copied to clipboard",
    });
  };
  return (
    <div className="mt-10">
      <Header authenticated={authenticated} address={address} />
      <div className="space-y-8 mt-10">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">Deposit Address.</p>
          <p>Tokens: 450</p>
        </div>

        <div className="w-full border border-border bg-white rounded-base">
          <img src={"/svgs/main.svg"} />
        </div>
        <div className="flex w-full justify-between">
          <p className="font-semibold text-lg">
            Deposit at:{" "}
            <span className="text-black/70">{truncateAddress(address)}</span>{" "}
          </p>
          <div onClick={() => copyAddress(address)}>
            <CopyIcon className="text-black/40 hover:text-black hover:scale-110 transition-all ease-in-out duration-300" />
          </div>
        </div>
        <div className="flex items-center justify-end w-full">
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Header = ({ authenticated, address }) => {
  return (
    <div className="mt-10 flex justify-between items-center scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-4">
      <div>Address</div>
      <div className="text-xl text-black/70 md:hidden flex items-center justify-center">
        {/* {truncateAddress(address)} */}
        <DropDown authenticated={authenticated} address={address} />
      </div>
    </div>
  );
};

const DropDown = ({ authenticated, address }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout } = usePrivy();
  // const { wallets } = useWallets();
  // const w0 = wallets[0];
  // const [tokens, setTokens] = useState("0");
  // const { token } = useSelector((tok) => tok.tokens);
  // console.log(token);
  // const accountAddress = w0?.address?.slice(0, 6)?.toLocaleLowerCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };
  return (
    <div className="relative">
      {authenticated ? (
        <button
          onBlur={() => [setIsOpen(false)]}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 text-xl font-base"
        >
          <div className="flex items-center gap-2 font-semibold">
            {/* <GiToken className="" /> */}
            {truncateAddress(address)}
            {/* <p> {token === "0" ? "0" : token.slice(0, -18)}</p> */}
          </div>

          {/* {accountAddress}.... */}
          <ChevronDown
            className={clsx(
              isOpen ? "rotate-180" : "rotate-0",
              "h-5 w-5 transition-transform"
            )}
            color="black"
          />
        </button>
      ) : (
        <button
          onBlur={() => [setIsOpen(false)]}
          onClick={login}
          className="flex items-center gap-2 text-xl font-base"
        >
          Login
        </button>
      )}

      <div
        className={clsx(
          isOpen
            ? "visible top-12 opacity-100 right-1"
            : "invisible top-10 right-1 opacity-0",
          "absolute flex w-[150px] flex-col rounded-base border-2 shadow-light border-black bg-white text-lg font-base transition-all"
        )}
      >
        {/* <div
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center rounded-t-base px-4 py-3 border-b-2 border-b-black"
        >
          {accountAddress}....
        </div> */}

        <Link
          href={"/deposit"}
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <BanknoteIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Deposit
        </Link>

        <div
          onClick={handleLogout}
          className="text-left flex items-center px-4 py-3 border-b-2 border-b-black bg-red-500 text-white cursor-pointer"
        >
          <LogOutIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Logout
        </div>
      </div>
    </div>
  );
};
