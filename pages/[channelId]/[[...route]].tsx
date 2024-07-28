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
import {buildConfiguration} from '@/utils/buildConfiguration';
import {initialize} from '@bloomreach/spa-sdk';
import axios, {AxiosError} from 'axios';
import {App} from 'components/App';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

export default function Index({
                                configuration,
                                page,
                              }: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  console.log('[LOAD]', '...App is ready', new Date());
  return <App configuration={configuration} page={page!} />;
};

export const getServerSideProps: GetServerSideProps = async ({
                                                               req: request,
                                                               res: response,
                                                               resolvedUrl: path,
                                                               query,
                                                             }) => {
  if (path === '/undefined') {
    return {props: {configuration: {}, page: {}}};
  }
  console.time('BRPageFetching');
  try {
    const configuration = buildConfiguration(path, query);

    //request.headers['cache-control'] = 'max-age=0';
    //console.log('[SERVER]', path, query, request.headers);

    const page = await initialize({request, httpClient: axios, ...configuration});
    console.timeEnd('BRPageFetching');
    const pageJson = page!.toJSON();

    const localeSetting = pageJson.meta.locale ?? 'en_US';
    const locale = localeSetting.split('_')[0] ?? 'en';

    let locales = await serverSideTranslations(locale, ['common', 'facet', 'product', 'search','cart', 'profile']);
    return {props: {configuration, page: pageJson, ...locales}};
  } catch (error) {
    if (axios.isAxiosError(error))  {
      // Access to config, request, and response
      const axiosError = error as AxiosError;
      if (axiosError.response.status === 404) {
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        }
      }
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
};


