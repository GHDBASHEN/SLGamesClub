import Link from 'next/link';
import { FaGamepad, FaTwitter, FaInstagram, FaDiscord, FaYoutube } from 'react-icons/fa';

const socialLinks = [
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaDiscord, href: '#', label: 'Discord' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer className="relative bg-card/50 border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <span className="bg-gradient-primary p-2.5 rounded-xl shadow-glow">
                                <FaGamepad className="text-xl text-white" />
                            </span>
                            <span className="text-xl font-bold font-gaming gaming-text-gradient">
                                SL Games Club
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                            The ultimate community platform for Sri Lankan gamers.
                            Connect, share, and level up together.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300"
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Add other footer columns as needed */}
                </div>
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SL Games Club.</p>
                    <p className="text-sm text-muted-foreground">Made with 💜 in Sri Lanka</p>
                </div>
            </div>
        </footer>
    );
}