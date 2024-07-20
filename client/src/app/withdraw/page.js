"use client";
import React, { useEffect } from "react";
import { Header } from "../page";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { truncateAddress } from "@/utils/webHelpers";
import {
  PAYROLLABI,
  PAYROLLCONTRACTADDRESS,
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
} from "@/utils/contractAddress";
import axios from "axios";
import { Contract } from "ethers";
import { PaymasterMode } from "@biconomy/account";
import Image from "next/image";

const Withdraw = ({ smartContractAccountAddress, signer, smartAccount }) => {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const address = w0?.address;
  const fundWallet = async () => {
    try {
      // await w0.switchChain(9090);
      const provider = await w0?.getEthersProvider();
      const balance = await provider.getBalance(w0.address);
      if (balance?.lte("10000000000000000")) {
        const { data } = await axios.get(
          `https://v3wkcmrs-8080.inc1.devtunnels.ms/api/sendEth/${address}`
        );
        console.log(data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };
  useEffect(() => {
    if (ready && authenticated && w0) {
      // w0.switchChain(9090);
      // fundWallet();
    }
  }, [ready, authenticated, w0]);
  const withdrawFunds = async () => {
    const tokenBridgeContract = await new Contract(
      TOKENBRIDGECONTRACTADDRESS,
      TOKENBRIDGEABI,
      signer
    );

    const txData = await tokenBridgeContract.populateTransaction.withdrawFunds(
      "100000000000",
      {
        gasLimit: 7920027,
      }
    );

    const tx1 = {
      to: TOKENBRIDGECONTRACTADDRESS,
      data: txData.data,
    };

    const userOpResponse = await smartAccount?.sendTransaction(tx1, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    });
    await userOpResponse.wait(1);
    // const provider = await w0?.getEthersProvider();
    // const signer = await provider?.getSigner();

    // const payrollContract = new Contract(
    //   PAYROLLCONTRACTADDRESS,
    //   PAYROLLABI,
    //   signer
    // );

    // const tx = await payrollContract.withdrawFunds();
    // console.log(tx);
  };

  return (
    <div className="mt-6">
      <Header
        authenticated={authenticated}
        smartAccountAddress={smartContractAccountAddress}
      />
      <div className="md:grid grid-cols-2 md:mt-20 md:gap-10">
        <div className="space-y-8 mt-4 md:flex flex-col items-center justify-between">
          <div className="w-full">
            <p className="font-semibold text-xl">Withdraw.</p>
            <p>You&apos;ve some secret withdrawals.</p>

            <div className="hidden md:flex w-full mt-8">
              Easily withdraw your funds with Payroll Protocol. Our secure
              blockchain-based system ensures that all transactions are
              encrypted and transparent. Enter the details of the withdrawal,
              and our platform will process it swiftly, maintaining privacy and
              security throughout the transaction.
            </div>
          </div>

          <div className="w-full border  md:hidden border-border bg-white rounded-base">
            <img src={"/svgs/main.svg"} />
          </div>

          <div className="flex items-center md:justify-start justify-end w-full md:pb-8">
            <Button onClick={withdrawFunds}>Withdraw Funds</Button>
          </div>
        </div>
        <div className="hidden md:flex bg-white border rounded-base shadow-light">
          <Image src={"/svgs/main.svg"} width={1080} height={1080} />
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
