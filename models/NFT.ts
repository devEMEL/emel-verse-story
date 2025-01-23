import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema(
    {
        chainId: { type: String },
        name: { type: String },
        symbol: { type: String },
        description: { type: String },
        collectionAddress: {
            type: String,
            required: true,
            ref: 'Collection',
        },
        tokenId: { type: String },
        ownerAddress: { type: String },
        mintedAt: { type: String},
        imageUrl: { type: String},
    },
    {
        timestamps: true,
    }
);

export const nftModel = mongoose.models.NFT || mongoose.model('NFT', nftSchema);