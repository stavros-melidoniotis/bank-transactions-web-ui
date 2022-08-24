import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'

config.autoAddCss = false

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp