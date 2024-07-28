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
import {FC, useContext, useEffect} from 'react';
//next
import Head from 'next/head';
//Bloomreach sdk
import {Document} from '@bloomreach/spa-sdk';
import {BrPageContext} from '@bloomreach/react-sdk';
//contexts
import {SEOContext} from '@/contexts/SEOContext';

type SEOProps = {
  title?: string;
  sitename?: string;
  description?: string;
};

const SEOComponent: FC<SEOProps> = ({
                                      title,
                                      description,
                                      sitename,
                                    }) => {
  const {seo, setSeo} = useContext(SEOContext);

  const page = useContext(BrPageContext);
  const document = page?.getDocument<Document>();
  const metadata: any = document?.getData() ?? {};

  sitename = page?.getChannelParameters()?.pacificTitle || sitename;
  title = metadata?.seo?.seoTitle || metadata?.title || metadata?.displayName || page?.getTitle() || title;
  title = `${title} | ${sitename}`;
  description = metadata?.seo?.seoDescription || description;
  const seoTags = metadata?.seotag;

  useEffect(() => {
    setSeo({
      title,
      description,
      seoTags,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, seoTags]);

  const {title: seoTitle, description: seoDescription, seoTags: seoSeoTags, canonicalUrl} = seo;
  return (
    <Head>
      <title>{seoTitle}</title>
      {seoDescription && <meta name='description' content={seoDescription} />}
      {seoSeoTags?.map((seoTag: any, key: number) => {
        const {tag, value} = seoTag;
        return <meta name={tag} content={value} key={key} />;
      })}
      {canonicalUrl && <link rel='canonical' href={canonicalUrl ?? ''} />}
    </Head>
  );
};

export default SEOComponent;
