import Link from 'next/link';
import React from 'react';

export const Logo: React.FC = () => {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">ML</span>
            </div>
            <span className="text-white text-xl font-bold">emelverse</span>
        </Link>
    );
};
