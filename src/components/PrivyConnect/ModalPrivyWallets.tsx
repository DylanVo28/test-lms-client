"use client"
import React, {useEffect, useState} from 'react';
import { X, ChevronUp, Copy, ExternalLink } from 'lucide-react';
import {useWalletConnect} from "./useWalletConnect";

const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

declare global {
    interface Window {
        openModalPrivyWallet: () => void;
    }
}
const CopyAddress: React.FC<{ address: string }> = ({ address }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className=" transition-colors duration-200 cursor-pointer"
        >
            {copied ? '✓ Copied!' : <Copy className={'w-4 h-4'}/>}
        </button>
    );
};
export const ModalPrivyWallet = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const {address, disconnect}=useWalletConnect()
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const safeAddress = address ?? "";
    useEffect(() => {
        window.openModalPrivyWallet = () => {
            setIsOpen(true)
        }
    }, []);

    // When modal mounts (isOpen), toggle visibility on next tick for smooth transition
    useEffect(() => {
        if (isOpen) {
            // start hidden then show to trigger transition
            setIsVisible(false);
            const t = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(t);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Lock body scroll to avoid layout shift (scrollbar) and jank
    useEffect(() => {
        if (isOpen) {
            const previous = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = previous;
            };
        }
    }, [isOpen]);

    const handleClose = () => {
        // add a fade-out before unmount; match backdrop duration (300ms)
        if (isClosing) return;
        setIsClosing(true);
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 320);
    }

    const handleDisconnect = async () => {
        await disconnect()
        setIsOpen(false)
    }


    if(!isOpen) return <></>;

    return (
        <>
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} `}
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                onClick={handleClose}
            />
            <div
                role="dialog"
                aria-labelledby="wallet-dialog-title"
                className={"oui-fixed oui-z-50 oui-gap-4  oui-px-4 oui-shadow-lg oui-inset-y-0 oui-right-0 oui-h-auto oui-w-3/4 my-4 py-4 oui-border mr-4 sm:oui-max-w-sm !oui-p-4  !oui-bg-[#131519] !oui-border !oui-border-solid oui-border-line-12 oui-border-solid !oui-bottom-[30px] oui-right-3 oui-top-[48px] !oui-h-auto oui-w-[300px] oui-overflow-hidden rounded-[16px] oui-bg-[#131519]"}
                tabIndex={-1}
                style={{
                    pointerEvents: isClosing ? 'none' : 'auto',
                    willChange: 'transform, opacity',
                    transform: (isVisible && !isClosing) ? 'translateX(0%)' : 'translateX(100%)',
                    opacity: (isVisible && !isClosing) ? 1 : 0,
                    transition: 'transform 300ms ease, opacity 300ms ease'
                }}
            >
                <div className="oui-h-full oui-py-0 oui-border-none oui-relative">
                    <div className="oui-absolute oui-inset-x-[50px] -oui-top-[calc(100vh/2)] oui-z-0 oui-h-screen"
                         style={{
                             background : "conic-gradient(from -41deg at 40.63% 50.41%, rgba(242, 98, 181, 0) 125.179deg, rgba(95, 197, 255, 0.2) 193.412deg, rgba(255, 172, 137, 0.2) 216.021deg, rgba(129, 85, 255, 0.2) 236.071deg, rgba(120, 157, 255, 0.2) 259.953deg, rgba(159, 115, 241, 0) 311.078deg)",
                             filter: "blur(50px)"
                         }}></div>
                    <div className="oui-relative oui-z-10 oui-flex oui-h-full oui-flex-col oui-gap-4 md:oui-gap-5">
                        <div className="oui-flex oui-flex-none oui-items-center oui-justify-between">
                            <div id="wallet-dialog-title" className="oui-font-semibold oui-text-base-contrast-80  oui-pb-2 oui-text-[20px] md:oui-py-0 md:oui-text-base">My wallet</div>
                            <button className="oui-size-5 oui-cursor-pointer oui-text-base-contrast-20 hover:oui-text-base-contrast-80" onClick={handleClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div>
                            <div className="oui-flex oui-flex-col oui-gap-5">
                                <div className="oui-relative oui-h-[110px] oui-overflow-hidden oui-rounded-2xl  oui-p-4 oui-bg-[#283BEE]">
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: "-20px",
                                            background:
                                                'url("https://oss.orderly.network/static/sdk/wallet-card-bg.png") center center / contain no-repeat',
                                            width: 110,
                                            height: 110,
                                            zIndex: 0
                                        }}
                                    />
                                    <div className="oui-relative oui-z-10 oui-flex oui-h-full oui-flex-col oui-justify-between">
                                        <div className="oui-flex oui-items-center oui-justify-between">
                                            <div className="oui-text-sm oui-font-semibold oui-text-base-contrast">{formatAddress(safeAddress)}</div>
                                            <div className="oui-flex oui-items-center oui-justify-center oui-gap-2">
                                                <CopyAddress address={safeAddress} />
                                                <button className="oui-cursor-pointer oui-text-base-contrast-80 hover:oui-text-base-contrast" onClick={handleDisconnect}>
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};