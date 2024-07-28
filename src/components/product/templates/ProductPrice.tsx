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

import {FlexBox} from '@/components/common/flex-box';
import {Box} from '@mui/material';
import {formattedPrice} from '@/utils/CurrencyUtils';

export interface ProductPriceProps {
  price: number,
  salePrice: number,
  size: 'small' | 'medium' | 'large',
  justifyContent?: string,
}

export const ProductPrice = (props: ProductPriceProps) => {
  const {price, salePrice, size, justifyContent} = props;
  const discount = Math.round(((price - salePrice) / price) * 100);

  return salePrice && (
    <FlexBox alignItems='center' gap={1} mt={0.5} justifyContent={justifyContent} sx={{
      fontSize: size,
    }}>
      <Box fontWeight='bold' color='primary.main'>
        {formattedPrice(salePrice)}
      </Box>

      {!!discount && (
        <Box fontWeight='bold' color='grey.600'>
          <del>{formattedPrice(price)}</del>
        </Box>
      )}
    </FlexBox>
  );
};
