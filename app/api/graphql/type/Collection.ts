import { gql } from '@apollo/client';

export const CollectionType = gql`
    type Collection {
        id: ID!
        chainId: String!
        name: String!
        symbol: String!
        description: String
        ownerAddress: String!
        createdAt: String!
        price: String!
        imageUrl: String!
        totalSupply: String!
        mintedAmount: String!
    }

    extend type Query {
        collections(orderBy: String!, orderDirection: String!, chainId: String!): [Collection!]!
        collection(id: ID!): Collection
        getCollectionsByOwner(ownerAddress: String!, chainId: String!): [Collection]

    }

    extend type Mutation {
        createCollection(
            id: ID!
            chainId: String!
            name: String!
            symbol: String!
            description: String
            ownerAddress: String!
            createdAt: String!
            price: String!
            totalSupply: String!
            imageUrl: String!
            mintedAmount: String!
        ): Collection

        updateCollection(id: ID!): Collection
    }
`;

// removed     contractAddress: String!, since is represented by _id
// create collection (after successfully creating a collection)
// mintNFT (after successfully minting nft)

// update collection minted amount after each nft minting

