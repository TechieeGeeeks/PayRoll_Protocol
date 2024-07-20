"use client";

import Head from "next/head";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setNavigation } from "@/redux/slices/navigationSlice";
// import CallToActionSection from "./cta";

export default function LandingPage() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col">
      <Head>
        <title>PayRoll Protocol</title>
        <meta
          name="description"
          content="Secure and Transparent Salary Payments"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-6">
        <div className="flex justify-between items-center scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 pb-4 border-b">
          <div className="text-2xl md:flex items-center gap-2 hidden">
            Payroll Protocol
          </div>
          <div className="text-xl text-black/70 flex items-center gap-2 md:hidden">
            Payroll Protocol
          </div>
        </div>
      </div>

      <main className="container mx-auto flex-grow px-4 py-6 mt-20">
        <section className="text-center mb-12 md:flex flex-col items-center justify-center w-full">
          <h2 className="text-2xl font-semibold capitalize mb-4 md:text-4xl md:font-bold w-full max-w-3xl">
            One stop solution for confidential payments
          </h2>
          <p className="text-muted-foreground leading-tight md:text-lg md:max-w-2xl">
            Revolutionize your payroll process with our blockchain-based
            solution, powered by INCO FHEVM for hidden states.
          </p>
          <div className="max-w-4xl grid">{/* <CallToActionSection /> */}</div>

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
