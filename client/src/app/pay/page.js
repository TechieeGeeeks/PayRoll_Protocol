"use client";
import React, { useEffect, useState } from "react";
import { Header } from "../page";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { getInstance } from "@/utils/fhevm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signMessage } from "@/utils/eip712Helpers";
import axios from "axios";

const Page = () => {
  const { authenticated } = usePrivy();
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const { wallets } = useWallets();
  const w0 = wallets[0];

  const fundWallet = async () => {
    try {
      await w0.switchChain(9090);
      const provider = await w0?.getEthersProvider();
      const balance = await provider.getBalance(w0.address);
      if (balance?.lte(1000000000000000)) {
        const { data } = await axios.get(
          `https://v3wkcmrs-8080.inc1.devtunnels.ms/api/sendEth/${address}`
        );
        console.log(data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  console.log(w0?.chainId);

  const [formValues, setFormValues] = useState({
    amount: "",
    address1: "",
    amount1: "",
    address2: "",
    amount2: "",
    address3: "",
    amount3: "",
    locktime: "",
    dilute: "",
  });

  const formFields = [
    { id: "amount", label: "Amount" },
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
  const address = w0?.address;

  const handleFormSubmit = async () => {
    console.log(formValues);
    signMessage(w0, fhevmInstance, formValues);
  };
  return (
    <div className="mt-10">
      <Header address={address} authenticated={authenticated} />
      <div className="space-y-8 mt-10">
        <div className="">
          <p className="font-semibold text-xl">Pay for salary.</p>
          {/* <p>Available wiithdraw: 450</p> */}
        </div>
        <div className="grid grid-cols-2 mt-6 gap-8">
          {formFields.map(({ id, label }, index) => (
            <div
              key={id}
              className={`grid gap-2 md:grid-cols-2 items-center ${
                index === 0 ? "col-span-2" : ""
              }`}
            >
              <Label htmlFor={id}>{label}</Label>
              <Input
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
          <Button
            variant={"neutral"}
            onClick={fundWallet}
            // onClick={async () => {
            //   await w0.switchChain(9090);
            //   console.log(w0.chainId);
            // }}
          >
            Check
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
