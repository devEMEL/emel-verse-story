// @ts-nocheck
'use client';
import { getTokenURI, weiToEther } from '@/utils';
import { ethers } from 'ethers';
import React, { FormEvent, useState } from 'react';
import NFTCollection from '@/abi/NFTCollection.json';
import { useEthersProvider, useEthersSigner } from '@/app/layout';
import { useAccount, useChainId } from 'wagmi';
import { useMutation } from '@apollo/client';
import { CREATE_NFT } from '@/mutations/nftMutations';
import { GET_NFTS } from '@/queries/nftQueries';
import { useToastify } from '@/hooks/useToastify';
import { useErrorPopup } from '@/hooks/useErrorPopup';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SuccessPopup } from './popups/SuccessPopup';
import { ErrorPopup } from './popups/ErrorPopup';
import { ToastPopup } from './popups/ToastPopup';
import { UPDATE_COLLECTION } from '@/mutations/collectionMutations';
import { GET_COLLECTIONS } from '@/queries/collectionQueries';
import { useRegisterIPPopup } from '@/hooks/useRegisterIPPopup';
import { RegisterIPPopup } from './popups/RegisterIPPopup';
import { IpMetadata } from '@story-protocol/core-sdk'
import { storyClient } from '@/config/storyClient';
import { Address } from 'viem';
import { createHash } from 'crypto';

interface Collection {
    id: string;
    chainId: string;
    name: string;
    symbol: string;
    description: string;
    ownerAddress: string;
    createdAt: string;
    price: string;
    imageUrl: string;
    totalSupply: string;
    mintedAmount: string;
}

interface ExistingData {
    collections: any[]
}

interface MintButtonProps {
    collection: Collection;
    isOpen: boolean;
    onClose: () => void;
    disabled?: boolean;
    openPopup: () => void;
}

export const MintButton: React.FC<MintButtonProps> = ({
    collection,
    isOpen,
    onClose,
    disabled,
    openPopup,
}) => {



    // const { isOpen, openPopup, closePopup } = usePopup();
    const { isOpen: isToastOpen, openPopup: openToastPopup, closePopup: closeToastPopup } = useToastify();
    const { isOpen: isErrorOpen, openPopup: openErrorPopup, closePopup: closeErrorPopup } = useErrorPopup();
    const { isOpen: isRegisterIPOpen, openPopup: openRegisterIPPopup, closePopup: closeRegisterIPPopup } = useRegisterIPPopup();

    const [errorMessage, setErrorMessage] = useState<string>("Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit libero optio adipisci eos atque culpa corporis error eum maxime suscipit quibusdam, veritatis et laborum pariatur quod, alias in nobis magnam.");
    const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");
    const [registerIPMessage, setRegisterIPMessage] = useState<string>("Loading...");
    const [eventName, setEventName] = useState<string>("");
    const [eventImageUrl, setEventImageUrl] = useState<string>("");

    const provider = useEthersProvider();
    const signer = useEthersSigner();
    const { address } = useAccount();
    // const chainId = useChainId()
    const chainId = 1516;

    const [createNFT, { loading, error }] = useMutation(CREATE_NFT, {
        update(cache, { data: { createNFT } }) {
          const existingData = cache.readQuery({ 
            query: GET_NFTS
          });
          
          if (existingData) {
            const { nfts } = existingData;
            cache.writeQuery({
              query: GET_NFTS,
              data: { 
                nfts: [...nfts, createNFT]
              },
            });
          }
        },
        onError: (error) => {
          console.error('Create nft error:', error);
        }
      });

      const [updateCollection, { loading: upl, error: upe }] = useMutation(UPDATE_COLLECTION, {
        update(cache, { data: { updateCollection } }) {
          const existingData: ExistingData | null = cache.readQuery({
            query: GET_COLLECTIONS,
          });
      
          if (existingData) {
            const { collections } = existingData;
      
            // Replace the updated collection in the array
            const updatedCollections = collections.map((collection) =>
              collection.id === updateCollection.id ? updateCollection : collection
            );
      
            cache.writeQuery({
              query: GET_COLLECTIONS,
              data: {
                collections: updatedCollections,
              },
            });
          }
        },
        onError: (error) => {
          console.error('Update Collection error:', error);
        },
      });

    const handleMintCollection = async () => {
        console.log('Minting NFT...');

        const contract = new ethers.Contract(
            collection.id,
            NFTCollection.abi,
            signer
        );
        // make txn

        setLoadingMessage("Pinning Metadata to IPFS")
        openToastPopup()
        // prepare tokenURI
        const metadata = {
            name: collection.name, // next time
            description: collection.description,
            image: collection.imageUrl,
        };
        console.log(metadata);
        const tokenURI = await getTokenURI(metadata);
        console.log({tokenURI});

        setLoadingMessage("Minting NFT ...")
        const tx = await contract.mintNFT(tokenURI, { value: BigInt(collection.price), });
        const response = await tx.wait();
        console.log(response);
        
        // read event log
        const filter = contract.filters.NFTCreated();
        const events = await contract.queryFilter(filter, response.blockNumber);
        console.log(events);

        const eventObj = {
            chainId,
            collectionAddress: events[0].args[0],
            owner: events[0].args[1],
            name: events[0].args[2],
            symbol: events[0].args[3],
            description: events[0].args[4],
            tokenId: Number(String(events[0].args[5])),
            createdAt: Number(String(events[0].args[6])),
            imageUrl: collection.imageUrl,
        };
        console.log(eventObj);


        return {
            eventObj,
            // name: eventObj.name,
            // tokenId: eventObj.tokenId,
            // imageURI: eventObj.imageUrl,
            tokenURI,
            metadata
        }
    }
    const mintCollection = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const { eventObj, tokenURI, metadata } = await handleMintCollection();
            
            setEventName(`${name} #${eventObj.tokenId}`);
            // imageURIToSrc
            setEventImageUrl(eventObj.imageUrl);

            closeToastPopup();
            //// register ip popup...
            openRegisterIPPopup()
            setRegisterIPMessage("Registering IP...");
            // function to register ip
            // setup ip metadata
            const ipMetadata: IpMetadata = storyClient.ipAsset.generateIpMetadata({
                title: collection.name,
                description: collection.description,
                watermarkImg: collection.imageUrl,
                attributes: [
                  {
                    key: 'Rarity',
                    value: 'Common',
                  },
                ],
              });
            const ipIpfsHash = await getTokenURI(ipMetadata)
            const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
            // mint ip

            const nftHash = createHash('sha256').update(JSON.stringify(metadata)).digest('hex');//.......
            const response = await storyClient.ipAsset.registerIpAndAttachPilTerms({
                nftContract: collection.id as Address,
                tokenId: eventObj.tokenId!,
                terms: [], // IP already has non-commercial social remixing terms. You can add more here.
                ipMetadata: {
                  ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                  ipMetadataHash: `0x${ipHash}`,
                  nftMetadataURI: `https://ipfs.io/ipfs/${tokenURI.split('//')[1]}`,
                  nftMetadataHash: `0x${nftHash}`,
                },
                txOptions: { waitForTransaction: true },
              })
            
              console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
              console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`);

              await createNFT({variables: {chainId: String(chainId), name: String(eventObj.name), symbol: String(eventObj.symbol), description: String(eventObj.description), collectionAddress: String(eventObj.collectionAddress), tokenId: String(eventObj.tokenId), ownerAddress: String(eventObj.owner), mintedAt: String(eventObj.createdAt), imageUrl: String(eventObj.imageUrl), ipId: String(response.ipId)}});

              await updateCollection({ variables: { id: String(eventObj.collectionAddress) }});


            //////
            closeRegisterIPPopup()

            // add the ipid to database.....

            // display success popup (define the image url and name)
            openPopup();
        } catch(err) {
            // close toast
            closeToastPopup();
            console.log({errorMessage: err})
            setErrorMessage(String(err));
            openErrorPopup();
            console.log(err);
        } finally {

        }
    };

    return (
        <div>

                <SuccessPopup
                    isOpen={isOpen}
                    onClose={onClose}
                    nftName={eventName}
                    imageUrl={eventImageUrl}
                    title="NFT Minted Successfully!"
                />
                <ErrorPopup
                    isOpen={isErrorOpen}
                    onClose={closeErrorPopup}
                    message={errorMessage}
                 />
                 <ToastPopup
                      isVisible={isToastOpen}
                      message={loadingMessage}
                 />
                 <RegisterIPPopup
                    isVisible={isRegisterIPOpen}
                    message={registerIPMessage}
                  />

<button
            onClick={address && mintCollection}
            disabled={disabled}
            className="w-full bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-colors flex justify-center"
        >
            
            {address ? `Mint for ${weiToEther(String(collection.price))} MON` : <ConnectButton />}
        </button>
        </div>
        
    );
};
