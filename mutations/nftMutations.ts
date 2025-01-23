import { gql } from "@apollo/client";


export const CREATE_NFT = gql`
    mutation createNFT($chainId: String!, $name: String!, $symbol: String!, $description: String!, $collectionAddress: String!, $tokenId: String!, $ownerAddress: String!, $mintedAt: String!, $imageUrl: String!) {
        createNFT(chainId: $chainId, name: $name, symbol: $symbol, description: $description, collectionAddress: $collectionAddress, tokenId: $tokenId, ownerAddress: $ownerAddress, mintedAt: $mintedAt, imageUrl: $imageUrl) {
            id
            chainId
            name
            symbol
            description
            collectionAddress
            tokenId
            ownerAddress
            mintedAt
        }
    }
`;