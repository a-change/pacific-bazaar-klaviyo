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

//mui
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import {Box, Button} from '@mui/material';
import {Property} from 'csstype';
import FlexDirection = Property.FlexDirection;
//next
import {useTranslation} from 'next-i18next';
//other libs
import {useSnackbar} from 'notistack';
//contexts
import {CartItem, useAppContext} from '@/contexts/AppContext';
//components
import {FlexBox} from '@/components/common/flex-box';
//types
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {BrProduct, BrProductVariant} from '@/utils/CommonTypes';
//functions
import {GTM_CART_EVENT_TYPE, pushCartEvents} from '@/components/gtm/GTMComponentUtils';

export interface ProductCartButtonProps {
  direction?: 'vertical' | 'horizontal';
  size?: 'small' | 'large';
  productContent: BrProduct;
  productParams: ProductComponentParams;
  variant: BrProductVariant;
}

export const ProductCartButton = (props: ProductCartButtonProps) => {
  const {direction = 'vertical', productContent, productParams, variant, size = 'small'} = props;

  const {
    pid: id,
    title,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    description,
    brand,
    inStock,
    onSale,
    variants = [],
  } = productContent;

  const {widgetProps} = productParams;

  const {
    skuid: skuId,
    sku_color: skuColor,
    sku_size: skuSize,
    sku_thumb_images: skuImages,
    sku_price: skuPrice,
    sku_sale_price: skuSalePrice,
  } = variant ?? {};

  const {t} = useTranslation('product');

  const price: any = skuPrice ?? productPrice;
  const salePrice: any = skuSalePrice ?? productSalePrice;

  const {enqueueSnackbar} = useSnackbar();
  const {state, dispatch} = useAppContext();

  const cartItem: CartItem | undefined = state.cart.find(
    (item) => item.skuid === skuId && item.pid === id,
  );

  const handleCartAmountChange =
    (qty: number, increment: boolean, type?: GTM_CART_EVENT_TYPE) => () => {
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
        qty: qty,
      };

      pushCartEvents(
        state,
        widgetProps,
        id,
        skuId as string,
        salePrice,
        title,
        qty,
        increment,
        type,
      );

      dispatch({type: 'CHANGE_CART_AMOUNT', payload: variantToAdd});
      // SHOW ALERT PRODUCT ADDED OR REMOVE
      if (type === 'remove') {
        enqueueSnackbar('Remove from Cart', {variant: 'error'});
      } else {
        enqueueSnackbar('Added to Cart', {variant: 'success'});
      }
    };

  const styles =
    direction === 'vertical'
      ? {
        width: '30px',
        flexDirection: 'column-reverse' as FlexDirection,
        justifyContent: !!cartItem?.qty ? 'space-between' : 'flex-start',
      }
      : {
        flexDirection: 'row-reverse' as FlexDirection,
        justifyContent: 'flex-start',
      };

  const boxStyles =
    direction === 'horizontal'
      ? {
        px: 4,
      }
      : {};

  return (
    <FlexBox alignItems='center' className='add-cart' {...styles}>
      {(cartItem?.qty || 0) === 0 ? (
        size === 'small' ? (
          <Button
            color='primary'
            variant='outlined'
            sx={{padding: '3px'}}
            onClick={handleCartAmountChange(1, true, 'add')}
          >
            <AddIcon fontSize='small' />
          </Button>
        ) : (
          <Button
            color='primary'
            variant='contained'
            onClick={handleCartAmountChange(1, true, 'add')}
            sx={{mb: 4.5, px: '1.75rem', height: 40}}
            startIcon={<AddShoppingCartIcon />}
          >
            {t('add-to-cart')}
          </Button>
        )
      ) : (
        <Button
          color='primary'
          variant='outlined'
          sx={{padding: '3px'}}
          onClick={handleCartAmountChange((cartItem?.qty || 0) + 1, true, 'update')}
        >
          <AddIcon fontSize='small' />
        </Button>
      )}

      {!!cartItem?.qty && (
        <>
          <Box color='text.primary' fontWeight='600' {...boxStyles}>
            {cartItem?.qty}
          </Box>

          <Button
            color='primary'
            variant='outlined'
            sx={{padding: '3px'}}
            onClick={handleCartAmountChange(
              cartItem?.qty - 1,
              false,
              cartItem?.qty - 1 === 0 ? 'remove' : 'update',
            )}
          >
            <RemoveIcon fontSize='small' />
          </Button>
        </>
      )}
    </FlexBox>
  );
};
