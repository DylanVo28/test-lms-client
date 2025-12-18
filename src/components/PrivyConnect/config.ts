import {createConfig, http, injected} from "wagmi";
import {base} from "viem/chains";

const createConnectors = () => {
    return [injected()];
};

export const config = createConfig({
    chains: [base],
    connectors: createConnectors(),
    transports: {
        [base.id]: http(),
    },
});
