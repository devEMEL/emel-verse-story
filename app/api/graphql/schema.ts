import { gql } from '@apollo/client';
import { CollectionType } from './type/Collection';
import { NFTType } from './type/NFT';
import { FaucetType } from './type/Faucet';

const baseSchema = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }
`;

export const typeDefs = [baseSchema, CollectionType, NFTType, FaucetType];
