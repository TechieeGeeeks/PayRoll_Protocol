"use client";
import { http } from "viem";
import { BiconomyProvider } from "@biconomy/use-aa";
// import { polygonAmoy } from "viem/chains";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseNetwork, incoNetwork } from "@/utils/chains";

export default function Providers({ children }) {
  const biconomyPaymasterApiKey =
    process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || "";
  const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || "";

  const config = createConfig({
    chains: [baseNetwork, incoNetwork],
    transports: {
      [baseNetwork.id]: http("https://sepolia.base.org"),
    },
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BiconomyProvider
          config={{
            biconomyPaymasterApiKey,
            bundlerUrl,
          }}
          queryClient={queryClient}
        >
          {children}
        </BiconomyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
