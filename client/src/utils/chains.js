// import { toast } from "sonner";

export const chainsName = { base: "Base" };

export const baseNetwork = {
  id: 84532,
  network: "Base Sepolia",
  name: "Base Sepolia",
  nativeCurrency: {
    name: "BASE",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Block Explorer",
      url: "https://sepolia-explorer.base.org",
    },
  },
};

export async function switchToBaseNetwork(w0, setter) {
  try {
    const provider = await w0?.getEthersProvider();
    const res = await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "14A34",
        chainName: "Base Sepolia",
        nativeCurrency: {
          name: "BASE",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia-explorer.base.org"],
      },
    ]);

    const network = await provider.detectNetwork();
    if (network.chainId === 84532) {
      setter(chainsName.base);
    }
  } catch (error) {
    console.log(error?.message);
    // toast(error?.message);
  }
}

export async function switchToIncoNetwork(w0) {
  try {
    const provider = await w0?.getEthersProvider();
    const res = await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x2382",
        chainName: "Inco Gentry Testnet",
        nativeCurrency: {
          name: "INCO",
          symbol: "INCO",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.inco.org/"],
        blockExplorerUrls: ["https://explorer.testnet.inco.org"],
      },
    ]);

    const network = await provider.detectNetwork();
    // if (network.chainId === 9090) {
    //   setter(chainsName.inco);
    // }
  } catch (error) {
    console.log(error?.message);
    toast(error?.message);
  }
}

export const incoNetwork = {
  id: 9090,
  network: "Inco Gentry Testnet",
  name: "INCO",
  nativeCurrency: {
    name: "INCO",
    symbol: "INCO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.inco.org/"],
    },
    public: {
      http: ["https://testnet.inco.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.testnet.inco.org",
    },
  },
};
