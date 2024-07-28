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
import Link from 'next/link';
import {useRouter} from 'next/router';
//mui
import {Add, Close, Remove} from '@mui/icons-material';
import {Avatar, Button, Card, IconButton, styled} from '@mui/material';
//other libs
import {useSnackbar} from 'notistack';
//contexts
import {CartItem, useAppContext} from '@/contexts/AppContext';
//components
import {FlexBox} from '@/components/common/flex-box';
import {Span} from '@/components/common/typography/Typography';
import {GTM_CART_EVENT_TYPE, pushCartEvents} from '@/components/gtm/GTMComponentUtils';
//types
import {StageInputProps} from '../CartComponentTypes';
import {CartStageEnum} from './CartDetail';
//functions
import {formattedPrice} from '@/utils/CurrencyUtils';

// styled components
const Wrapper = styled(Card)(({theme}) => ({
  'display': 'flex',
  'overflow': 'hidden',
  'textOverflow': 'ellipsis',
  'alignItems': 'center',
  'position': 'relative',
  'borderRadius': '10px',
  'marginBottom': '1.5rem',
  'boxShadow': theme.shadows[2],
  'backgroundColor': theme.palette.background.paper,

  '@media only screen and (max-width: 425px)': {
    flexWrap: 'wrap',
    img: {height: 'auto', minWidth: '100%'},
  },
}));

// =========================================================
interface EditEnabled {
  enabled?: boolean;
}

// =========================================================

export const CartItemCard = (props: CartItem & StageInputProps & EditEnabled) => {
  const {
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
    skuid: skuId,
    qty,
    stage,
    enabled = true,
  } = props;
  const {query} = useRouter();
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();

  // handle change cart
  const handleCartAmountChange =
    (qty: number, increment: boolean, type?: GTM_CART_EVENT_TYPE) => () => {
      const variantToAdd = {
        title: title,
        pid: id,
        sale_price: salePrice,
        price: price,
        description: description,
        thumb_image: imgUrl,
        brand: brand,
        variants: variants,
        sku_color: skuColor,
        sku_size: skuSize,
        inStock: inStock,
        onSale: onSale,
        skuid: skuId as string,
        qty: qty,
      };

      pushCartEvents(state, null, id, skuId as string, salePrice, title, qty, increment, type);

      dispatch({
        type: 'CHANGE_CART_AMOUNT',
        payload: variantToAdd,
      });
      // SHOW ALERT PRODUCT ADDED OR REMOVE
      if (type === 'remove') {
        enqueueSnackbar('Removed from Cart', {variant: 'error'});
      } else {
        enqueueSnackbar('Added to Cart', {variant: 'success'});
      }
    };

  return (
    <Wrapper>
      <Link href={`/${query?.channelId}/products/${id}___${skuId ?? id}`} legacyBehavior>
        <a>
          <Avatar alt={title} src={imgUrl} sx={{mx: 2, width: 76, height: 76}} />
        </a>
      </Link>

      {enabled && stage !== CartStageEnum.PURCHASE && (
        <IconButton
          size='small'
          onClick={handleCartAmountChange(0, false, 'remove')}
          sx={{position: 'absolute', right: 15, top: 15}}
        >
          <Close fontSize='small' />
        </IconButton>
      )}

      <FlexBox p={2} rowGap={2} width='100%' flexDirection='column'>
        <Link href={`/${query?.channelId}/products/${id}___${skuId ?? id}`} legacyBehavior>
          <a>
            <strong>{title}</strong>
          </a>
        </Link>

        {/* //TODO make price function of location */}
        <FlexBox gap={1} flexWrap='wrap' alignItems='center'>
          <Span color='grey.600'>
            {formattedPrice(price)} x {qty}
          </Span>

          <Span fontWeight={600} color='primary.main'>
            {formattedPrice(price * qty, 2)}
          </Span>
        </FlexBox>

        {enabled && stage !== CartStageEnum.PURCHASE && (
          <FlexBox alignItems='center'>
            <Button
              color='primary'
              sx={{p: '5px'}}
              variant='outlined'
              disabled={qty === 1}
              onClick={handleCartAmountChange(qty - 1, true, 'remove')}
            >
              <Remove fontSize='small' />
            </Button>

            <Span mx={1} fontWeight={600} fontSize={15}>
              {qty}
            </Span>
            <Button
              color='primary'
              sx={{p: '5px'}}
              variant='outlined'
              onClick={handleCartAmountChange(qty + 1, true, 'update')}
            >
              <Add fontSize='small' />
            </Button>
          </FlexBox>
        )}
      </FlexBox>
    </Wrapper>
  );
};
