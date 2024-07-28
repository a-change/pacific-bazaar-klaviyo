import {BrPageContext} from '@bloomreach/react-sdk';
import {Document} from '@bloomreach/spa-sdk';
import Head from 'next/head';
import {FC, useContext, useEffect} from 'react';
import {SEOContext} from '@/contexts/SEOContext';
import {pushGtmEventWidget} from '@/components/gtm/GTMComponentUtils';

// ====================================================================
type SEOProps = {
  title?: string;
  sitename?: string;
  description?: string;
};
// ====================================================================

const SEO: FC<SEOProps> = ({
                             title,
                             description,
                             sitename,
                           }) => {
  const {seo, setSeo} = useContext(SEOContext);

  const page = useContext(BrPageContext);
  const document = page?.getDocument<Document>();
  const metadata: any = document?.getData() ?? {};

  sitename = page?.getChannelParameters()?.pacificTitle || sitename;
  title = metadata?.seo?.seoTitle || metadata?.title || page?.getTitle() || title;
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
        return (
          <meta name={tag} content={value} key={key} />
        );
      })}
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
    </Head>
  );
};

export default SEO;
