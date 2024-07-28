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
import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import {useRouter} from 'next/router';
//mui
import {Add, Clear, Close, Remove} from '@mui/icons-material';
import {Avatar, Box, Button, Divider, IconButton, useTheme} from '@mui/material';
//contexts
import {CartItem, useAppContext} from 'contexts/AppContext';
//components
import LazyImage from '@/components/common/bazaar/LazyImage';
import {H5, H6, Paragraph, Tiny} from '@/components/common/bazaar/Typography';
import {FlexBetween, FlexBox} from '@/components/common/flex-box';
import CartBag from '@/components/common/icons/CartBag';
//types
//functions
import {
  GTM_CART_EVENT_TYPE,
  pushCartEvents,
  pushGtmEventRemoveFromCart,
  pushGtmEventUpdateCart,
} from '@/components/gtm/GTMComponentUtils';
import {formattedPrice} from '@/utils/CurrencyUtils';
import {useSnackbar} from 'notistack';

type MiniCartProps = {toggleSidenav: () => void};

export const MiniCart: FC<MiniCartProps> = ({toggleSidenav}) => {
  const {palette} = useTheme();
  const {state, dispatch} = useAppContext();
  const {query} = useRouter();
  const cartList = state.cart;
  const {t} = useTranslation('cart');
  const {enqueueSnackbar} = useSnackbar();

  const handleCartAmountChange =
    (
      amount: number,
      product: CartItem,
      changedAmount: number,
      increment: boolean,
      type?: GTM_CART_EVENT_TYPE,
    ) =>
      () => {
        // Trigger Discovery ATC event via GTM
        const {pid: id, skuid: skuId} = product;

        pushCartEvents(
          state,
          null,
          id,
          skuId as string,
          product.sale_price,
          product.title,
          amount,
          increment,
          type,
        );

        if (amount === 0) {
          pushGtmEventRemoveFromCart(id, skuId as string, changedAmount);
        } else {
          pushGtmEventUpdateCart(id, skuId as string, changedAmount);
        }

        dispatch({
          type: 'CHANGE_CART_AMOUNT',
          payload: {...product, qty: amount},
        });

        if (type === 'remove') {
          enqueueSnackbar('Remove from Cart', {variant: 'error'});
        } else {
          enqueueSnackbar('Added to Cart', {variant: 'success'});
        }
      };

  const getTotalPrice = () => {
    return cartList.reduce(
      (accum, item) => accum + (item.onSale === 'true' ? item.sale_price : item.price) * item.qty,
      0,
    );
  };

  return (
    <Box width='100%' maxWidth={380}>
      <Box overflow='auto' height={`calc(100vh - ${!!cartList.length ? '80px - 3.25rem' : '0px'})`}>
        <FlexBetween mx={3} height={74}>
          <FlexBox gap={1} alignItems='center' /*color='secondary.main'*/>
            <CartBag color='inherit' />

            <Paragraph lineHeight={0} fontWeight={600}>
              {cartList.length} {t('items')}
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleSidenav}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cartList.length <= 0 && (
          <FlexBox
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            height='calc(100% - 74px)'
          >
            <LazyImage
              width={90}
              height={100}
              alt='banner'
              src='/assets/imgs/common/shopping-bag.svg'
            />
            <Box component='p' mt={2} color='grey.600' textAlign='center' maxWidth='200px'>
              {t('empty-cart')}
            </Box>
          </FlexBox>
        )}

        {cartList.map((item: CartItem) => (
          <FlexBox
            py={2}
            px={2.5}
            key={`${item.pid}___${item.skuid}`}
            alignItems='center'
            borderBottom={`1px solid ${palette.divider}`}
          >
            <FlexBox alignItems='center' flexDirection='column'>
              <Button
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(item.qty + 1, item, 1, true, 'update')}
                sx={{height: '32px', width: '32px' /*, borderRadius: '300px'*/}}
              >
                <Add fontSize='small' />
              </Button>

              <Box fontWeight={600} fontSize='15px' my='3px'>
                {item.qty}
              </Box>

              <Button
                color='primary'
                variant='outlined'
                disabled={item.qty === 1}
                onClick={handleCartAmountChange(item.qty - 1, item, -1, true, 'update')}
                sx={{height: '32px', width: '32px' /*, borderRadius: '300px'*/}}
              >
                <Remove fontSize='small' />
              </Button>
            </FlexBox>

            <Link
              href={`/${query?.channelId}/products/${item.pid}___${item.skuid ?? item.pid}`}
              legacyBehavior
            >
              <a>
                <Avatar
                  alt={item.title}
                  src={item.thumb_image}
                  sx={{mx: 2, width: 76, height: 76}}
                />
              </a>
            </Link>

            <Box
              flex='1'
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Link
                href={`/${query?.channelId}/products/${item.pid}___${item.skuid ?? item.pid}`}
                legacyBehavior
              >
                <a>
                  <H5 ellipsis fontSize='14px' className='title'>
                    {item.title}
                  </H5>
                </a>
              </Link>

              <Tiny color='grey.600'>
                {formattedPrice(item.onSale === 'true' ? item.sale_price : item.price)} x {item.qty}
              </Tiny>

              <FlexBox gap={1} fontWeight={600} fontSize='14px' color='primary.main' mt={0.5}>
                {item.onSale === 'true' ? (
                  <>
                    {formattedPrice(item.qty * item.sale_price)}{' '}
                    <H6 color='grey.600'>
                      <del>{formattedPrice(item.qty * item.price)}</del>
                    </H6>
                  </>
                ) : (
                  formattedPrice(item.qty * item.price)
                )}
              </FlexBox>
            </Box>

            <IconButton
              size='small'
              onClick={handleCartAmountChange(0, item, item.qty, false, 'remove')}
              sx={{marginLeft: 2.5}}
            >
              <Close fontSize='small' />
            </IconButton>
          </FlexBox>
        ))}
      </Box>

      {cartList.length > 0 && (
        <Box p={2.5}>
          <Link href={`/${query?.channelId}/cart`} passHref>
            <Button
              fullWidth
              color='primary'
              variant='contained'
              sx={{mb: '0.75rem', height: '40px'}}
              onClick={toggleSidenav}
            >
              {t('checkout-now')} ({formattedPrice(getTotalPrice())})
            </Button>
          </Link>

          <Link href={`/${query?.channelId}/cart`} passHref>
            <Button
              fullWidth
              color='primary'
              variant='outlined'
              sx={{height: 40}}
              onClick={toggleSidenav}
            >
              {t('view-cart')}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};
