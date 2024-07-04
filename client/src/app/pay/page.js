"use client";
import React, { useEffect, useState } from "react";
import { Header } from "../page";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { getInstance } from "@/utils/fhevm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  PAYROLLABI,
  PAYROLLCONTRACTADDRESS,
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
  USDCABI,
  USDCCONTRACTADDRESS,
} from "@/utils/contractAddress";
import { Contract, ethers } from "ethers";
import { RefreshCcw } from "lucide-react";
import { PaymasterMode } from "@biconomy/account";

const Pay = ({ smartContractAccountAddress, signer, smartAccount }) => {
  const { signTypedData } = usePrivy();
  const { authenticated, ready } = usePrivy();
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [tokens, setTokens] = useState("0");

  // useEffect(() => {
  //   if (ready && authenticated && w0) {
  //     w0.switchChain(9090);
  //     fundWallet();
  //   }
  // }, [ready, authenticated, w0]);

  // const fundWallet = async () => {
  //   try {
  //     await w0.switchChain(9090);
  //     const provider = await w0?.getEthersProvider();
  //     const balance = await provider.getBalance(w0.address);
  //     console.log(balance?.toString())
  //     if (balance?.lte("11871346401399617")) {
  //       const { data } = await axios.get(
  //         `https://v3wkcmrs-8080.inc1.devtunnels.ms/api/sendEth/${address}`
  //       );
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.log(error?.message);
  //   }
  // };

  const [formValues, setFormValues] = useState({
    amount: "",
    address1: "0xFc1D1d21c10dd7A22EFa85215A674C030c803062",
    amount1: "300",
    address2: "0xee559E753aCF8cE65Bf56e595A9A83F1E648016C",
    amount2: "300",
    address3: "0x36e7A8dB019395A42235b255C1dD5E6A42d518B4",
    amount3: "300",
    locktime: "",
    dilute: "",
  });

  const formFields = [
    { id: "address1", label: "Address 1" },
    { id: "amount1", label: "Amount 1" },
    { id: "address2", label: "Address 2" },
    { id: "amount2", label: "Amount 2" },
    { id: "address3", label: "Address 3" },
    { id: "amount3", label: "Amount 3" },
    { id: "locktime", label: "Lock Time" },
    { id: "dilute", label: "Dilute" },
  ];

  const getFhevmInstance = async () => {
    const instance = await getInstance();
    setFhevmInstance(instance);
  };

  useEffect(() => {
    getFhevmInstance();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const address = smartContractAccountAddress;
  console.log(w0?.chainId);
  const handleFormSubmit = async () => {
    // await w0.switchChain(9090);
    console.log(w0.chainId);
    console.log(formValues);
    // const provider = await w0?.getEthersProvider();
    // const signer = await provider?.getSigner();

    const {
      amount,
      address1,
      amount1,
      address2,
      amount2,
      address3,
      amount3,
      locktime,
      dilute,
    } = formValues;

    const addressArray = [address1, address2, address3];
    const encryptedAmountArray = [
      await fhevmInstance.encrypt32(Number(amount1)),
      await fhevmInstance.encrypt32(Number(amount2)),
      await fhevmInstance.encrypt32(Number(amount3)),
    ];
    const encryptedAmount = await fhevmInstance.encrypt32(Number(amount1));
    // Using ethers.js AbiCoder to encode the encrypted value

    const bytesFor1 = ethers.utils.defaultAbiCoder.encode(
      ["bytes"],
      [encryptedAmount]
    );

    // Padding the encoded bytes to get the desired substring
    let paddedBytesFor1 = "0x" + bytesFor1.slice(130, 33146);
    console.log({
      user: smartContractAccountAddress,
      userAddress1: address1,
      userAddresses2: address2,
      userAddresses3: address3,
      encryptedData: paddedBytesFor1,
    });
    // user, userAddress1, userAddresses2, userAddresses3, encryptedData
    try {
      const { data } = await axios.post(
        "https://v3wkcmrs-8080.inc1.devtunnels.ms/distribute-funds",
        {
          amount1: Number(amount1),
          user: smartContractAccountAddress,
          userAddress1: address1,
          userAddresses2: address2,
          userAddresses3: address3,
          encryptedData: paddedBytesFor1,
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    const tokenBridgeContract = await new Contract(
      TOKENBRIDGECONTRACTADDRESS,
      TOKENBRIDGEABI,
      signer
    );

    console.log(addressArray);

    const txData =
      await tokenBridgeContract.populateTransaction.distributeFunds(
        address1,
        address2,
        address3,
        await fhevmInstance.encrypt32(Number(amount1)),
        { gasLimit: 7920027 }
      );

    const tx1 = {
      to: TOKENBRIDGECONTRACTADDRESS,
      data: txData.data,
    };

    const userOpResponse = await smartAccount?.sendTransaction(tx1, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    });
    await userOpResponse.wait(1);

    // const payrollContract = new Contract(
    //   PAYROLLCONTRACTADDRESS,
    //   PAYROLLABI,
    //   signer
    // );

    // const result = await payrollContract.distributeFunds(
    //   addressArray,
    //   encryptedAmountArray,
    //   { gasLimit: 7920027 }
    // );
    // console.log(w0.chainId);
    // await result.wait(1);
    // console.log(result);
  };

  const handleRefreshToken = async () => {
    await w0.switchChain(9090);
  };
  return (
    <div className="mt-6">
      <Header
        address={address}
        authenticated={authenticated}
        smartAccountAddress={smartContractAccountAddress}
      />
      <div className="space-y-8 mt-4">
        <div className="">
          <p className="font-semibold text-xl">Pay for salary.</p>
        </div>
        <div className="grid grid-cols-2 mt-6 gap-8">
          {formFields.map(({ id, label }, index) => (
            <div key={id} className={`grid gap-2 md:grid-cols-2 items-center`}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                type={`${
                  id === "locktime" || id === "dilute" ? "date" : "text"
                }`}
                id={id}
                onChange={handleChange}
                value={formValues[id]}
                placeholder={label}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end w-full">
          <Button onClick={handleFormSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
