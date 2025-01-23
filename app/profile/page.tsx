'use client';
import { CollectionsGrid } from '@/components/CollectionsGrid';
import MyNFTs from '@/components/MyNFTs';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_BY_OWNER } from '@/queries/collectionQueries';
import { useAccount, useChainId } from 'wagmi';
import { GET_NFTS_BY_OWNER } from '@/queries/nftQueries';

const Page = () => {

    const chainId = useChainId();
    const { address } = useAccount();

    const { loading, error, data } = useQuery(GET_COLLECTIONS_BY_OWNER, {
        variables: { ownerAddress: address, chainId: String(chainId) },
        skip: !address, // Skip query until address is available
    });

    const { loading: nftLoading, error: nftError, data: nftData } = useQuery(GET_NFTS_BY_OWNER, {
        variables: { ownerAddress: address, chainId: String(chainId) },
        skip: !address, // Skip query until address is available
    });


    if (loading) return <p>Loading...</p>; // Loading Spinner
    if (error) return <p>Error : {error.message}</p>

    if (nftLoading) return <p>Loading...</p>; // Loading Spinner
    if (nftError) return <p>Error : {nftError.message}</p>
    if(!data || !nftData) {
        return <p>No data available</p>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Your collections grid/list will go here */}
            <CollectionsGrid title="My Collections" collections={data?.getCollectionsByOwner} />
            <MyNFTs title="My NFTs" NFTs={nftData?.getNftsByOwner} />
        </div>
    );
};

export default Page;
