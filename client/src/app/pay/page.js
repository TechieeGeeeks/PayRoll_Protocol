"use client";
import React, { useState } from "react";
import { Header } from "../page";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [formValues, setFormValues] = useState({
    amount: "",
    address1: "",
    distributionAddress1: "",
    address2: "",
    distributionAddress2: "",
    address3: "",
    distributionAddress3: "",
    locktime: "",
    dilute: "",
  });

  const formFields = [
    { id: "amount", label: "Amount" },
    { id: "address1", label: "Address 1" },
    { id: "distributionAddress1", label: "Distribution Address 1" },
    { id: "address2", label: "Address 2" },
    { id: "distributionAddress2", label: "Distribution Address 2" },
    { id: "address3", label: "Address 3" },
    { id: "distributionAddress3", label: "Distribution Address 3" },
    { id: "locktime", label: "Lock Time" },
    { id: "dilute", label: "Dilute" },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const address = w0?.address;
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
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
