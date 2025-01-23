'use client';
import React, { useEffect, useState } from 'react';
import { CollectionHeader } from '@/components/CollectionHeader';
import { CollectionStats } from '@/components/CollectionStats';
import { CollectionDescription } from '@/components/CollectionDescription';
import { MintButton } from '@/components/MintButton';
import { SuccessPopup } from '@/components/popups/SuccessPopup';
import { usePopup } from '@/hooks/usePopup';
import { useQuery } from '@apollo/client';
import { GET_COLLECTION } from '@/queries/collectionQueries';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import NFTCollection from '@/abi/NFTCollection.json';
import { useEthersProvider, useEthersSigner } from '@/app/layout';
import { weiToEther } from '@/utils';
import { ToastPopup } from '@/components/popups/ToastPopup';
import { useToastify } from '@/hooks/useToastify';
import { useErrorPopup } from '@/hooks/useErrorPopup';
import { ErrorPopup } from '@/components/popups/ErrorPopup';

interface PageProps {
    params: {
        id: string;
    }
}

const page: React.FC<PageProps> = ({ params }) => {


    const { id } = params;

    const [loadingMessage, setLoadingMessage] =useState("");
    const [errorMessage, setErrorMessage] = useState<string>("Lorem ");
    const { isOpen: isToastOpen, openPopup: openToastPopup, closePopup: closeToastPopup } = useToastify();
    const { isOpen: isErrorOpen, openPopup: openErrorPopup, closePopup: closeErrorPopup } = useErrorPopup();




    const provider = useEthersProvider();
    const signer = useEthersSigner();

    const [contractETHBalance, setContractETHBalance] = useState("0");
    const { isOpen, openPopup, closePopup } = usePopup();
    const { loading, data: collection, error } = useQuery(GET_COLLECTION, {
        variables: { id }
    });

    const { imageSrc, isLoading, } = useImageLoader(collection?.collection?.imageUrl);
    const { address } = useAccount();

    const withdrawETHFromContract = async() => {
        try {
            console.log({contractETHBalance});

            const contract = new ethers.Contract(
                collection?.collection?.id,
                NFTCollection.abi,
                signer
            );
            setLoadingMessage("Withdrawing ETH from contract ...");
            openToastPopup();
            const tx =await contract.withdraw();
            const response = await tx.wait();
            console.log(response);
            closeToastPopup()
            setLoadingMessage("");
        } catch (err) {
            closeToastPopup();
            console.log({errorMessage: err})
            setErrorMessage(String(err));
            openErrorPopup();
            console.log(err);
        }
        

    }

    useEffect(() => {

        const fetchBalance = async() => {
            try {
                const ETHBalance = await provider?.getBalance(id);
                setContractETHBalance(String(ETHBalance));
                console.log(String(ETHBalance));
            } catch(err) {
                console.log(err);
            }
            
        }
        fetchBalance()
    }, [contractETHBalance, address, id])
    

    if (loading) return <p>Loading...</p>; // Loading Spinner
    if (error) return <p>Error : {error.message}</p>

    return (
        <div className="min-h-screen bg-gray-900">
            <ErrorPopup
                    isOpen={isErrorOpen}
                    onClose={closeErrorPopup}
                    message={errorMessage}
                 />
            <ToastPopup
                      isVisible={isToastOpen}
                      message={loadingMessage}
                     
                 />
            <SuccessPopup
                isOpen={isOpen}
                onClose={closePopup}
                nftName=""
                imageUrl=""
                title="NFT Minted Successfully!"
            />
            <CollectionHeader
                name={collection?.collection?.name}
                imageUrl={imageSrc}
            />
            <div className="container mx-auto px-4 py-8 space-y-8">
                <CollectionStats
                    contractAddress={collection?.collection?.id}
                    ownerAddress={collection?.collection?.ownerAddress}
                    createdAt={collection?.collection?.createdAt}
                    price={collection?.collection?.price}
                    mintedAmount={collection?.collection?.mintedAmount}
                    totalSupply={collection?.collection?.totalSupply}
                />
                <CollectionDescription description={collection?.collection?.description} />
                {
                    collection?.collection?.ownerAddress === address && (
                        <button
                        onClick={withdrawETHFromContract}
                        className="w-full bg-white text-black font-bold py-4 px-8 rounded-lg hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-colors flex justify-center"
                    >
                        {/* contract balance */}
                        Withdraw my MON balance from contract: {weiToEther(contractETHBalance)} MON
                    </button>
                    ) 
                }
                <MintButton
                    collection={collection?.collection}
                    isOpen={isOpen}
                    onClose={closePopup}
                    disabled={
                        collection?.collection?.mintedAmount === collection?.collection?.totalSupply
                    }
                    openPopup={openPopup}
                />
            </div>
        </div>
    );
};

export default page;
