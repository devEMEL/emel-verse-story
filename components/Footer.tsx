import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-black to-zinc-900/90 border-t border-zinc-800/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Main Nav */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">
                            Navigation
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/create"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Create
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profile"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faucet"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Faucet
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    {/* <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Faucet</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div> */}

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-lg">
                            Community
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800/50"
                            >
                                Twitter
                            </a>
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800/50"
                            >
                                Discord
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Copyright */}
                <div className="pt-8 border-t border-zinc-800/30 text-center">
                    <p className="text-zinc-500 text-sm">
                        © 2024 Emelverse. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
