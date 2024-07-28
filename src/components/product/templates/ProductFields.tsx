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
import {Fragment} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Chip, Stack} from '@mui/material';
//components
import {FlexBox} from '@/components/common/flex-box';
import {H6, Paragraph} from '@/components/common/bazaar/Typography';

export interface ProductFieldsProps {
  skuId?: string | string[],
  brand?: string,
  description?: string,
}

export const ProductFields = (props: ProductFieldsProps) => {
  const {t} = useTranslation('product');

  const {skuId, brand, description} = props;
  return (
    <Fragment>
      <Stack direction={'row'}>
        {skuId && (
          <FlexBox alignItems='center' mb={1}>
            <Chip label='SKU' />
            <H6 sx={{marginX: 1}}>{skuId}</H6>
          </FlexBox>
        )}
        {brand && (
          <FlexBox alignItems='center' mb={1}>
            <Chip label={t('brand')} />
            <H6 sx={{marginX: 1}}>{brand}</H6>
          </FlexBox>
        )}
      </Stack>

      <Paragraph my={2} dangerouslySetInnerHTML={{__html: description}} />
    </Fragment>
  );
};
