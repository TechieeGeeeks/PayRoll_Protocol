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

// export async function switchToZamaNetwork(w0, setter) {
//   try {
//     const provider = await w0?.getEthersProvider();
//     const res = await provider?.send("wallet_addEthereumChain", [
//       {
//         chainId: "14A34",
//         chainName: "Base Sepolia",
//         nativeCurrency: {
//           name: "BASE",
//           symbol: "ETH",
//           decimals: 18,
//         },
//         rpcUrls: ["https://sepolia.base.org"],
//         blockExplorerUrls: ["https://sepolia-explorer.base.org"],
//       },
//     ]);

//     const network = await provider.detectNetwork();
//     if (network.chainId === 84532) {
//       setter(chainsName.base);
//     }
//   } catch (error) {
//     console.log(error?.message);
//     // toast(error?.message);
//   }
// }
