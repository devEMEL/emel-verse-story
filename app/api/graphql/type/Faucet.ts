import { gql } from '@apollo/client';

export const FaucetType = gql`
    type Faucet {
        id: ID!
        lastRequestTime: String!
        message: String
        txHash: String
    }

    extend type Mutation {
        requestFaucet(
            id: ID!
        ): Faucet
    }
`;

