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

//components
import LazyImage from '@/components/common/bazaar/LazyImage';
import {Paragraph} from '@/components/common/bazaar/Typography';
//functions
import {getDateString} from '@/utils/DateUtils';
//templates
import {DateBox, ImageBox} from '@/components/article/templates/ArticleCard';

export interface ArticleImageBoxProps {
  title: string,
  imageUrl?: string,
  date?: Date,
}

export const ArticleImageBox = (props: ArticleImageBoxProps) => {
  const {title, imageUrl, date} = props;
  return (
    <ImageBox maxHeight={220}>
      {imageUrl ? <img
        width={580}
        height={272}
        src={imageUrl}
        alt={title}
        style={{objectFit: 'cover'}}
        //layout="responsive"
      /> : <LazyImage
        width={580}
        height={272}
        alt='article'
        src='/assets/imgs/articles/article-card-placeholder.svg'
      />}

      {date && (
        <DateBox>
          <Paragraph width='min-content' lineHeight={1} fontWeight={600}>
            {getDateString(date, 'short')}
          </Paragraph>
        </DateBox>
      )}
    </ImageBox>
  );
};