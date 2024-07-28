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
import {FC, useEffect, useState} from 'react';
//next
import Link from 'next/link';
//mui
import {Box, Grid, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {H4, Paragraph} from '@/components/common/bazaar/Typography';
import LazyImage from '@/components/common/bazaar/LazyImage';
import {NavLink3} from '@/components/common/nav-link';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {remoteHtmlTags} from '@/utils/HtmlUtils';
import {getDateString} from '@/utils/DateUtils';
//types
import {ArticleTemplateProps} from '@/components/article/ArticleComponentTypes';
//templates
import {DateBox, ImageBox} from '@/components/article/templates/ArticleCard';
import {ArticleImageBox} from '@/components/article/templates/ArticleImageBox';

//Custom styled components
const StyledBazaarCard = styled(BazaarCard)({
  'height': '100%',
  'margin': 'auto',
  'display': 'flex',
  'overflow': 'hidden',
  'borderRadius': '8px',
  'position': 'relative',
  'flexDirection': 'column',
  'justifyContent': 'space-between',
  'transition': 'all 250ms ease-in-out',
  ':hover': {'& .hover-box': {opacity: 1}},
});

export const ArticleListItem: FC<ArticleTemplateProps> = (props: ArticleTemplateProps) => {
  const {articleContent, articleParams} = props;
  const {title, description, images, date, link} = articleContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/articles/article-placeholder.svg');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(remoteHtmlTags(description));
  }, [description]);

  return (
    <StyledBazaarCard>
      <Grid container spacing={1}>
        <Grid item md={4} xs={12}>
          <ArticleImageBox {...{
            title,
            date,
            imageUrl,
          }} />
        </Grid>
        <Grid item md={8} xs={12}>
          <Box
            px={2}
            pt={1}
            pb={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
            flexGrow={1}
          >
            <Box flexGrow={1}>
              <Link href={link?.url ?? ''} legacyBehavior>
                <a>
                  <H4 fontWeight={700}>{title}</H4>
                </a>
              </Link>
              <Paragraph
                mt={0.5}
                mb={3}
                dangerouslySetInnerHTML={{__html: html}}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '4',
                  WebkitBoxOrient: 'vertical',
                }}
              />
            </Box>
            <Box flexGrow={0}>
              <NavLink3 text='Read More' href={link?.url ?? ''} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </StyledBazaarCard>
  );
};
