'use client';
import React, { useState } from 'react';

export const FaucetForm = () => {
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log('Requesting faucet for:', address);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert('Success!');
        } catch (error) {
            alert('Failed!');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white mb-4"
                required
            />
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 disabled:bg-white/50"
            >
                {isLoading ? 'Requesting...' : 'Request Faucet'}
            </button>

            {/* <div className='mt-4 text-center bg-green-700 py-2 font-bold'>
                Sent 0.001 ETH  🎉 ✅️
            </div>

            <div className='mt-4 text-center bg-red-700 py-2 font-bold'>
               Error, try again in 24 hrs
            </div> */}
        </form>
    );
};
