/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//react
import {ReactElement, ReactNode} from 'react';
//next
import {NextPage} from 'next';
import {appWithTranslation} from 'next-i18next';
import {AppProps} from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import {Lato, Montserrat, Open_Sans, Poppins, Roboto} from 'next/font/google';
import nextI18NextConfig from '../next-i18next.config';
//mui
import MuiTheme from 'theme/MuiTheme';
//other libs
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'simplebar/dist/simplebar.min.css';
//contexts
import {AppProvider} from 'contexts/AppContext';
import SettingsProvider from 'contexts/SettingContext';
import {PreferenceProvider} from '@/contexts/PreferenceContext';
//components
import RTL from '@/components/rtl/RTL';
import SnackbarProvider from '@/components/common/bazaar/SnackbarProvider';
import OpenGraphTags from '@/utils/OpenGraphTags';

type MyAppProps = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
};

//Binding events.
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());
// small change
nProgress.configure({showSpinner: false});

const openSans = Open_Sans({subsets: ['latin']});
const montserrat = Montserrat({subsets: ['latin']});
const lato = Lato({weight: ['100', '300', '400', '700', '900'], subsets: ['latin']});
const poppins = Poppins({weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin']});
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

const MyApp = ({Component, pageProps}: MyAppProps) => {
  const AnyComponent = Component as any;
  const getLayout = AnyComponent.getLayout ?? ((page) => page);
  const page = pageProps?.page ?? {};

  const channelProps = page?.channel?.info?.props ?? {};

  const font: string = channelProps?.font;

  let fontClassName = ''; //`${openSans.className} ${montserrat.className} ${lato.className} ${poppins.className} ${roboto.className} `;
  switch (font) {
    case 'openSans':
      fontClassName = openSans.className;
      break;
    case 'montserrat':
      fontClassName = montserrat.className;
      break;
    case 'lato':
      fontClassName = lato.className;
      break;
    case 'poppins':
      fontClassName = poppins.className;
      break;
    case 'roboto':
      fontClassName = roboto.className;
      break;
  }

  return (
    <main className={`${fontClassName}`}>
      <Head>
        <meta name='ROBOTS' content='NOINDEX, NOFOLLOW' />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <OpenGraphTags />
        <title>{channelProps?.pacificTitle ?? 'Pacific Home'}</title>
      </Head>

      <SettingsProvider>
        <AppProvider>
          <PreferenceProvider>
            <MuiTheme>
              <SnackbarProvider>
                <RTL>{getLayout(<AnyComponent {...pageProps} />)}</RTL>
              </SnackbarProvider>
            </MuiTheme>
          </PreferenceProvider>
        </AppProvider>
      </SettingsProvider>
    </main>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig);


