"use client";

import Head from "next/head";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setNavigation } from "@/redux/slices/navigationSlice";

export default function LandingPage() {
  const dispatch = useDispatch();
  return (
    <div className=" min-h-screen flex flex-col">
      <Head>
        <title>PayRoll Protocol</title>
        <meta
          name="description"
          content="Secure and Transparent Salary Payments"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">PayRoll Protocol</h1>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-6 mt-20">
        <section className="text-center mb-12">
          <h2 className="text-2xl font-semibold capitalize mb-4">
            One stop solution for confidential payments
          </h2>
          <p className="text-gray-600">
            Revolutionize your payroll process with our blockchain-based
            solution, powered by INCO FHEVM for hidden states.
          </p>{" "}
          <div className="mt-6">
            <Button onClick={() => dispatch(setNavigation("/deposit"))}>
              Get Started
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
