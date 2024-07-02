"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { truncateAddress } from "@/utils/webHelpers";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import clsx from "clsx";
import {
  BanknoteIcon,
  ChevronDown,
  CoinsIcon,
  CopyIcon,
  LogOutIcon,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createSmartAccountClient } from "@biconomy/account";
import { Contract, ethers } from "ethers";
import { getInstance } from "@/utils/fhevm";
import {
  PAYROLLCONTRACTADDRESS,
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
  USDCABI,
  USDCCONTRACTADDRESS,
} from "@/utils/contractAddress";
import { Input } from "@/components/ui/input";
import { useViewport } from "@tma.js/sdk-react";

const Page = () => {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [signer, setSigner] = useState(null);
  const [smartAccount, setSmartAccount] = useState(null);
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [tokens, setTokens] = useState("0");
  const getBalance = async () => {
    await w0.switchChain(84532);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const udscContract = new ethers.Contract(
      USDCCONTRACTADDRESS,
      USDCABI,
      signer
    );

    const balance = await udscContract.balanceOf(w0.address);
    const bigNumber = ethers.BigNumber.from(balance);
    setTokens(bigNumber.toString());
  };
  const [depositAmount, setDepositAmount] = useState();
  useEffect(() => {
    if (signer && ready && authenticated && w0) {
      getBalance();
    }
  }, [signer, ready, authenticated, w0]);

  const vp = useViewport();

  useEffect(() => {
    console.log(vp); // will be undefined and then Viewport instance.
  }, [vp]);

  const getFhevmInstance = async () => {
    const instance = await getInstance();
    setFhevmInstance(instance);
  };

  useEffect(() => {
    getFhevmInstance();
  }, []);

  const createSmartAccount = async (signer) => {
    if (!signer) return;
    const smartAccount = await createSmartAccountClient({
      signer: signer,
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      biconomyPaymasterApiKey:
        "https://paymaster.biconomy.io/api/v1/84532/9TNSt35x8.d36efc58-f988-4c7a-b2ea-a4ca79c1ef95",
      rpcUrl: "https://sepolia.base.org",
    });
    return smartAccount;
  };

  const getSigner = async () => {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    setSigner(signer);
    const smartContractAccount = await createSmartAccount(signer);
    setSmartAccount(smartContractAccount);
  };
  useEffect(() => {
    if (ready && authenticated) {
      setSigner(getSigner());
    }
  }, [w0]);

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
  const handlePayBtn = async () => {
    w0.switchChain(84532);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    try {
      const usdcContract = new Contract(USDCCONTRACTADDRESS, USDCABI, signer);
      await usdcContract.transferFromOwner(TOKENBRIDGECONTRACTADDRESS);
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleDeposit = async () => {
    w0.switchChain(84532);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const value = ethers.utils.parseUnits(depositAmount, "ether");
    try {
      const usdcContract = new Contract(
        TOKENBRIDGECONTRACTADDRESS,
        TOKENBRIDGEABI,
        signer
      );
      await usdcContract.lockTokens(value);
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="mt-10">
      <Header authenticated={authenticated} address={address} />
      <div className="space-y-4 mt-10">
        <div className="">
          <div>
            <div className="w-full items-center justify-between flex">
              <p className="font-semibold text-xl">Deposit Address.</p>{" "}
              <CoinsIcon
                className="text-black/40 hover:text-black hover:scale-110 transition-all ease-in-out duration-300"
                onClick={handlePayBtn}
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-between">
            <p>
              Available tokens: {tokens === "0" ? "0" : tokens.slice(0, -18)}
            </p>
          </div>
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
        <div className="w-full border border-border bg-white rounded-base">
          <img src={"/svgs/main.svg"} />
        </div>
        <div className="space-y-1 font-semibold">
          <p>Amount to deposit</p>
          <div className="flex items-center justify-betweeb w-full gap-2 ">
            <Input
              placeholder="Token Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Button variant="noShadow" onClick={handleDeposit}>
              Deposit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

export const Header = ({ authenticated, address }) => {
  return (
    <div className="mt-10 flex justify-between items-center scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-4">
      <Link href={"/"}>Payroll</Link>
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
          "absolute flex w-[170px] flex-col rounded-base border-2 shadow-light border-black bg-white text-lg font-base transition-all"
        )}
      >
        {/* <div
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center rounded-t-base px-4 py-3 border-b-2 border-b-black"
        >
          {accountAddress}....
        </div> */}
        <Link
          href={"/"}
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <PiggyBank className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Deposit
        </Link>
        <Link
          href={"/pay"}
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <BanknoteIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Pay
        </Link>
        <Link
          href={"/withdraw"}
          onClick={() => setIsOpen(false)}
          className="text-left flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <CoinsIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Withdraw
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
