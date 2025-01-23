import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'

import { configDotenv } from 'dotenv';

configDotenv();
const privateKey: Address = `0x${process.env.STORY_WALLET_PRIVATE_KEY}`
export const account: Account = privateKeyToAccount(privateKey)

const config: StoryConfig = {  
  account: account,  
  transport: http(process.env.RPC_PROVIDER_URL),  
  chainId: 'odyssey',  
}  
export const storyClient = StoryClient.newClient(config)