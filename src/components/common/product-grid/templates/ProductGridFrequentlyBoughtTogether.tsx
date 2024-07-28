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
import {Fragment, useContext} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {Box, Button, styled} from '@mui/material';
//other libs
import {useSnackbar} from 'notistack';
//contexts
import {useAppContext} from '@/contexts/AppContext';
import {UserContext} from '@/contexts/UserContext';
//components
import {H2, H3, Span} from '@/components/common/bazaar/Typography';
import FlexBox from '@/components/common/flex-box/FlexBox';
import FlexRowCenter from '@/components/common/flex-box/FlexRowCenter';
import {Sorter} from '@/components/common/sorter/Sorter';
//types
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {SorterParams} from '@/components/common/sorter/SorterTypes';
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {BrProduct} from '@/utils/CommonTypes';
//functions
import {pushCartEvents} from '@/components/gtm/GTMComponentUtils';
import {formattedPrice} from '@/utils/CurrencyUtils';
import {showCart} from '@/components/cart/CartComponentUtils';
//templates
import {ProductCard} from '@/components/product/templates';

//Custom styled components
const WrapperBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    '& .card-holder': {flexDirection: 'column'},
  },
}));

export interface ProductGridFrequentlyBoughtTogetherPops {
  sorterParams: SorterParams;
  productParams: ProductComponentParams;
  items: Array<SlotBanner | BrProduct>;
}

export const ProductGridFrequentlyBoughtTogether = (
  props: ProductGridFrequentlyBoughtTogetherPops,
) => {
  const {items, sorterParams, productParams} = props;

  const {
    userState: {user},
  } = useContext(UserContext)!;

  const {t} = useTranslation('product');
  const {enqueueSnackbar} = useSnackbar();
  const {state, dispatch} = useAppContext();

  const fbtProducts = items.filter((item) => !(item as any)?.banner).slice(0, 3);

  const totalPrice = fbtProducts.reduce((n, item) => {
    const product = item as BrProduct;
    return n + product.price;
  }, 0);

  const totalSalePrice = fbtProducts.reduce((n, item) => {
    const product = item as BrProduct;
    return n + product.sale_price;
  }, 0);

  return (
    <WrapperBox mb={1}>
      <Box sx={{marginY: 2}}>
        <Sorter {...sorterParams} />
      </Box>
      <FlexBox className='card-holder' flexWrap='wrap' m={-1}>
        {fbtProducts.map((item, ind) => {
          const product = item as BrProduct;
          return (
            <Fragment key={product.pid}>
              <Box
                sx={{
                  width: '100%',
                  flex: '1 1 0',
                  minWidth: '160px',
                  margin: {xs: 0, sm: 1},
                  maxWidth: {xs: '100%', sm: '220px'},
                }}
              >
                <ProductCard
                  productContent={product}
                  productParams={{
                    ...productParams,
                    ...{
                      size: 'small',
                    },
                  }}
                />
              </Box>
              {ind < fbtProducts.length - 1 && (
                <FlexRowCenter>
                  <H2 color='grey.600' mx={1}>
                    +
                  </H2>
                </FlexRowCenter>
              )}
            </Fragment>
          );
        })}

        <FlexRowCenter>
          <H2 color='grey.600' mx={3}>
            =
          </H2>
        </FlexRowCenter>

        <FlexRowCenter
          m={1}
          minWidth={300}
          minHeight={200}
          border='1px solid'
          borderRadius='8px'
          className='gray-box'
          borderColor='grey.400'
          flexDirection='column'
        >
          <H3 color='primary.main'>{formattedPrice(totalSalePrice)}</H3>
          <Span mb={2} fontWeight='600' color='grey.600'>
            Save {formattedPrice(totalPrice - totalSalePrice)}
          </Span>

          {showCart(user) && (
            <FlexBox gap={1.5}>
              <Button
                color='primary'
                variant='contained'
                onClick={() => {
                  fbtProducts.forEach((item) => {
                    const {
                      pid: id,
                      title,
                      sale_price: salePrice,
                      thumb_image: imgUrl,
                      price: price,
                      description,
                      brand,
                      inStock,
                      onSale,
                      variants,
                    } = item as BrProduct;
                    const variant = variants?.[0];

                    const {skuid: skuId, sku_color: skuColor, sku_size: skuSize} = variant ?? {};

                    const variantToAdd = {
                      title,
                      pid: id,
                      sale_price: salePrice,
                      price,
                      description,
                      thumb_image: imgUrl,
                      brand,
                      variants,
                      sku_color: skuColor,
                      sku_size: skuSize,
                      inStock,
                      onSale,
                      skuid: skuId as string,
                      qty: 1,
                    };

                    pushCartEvents(
                      state,
                      productParams.widgetProps,
                      id,
                      skuId as string,
                      salePrice,
                      title,
                      1,
                      true,
                      'add',
                    );

                    dispatch({type: 'CHANGE_CART_AMOUNT', payload: variantToAdd});
                    // SHOW ALERT PRODUCT ADDED OR REMOVE
                    enqueueSnackbar('Added to Cart', {variant: 'success'});
                  });
                }}
                sx={{mb: 4.5, px: '1.75rem', height: 40}}
                startIcon={<AddShoppingCartIcon />}
              >
                {t('add-to-cart')}
              </Button>
            </FlexBox>
          )}
        </FlexRowCenter>
      </FlexBox>
    </WrapperBox>
  );
};
