"use client";
import React, { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import Loading from "../loading";
import { useDispatch } from "react-redux";
import { setNavigation } from "@/redux/slices/navigationSlice";
import { DeskLogin } from "../landing-page";

const LogginChecker = ({ children }) => {
  const { login, authenticated, ready } = usePrivy();
  const w0 = useWallets();
  // console.log(authenticated, w0)
  const dispatch = useDispatch();
  const handleLogin = () => {
    try {
      login();
      dispatch(setNavigation("/"));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!authenticated || !ready) {
      dispatch(setNavigation("/login"));
    }
  }, [ready, authenticated]);

  if (!ready) return <Loading />;

  return (
    <>
      {!authenticated ? (
        <>
          <div className="mt-10 md:hidden">
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
              <Button className="w-full" onClick={handleLogin}>
                Connect
              </Button>
            </div>
          </div>

          <div className="md:flex hidden">
            <DeskLogin login={login} />
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
};

export default LogginChecker;
