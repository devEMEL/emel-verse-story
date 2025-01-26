// @ts-nocheck

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts';
import { configDotenv } from 'dotenv';

configDotenv();


export const account = privateKeyToAccount(process.env.NEXT_PUBLIC_STORY_WALLET_PRIVATE_KEY as Address);
console.log({account});


const config: StoryConfig = {  
  account,  
  transport: http('https://rpc.odyssey.storyrpc.io'),  
  chainId: 'odyssey',  
}  
export const storyClient = StoryClient.newClient(config);

