import { useState, useEffect } from 'react';
import { providers } from 'ethers';
import { Modal, Button } from '@mantine/core';
import { useUser } from 'components/context/UserContext';
import { isServer } from 'util/ssr';

const CHAIN_ID = 1; // Mainnet, https://docs.metamask.io/guide/ethereum-provider.html#chain-ids

export default function ConnectModal() {
    const { user, dispatchUser } = useUser();
    const [modalOpen, setModalOpen] = useState(isServer ? false : !user.active);
    const connect = async () => {
        if (isServer || typeof window.ethereum === 'undefined') return; // TODO prompt to install wallet
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
            const account = (accounts as Array<string>)[0];
            const provider = new providers.Web3Provider(
                window.ethereum as unknown as providers.ExternalProvider
            );
            const { chainId } = await provider.getNetwork();
            const active = chainId === CHAIN_ID;
            dispatchUser({
                active: active,
                provider: provider,
                account: account,
                chainId: chainId,
            });
            setModalOpen(!active);
        });
    };
    const setChain = async () => {
        if (isServer || typeof window.ethereum === 'undefined') return;
        window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CHAIN_ID}` }],
            })
            .catch((err) => {
                // Chain not added to MetaMask
                if (err.code === 4902) return;
            });
    };
    useEffect(() => {
        window.ethereum?.on('accountsChanged', (accounts) => {
            const n = (accounts as Array<string>).length;
            const active = !!n && user.chainId === CHAIN_ID;
            dispatchUser({ active: active, account: (accounts as Array<string>)[0] });
            setModalOpen(!active);
        });
        window.ethereum?.on('chainChanged', (chainId) => {
            const id = parseInt(chainId as string);
            const active = !!user.account && id === CHAIN_ID;
            dispatchUser({ active: active, chainId: id });
            setModalOpen(!active);
        });
        connect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Modal
            opened={modalOpen}
            onClose={() => {
                if (user.active) setModalOpen(false);
            }}
            title={
                !user.account
                    ? 'Please connect your MetaMask wallet'
                    : 'Please set your network to Mainnet'
            }
            withCloseButton={false}
            centered
        >
            <Button onClick={!user.account ? connect : setChain}>
                {!user.account ? 'Connect wallet' : 'Change chain'}
            </Button>
        </Modal>
    );
}
