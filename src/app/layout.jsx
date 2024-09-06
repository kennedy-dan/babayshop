
'use client';
import './globals.css'

import React from 'react';
import Providers from '~/redux/provider';
import AxiosConfig from '../AxiosConfig';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '~/redux/store';
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Poppins} from 'next/font/google'

import '~/public/static/fonts/Linearicons/Font/demo-files/demo.css';
import '~/public/static/fonts/font-awesome/css/font-awesome.min.css';
import '~/public/static/css/bootstrap.min.css';
import '~/public/static/css/slick.min.css';
import '~/scss/style.scss';
import '~/scss/home-default.scss';
import '~/scss/market-place-1.scss';
import '~/scss/market-place-2.scss';
import '~/scss/market-place-3.scss';
import '~/scss/market-place-4.scss';
import '~/scss/electronic.scss';
import '~/scss/furniture.scss';
import '~/scss/organic.scss';
import '~/scss/technology.scss';
import '~/scss/autopart.scss';
import getHeadData, {
    generatePageMetadata,
} from '~/utilities/seo/RoutePathsSEO';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

// export const metadata = generatePageMetadata(getHeadData('/'));
export default function RootLayout({ children }) {
    return (
        <html lang="en">
                <head>
    <link rel="icon" href="/favicon.ico" sizes="any" />
  </head>
        <body className={poppins.className}>
        <Providers>
           <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={true}
            pauseOnFocusLoss={false}
            transition={Zoom}

            // limit={1}
          />
        <PersistGate loading={null} persistor={persistor}>
          <AxiosConfig>
            {children}
          </AxiosConfig>
        </PersistGate>
        </Providers>
      </body>

        </html>
    );
}
