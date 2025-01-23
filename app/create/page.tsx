// @ts-nocheck
'use client';

import React, { useState, FormEvent } from 'react';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextArea } from '@/components/forms/FormTextArea';
import { ImagePreview } from '@/components/forms/ImagePreview';
import { usePopup } from '@/hooks/usePopup';
import { SuccessPopup } from '@/components/popups/SuccessPopup';
import { etherToWei, getImageURI, normalizeScientificNotation } from '@/utils';
import { useErrorPopup } from '@/hooks/useErrorPopup';
import { ErrorPopup } from '@/components/popups/ErrorPopup';
import { useToastify } from '@/hooks/useToastify';
import { ToastPopup } from '@/components/popups/ToastPopup';
import { ethers } from 'ethers';
import { useEthersProvider, useEthersSigner } from '../layout';
import NFTCollectionFactory from '@/abi/NFTCollectionFactory.json';
import { useChainId } from 'wagmi';
import { CREATE_COLLECTION } from '@/mutations/collectionMutations';
import { GET_COLLECTIONS } from '@/queries/collectionQueries';
import { useMutation } from '@apollo/client';

interface ExistingData {
    collections: any[]
}

const page: React.FC = () => {
    const { isOpen, openPopup, closePopup } = usePopup();
    const { isOpen: isErrorOpen, openPopup: openErrorPopup, closePopup: closeErrorPopup } = useErrorPopup();
    const { isOpen: isToastOpen, openPopup: openToastPopup, closePopup: closeToastPopup } = useToastify();

    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        description: '',
        price: '',
        totalSupply: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit libero optio adipisci eos atque culpa corporis error eum maxime suscipit quibusdam, veritatis et laborum pariatur quod, alias in nobis magnam.");
    const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");
    const [eventName, setEventName] = useState<string>("");
    const [eventImageUrl, setEventImageUrl] = useState<string>("");

    const provider = useEthersProvider();
    const signer = useEthersSigner();

    const chainId = useChainId();

    const [createCollection, { loading, error }] = useMutation(CREATE_COLLECTION, {
        update(cache, { data: { createCollection } }) {

          const existingData: ExistingData | null = cache.readQuery({ 
            query: GET_COLLECTIONS 
          });
          
          if (existingData) {
            const { collections } = existingData;
            cache.writeQuery({
              query: GET_COLLECTIONS,
              data: { 
                collections: [...collections, createCollection]
              },
            });
          }
        },
        onError: (error) => {
          console.error('Create collection error:', error);
        }
      });

    const handleCreateCollection = async(name: string, symbol: string, description: string, price: bigint, totalSupply: string, imageFile: File) => {
        console.log("HandleCreateCollection...")
        // Handle form submission here

        // use as BigInt(totalSupply)

        // pin to ipfs and stuffs
        setLoadingMessage("Pinning Image to IPFS")
        openToastPopup()
        const imageURI = await getImageURI(imageFile);
        console.log(imageURI);
        // closeToastPopup()
        setLoadingMessage("Deploying Collection...")
        // create contract obj
        const contract = new ethers.Contract(
            NFTCollectionFactory.network[2].address,
            NFTCollectionFactory.abi,
            signer
        );
        console.log(NFTCollectionFactory.network[2].address)
        // make txn
        const tx = await contract.createCollection(
            name,
            symbol,
            description,
            price,
            BigInt(totalSupply),
            imageURI
        );
        const response = await tx.wait();
        console.log(response);
        
        // read event log
        const filter = contract.filters.CollectionCreated();
        const events = await contract.queryFilter(filter, response.blockNumber);
        console.log(events);

        const eventObj = {
            chainId,
            contractAddress: events[0].args[0],
            name: events[0].args[1],
            symbol: events[0].args[2],
            description: events[0].args[3],
            creator: events[0].args[4],
            createdAt: Number(String(events[0].args[5])),
            price: BigInt(String(events[0].args[6])),
            maxSupply: Number(String(events[0].args[7])),
            imageURI: events[0].args[8],
            mintedAmount: 0,
        };
        console.log({eventObj});
        // make createcollection request (push to db)
        await createCollection({variables: {id: eventObj.contractAddress, chainId: String(chainId), name: String(eventObj.name), symbol: String(eventObj.symbol), description: String(eventObj.description), ownerAddress: String(eventObj.creator), createdAt: String(eventObj.createdAt), price: normalizeScientificNotation(String(eventObj.price)), imageUrl: String(eventObj.imageURI), totalSupply: String(eventObj.maxSupply), mintedAmount: String(eventObj.mintedAmount)}})

        return {
            name: eventObj.name,
            imageURI: eventObj.imageURI
        }
        
    }

    const createCollectionFunc = async(e: FormEvent) => {
        e.preventDefault();

        if (
            !(
                formData.name &&
                formData.symbol &&
                formData.description &&
                formData.price &&
                formData.totalSupply &&
                imageFile
            )
        )
        return;

        const priceInWei = etherToWei(formData.price);
        console.log({name: formData.name, symbol: formData.symbol, description: formData.description, price: priceInWei, totalSupply: formData.totalSupply});

        try {

            const { name, imageURI } = await handleCreateCollection(formData.name, formData.symbol, formData.description, priceInWei, formData.totalSupply, imageFile );
            setEventName(name);
            // imageURIToSrc
            setEventImageUrl(imageURI);

            closeToastPopup();

            // display success popup (define the image url and name)
            openPopup();
        } catch(err: any) {
            // close toast
            closeToastPopup();
            console.log({errorMessage: err})
            setErrorMessage(String(err));
            openErrorPopup();
            console.log(err);
        } finally {
            // after form submission
            setFormData({
                name: '',
                symbol: '',
                description: '',
                price: '',
                totalSupply: '',
            })
            setImageFile(null)
            
        }
  

        
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-2xl font-bold text-white mb-8">
                    Create New Collection
                </h1>
                {/* <button onClick={openErrorPopup}>open error popup</button> */}
                <SuccessPopup
                    isOpen={isOpen}
                    onClose={closePopup}
                    nftName={eventName}
                    imageUrl={eventImageUrl}
                    title="NFT Collection Created Successfully!"
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
                <form
                    onSubmit={createCollectionFunc}
                    className="bg-black/80 p-6 rounded-lg"
                >
                    <FormInput
                        label="Collection Name"
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />

                    <FormInput
                        label="Symbol"
                        type="text"
                        id="symbol"
                        value={formData.symbol}
                        onChange={(e) =>
                            setFormData({ ...formData, symbol: e.target.value })
                        }
                        required
                    />

                    <FormTextArea
                        label="Description"
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white mb-2">
                            Collection Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-white"
                            required
                        />
                        <ImagePreview file={imageFile} />
                    </div>

                    <FormInput
                        label="Price (MON)"
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                        required
                        min={0}
                        step="0.000001"
                    />

                    <FormInput
                        label="Total Supply"
                        type="number"
                        id="totalSupply"
                        value={formData.totalSupply}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                totalSupply: e.target.value,
                            })
                        }
                        required
                        min={1}
                    />

                    <button
                        type="submit"
                        // onClick={createCollectionFunc}
                        className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors mt-6"
                    >
                        Create Collection
                    </button>
                </form>
            </div>
        </div>
    );
};

export default page;
