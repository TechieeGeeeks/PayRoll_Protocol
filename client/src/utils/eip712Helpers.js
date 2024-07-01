import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { ethers } from "ethers";

const EIP712ServerCall = async (
  expiryTime,
  signature,
  address,
  data,
  encryptedValue
) => {
  console.log({
    user: "0x4D1bb64026eE02AB61897DCa915567F7c1243102",
    encryptedValue: encryptedValue,
    expiryTime: expiryTime,
    chainId: data.chainId,
    executionChainId: data.executionChainId,
    bytesSignature: signature,
  });
  try {
    const receipt = await axios.post(
      `https://v3wkcmrs-8081.inc1.devtunnels.ms/api/eip712call/${address}`,
      {
        user: "0x4D1bb64026eE02AB61897DCa915567F7c1243102",
        encryptedValue: encryptedValue,
        expiryTime: expiryTime,
        chainId: data.chainId,
        executionChainId: data.executionChainId,
        bytesSignature: signature,
      }
    );
    console.log(receipt.data);
  } catch (error) {
    console.log(error);

    toast({ title: "Error Occured!" });
  }
};

export const signMessage = async (w0, fhevmInstance, formValues) => {
  const address = w0.address;
  const provider = await w0?.getEthersProvider();
  const signer = await provider?.getSigner();
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + 120;

  const encryptedAmount1 = fhevmInstance.encrypt32(Number(formValues.amount1));
  const encryptedAmount2 = fhevmInstance.encrypt32(Number(formValues.amount2));
  const encryptedAmount3 = fhevmInstance.encrypt32(Number(formValues.amount3));

  const address1 = formValues.address1;
  const address2 = formValues.address2;
  const address3 = formValues.address3;

  const domain = {
    name: "PayRoll",
    version: "1",
    chainId: await signer.getChainId(),
    verifyingContract: "0xF49Cfbc8B29FfCE0F5FD0cd4C57045C9C905B0bf",
  };
  const data = {
    // user: address1,
    // encryptedValues: [encryptedAmount1, encryptedAmount2, encryptedAmount3],
    expiration: Math.floor(Date.now() / 1000) + 3600,
    chainId: 84532,
    executionChainId: 9090,
    // ownerAddress: address,
  };

  const types = {
    Distribute: [
      //   { name: "users", type: "address[]" },
      //   { name: "encryptedValues", type: "bytes[]" },
      { name: "expiration", type: "uint256" },
      { name: "chainId", type: "uint256" },
      { name: "executionChainId", type: "uint256" },
      //   { name: "ownerAddress", type: "address" },
    ],
  };

  try {
    const signature = await signer._signTypedData(domain, types, data);
    console.log(signature);
    await EIP712ServerCall(
      expirationTime,
      signature,
      address,
      data,
      encryptedAmount1
    );
  } catch (error) {
    console.error("Error signing message:", error.message);
  }
};
