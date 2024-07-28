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

//next
import {useTranslation} from 'next-i18next';
//mui
import {Chip, Stack, styled} from '@mui/material';

const StyledChip = styled(Chip)<{size?: string}>(({theme, size}) => ({
  'zIndex': 1,
  'left': '10px',
  'paddingLeft': size === 'medium' ? 15 : 3,
  'paddingRight': size === 'medium' ? 15 : 3,
  'fontWeight': 600,
  'fontSize': '10px',
  'position': 'absolute',
  '&:nth-of-type(1)': {
    top: '10px',
  },
  '&:nth-of-type(2)': {
    top: size === 'medium' ? '50px' : '40px',
  },
  '&:nth-of-type(3)': {
    top: size === 'medium' ? '80px' : '70px',
  },
}));

export interface ProductBadgeProps {
  showAttributeBadge: boolean,
  discount: number,
  inStock: string,
  onSale: string,
  size: 'small' | 'medium' | 'large',
}

export const ProductBadge = (props: ProductBadgeProps) => {
  const {
    showAttributeBadge,
    discount,
    inStock,
    onSale,
    size,
  } = props;
  const {t} = useTranslation('product');

  let chipSize: 'small' | 'medium' = 'small';
  switch (size) {
    case 'large':
      chipSize = 'medium';
      break;
  }

  return showAttributeBadge && (
    <Stack>
      {/*!!discount && (
        <StyledChip color='primary' size={chipSize} label={t('off', {off: discount})} />
      )*/}
      {inStock === 'true' && (
        <StyledChip color='success' size={chipSize} label={t('in-stock')} />
      )}
      {onSale === 'true' && (
        <StyledChip color='primary' size={chipSize} label={t('on-sale')} />
      )}
    </Stack>
  );
};