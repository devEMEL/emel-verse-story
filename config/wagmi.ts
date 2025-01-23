import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { baseSepolia, sepolia } from 'viem/chains';
import type { Chain } from 'viem';

const emel_Tanssi = {
    id: 1219,
    name: 'Emel_Tanssi',
    nativeCurrency: {
        decimals: 18,
        name: 'Emel_Tanssi',
        symbol: 'EML',
    },
    rpcUrls: {
        public: {
            http: ['https://fraa-flashbox-4524-rpc.a.stagenet.tanssi.network'],
        },
        default: {
            http: ['https://fraa-flashbox-4524-rpc.a.stagenet.tanssi.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Emel_Tanssi',
            url: 'https://opencampus-codex.blockscout.com',
        },
    },

    testnet: false,
} as const satisfies Chain;

const monadDevnet = {
    id: 20143,
    name: 'Monad Devnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad Devnet',
        symbol: 'DMON',
    },
    rpcUrls: {
        public: {
            http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
        },
        default: {
            http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Monad Devnet',
            url: 'https://explorer.monad-devnet.devnet101.com',
        },
    },

    testnet: true,
} as const satisfies Chain;

export const wagmiConfig = getDefaultConfig({
    appName: 'tanssi minter',
    projectId: 'cdddc2c45ee7a243f73916dfe293c0ca',
    chains: [
        monadDevnet,
        // baseSepolia
    ],
    transports: {
        [monadDevnet.id]: http(),
        // [baseSepolia.id]: http(),
    },
});
