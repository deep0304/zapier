import { ethers } from "ethers";

if (!process.env.PRIVATE_KEY || !process.env.RPC_URL) {
  throw new Error("set private key in .env");
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export async function sendEth(to: string, amount: string) {
  try {
    //@ts-ignore
    const value = ethers.utils.parseEther(amount);

    const sender = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const transaction = await sender.sendTransaction({
      to: to,
      value: value, // Correct usage of parseEther
    });
    console.log("Transaction hash is:", transaction.hash);

    const receipt = await transaction.wait(1);
    console.log("Transaction receipt:", receipt);
    return receipt;
  } catch (error) {
    console.log("The error while sending the transaction is:", error);
  }
}
