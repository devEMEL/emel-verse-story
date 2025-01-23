'use client';

import { useState, useEffect } from 'react';
import CollectionSort from './CollectionSort';
import { CollectionsGrid } from './CollectionsGrid';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS } from '@/queries/collectionQueries';
import { useChainId } from 'wagmi';

const CollectionsPage = () => {

    const chainId = useChainId();
    const [activeSort, setActiveSort] = useState('name');
    const [orderDirection, setOrderDirection] = useState('asc');
    const { loading, data, error, refetch } = useQuery(GET_COLLECTIONS, { 
        variables: { orderBy: activeSort, orderDirection, chainId: String(chainId) }
    });

    const handleSort = (sortType: any) => {
        if (sortType === activeSort) {
            // Toggle order direction if the same sort type is clicked
            setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // Update sorting criterion
            setActiveSort(sortType);
            setOrderDirection('asc'); // Reset to ascending order if sortType changes
        }

    };

    useEffect(() => {
        // Whenever activeSort or orderDirection changes, refetch with new variables
        refetch({
            orderBy: activeSort,
            orderDirection
        });

        // Logging after state has changed
        console.log("Updated activeSort:", activeSort);
        console.log("Updated orderDirection:", orderDirection);
    }, [activeSort, orderDirection, refetch]); // Dependency on both activeSort and orderDirection

    if (loading) return <p>Loading...</p>; // Loading Spinner
    if (error) return <p>Error : {error.message}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <CollectionSort onSort={handleSort} activeSort={activeSort} />
            </div>

            {/* Your collections grid/list will go here */}
            {
                !loading && !error && (
                    <CollectionsGrid
                        title="NFT Collections"
                        collections={data.collections}
                    />
                )
            }
        </div>
    );
};

export default CollectionsPage;