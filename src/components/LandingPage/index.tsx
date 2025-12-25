import ImageCustom from '@/components/UI/ImageCustom';
import {useMemo, useState, useEffect} from "react";
import {useWalletConnect} from "adapter-connect"
import {base} from "viem/chains";
import type {EIP1193Provider} from 'viem';
import {createConnector, useAccount} from 'wagmi';
import RegisterFormModal from "@/components/RegisterFormModal";
import { useRouter } from 'next/router';

const SvgIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        height='100%'
        fill='none'
        viewBox='0 0 500 72'
        preserveAspectRatio={'none'}
    >
        <g clipPath='url(#a)'>
            <rect
                width='500'
                height='72'
                fill='#003E4A'
                fillOpacity='0.3'
                rx='20'
            ></rect>
            <g filter='url(#b)'>
                <path
                    fill='#00A8CE'
                    d='m522.5-57-370 51c111.667-2.667 314.286 1.5 322 49 6.171 38-104.667 54.667-140 57.5h188z'
                ></path>
            </g>
        </g>
        <defs>
            <clipPath id='a'>
                <rect width='500' height='72' fill='#fff' rx='20'></rect>
            </clipPath>
            <filter
                id='b'
                width='518'
                height='305.5'
                x='78.5'
                y='-131'
                colorInterpolationFilters='sRGB'
                filterUnits='userSpaceOnUse'
            >
                <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                <feBlend
                    in='SourceGraphic'
                    in2='BackgroundImageFix'
                    result='shape'
                ></feBlend>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                ></feColorMatrix>
                <feOffset dx='-8' dy='1'></feOffset>
                <feGaussianBlur stdDeviation='6.5'></feGaussianBlur>
                <feComposite
                    in2='hardAlpha'
                    k2='-1'
                    k3='1'
                    operator='arithmetic'
                ></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'></feColorMatrix>
                <feBlend in2='shape' result='effect1_innerShadow_1_42'></feBlend>
                <feGaussianBlur
                    result='effect2_foregroundBlur_1_42'
                    stdDeviation='37'
                ></feGaussianBlur>
            </filter>
        </defs>
    </svg>
);

export const LandingPage = () => {
    const {login, connectors, connect, connectWallet, disconnect} = useWalletConnect()
    const {address} = useAccount()
    const [isConnecting, setIsConnecting] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [progress, setProgress] = useState(0)
    const router = useRouter()

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
    const loginOptions = [
        {label: 'Email', icon: '/icons/ic-mail.svg', bg: 'bg-[#0c2f46]/70', onClick: handleEmailLogin},
        {
            label: 'Google',
            icon: '/icons/ic-google.svg',
            bg: 'bg-gradient-to-r from-[#071859]/80 via-[#193f99]/80 to-[#1058c1]/80',
            onClick: handleGoogleLogin
        },
        {label: 'X/Twitter', icon: '/icons/ic-x.svg', bg: 'bg-[#0c2f46]/70', onClick: handleTwitterLogin},
    ];
    const icon = useMemo(() => {
        const icons = {
            "walletConnect": "https://hype.what.exchange/icons/walletconnect-icon.png",
            "metaMaskSDK": "https://hype.what.exchange/icons/metamask-icon.png",
            "io.metamask": "https://hype.what.exchange/icons/metamask-icon.png",
            "io.privy.wallet": "https://hype.what.exchange/icons/privy-icon.png",
            "phantom": "https://hype.what.exchange/icons/phantom-icon.png",
            "brave": "https://hype.what.exchange/icons/brave-icon.png",
            "binance": "https://hype.what.exchange/icons/binance-icon.png",
        }
        return icons
    }, [])

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
            setIsConnecting(true);
            // Check if this is a Privy-managed wallet (MetaMask or WalletConnect)
            const privyWalletName = connectorToPrivyWallet[connector.id];

            if (privyWalletName && connectWallet) {
                // Use Privy's connectWallet for MetaMask and WalletConnect
                await connectWallet({walletList: [privyWalletName as 'metamask' | 'wallet_connect']});
            } else {
                // For other wallets (injected), use wagmi connect
                await connect({connector, chainId: base.id});
            }
            // Progress bar will start when address is detected in useEffect
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setIsConnecting(false);
            setIsRedirecting(false);
            setProgress(0);
        }
    }

    // Detect when wallet is connected and start redirecting
    useEffect(() => {
        if (address && isConnecting) {
            // Wallet connected, now start redirecting
            setIsConnecting(false);
            setIsRedirecting(true);
            setProgress(0);
            
            // Simulate progress during redirect
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Redirect to platform
            const redirectTimer = setTimeout(() => {
                setProgress(100);
                const currentUrl = window.location.href;
                const platformUrl = currentUrl.replace(/\/$/, '') + '/platform';
                // Small delay to show 100% before redirect
                setTimeout(() => {
                    window.location.href = platformUrl;
                }, 300);
            }, 2000);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(redirectTimer);
            };
        }
    }, [address, isConnecting]);

    // 连接特定钱包
    const handleConnectSpecificWallet = async (walletName: 'phantom' | 'brave' | 'binance') => {
        try {
            setIsConnecting(true);
            let provider: any = null;
            if (walletName === 'brave') {
                provider = (window as any).braveEthereum as EIP1193Provider;
                if (!provider || (!(window as any).braveEthereum?.isBraveWallet && !(window as any).braveEthereum?._brave)) {
                    throw new Error('Brave Wallet is not installed. Please install it first.');
                }
            } else if (walletName === 'binance') {
                provider = (window as any).binancew3w?.ethereum as EIP1193Provider;
                if (!provider) {
                    throw new Error('Binance Wallet is not installed. Please install it first.');
                    return;
                }
            }

            // 请求账户授权
            await provider.request({method: 'eth_requestAccounts'});

            // 创建自定义 connector 并连接到 wagmi
            const customConnector = createConnector((config) => ({
                id: walletName,
                name: walletName === 'brave' ? 'Brave Wallet' : 'Binance Wallet',
                type: 'injected',
                async setup() {
                    // Setup logic if needed
                },
                async connect(parameters) {
                    const accounts = await provider.request({method: 'eth_requestAccounts'});
                    const chainId = await provider.request({method: 'eth_chainId'});
                    return {
                        accounts: accounts.map((account: string) => account as `0x${string}`),
                        chainId: Number(chainId),
                    };
                },
                async disconnect() {
                    // Disconnect logic if needed
                },
                async getAccounts() {
                    const accounts = await provider.request({method: 'eth_accounts'});
                    return accounts.map((account: string) => account as `0x${string}`);
                },
                async getChainId() {
                    const chainId = await provider.request({method: 'eth_chainId'});
                    return Number(chainId);
                },
                async isAuthorized() {
                    try {
                        const accounts = await provider.request({method: 'eth_accounts'});
                        return accounts.length > 0;
                    } catch {
                        return false;
                    }
                },
                getProvider() {
                    return provider;
                },
                async switchChain({chainId: targetChainId}) {
                    const hexChainId = `0x${targetChainId.toString(16)}`;

                    // 根据 chainId 获取对应的 Chain 对象

                    try {
                        // 尝试切换链
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{chainId: hexChainId}],
                        });
                        return base;
                    } catch (switchError: any) {
                        // 如果链不存在（错误码 4902），则添加链
                        if (switchError.code === 4902 || switchError.code === -32603) {
                            try {
                                const explorerUrl = base.blockExplorers?.default?.url;
                                await provider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                        chainId: hexChainId,
                                        chainName: base.name,
                                        nativeCurrency: {
                                            name: base.nativeCurrency.name,
                                            symbol: base.nativeCurrency.symbol,
                                            decimals: base.nativeCurrency.decimals,
                                        },
                                        rpcUrls: base.rpcUrls.default.http,
                                        blockExplorerUrls: explorerUrl ? [explorerUrl] : undefined,
                                    }],
                                });
                                return base;
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
                        config.emitter.emit('change', {accounts: accounts.map((account: string) => account as `0x${string}`)});
                    }
                },
                onChainChanged(chainId) {
                    const chainIdNumber = typeof chainId === 'string' ? Number.parseInt(chainId, 16) : Number(chainId);
                    config.emitter.emit('change', {chainId: chainIdNumber});
                },
                onDisconnect() {
                    config.emitter.emit('disconnect');
                },
            }));

            // 使用 wagmi connect 连接钱包
            await connect({connector: customConnector, chainId: base.id});
            // Progress bar will start when address is detected in useEffect

        } catch (error) {
            console.error(`Failed to connect ${walletName}:`, error);
            setIsConnecting(false);
            setIsRedirecting(false);
            setProgress(0);
            if ((error as any)?.code === 4001) {
                console.error('User rejected the connection request.');
            } else {
                console.error(`Failed to connect ${walletName}. Please try again.`);
            }
        }
    }

    return (
        <div className="relative min-h-screen w-screen overflow-hidden text-white" style={{
            fontFamily: '"Orbitron", sans-serif'
        }}>
            {/* Top Progress Bar - like YouTube/GitHub */}
            {isRedirecting && (
                <div className="fixed top-0 left-0 right-0 z-50 h-1">
                    <div 
                        className="h-full bg-[#00A8CE] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/background.png')`,

                }}
            />
            <div className={'flex w-screen h-screen items-center justify-center'}>
                
            <div className="relative w-screen flex flex-col justify-center  md:flex-row md:items-end gap-12 px-4" style={{height: 'fit-content'}}>
                {/* Logo for mobile */}
                <div className="flex justify-center mb-4 md:hidden">
                    <ImageCustom 
                        src="/logo.png" 
                        alt="Logo" 
                        width={200} 
                        height={60}
                        className="object-contain"
                    />
                </div>
                
                <div className=" mb-8 w-1/2 text-right hidden md:flex gap-2 justify-end">

                    <div className={'relative pr-20'}>

                        <div className={'flex gap-2 relative'}>
                              <span className={'absolute'} style={{
                                  fontSize: '100px', fontFamily: "Helvetica",
                                  left: '-8%',
                                  top: '-55%'
                              }}>
                            “
                        </span>
                            <p className="font-bold" style={{fontSize: '26px', lineHeight: '150%'}}>

                                Live as if you were to die tomorrow.
                                <br/>
                                Learn as if you were to live forever.

                            </p>
                            <span className={'absolute'} style={{fontSize: '100px',  fontFamily: "Helvetica",  right: '-8%',
                                transform: 'scaleX(-1)',
                                bottom: '-110%'}}>“</span>

                        </div>
                        <span style={{fontSize: '17px'}}>
                        Mahatma Gandhi
                    </span>
                    </div>

                </div>

                <div className="flex justify-start md:w-1/2" >
                    <div
                        className="box w-full max-w-[600px] rounded-[30px] md:rounded-[63px] p-[1px] shadow-2xl backdrop-blur-sm"
                        style={{
                            // border: 'solid',
                            // borderImage: 'linear-gradient(324.98deg, #000000 2.66%, #00A3C3 96.34%) 1 / 1px',

                        }}
                    >
                        <div className="relative h-full w-full rounded-[28px] md:rounded-[60px]  p-4 md:p-12">
                        <h2 className="mb-4 text-center text-lg font-semibold" style={{fontSize: '18px'}}>Connect
                            wallet</h2>
                        <div className="mb-4 space-y-3 p-1">
                            <p className="text-sm text-white/70" style={{
                                fontSize: '15px'
                            }}>Log in</p>
                            {loginOptions.map((item) => (
                                <button
                                    onClick={item.onClick}
                                    key={item.label}
                                    className="box2 relative overflow-hidden w-full bg-black flex flex-1 cursor-pointer
                                    items-center  justify-center gap-2 rounded-xl  px-3 py-3 md:py-6 text-sm font-semibold transition hover:scale-[1.01]"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                >

                  <span className="flex h-[20px] w-[20px] md:h-[30px] md:w-[30px] items-center justify-center z-10">
                    <ImageCustom
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={'h-[20px] w-[20px] md:h-[30px] md:w-[30px]'}
                    />
                  </span>
                                    <span  className={'z-10 text-xs md:text-[20px]'}>{item.label}</span>
                                    <div className={'absolute w-full h-full left-0 top-0 '} style={{}}>
                                        <SvgIcon/>
                                    </div>
                                </button>
                            ))}
                            <div className={'flex gap-2 justify-center items-center w-full'}>
                                <p className="pt-1 text-center text-xs text-white/70" style={{
                                    fontSize: '12px',
                                }}>Protected by </p>
                                <ImageCustom src={'/icons/ic-privy.svg'} alt={'privy'} width={56} height={12}/>
                            </div>
                        </div>

                        <div className="border-t" style={{borderColor: '#00A3C3'}}/>

                        <div className="mt-4 overflow-y-auto h-[200px] no-scrollbar p-1" >
                            <p className="text-sm text-white/70 mb-4">EVM</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {connectors.filter(c=>c.id !== "io.metamask").map((connector) => (
                                    <button
                                        key={connector.id}
                                        onClick={() => handleConnectWallet(connector)}
                                        className="box2 relative overflow-hidden bg-black flex flex-1 cursor-pointer
                                         items-center  justify-center gap-2 rounded-xl  px-3 py-3 md:py-6  text-sm font-semibold transition hover:scale-[1.01]"
                                        style={{
                                            borderRadius: '20px'
                                        }}
                                    >
                                        <div className="flex h-[20px] w-[20px] md:h-[30px] md:w-[30px] items-center justify-center z-10">
                                            <ImageCustom
                                                src={
                                                    (connector.icon as string) ||
                                                    ((icon as any)?.[connector.id] as string) ||
                                                    ''
                                                }
                                                alt={connector.name}
                                                width={18}
                                                height={18}
                                                className={'h-[20px] w-[20px] md:h-[30px] md:w-[30px]'}
                                            />
                                        </div>
                                        <div className="text-xs md:text-[20px] text-white z-10">{connector.name}</div>
                                        <div className={'absolute w-full h-full left-0 top-0 '} style={{}}>
                                            <SvgIcon/>
                                        </div>
                                    </button>
                                ))}

                                {/* MetaMask button - handled by Privy */}
                                <button
                                    onClick={async () => {
                                        try {
                                            setIsConnecting(true);
                                            if (connectWallet) {
                                                await (connectWallet as any)({walletList: ['metamask']});
                                            }
                                            // Progress bar will start when address is detected in useEffect
                                        } catch (error) {
                                            console.error('Failed to connect MetaMask:', error);
                                            setIsConnecting(false);
                                            setIsRedirecting(false);
                                            setProgress(0);
                                        }
                                    }}
                                    className="box2 relative overflow-hidden bg-black flex flex-1 cursor-pointer
                                    items-center  justify-center gap-2 rounded-xl  px-3 py-3 md:py-6 text-sm font-semibold transition hover:scale-[1.01]"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                >
                                    <div className="flex h-[20px] w-[20px] md:h-[30px] md:w-[30px] items-center justify-center z-10">
                                        <ImageCustom
                                            src="https://hype.what.exchange/icons/metamask-icon.png"
                                            alt="MetaMask"
                                            width={18}
                                            height={18}
                                            className={'h-[20px] w-[20px] md:h-[30px] md:w-[30px]'}
                                        />
                                    </div>
                                    <div className="text-xs md:text-[20px] text-white z-10">MetaMask</div>
                                    <div className={'absolute w-full h-full left-0 top-0 '} style={{}}>
                                        <SvgIcon/>
                                    </div>
                                </button>

                                {/* WalletConnect button - handled by Privy */}
                                <button
                                    onClick={async () => {
                                        try {
                                            setIsConnecting(true);
                                            if (connectWallet) {
                                                await (connectWallet as any)({walletList: ['wallet_connect']});
                                            }
                                            // Progress bar will start when address is detected in useEffect
                                        } catch (error) {
                                            console.error('Failed to connect WalletConnect:', error);
                                            setIsConnecting(false);
                                            setIsRedirecting(false);
                                            setProgress(0);
                                        }
                                    }}
                                    className="box2 relative overflow-hidden bg-black flex flex-1 cursor-pointer
                                    items-center  justify-center gap-2 rounded-xl px-3 py-3 md:py-6 text-sm font-semibold transition hover:scale-[1.01]"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                >
                                    <div className="flex h-[20px] w-[20px] md:h-[30px] md:w-[30px] items-center justify-center z-10">
                                        <ImageCustom
                                            src="https://hype.what.exchange/icons/walletconnect-icon.png"
                                            alt="WalletConnect"
                                            width={18}
                                            height={18}
                                            className={'h-[20px] w-[20px] md:h-[30px] md:w-[30px]'}
                                        />
                                    </div>
                                    <div className="text-xs md:text-[20px] text-white z-10">WalletConnect</div>
                                    <div className={'absolute w-full h-full left-0 top-0 '} style={{}}>
                                        <SvgIcon/>
                                    </div>
                                </button>


                                {/* Binance Wallet button */}
                                <button
                                    onClick={() => handleConnectSpecificWallet('binance')}
                                    className="box2 relative overflow-hidden bg-black flex justify-center flex-1
                                    cursor-pointer items-center gap-2 rounded-xl  px-3 py-3 md:py-6  text-sm font-semibold transition hover:scale-[1.01]"
                                    style={{
                                        borderRadius: '20px'
                                    }}
                                >
                                    <div className="flex h-[20px] w-[20px] md:h-[30px] md:w-[30px] items-center justify-center z-10">
                                        <ImageCustom
                                            src="https://hype.what.exchange/icons/binance-icon.png"
                                            alt="Binance Wallet"
                                            width={30}
                                            height={30}
                                            className={'h-[20px] w-[20px] md:h-[30px] md:w-[30px]'}
                                        />
                                    </div>
                                    <div className="text-xs md:text-[20px] text-white z-10">Binance</div>
                                    <div className={'absolute w-full h-full left-0 top-0 '} style={{}}>
                                        <SvgIcon/>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-xs" style={{
                            color: '#878787',
                            fontSize: '12px'
                        }}>
                            By connecting your wallet, you acknowledge and agree to the{' '}
                            <a className="underline decoration-white/50 underline-offset-2" href="https://www.privy.io/user-terms-of-service" target={"_blank"}
                               style={{color: '#00A8CE'}}>
                                terms of use
                            </a>
                            .
                        </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <RegisterFormModal/>
        </div>
    );
};