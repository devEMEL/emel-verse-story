import { ethers} from 'ethers';

import { FileObject, PinataSDK } from 'pinata-web3';

const IMAGE_SAMPLE =
    'https://maroon-major-crawdad-175.mypinata.cloud/ipfs/bafkreiaiqqqnwyvi5gksqfwsqihdt7izf5fklnbehal7elyusducquwq6i';

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: 'https://ipfs.io',
});

export const truncateAddress = (
    address: string,
    startLength = 6,
    endLength = 4
) => {
    if (!address) return '';
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const formatRelativeTime = (timestamp: any): any => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'} ago`;
    }
  
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  };

export const etherToWei = (amountInEther: string) => {
    return ethers.parseEther(amountInEther);
};

export const weiToEther = (amountInWei: string) => {
    return ethers.formatEther(amountInWei);
};

export const getImageURI = async (imageFile: FileObject) => {
    const upload = await pinata.upload.file(imageFile);
    return `ipfs://${upload.IpfsHash}`;
};

export const getTokenURI = async (metadata: object) => {
    const upload = await pinata.upload.json(metadata);
    return `ipfs://${upload.IpfsHash}`;
};

export const normalizeScientificNotation = (value: string | number): string => {
    // Convert to string and handle scientific notation
    const str = value.toString();
    if (str.includes('e')) {
      const [base, exponent] = str.split('e');
      const exp = parseInt(exponent);
      if (exp > 0) {
        return base.replace('.', '') + '0'.repeat(exp - (base.length - base.indexOf('.') - 1));
      }
    }
    return str;
  }