import React from 'react';
import { FaucetForm } from '@/components/forms/FaucetForm';

const page = () => {
    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-lg">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Testnet ETH Faucet
                </h1>
                <div className="bg-black/80 p-6 rounded-lg">
                    <FaucetForm />
                </div>
            </div>
        </div>
    );
};

export default page;
