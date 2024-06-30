import { baseNetwork, incoNetwork } from "@/utils/chains";

export const privyConfig = {
  appId: "cltn4pfm807ld12sf83bqr3iy",
  config: {
    logo: "https://your.logo.url",
    appearance: { theme: "dark" },
    loginMethods: ["email"],
    appearance: {
      walletList: ["metamask", "detected_wallets", "rainbow"],
      theme: "dark",
    },
    defaultChain: baseNetwork,
    supportedChains: [baseNetwork, incoNetwork],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};
