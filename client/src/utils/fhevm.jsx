import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { initFhevm, createInstance } from "fhevmjs";
export const init = async () => {
  await initFhevm();
};

// TFHE.sol contract address
// From https://github.com/zama-ai/fhevmjs/blob/c4b8a80a8783ef965973283362221e365a193b76/bin/fhevm.js#L9
const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

export const provider = new ethers.providers.JsonRpcProvider(
  "https://testnet.inco.org",
  {
    chainId: 9090,
    name: "Inco Gentry Testnet",
  }
);

export const createFhevmInstance = async () => {
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();
  // Get blockchain public key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });
  const decoded = defaultAbiCoder.decode(["bytes"], ret);
  const publicKey = decoded[0];
  const instance = await createInstance({ chainId, publicKey });
  console.log("created instance");
  return instance;
};

export const getInstance = async () => {
  await init();
  const instance = await createFhevmInstance();
  return instance;
};
