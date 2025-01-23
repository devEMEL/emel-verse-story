import { gql } from '@apollo/client';

export const GET_NFTS = gql`
    query getNFTs {
        nfts {
            id
            chainId
            name
            symbol
            description
            collectionAddress
            tokenId
            ownerAddress
            mintedAt
            imageUrl
        }
    }
`;

export const GET_NFT = gql`
    query getNFT($id: String!) {
        nft(id: $id) {
            id
            chainId
            name
            symbol
            description
            collectionAddress
            tokenId
            ownerAddress
            mintedAt
            imageUrl
        }
    }
`;

export const GET_NFTS_BY_OWNER = gql`

    query GetNftsByOwner($ownerAddress: String!, $chainId: String!) {
        getNftsByOwner(ownerAddress: $ownerAddress, chainId: $chainId) {
            id
            chainId
            name
            symbol
            description
            collectionAddress
            tokenId
            ownerAddress
            mintedAt
            imageUrl
        }
    }

`;