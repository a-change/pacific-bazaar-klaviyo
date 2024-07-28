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
import {FC, useContext} from 'react';
//next
import Link from 'next/link';
//mui
import {Box, styled} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//components
import {FlexBox} from '@/components/common/flex-box';
import {H4, Span} from '@/components/common/bazaar/Typography';
//types
import {ProductTemplateProps} from '@/components/product/ProductComponentTypes';
//functions
import {getProductUrl} from '@/components/product/ProductComponentUtils';
import {formattedPrice} from '@/utils/CurrencyUtils';
//Custom styled components
export const StyledSuggestedFlexBox = styled(FlexBox)(({theme}) => ({
  alignItems: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const ProductSuggested: FC<ProductTemplateProps> = (props) => {
  const page = useContext(BrPageContext);
  const {productContent: {pid: id, title, thumb_image, sale_price, variants}} = props;
  const skuId = variants?.[0]?.skuid ? variants?.[0]?.skuid : id;

  const productUrl = getProductUrl(page, id, skuId as string);
  return (
    <Link href={productUrl ?? ''}>
      <StyledSuggestedFlexBox gap={1}>
        <FlexBox sx={{
          width: '60px',
          justifyContent: 'center',
        }}>
          <img
            src={thumb_image!}
            height={'60px'}
            width={'auto'}
            style={{
              objectFit: 'cover',
              maxWidth: '-webkit-fill-available',
            }}
            alt={'product-image'}
          />
        </FlexBox>
        <Box>
          <H4 fontWeight='bold'>{title}</H4>
          <Span fontWeight='600' color='primary.main'>
            {formattedPrice(sale_price)}
          </Span>
        </Box>
      </StyledSuggestedFlexBox>
    </Link>
  );
};

