import { gql } from '@apollo/client';

export const CREATE_COLLECTION = gql`
    mutation createCollection($id: ID!, $chainId: String!, $name: String!, $symbol: String!, $description: String!, $ownerAddress: String!, $createdAt: String!, $price: String!, $imageUrl: String!, $totalSupply: String!, $mintedAmount: String!) {
        createCollection(id: $id, chainId: $chainId, name: $name, symbol: $symbol, description: $description, ownerAddress: $ownerAddress, createdAt: $createdAt, price: $price, imageUrl: $imageUrl, totalSupply: $totalSupply, mintedAmount: $mintedAmount) {
            id
            chainId
            name
            symbol
            description
            ownerAddress
            createdAt
            price
            imageUrl
            totalSupply
            mintedAmount

        }
    }
`;

export const UPDATE_COLLECTION = gql`
    mutation updateCollection($id: ID!) {
        updateCollection(id: $id) {
            id
            chainId
            name
            symbol
            description
            ownerAddress
            createdAt
            price
            imageUrl
            totalSupply
            mintedAmount

        }
    }
`;
