import { MantineProvider } from '@mantine/core';
import UserProvider from 'components/context/UserContext';
import type { AppProps } from 'next/app';

function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
            }}
        >
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
        </MantineProvider>
    );
}

export default MyApp;
