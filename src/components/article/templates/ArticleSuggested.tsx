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
import {FC} from 'react';
//next
import Link from 'next/link';
//mui
import {Box, styled} from '@mui/material';
//components
import {H4} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {ArticleTemplateProps} from '../ArticleComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {StyledSuggestedFlexBox} from '@/components/product/templates';

export const ArticleSuggested: FC<ArticleTemplateProps> = (props: ArticleTemplateProps) => {
  const {articleContent} = props;
  const {title, images, link} = articleContent;

  const imageUrl = images[ImageSizeEnum.Original].url;
  return (
    <Link href={link?.url ?? ''}>
      <StyledSuggestedFlexBox alignItems='flex-start' gap={1}>
        <FlexBox>
          <img src={imageUrl} width={60} height={60} alt={'image'} />
        </FlexBox>
        <Box>
          <H4 fontWeight='bold'>{title}</H4>
        </Box>
      </StyledSuggestedFlexBox>
    </Link>
  );
};