//@ts-nocheck

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config();

const privateKey: Address = `0x${process.env.STORY_WALLET_PRIVATE_KEY}`

export const account: Account = privateKeyToAccount(privateKey);

// console.log({account});

const config: StoryConfig = {  
  account,  
  transport: http('https://rpc.odyssey.storyrpc.io'),  
  chainId: 'odyssey',  
}  
export const storyClient = StoryClient.newClient(config);

