import mongoose from 'mongoose';

const faucetSchema = new mongoose.Schema(
    {
        walletAddress: { type: String },
        lastRequestTime: { type: String },
        message: { type: String },
        txHash: { type: String },
    },
);

export const faucetModel =
    mongoose.models.Faucet ||
    mongoose.model('Faucet', faucetSchema);

