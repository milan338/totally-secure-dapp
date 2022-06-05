import { MantineProvider } from '@mantine/core';
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
            <Component {...pageProps} />
        </MantineProvider>
    );
}

export default MyApp;
