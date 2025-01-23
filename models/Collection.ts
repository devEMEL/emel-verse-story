import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        chainId: { type: String },
        name: { type: String },
        symbol: { type: String },
        description: { type: String },
        ownerAddress: { type: String },
        createdAt: { type: String },
        price: { type: String },
        imageUrl: { type: String },
        totalSupply: { type: String },
        mintedAmount: { type: String },
    },
    {
        _id: true,
    }
);

export const collectionModel =
    mongoose.models.Collection ||
    mongoose.model('Collection', collectionSchema);

// _id = contract address
