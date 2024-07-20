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
import { PaymasterMode, createSmartAccountClient } from "@biconomy/account";
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
import { useDispatch, useSelector } from "react-redux";
import Pay from "./pay/page";
import Withdraw from "./withdraw/page";
import LandingPage from "@/components/landingPage";
import { setNavigation } from "@/redux/slices/navigationSlice";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import LogginChecker from "@/components/login/login-checker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

const Page = () => {
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [signer, setSigner] = useState(null);
  const { navigation } = useSelector((state) => state.navigation);
  // console.log(navigation);
  const { authenticated } = usePrivy();
  const dispatch = useDispatch();
  const [smartAccount, setSmartAccount] = useState(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  // const [smartContract, setsmartContract] = useState(null)
  // console.log(smartAccount)
  useEffect(() => {
    if (authenticated) {
      dispatch(setNavigation("/"));
    }
  }, [authenticated]);

  const createSmartAccount = async (signer) => {
    if (!signer) return;
    const smartAccount = await createSmartAccountClient({
      signer: signer,
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      biconomyPaymasterApiKey: "9TNSt35x8.d36efc58-f988-4c7a-b2ea-a4ca79c1ef95",
      rpcUrl: "https://sepolia.base.org",
    });
    return smartAccount;
  };

  const getSigner = async () => {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    setSigner(signer);
    const smartContractAccount = await createSmartAccount(signer);
    // console.log(smartContractAccount);
    setSmartAccount(() => smartContractAccount);
    // console.log(await smartContractAccount?.getAddress());
    const newProvider = await new ethers.providers.JsonRpcProvider(
      "https://sepolia.base.org"
    );
    // console.log(provider);
    const newSigner = await newProvider?.getSigner(
      await smartContractAccount?.getAddress()
    );
    setSmartAccountAddress(await smartContractAccount?.getAddress());
    setSigner(newSigner);
  };
  // console.log(smartAccountAddress);
  // console.log(signer)
  useEffect(() => {
    if (ready && authenticated) {
      getSigner();
    }
  }, [w0]);

  return (
    <>
      {(navigation === "/login" || navigation === null) && <LogginChecker />}
      {navigation === "/" && <LandingPage />}
      {navigation === "/deposit" && (
        <Home
          smartAccount={smartAccount}
          signer={signer}
          smartContractAccountAddress={smartAccountAddress}
        />
      )}
      {navigation === "/pay" && (
        <Pay
          signer={signer}
          smartAccount={smartAccount}
          smartContractAccountAddress={smartAccountAddress}
        />
      )}
      {navigation === "/withdraw" && (
        <Withdraw
          smartAccount={smartAccount}
          signer={signer}
          smartContractAccountAddress={smartAccountAddress}
        />
      )}
    </>
  );
};

export default Page;

const Home = ({ smartAccount, signer, smartContractAccountAddress }) => {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  // const [signer, setSigner] = useState(null);
  // const [smartAccount, setSmartAccount] = useState(null);
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const dispatch = useDispatch();
  const [tokens, setTokens] = useState("0");
  const [withdrawMode, setWithdrawMode] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    "0x8EFaf91508c3bFA232a3D5d89C2005774d0A6C38"
  );
  const getBalance = async () => {
    await w0.switchChain(84532);
    const provider = await w0?.getEthersProvider();
    console.log("called");
    // const signer = await provider?.getSigner();
    const udscContract = new ethers.Contract(
      USDCCONTRACTADDRESS,
      USDCABI,
      signer
    );

    const balance = await udscContract.balanceOf(smartContractAccountAddress);
    const bigNumber = ethers.BigNumber.from(balance);
    // console.log(balance);
    setTokens(bigNumber.toString());
  };
  const [depositAmount, setDepositAmount] = useState();
  useEffect(() => {
    if (signer && ready && authenticated && w0) {
      getBalance();
    }
  }, [signer, ready, authenticated, w0]);

  // const vp = useViewport();

  // useEffect(() => {
  //   console.log(vp); // will be undefined and then Viewport instance.
  // }, [vp]);

  const getFhevmInstance = async () => {
    const instance = await getInstance();
    setFhevmInstance(instance);
  };

  useEffect(() => {
    getFhevmInstance();
  }, []);

  useEffect(() => {
    if (tokens !== "0") {
      setDepositAmount(tokens.slice(0, -18));
    }
  }, [tokens]);

  const address = w0?.address;

  const handlePayBtn = async () => {
    // w0.switchChain(84532);
    // const signer = await provider?.getSigner();
    // console.log(await smartAccount.getSigner())
    try {
      const usdcContract = await new Contract(
        USDCCONTRACTADDRESS,
        USDCABI,
        signer
      );

      const txData = await usdcContract.populateTransaction.transferFromOwner(
        TOKENBRIDGECONTRACTADDRESS
      );

      const tx1 = {
        to: USDCCONTRACTADDRESS,
        data: txData.data,
      };

      const userOpResponse = await smartAccount?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      await userOpResponse.wait(1);

      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleDeposit = async () => {
    // console.log(signer)
    const value = ethers.utils.parseUnits(depositAmount, "ether");
    try {
      const usdcContract = new Contract(
        TOKENBRIDGECONTRACTADDRESS,
        TOKENBRIDGEABI,
        signer
      );
      const txData = await usdcContract.populateTransaction.lockTokens(value, {
        gasLimit: 7920027,
      });
      const tx1 = {
        to: TOKENBRIDGECONTRACTADDRESS,
        data: txData.data,
      };
      const userOpResponse = await smartAccount?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      await userOpResponse.wait(4);
      console.log("get");
      console.log(userOpResponse);
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const usdcContract = new Contract(USDCCONTRACTADDRESS, USDCABI, signer);
      const balance = await usdcContract.balanceOf(smartContractAccountAddress);
      const txData = await usdcContract.populateTransaction.transfer(
        withdrawAmount,
        balance,
        {
          gasLimit: 7920027,
        }
      );
      const tx1 = {
        to: USDCCONTRACTADDRESS,
        data: txData.data,
      };
      const userOpResponse = await smartAccount?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      await userOpResponse.wait(4);
      console.log("get");
      console.log(userOpResponse);
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <>
      <div className="mt-6">
        <Header
          authenticated={authenticated}
          address={address}
          smartAccountAddress={smartContractAccountAddress}
        />
        <div className="md:grid grid-cols-2 md:mt-20 md:gap-10">
          <div className="space-y-4 mt-4 md:flex md:flex-col items-center justify-between w-full">
            <div className="w-full">
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
                <div className="flex items-center gap-1">
                  <p>
                    Available tokens:{" "}
                    {tokens === "0" ? "0" : tokens.slice(0, -18)}
                  </p>
                  <PiCurrencyDollarSimpleFill className="text-blue-800 text-xl" />
                </div>
              </div>

              <div className="hidden md:flex w-full mt-8">
                Securely deposit funds into the Payroll Protocol system. Using
                our advanced blockchain technology, all transactions are
                encrypted and stored immutably, ensuring both security and
                transparency. Simply enter the total salary amount and the
                encrypted addresses of your employees, and our platform will
                handle the rest, ensuring timely and private salary
                disbursements.
              </div>
            </div>

            <div className="w-full border border-border bg-white rounded-base md:hidden">
              <Image src={"/svgs/main.svg"} width={1080} height={1080} />
            </div>

            <div className="space-y-1 w-full font-semibold">
              <div className="flex items-center justify-between my-2">
                {withdrawMode ? (
                  <p>Address to Withdraw</p>
                ) : (
                  <p>Amount to deposit</p>
                )}
                <Switch
                  checked={withdrawMode}
                  onCheckedChange={() => setWithdrawMode(!withdrawMode)}
                />
              </div>
              {withdrawMode ? (
                <div className="flex items-center justify-betweeb w-full gap-2 ">
                  <Input
                    placeholder="Withdraw Address"
                    className="shadow-light ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <Button onClick={handleWithdraw}>Withdraw</Button>
                </div>
              ) : (
                <div className="flex items-center justify-betweeb w-full gap-2 ">
                  <Input
                    placeholder="Token Amount"
                    className="shadow-light ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <Button onClick={handleDeposit}>Deposit</Button>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex bg-white border rounded-base shadow-light">
            <Image src={"/svgs/main.svg"} width={1080} height={1080} />
          </div>
        </div>
      </div>
    </>
  );
};

export const Header = ({ authenticated, address, smartAccountAddress }) => {
  // console.log(smartAccountAddress);
  const { logout } = usePrivy();
  const dispatch = useDispatch();
  const { navigation } = useSelector((state) => state.navigation);
  const [nav, setNav] = useState(navigation);
  useEffect(() => {
    setNav(navigation);
  }, [navigation]);

  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };
  const handleLogout = () => {
    logout();
    dispatch(setNavigation(null));
  };
  const copyAddress = (smartAccountAddress) => {
    try {
      navigator.clipboard.writeText(`${smartAccountAddress}`);
    } catch (error) {
      console.log(error);
    }
    toast({
      title: "Copied to clipboard!",
      // description: "Address, copied to clipboard",
    });
  };
  return (
    <div className="flex justify-between items-center scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 pb-4 border-b">
      {/* <Link href={"/"}>Payroll</Link> */}
      <div
        className="text-2xl md:flex items-center gap-2 hidden"
        onClick={() => handleNavigation("/")}
      >
        {nav === "/pay"
          ? "Distribition per address"
          : "Payroll Protocol"}
      </div>
      <div className="text-xl text-black/70 flex items-center gap-2 md:hidden">
        {truncateAddress(smartAccountAddress)}
        <div onClick={() => copyAddress(smartAccountAddress)}>
          <CopyIcon className="text-black/40 hover:text-black hover:scale-110 transition-all ease-in-out duration-300 w-4" />
        </div>
      </div>

      <div className="text-xl text-black/70  flex gap-3 items-center justify-center">
        <Button
          size="sm"
          onClick={logout}
          variant="neutral"
          className="gap-2 md:hidden flex items-center justify-between bg-red-500 text-white"
        >
          <LogOutIcon />
          Logout
        </Button>
        <div className="hidden md:flex cursor-none">
          <DropDown
            authenticated={authenticated}
            address={smartAccountAddress}
          />
        </div>
        {/* <DropDown authenticated={authenticated} address={address} /> */}
      </div>
    </div>
  );
};

const DropDown = ({ authenticated, address }) => {
  const copyAddress = (smartAccountAddress) => {
    try {
      navigator.clipboard.writeText(`${smartAccountAddress}`);
    } catch (error) {
      console.log(error);
    }
    toast({
      title: "Copied to clipboard!",
      // description: "Address, copied to clipboard",
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const { login, logout } = usePrivy();
  const { navigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };
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
          className="flex items-center gap-2 text-xl font-base cursor-none"
        >
          <div className="flex items-center gap-2 font-semibold cursor-none">
            {/* <GiToken className="" /> */}
            <div onClick={() => copyAddress(smartAccountAddress)}>
              <CopyIcon className="text-black/40 hover:text-black hover:scale-110 transition-all ease-in-out duration-300 w-4" />
            </div>
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
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/deposit");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <PiggyBank className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Deposit
        </div>
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/pay");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <BanknoteIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Pay
        </div>
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/withdraw");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black "
        >
          <CoinsIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Withdraw
        </div>

        <div
          onClick={handleLogout}
          className="text-left hover:bg-red-600  flex items-center px-4 py-3 border-b-2 border-b-black bg-red-500 text-white"
        >
          <LogOutIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Logout
        </div>
      </div>
    </div>
  );
};
