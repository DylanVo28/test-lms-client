import React, {useEffect, useMemo} from "react";
import {get} from "lodash";
import {createConnector} from 'wagmi';
import type {EIP1193Provider} from 'viem';
import {arbitrum, arbitrumSepolia} from "viem/chains";
import type {Chain} from 'viem';
import {useWalletConnect} from "./useWalletConnect";
import {base} from "viem/chains";

declare global {
    interface Window {
        openModalPrivyConnect : ()=>void
    }
}
export const ModalPrivyConnect=()=>{
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {login, connectors, connect, connectWallet} =useWalletConnect()
    const icon=useMemo(()=>{
        const icons={
            "walletConnect": "https://hype.what.exchange/icons/walletconnect-icon.png",
            "metaMaskSDK": "https://hype.what.exchange/icons/metamask-icon.png",
            "io.metamask": "https://hype.what.exchange/icons/metamask-icon.png",
            "io.privy.wallet": "https://hype.what.exchange/icons/privy-icon.png",
            "phantom": "https://hype.what.exchange/icons/phantom-icon.png",
            "brave": "https://hype.what.exchange/icons/brave-icon.png",
            "binance": "https://hype.what.exchange/icons/binance-icon.png",
        }
        return icons
    },[])


    const connectorToPrivyWallet = useMemo(() => {
        const map: Record<string, string> = {
            'io.metamask': 'metamask',
            'metaMaskSDK': 'metamask',
            'walletConnect': 'wallet_connect',
        };
        return map;
    }, []);

    const handleConnectWallet = async (connector: any) => {
        try {
            // Check if this is a Privy-managed wallet (MetaMask or WalletConnect)
            const privyWalletName = connectorToPrivyWallet[connector.id];

            if (privyWalletName && connectWallet) {
                // Use Privy's connectWallet for MetaMask and WalletConnect
                await connectWallet({ walletList: [privyWalletName as 'metamask' | 'wallet_connect'] });
            } else {
                // For other wallets (injected), use wagmi connect
                await connect({ connector, chainId: base.id });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    }

    // 连接特定钱包
    const handleConnectSpecificWallet = async (walletName: 'phantom' | 'brave' | 'binance') => {
        try {
            let provider: any = null;
            if (walletName === 'brave') {
                provider = (window as any).braveEthereum as EIP1193Provider;
                if (!provider || (!(window as any).braveEthereum?.isBraveWallet && !(window as any).braveEthereum?._brave)) {
                    throw new Error('Brave Wallet is not installed. Please install it first.');
                }
            }
            else if (walletName === 'binance') {
                provider = (window as any).binancew3w?.ethereum as EIP1193Provider;
                if (!provider) {
                    throw new Error('Binance Wallet is not installed. Please install it first.');
                    return;
                }
            }
            
            // 请求账户授权
            await provider.request({ method: 'eth_requestAccounts' });
  
            // 创建自定义 connector 并连接到 wagmi
            const customConnector = createConnector((config) => ({
                id: walletName,
                name: walletName === 'brave' ? 'Brave Wallet' : 'Binance Wallet',
                type: 'injected',
                async setup() {
                    // Setup logic if needed
                },
                async connect(parameters) {
                    const accounts = await provider.request({ method: 'eth_requestAccounts' });
                    const chainId = await provider.request({ method: 'eth_chainId' });
                    return {
                        accounts: accounts.map((account: string) => account as `0x${string}`),
                        chainId: Number(chainId),
                    };
                },
                async disconnect() {
                    // Disconnect logic if needed
                },
                async getAccounts() {
                    const accounts = await provider.request({ method: 'eth_accounts' });
                    return accounts.map((account: string) => account as `0x${string}`);
                },
                async getChainId() {
                    const chainId = await provider.request({ method: 'eth_chainId' });
                    return Number(chainId);
                },
                async isAuthorized() {
                    try {
                        const accounts = await provider.request({ method: 'eth_accounts' });
                        return accounts.length > 0;
                    } catch {
                        return false;
                    }
                },
                getProvider() {
                    return provider;
                },
                async switchChain({ chainId: targetChainId }) {
                    const hexChainId = `0x${targetChainId.toString(16)}`;
                    
                    // 根据 chainId 获取对应的 Chain 对象
                    const targetChain: Chain = targetChainId === arbitrum.id ? arbitrum : arbitrumSepolia;
                    
                    try {
                        // 尝试切换链
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: hexChainId }],
                        });
                        return targetChain;
                    } catch (switchError: any) {
                        // 如果链不存在（错误码 4902），则添加链
                        if (switchError.code === 4902 || switchError.code === -32603) {
                            try {
                                const explorerUrl = targetChain.blockExplorers?.default?.url;
                                await provider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                        chainId: hexChainId,
                                        chainName: targetChain.name,
                                        nativeCurrency: {
                                            name: targetChain.nativeCurrency.name,
                                            symbol: targetChain.nativeCurrency.symbol,
                                            decimals: targetChain.nativeCurrency.decimals,
                                        },
                                        rpcUrls: targetChain.rpcUrls.default.http,
                                        blockExplorerUrls: explorerUrl ? [explorerUrl] : undefined,
                                    }],
                                });
                                return targetChain;
                            } catch (addError) {
                                throw new Error(`Failed to add chain: ${addError}`);
                            }
                        }
                        // 如果用户拒绝，抛出错误
                        if (switchError.code === 4001) {
                            throw new Error('User rejected the chain switch.');
                        }
                        throw switchError;
                    }
                },
                onAccountsChanged(accounts) {
                    if (accounts.length === 0) {
                        config.emitter.emit('disconnect');
                    } else {
                        config.emitter.emit('change', { accounts: accounts.map((account: string) => account as `0x${string}`) });
                    }
                },
                onChainChanged(chainId) {
                    const chainIdNumber = typeof chainId === 'string' ? Number.parseInt(chainId, 16) : Number(chainId);
                    config.emitter.emit('change', { chainId: chainIdNumber });
                },
                onDisconnect() {
                    config.emitter.emit('disconnect');
                },
            }));
            
            // 使用 wagmi connect 连接钱包
            await connect({ connector: customConnector, chainId: base.id });
            
            setIsModalOpen(false);
        } catch (error) {
            console.error(`Failed to connect ${walletName}:`, error);
            if ((error as any)?.code === 4001) {
                console.error('User rejected the connection request.');
            } else {
                console.error(`Failed to connect ${walletName}. Please try again.`);
            }
        }
    }
    const handleEmailLogin = () => {
        login({
            loginMethods: ['email'],
        });
    };

    // Xử lý đăng nhập với Google
    const handleGoogleLogin = () => {
        login({
            loginMethods: ['google'],
        });
    };

    // Xử lý đăng nhập với Twitter/X
    const handleTwitterLogin = () => {
        login({
            loginMethods: ['twitter'],
        });
    };

    useEffect(()=>{
        window.openModalPrivyConnect = () =>{
            setIsModalOpen(true);
        }
    },[])

    if(!isModalOpen){
        return <></>
    }

    const handleConnectWalletSolana = async (walletList:string) => {
        // TODO: Implement Solana wallet connection
        setIsModalOpen(false)
    }

    return <div className="fixed inset-0 oui-bg-black/80 flex items-center justify-end z-50">
        <div
            role="dialog"
            aria-describedby="radix-:r2:"
            aria-labelledby="radix-:r1:"
            data-state="open"
            className="oui-fixed oui-z-50 oui-gap-4  oui-px-4 oui-shadow-lg oui-transition oui-ease-in-out data-[state=closed]:oui-duration-260 data-[state=open]:oui-duration-300 data-[state=open]:oui-animate-in data-[state=closed]:oui-animate-out oui-inset-y-0 oui-right-0 oui-h-auto oui-w-3/4 my-4 py-4 oui-border mr-4 data-[state=closed]:oui-slide-out-to-right data-[state=open]:oui-slide-in-from-right sm:oui-max-w-sm !oui-p-4  !oui-bg-[#131519] !oui-border !oui-border-solid oui-border-line-12 oui-border-solid !oui-bottom-[30px] oui-right-3 oui-top-[48px] !oui-h-auto oui-w-[300px] oui-overflow-hidden rounded-[16px] oui-bg-[#131519]"
            tabIndex={-1}
            style={{ pointerEvents: 'auto' }}
        >
            <div className="oui-h-full oui-py-0 oui-border-none oui-relative">
                <div 
                    className="oui-absolute oui-inset-x-[50px] -oui-top-[calc(100vh/2)] oui-z-0 oui-h-screen"
                    style={{
                        background: "conic-gradient(from -41deg at 40.63% 50.41%, rgba(242, 98, 181, 0) 125.179deg, rgba(95, 197, 255, 0.2) 193.412deg, rgba(255, 172, 137, 0.2) 216.021deg, rgba(129, 85, 255, 0.2) 236.071deg, rgba(120, 157, 255, 0.2) 259.953deg, rgba(159, 115, 241, 0) 311.078deg)",
                        filter: "blur(50px)"
                    }}
                ></div>
                
                <div className="oui-relative oui-z-10 oui-flex oui-h-full oui-flex-col oui-gap-4 md:oui-gap-5">
                    {/* Header */}
                    <div className="oui-flex oui-flex-none oui-items-center oui-justify-between">
                        <div className="oui-font-semibold oui-text-base-contrast-80  oui-pb-2 oui-text-[20px] md:oui-py-0 md:oui-text-base">
                            Connect wallet
                        </div>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            className="oui-size-5 oui-cursor-pointer oui-text-base-contrast-20 hover:oui-text-base-contrast-80"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <path fill="currentcolor" fillOpacity="0.54" d="M4.994 3.906c-.256 0-.523.086-.718.281a1.029 1.029 0 0 0 0 1.438l6.28 6.281-6.28 6.281a1.029 1.029 0 0 0 0 1.438c.39.39 1.047.39 1.437 0l6.281-6.28 6.282 6.28c.39.39 1.047.39 1.437 0 .39-.39.39-1.047 0-1.438l-6.281-6.28 6.281-6.282c.39-.39.39-1.047 0-1.438a1.013 1.013 0 0 0-.719-.28c-.256 0-.523.085-.718.28l-6.282 6.281-6.28-6.28a1.013 1.013 0 0 0-.72-.282Z"></path>
                        </svg>
                    </div>

                    {/* Scrollable Content */}
                    <div className="oui-relative oui-overflow-hidden oui-scroll-area-root oui-flex oui-grow oui-shrik oui-basis-auto oui-custom-scrollbar" style={{ position: 'relative' }}>
                        <div className="oui-h-full oui-w-full oui-rounded-[inherit]" style={{ overflow: 'auto' }}>
                            <div style={{ minWidth: '100%', display: 'table' }}>
                                <div className="oui-flex oui-flex-col oui-gap-4 md:oui-gap-5">
                                    {/* Login Section */}
                                    <div className="oui-box oui-flex oui-flex-col oui-items-start oui-justify-start oui-flex-nowrap oui-gap-2 oui-w-full">
                                        <div className="oui-flex oui-items-center oui-justify-between oui-mb-3 oui-text-sm oui-font-semibold oui-text-base-contrast-80">
                                            Login in
                                        </div>
                                        <div className="oui-box oui-grid oui-grid-cols-1 oui-gap-2 oui-w-full">
                                            <div>
                                                <button
                                                    onClick={handleEmailLogin}
                                                    className="oui-flex oui-cursor-pointer oui-items-center oui-justify-center oui-gap-1 oui-rounded-[6px]  oui-border oui-border-base-contrast-12 oui-px-2 oui-py-[11px] oui-border-none oui-bg-[#333948]  w-full"
                                                >
                                                    <img src="https://oss.orderly.network/static/sdk/privy/email.svg" className="oui-size-[18px]" />
                                                    <div className="oui-text-2xs oui-text-base-contrast">Email</div>
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={handleGoogleLogin}
                                                    className="oui-flex oui-cursor-pointer oui-items-center oui-justify-center oui-gap-1 oui-rounded-[6px]  oui-border oui-border-base-contrast-12 oui-px-2 oui-py-[11px] oui-border-none oui-bg-[#335FFC]  w-full"
                                                >
                                                    <img src="https://oss.orderly.network/static/sdk/privy/google.svg" className="oui-size-[18px]" />
                                                    <div className="oui-text-2xs oui-text-base-contrast">Google</div>
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={handleTwitterLogin}
                                                    className="oui-flex oui-cursor-pointer oui-items-center oui-justify-center oui-gap-1 oui-rounded-[6px]  oui-border oui-border-base-contrast-12 oui-px-2 oui-py-[11px] oui-border-none oui-bg-[#07080A] w-full"
                                                >
                                                    <img src="https://oss.orderly.network/static/sdk/privy/twitter.svg" className="oui-size-[18px]" />
                                                    <div className="oui-text-2xs oui-text-base-contrast">X / Twitter</div>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="oui-mt-4 oui-flex oui-h-3 oui-justify-center">
                                            <img src="https://oss.orderly.network/static/sdk/privy/privy-logo.png" className="oui-h-[10px]" />
                                        </div>
                                        <div className="oui-mt-4 oui-h-px oui-w-full oui-bg-line md:oui-mt-5"></div>
                                    </div>

                                    {/* EVM Wallets Section */}
                                    <div className="">
                                        <div className="oui-mb-2 oui-text-sm oui-font-semibold oui-text-base-contrast-80">EVM</div>
                                        <div className="oui-grid oui-grid-cols-2 oui-gap-2">
                                            {connectors.map((connector) => (
                                                <button
                                                    key={connector.id}
                                                    onClick={() => handleConnectWallet(connector)}
                                                    className="oui-flex oui-flex-1 oui-cursor-pointer oui-items-center oui-justify-start oui-gap-1 oui-rounded-[6px]  oui-px-2 oui-py-[11px] oui-bg-[#07080A]"
                                                >
                                                    <div className="oui-w-[18px] oui-h-[18px] oui-flex oui-items-center oui-justify-center">
                                                        <img 
                                                            src={(connector.icon ? connector.icon : get(icon, connector.id, "")) || ""}
                                                            className="oui-w-[18px] oui-h-[18px]" 
                                                            alt={connector.name}
                                                        />
                                                    </div>
                                                    <div className="oui-text-2xs oui-text-base-contrast">{connector.name}</div>
                                                </button>
                                            ))}
                                            {/* MetaMask button - handled by Privy */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        if (connectWallet) {
                                                            await (connectWallet as any)({ walletList: ['metamask'] });
                                                        }
                                                        setIsModalOpen(false);
                                                    } catch (error) {
                                                        console.error('Failed to connect MetaMask:', error);
                                                    }
                                                }}
                                                className="oui-flex oui-flex-1 oui-cursor-pointer oui-items-center oui-justify-start oui-gap-1 oui-rounded-[6px]  oui-px-2 oui-py-[11px] oui-bg-[#07080A]"
                                            >
                                                <div className="oui-w-[18px] oui-h-[18px] oui-flex oui-items-center oui-justify-center">
                                                    <img
                                                        src="https://hype.what.exchange/icons/metamask-icon.png"
                                                        className="oui-w-[18px] oui-h-[18px]"
                                                        alt="MetaMask"
                                                    />
                                                </div>
                                                <div className="oui-text-2xs oui-text-base-contrast">MetaMask</div>
                                            </button>

                                            {/* WalletConnect button - handled by Privy */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        if (connectWallet) {
                                                            await (connectWallet as any)({ walletList: ['wallet_connect'] });
                                                        }
                                                        setIsModalOpen(false);
                                                    } catch (error) {
                                                        console.error('Failed to connect WalletConnect:', error);
                                                    }
                                                }}
                                                className="oui-flex oui-flex-1 oui-cursor-pointer oui-items-center oui-justify-start oui-gap-1 oui-rounded-[6px]  oui-px-2 oui-py-[11px] oui-bg-[#07080A]"
                                            >
                                                <div className="oui-w-[18px] oui-h-[18px] oui-flex oui-items-center oui-justify-center">
                                                    <img
                                                        src="https://hype.what.exchange/icons/walletconnect-icon.png"
                                                        className="oui-w-[18px] oui-h-[18px]"
                                                        alt="WalletConnect"
                                                    />
                                                </div>
                                                <div className="oui-text-2xs oui-text-base-contrast">WalletConnect</div>
                                            </button>

                                            {/* Brave Wallet button */}
                                            <button
                                                onClick={() => handleConnectSpecificWallet('brave')}
                                                className="oui-flex oui-flex-1 oui-cursor-pointer oui-items-center oui-justify-start oui-gap-1 oui-rounded-[6px]  oui-px-2 oui-py-[11px] oui-bg-[#07080A]"
                                            >
                                                <div className="oui-w-[18px] oui-h-[18px] oui-flex oui-items-center oui-justify-center">
                                                    <img
                                                        src="https://hype.what.exchange/icons/brave-icon.png"
                                                        className="oui-w-[18px] oui-h-[18px]"
                                                        alt="Brave Wallet"
                                                        onError={(e) => {
                                                            // 如果图标不存在，使用占位符或默认图标
                                                            (e.target as HTMLImageElement).src = "https://hype.what.exchange/icons/metamask-icon.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className="oui-text-2xs oui-text-base-contrast">Brave Wallet</div>
                                            </button>

                                            {/* Binance Wallet button */}
                                            <button
                                                onClick={() => handleConnectSpecificWallet('binance')}
                                                className="oui-flex oui-flex-1 oui-cursor-pointer oui-items-center oui-justify-start oui-gap-1 oui-rounded-[6px]  oui-px-2 oui-py-[11px] oui-bg-[#07080A]"
                                            >
                                                <div className="oui-w-[18px] oui-h-[18px] oui-flex oui-items-center oui-justify-center">
                                                    <img
                                                        src="https://hype.what.exchange/icons/binance-icon.png"
                                                        className="oui-w-[18px] oui-h-[18px]"
                                                        alt="Binance Wallet"
                                                        onError={(e) => {
                                                            // 如果图标不存在，使用占位符或默认图标
                                                            (e.target as HTMLImageElement).src = "https://hype.what.exchange/icons/metamask-icon.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className="oui-text-2xs oui-text-base-contrast">Binance Wallet</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="oui-box oui-flex oui-flex-col oui-items-center oui-justify-start oui-flex-nowrap oui-gap-4">
                        <div className="oui-flex-none oui-text-center oui-text-2xs oui-font-semibold  oui-text-base-contrast-80">
                            By connecting your wallet, you acknowledge and agree to the{' '}
                            <a href="termsofuse" className="oui-cursor-pointer oui-text-primary oui-underline" target="_blank" rel="noreferrer">
                                terms of use
                            </a>
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}