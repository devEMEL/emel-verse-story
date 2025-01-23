import { gql } from '@apollo/client';

export const NFTType = gql`
    type NFT {
        id: ID!
        chainId: String!
        name: String!
        symbol: String!
        description: String
        collectionAddress: String!
        tokenId: String!
        ownerAddress: String!
        mintedAt: String!
        imageUrl: String!
    }

    extend type Query {
        nfts: [NFT!]!
        nft(id: ID!): NFT
        getNftsByOwner(ownerAddress: String!, chainId: String!): [NFT]
    }

    extend type Mutation {
        createNFT(
            chainId: String!
            name: String!
            symbol: String!
            description: String
            collectionAddress: String!
            tokenId: String!
            ownerAddress: String!
            mintedAt: String!
            imageUrl: String!
        ): NFT
    }
`;
// since id = collection id

