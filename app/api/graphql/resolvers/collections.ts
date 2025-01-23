// @ts-nocheck

import { collectionModel } from '@/models/Collection';
import { normalizeScientificNotation } from '@/utils';


const SORT_TYPES = {
    CREATED_AT: 'createdAt',
    PRICE: 'price',
    NAME: 'name',
    TOTAL_SUPPLY: 'totalSupply'
  };

  function validateSortParams(orderBy, orderDirection) {
    const validOrderByFields = Object.values(SORT_TYPES);
    const validDirections = ['asc', 'desc'];
    
    return {
      isValid: validOrderByFields.includes(orderBy) && validDirections.includes(orderDirection),
      orderBy,
      orderDirection
    };
  }

  async function getSortedCollections(orderBy, orderDirection, chainId) {
    try {
      const { isValid } = validateSortParams(orderBy, orderDirection);
      if (!isValid) return [];

      return await getBasicSortedCollections(orderBy, orderDirection, chainId);
    } catch (error) {
      console.error('Error in getSortedCollections:', error);
      return [];
    }
  }
  
  async function getBasicSortedCollections(orderBy, orderDirection, chainId) {
    const sortDirection = orderDirection === 'asc' ? 1 : -1;
    
    return await collectionModel.find({ chainId })
      .sort({ [orderBy]: sortDirection })
      .exec();
  }

  

export const collectionResolvers = {
    Query: {
        collections: async (_, { orderBy, orderDirection, chainId }, { dataSources }) => {
            return await getSortedCollections(orderBy, orderDirection, chainId)

        },
        collection: async (_, { id }, { dataSources }) => {
            return collectionModel.findById(id)
            
        },
        getCollectionsByOwner: async (_, { ownerAddress, chainId }, { dataSources }) => {
            try {
              return await collectionModel.find({ ownerAddress, chainId });
            } catch (error) {
              console.error("Error fetching collections by owner:", error);
              throw new Error("Unable to fetch collections for the specified owner");
            }
          },
    },
    Mutation: {
        createCollection: async (_, args, { dataSources }) => {

            const priceInWei = BigInt(normalizeScientificNotation(args.price)).toString();
            const collection = new collectionModel({
                _id: args.id,
                chainId: args.chainId,
                name: args.name,
                symbol: args.symbol,
                description: args.description,
                ownerAddress: args.ownerAddress,
                createdAt: args.createdAt,
                price: priceInWei,
                imageUrl: args.imageUrl,
                totalSupply: args.totalSupply,
                mintedAmount: args.mintedAmount,
            });
            return collection.save();
        },

        updateCollection: async (_, { id }, { dataSources }) => {
            // Find the collection by ID
            const collection = await collectionModel.findById(id);
        
            if (!collection) {
                throw new Error("Collection not found");
            }
        
            // Convert mintedAmount to a number, increment it, and convert back to a string
            const updatedMintedAmount = (parseInt(collection.mintedAmount || "0", 10) + 1).toString();
        
            // Update the collection with the new mintedAmount
            collection.mintedAmount = updatedMintedAmount;
        
            // Save the updated collection
            return collection.save();
        }
    },
};
