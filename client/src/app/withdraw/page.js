"use client";
import React from "react";
import { Header } from "../page";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { truncateAddress } from "@/utils/webHelpers";

const Page = () => {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const address = w0?.address;
  return (
    <div className="mt-10">
      <Header authenticated={authenticated} address={address} />
      <div className="space-y-8 mt-10">
        <div className="">
          <p className="font-semibold text-xl">Withdraw.</p>
          <p>Available withdraw: RS. 450</p>
        </div>

        <div className="w-full border border-border bg-white rounded-base">
          <img src={"/svgs/main.svg"} />
        </div>

        <div className="flex items-center justify-end w-full">
          <Button>Withdraw Salary</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
