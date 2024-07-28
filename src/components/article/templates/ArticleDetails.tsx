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
import React, {Fragment, useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
//mui
import {Box, Breadcrumbs, Chip, Container, Grid, Stack, styled, Typography} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {ProductComponent} from '@/components/product/ProductComponent';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {H1, H2, H4, Paragraph} from '@/components/common/bazaar/Typography';
import FlexFullScreen from '@/components/common/flex-box/FlexFullScreen';
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
import {SocialBar} from '@/components/common/social/SocialBar';
//types
import {ArticleTemplateProps} from '../ArticleComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getDateString} from '@/utils/DateUtils';
//templates
import {AIContentEntry, CallToActionEntry, ParagraphEntry} from '@/components/article/templates/entry';
import {AuthorBioByLine} from '@/components/author/templates';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {BreadcrumbNavLink} from '@/components/common/breadcrumb/CategoryBreadcrumb';
import {ProductGridKeywordProps, withProductGridKeyword} from '@/hocs/product/ProductGridKeywordHoc';
import {BrProduct} from '@/utils/CommonTypes';
import {ProductImage} from '@/components/product/templates/ProductImage';
import {QUERY_PARAM_QUERY} from '@/utils/SearchUtil';

//Custom styled components
const ArticleTopBox = styled(FlexFullScreen)(({theme}) => ({
  backgroundColor: theme.palette.grey[200],
  backgroundSize: '50% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right top',
}));

const ArticleContentBox = styled(FlexRowCenter)(({theme}) => ({
  width: '100%',
  padding: '16px',
  minHeight: '320px',
}));

const ArticleDetailsBase = (props: BrProps & ArticleTemplateProps & ProductGridKeywordProps) => {
  const {
    page,
    component,
    articleContent,
    articleParams,
    loading,
    error,
    itemsPageResult,
  } = props;
  const {t} = useTranslation('common');
  const router = useRouter();

  const {authors, tags, entries, sidebars = [], title, description, images, date, link} = articleContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    images && setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(description);
  }, [description]);

  const mainDivClass = sidebars && sidebars?.length > 0 ? 8 : 12;

  if (!loading && !error && itemsPageResult?.response?.docs) {
    itemsPageResult?.response?.docs?.forEach(brProduct => {
      const index = sidebars.findIndex(sidebar => sidebar.type === 'product' && sidebar.products?.[0]?.pid === brProduct.pid);
      if (index === -1) {
        sidebars.push({
          type: 'product',
          products: [brProduct],
        });
      }
    });
  }

  const sidebarProducts = sidebars
    .filter((sidebar) => sidebar != null && sidebar.type === 'product')
    .slice(0, 2);

  return (
    <Box>
      <ArticleTopBox>
        <Container disableGutters>
          <Grid container>
            <Grid item md={6}>
              <ArticleContentBox>
                <Stack spacing={2}>
                  {title && <H1>{title}</H1>}
                  <Stack spacing={2} direction='row'>
                    {tags?.map((tag: string, key: number) => (
                      <Chip label={tag}
                            onClick={() => router.push(page.getUrl(`/search?${QUERY_PARAM_QUERY}=${encodeURIComponent(tag)}`))}
                            key={`tag-${key}`} />
                    ))}
                  </Stack>
                  {description && <Paragraph dangerouslySetInnerHTML={{__html: html}}
                                             sx={{
                                               overflow: 'hidden',
                                               textOverflow: 'ellipsis',
                                               display: '-webkit-box',
                                               WebkitLineClamp: '4',
                                               WebkitBoxOrient: 'vertical',
                                             }}
                  />}
                  {authors?.[0]?.accounts && (
                    <Stack direction='row' spacing={2} sx={{
                      alignItems: 'center',
                    }}>
                      <H4>{t('share')}:</H4>
                      <SocialBar accounts={authors?.[0].accounts} />
                    </Stack>
                  )}
                </Stack>
              </ArticleContentBox>
            </Grid>
            <Grid item md={6} sx={{
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}></Grid>
          </Grid>
        </Container>
      </ArticleTopBox>
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} sx={{
        marginY: '10px',
      }}>
        <BreadcrumbNavLink color='inherit' href={page.getUrl(`/articles`)}>
          {t('articles')}
        </BreadcrumbNavLink>
        <Typography color='text.primary' sx={{
          textTransform: 'capitalize',
        }}>
          {title}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item md={mainDivClass}>
          <Stack spacing={2}>
            {authors?.map((author, key) => {
              return <AuthorBioByLine authorBioContent={author} key={`author-${key}`} />;
            })}
            <H4>{getDateString(date, 'long')}</H4>
            <Typography dangerouslySetInnerHTML={{__html: html}} />
            {entries?.map((entry, key: number) => {
              switch (entry?.type) {
                case 'paragraph':
                case 'demoParagraph':
                case 'demoAlphaParagraph':
                  return <ParagraphEntry {...entry} key={`paragraph-${key}`} />;
                case 'calltoaction':
                case 'demoCallToAction':
                case 'demoAlphaCallToAction':
                  return <CallToActionEntry {...entry} key={`cta-${key}`} />;
                case 'demoAIContent':
                  return <AIContentEntry {...entry} key={`cta-${key}`} />;
                default:
                  return null;
              }
            })}
          </Stack>
        </Grid>
        {sidebars && (
          <Grid item md={4}>
            <Stack direction='column' spacing={2} sx={{
              marginTop: '0.5rem',
            }}>
              {sidebars
                .filter((sidebar) => sidebar != null && sidebar.type === 'banner')
                .map((sidebar, key: number) => {
                  const banner = sidebar.banner;
                  if (!banner) {
                    return null;
                  }
                  return (
                    <BannerComponent
                      {...{page, component}}
                      documentRef={banner}
                      params={{
                        template: 'card',
                        textAlignment: 'center',
                        textColor: 'black',
                      }}
                      key={`banner-${key}`}
                    />
                  );
                })}
            </Stack>
            <Stack direction='column' spacing={2}>
              {sidebars
                .filter((sidebar) => sidebar != null && sidebar.type === 'product')
                .slice(0, 2)
                .map((sidebar, key: number) => {
                  return (
                    <Fragment key={key}>
                      {key === 0 && <H2>{t('related-products')}</H2>}
                      {sidebar.products.map((product, key) => (
                        product?.title ?
                          <ProductImage productContent={product as BrProduct} productParams={{template: 'image'}}
                                        key={`sidebar-${key}`} />
                          :
                          // @ts-ignore
                          product?.pid && <ProductComponent
                            {...{page, component}}
                            params={{
                              template: 'image',
                              productId: product?.pid,
                            }}
                            key={`sidebar-${key}`}
                          />
                      ))}
                    </Fragment>
                  );
                })}
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export const ArticleDetails = withProductGridKeyword(ArticleDetailsBase);
