import { useState, useEffect } from 'react';
import { providers } from 'ethers';
import { Modal, Button } from '@mantine/core';
import { useUser } from 'components/context/UserContext';
import { isServer } from 'util/ssr';

export default function ConnectModal() {
    const { user, dispatchUser } = useUser();
    const [modalOpen, setModalOpen] = useState(isServer ? false : !user.active);
    const connect = async () => {
        if (isServer || typeof window.ethereum === 'undefined') return;
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
            const account = (accounts as Array<string>)[0];
            const provider = new providers.Web3Provider(
                window.ethereum as unknown as providers.ExternalProvider
            );
            window.ethereum?.on('accountsChanged', (accounts) =>
                dispatchUser({ account: (accounts as Array<string>)[0] })
            );
            dispatchUser({ active: true, provider: provider, account: account });
            setModalOpen(false);
        });
    };
    // Try to connect on page load
    useEffect(() => {
        connect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Modal
            opened={modalOpen}
            onClose={() => {
                if (user.active) setModalOpen(false);
            }}
            title="Please connect your MetaMask wallet"
            centered
        >
            <Button onClick={connect}>Connect wallet</Button>
        </Modal>
    );
}
