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
import {useTranslation} from 'next-i18next';
//mui
import {Box, Card, styled} from '@mui/material';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {H4, Paragraph} from '@/components/common/bazaar/Typography';
import {FlexRowCenter} from '@/components/common/flex-box';
import {NavLink3} from '@/components/common/nav-link';
import LazyImage from '@/components/common/bazaar/LazyImage';
//types
import {ArticleTemplateProps} from '../ArticleComponentTypes';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {getDateString} from '@/utils/DateUtils';
import {remoteHtmlTags} from '@/utils/HtmlUtils';
import {ArticleImageBox} from '@/components/article/templates/ArticleImageBox';

//Custom styled components
export const ImageBox = styled(Box)({
  'cursor': 'pointer',
  'overflow': 'hidden',
  'position': 'relative',
  '& img': {transition: '0.3s'},
  ':hover': {'& img': {transform: 'scale(1.1)'}},
});

export const DateBox = styled(FlexRowCenter)(({theme}) => ({
  top: 30,
  left: 30,
  width: 50,
  height: 50,
  textAlign: 'center',
  position: 'absolute',
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.grey[200],
}));

export const ArticleCard: FC<ArticleTemplateProps> = (props: ArticleTemplateProps) => {
  const {articleContent, articleParams} = props;
  const {title, description, images, date, link} = articleContent;
  const [html, setHtml] = useState('');
  const width = useWindowSize();
  const [imageUrl, setImageUrl] = useState('/assets/imgs/articles/article-placeholder.svg');
  const {t} = useTranslation('common');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(remoteHtmlTags(description));
  }, [description]);

  return (
    <Card
      sx={{
        borderRadius: 0,
        boxShadow: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ArticleImageBox {...{
        title,
        date,
        imageUrl,
      }} />
      <Box
        px={2}
        pt={1}
        pb={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
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
          <NavLink3 text={t('read-more')} href={link?.url ?? ''} />
        </Box>
      </Box>
    </Card>
  );
};
