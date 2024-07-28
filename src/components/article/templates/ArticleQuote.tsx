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
import {useTranslation} from 'next-i18next';
//mui
import {Avatar, Box, Grid, styled} from '@mui/material';
//hooks
//components
import {H5, Paragraph} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {ArticleTemplateProps} from '../ArticleComponentTypes';
//functions
import {getImageVariantBySize} from '@/utils/ImageUtils';
import {remoteHtmlTags} from '@/utils/HtmlUtils';
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import Quote from '@/components/common/bazaar/Quote';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {NavLink3} from '@/components/common/nav-link';

//Custom styled components
const StyledBazaarCard = styled(BazaarCard)(({theme}) => ({
  overflow: 'hidden',
  borderRadius: '8px',
  position: 'relative',
  marginTop: '1rem',
  padding: '2rem 4rem',
  [theme.breakpoints.down('sm')]: {padding: '2rem'},
}));

const StyledFlexBox = styled(FlexBox)(({theme}) => ({
  padding: '4rem 6rem',
  [theme.breakpoints.down('sm')]: {padding: '2rem 4rem'},
}));

const StyledQuote = styled(Quote)(({theme}) => ({
  opacity: 0.08,
  fontSize: '4rem',
  position: 'absolute',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {fontSize: '3rem'},
}));

const StyledAvatar = styled(Avatar)({
  width: 96,
  height: 96,
  margin: 'auto',
  display: 'block',
});

const StyledGridContainer = styled(Grid)(({theme}) => ({
  flexWrap: 'wrap',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gap: 16,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export const ArticleQuote: FC<ArticleTemplateProps> = (props: ArticleTemplateProps) => {
  const {articleContent, articleParams} = props;
  const {authors, description, images, link} = articleContent;
  const [html, setHtml] = useState('');
  const {t} = useTranslation('common');

  useEffect(() => {
    setHtml(remoteHtmlTags(description));
  }, [description]);

  const author = authors?.[0];
  const {images: authorImages, fullName} = author ?? {};
  const authorImage = authorImages && getImageVariantBySize(authorImages, ImageSizeEnum.Thumbnail);

  return (
    <StyledBazaarCard>
      <StyledFlexBox position='relative' flexWrap='wrap'>
        <StyledQuote sx={{left: 0, top: 0}} />

        <StyledGridContainer container spacing={1}>
          <Grid item lg={2} md={3}>
            <StyledAvatar src={authorImage} />
          </Grid>

          <Grid item lg={10} md={9}>
            <Paragraph color='grey.700' dangerouslySetInnerHTML={{
              __html: html,
            }} />
            <Box flexGrow={0} sx={{
              marginY: '1rem',
            }}>
              <NavLink3 text={t('read-more')} href={link?.url ?? ''} />
            </Box>
            <H5 mt={1} fontWeight='700'>
              {fullName}
            </H5>
          </Grid>
        </StyledGridContainer>

        <StyledQuote
          sx={{right: 0, bottom: 0, transform: 'rotate(180deg)'}}
        />
      </StyledFlexBox>
    </StyledBazaarCard>
  );
};
