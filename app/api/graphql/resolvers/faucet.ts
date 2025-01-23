// @ts-nocheck

import { faucetModel } from "@/models/Faucet";
import { ethers } from "ethers";

export const faucetResolvers = {
    // Mutation: {
    //     async requestFaucet(_, { id }) {
    //         if (!ethers.isAddress(id)) {
    //             throw new Error("Invalid wallet address");
    //         }

    //         const now = new Date();

    //         // Faucet wallet setup
    //         const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
    //         const privateKey = "YOUR_FAUCET_WALLET_PRIVATE_KEY";
    //         const wallet = new ethers.Wallet(privateKey, provider);

    //         try {
    //             // Find the user in the database
    //             let user = await faucetModel.findById(id);

    //             // Check cooldown
    //             if (user && now - user.lastRequestTime < 24 * 60 * 60 * 1000) {
    //                 const timeLeft = 24 * 60 * 60 * 1000 - (now - user.lastRequestTime);
    //                 const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
                   
    //                 return {
    //                     id,
    //                     lastRequestTime: user.lastRequestTime,
    //                     message: `Please wait ${hoursLeft} hours before requesting again.`,
    //                 };
    //             }

    //             // if (user && now - user.lastRequestTime > 24 * 60 * 60 * 1000) {
    //             //         // send faucet

    //             //     // Send ETH
    //             //     const tx = await wallet.sendTransaction({
    //             //         to: id,
    //             //         value: ethers.parseEther("0.01"), // Faucet amount
    //             //     });

    //             //     const response = await tx.wait();
    //             //     console.log(response);

    //             //     user.lastRequestTime = now;
    //             //     await user.save();

    //             //     return {
    //             //         id,
    //             //         lastRequestTime: now.toISOString(),
    //             //         message: "Faucet sent successfully!",
    //             //         txHash: tx.hash,
    //             //     };

    //             // }
    //             if(!user) {
    //                  // Send ETH
    //                  const tx = await wallet.sendTransaction({
    //                     to: id,
    //                     value: ethers.parseEther("0.01"), // Faucet amount
    //                 });

    //                 const response = await tx.wait();
    //                 console.log(response);

    //                 user = new faucetModel({ _id: id, lastRequestTime: now });
    //                 await user.save();
    //                 return {
    //                     id,
    //                     lastRequestTime: now.toISOString(),
    //                     message: "Faucet sent successfully!",
    //                     txHash: tx.hash,
    //                 };
    //             }

                
    //         } catch (error) {
    //             console.error("Error sending faucet:", error);
    //             throw new Error("Failed to process faucet request. Try again later.");
    //         }
    //     },
    // },
    Mutation: {
        async requestFaucet(_, { id }) {
            if (!ethers.isAddress(id)) {
                throw new Error("Invalid wallet address");
            }

            const now = new Date();

            // Faucet wallet setup
            const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
            const privateKey = "YOUR_FAUCET_WALLET_PRIVATE_KEY";
            const wallet = new ethers.Wallet(privateKey, provider);

            try {
                // Find the user in the database
                let user = await faucetModel.findById(id);

                // Check cooldown
                if (user && now - user.lastRequestTime < 24 * 60 * 60 * 1000) {
                    const timeLeft = 24 * 60 * 60 * 1000 - (now - user.lastRequestTime);
                    const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));

                    return {
                        id,
                        lastRequestTime: user.lastRequestTime.toISOString(),
                        message: `Please wait ${hoursLeft} hours before requesting again.`,
                        txHash: null,
                    };
                }

                // Send ETH (common logic for both new and existing users)
                const tx = await wallet.sendTransaction({
                    to: id,
                    value: ethers.parseEther("0.01"), // Faucet amount
                });

                await tx.wait();

                // Update or create the user's last request time
                if (user) {
                    user.lastRequestTime = now;
                } else {
                    user = new faucetModel({ _id: id, lastRequestTime: now });
                }
                await user.save();

                return {
                    id,
                    lastRequestTime: now.toISOString(),
                    message: "Faucet sent successfully!",
                    txHash: tx.hash,
                };
            } catch (error) {
                console.error("Error sending faucet:", error);
                throw new Error("Failed to process faucet request. Try again later.");
            }
        },
    },
};
