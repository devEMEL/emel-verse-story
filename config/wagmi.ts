import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import type { Chain } from 'viem';


const storyOdysseyTestnet = {
    id: 1516,
    name: 'Story Odyssey Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Story Odyssey Testnet',
        symbol: 'IP',
    },
    rpcUrls: {
        public: {
            http: ['https://rpc.odyssey.storyrpc.io/'],
        },
        default: {
            http: ['https://rpc.odyssey.storyrpc.io/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Story Odyssey Testnet',
            url: 'https://odyssey.storyscan.xyz',
        },
    },

    testnet: true,
} as const satisfies Chain;

export const wagmiConfig = getDefaultConfig({
    appName: 'emelverse',
    projectId: 'cdddc2c45ee7a243f73916dfe293c0ca',
    chains: [
        storyOdysseyTestnet,
    ],
    transports: {
        [storyOdysseyTestnet.id]: http(),
    },
});
