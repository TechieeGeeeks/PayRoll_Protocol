"use client";
import React from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "../ui/button";

const LogginChecker = ({ children }) => {
  const { login, authenticated } = usePrivy();

  return (
    <>
      {!authenticated ? (
        <div className="mt-10">
          <div className="mt-10 flex justify-between scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-4">
            Login
          </div>
          <div className="space-y-8 mt-10">
            <p className="font-semibold text-lg">
              Connect your wallet to proceed.
            </p>
            <div className="w-full border border-border bg-white rounded-base">
              <img src={"/svgs/login.svg"} />
            </div>
            <Button className="w-full" onClick={login}>
              Connect
            </Button>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LogginChecker;
