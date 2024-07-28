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
import {FC, useContext, useState} from 'react';
//next
import Link from 'next/link';
//mui
import {Avatar, Box, Grid, MenuItem, styled, TextField} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {H2} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {ProductTemplateProps} from '@/components/product/ProductComponentTypes';
import {BrProductVariant} from '@/utils/CommonTypes';
//functions
import {pushGtmEventWidgetClick} from '@/components/gtm/GTMComponentUtils';
import {showCart} from '@/components/cart/CartComponentUtils';
import {
  getProductUrl,
  getSkuColorsOptions,
  getSkuSizesOptions,
} from '@/components/product/ProductComponentUtils';
//templates
import {
  ProductBadge,
  ProductCartButton,
  ProductFields,
  ProductPrice,
  ProductSelectedAttribute,
} from '@/components/product/templates';

//Custom styled components
const StyledBazaarCard = styled(BazaarCard)({
  'height': '100%',
  'margin': 'auto',
  'display': 'flex',
  'overflow': 'hidden',
  'borderRadius': '8px',
  'position': 'relative',
  'flexDirection': 'column',
  'justifyContent': 'space-between',
  'transition': 'all 250ms ease-in-out',
  ':hover': {'& .hover-box': {opacity: 1}},
  '& img': {
    width: '100%',
    objectFit: 'cover',
  },
});

const ImageWrapper = styled(Box)(({theme}) => ({
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  display: 'inline-block',
  [theme.breakpoints.down('sm')]: {display: 'block'},
}));

const ProductTextField = styled(TextField)(({theme}) => ({
  '& div': {
    fontSize: '0.7rem',
  },
}));

export const ProductListItem: FC<ProductTemplateProps> = (props) => {
  const {
    userState: {user},
  } = useContext(UserContext)!;

  const page = useContext(BrPageContext);
  const {
    productParams: {
      hideSku,
      showSkuSelect,
      showAttributeBadge,
      productUrl: productUrlFunc,
      widgetProps,
      hoverEffect,
    },
    productContent,
  } = props;

  const {
    pid: id,
    title,
    description,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    brand,
    inStock,
    onSale,
    variants,
  } = productContent;

  const [variant, setVariant] = useState<BrProductVariant>(variants?.[0]);

  const {
    skuid: skuId,
    sku_color: skuColor,
    sku_size: skuSize,
    sku_thumb_images: skuImages,
    sku_price: skuPrice,
    sku_sale_price: skuSalePrice,
  } = variant ?? {};

  const skuColorsOptions = getSkuColorsOptions(variants);
  const skuSizesOptions = getSkuSizesOptions(variants);

  const price: any = skuPrice ?? productPrice;
  const salePrice: any = skuSalePrice ?? productSalePrice;
  const discount = Math.round(((price - salePrice) / price) * 100);

  const onSelectVariant = (color, size) => {
    const selectedVariant = variants?.find(
      (variant) => variant.sku_color === color && variant.sku_size === size,
    );
    if (selectedVariant && selectedVariant.skuid !== variant.skuid) {
      setVariant(selectedVariant);
    }
  };

  const productUrl = productUrlFunc
    ? productUrlFunc(page, id, skuId as string, title)
    : getProductUrl(page, id, skuId as string);

  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      <Grid container spacing={1}>
        <Grid item md={4} xs={12}>
          <Box position='relative'>
            <ImageWrapper>
              <ProductBadge
                {...{
                  showAttributeBadge,
                  discount,
                  onSale,
                  inStock,
                  size: 'small',
                }}
              />

              <Link
                href={productUrl ?? ''}
                onClick={() => pushGtmEventWidgetClick(widgetProps, id)}
              >
                <img src={imgUrl} style={{objectFit: 'contain', padding: '10px'}} alt={title} />
              </Link>
            </ImageWrapper>
          </Box>
        </Grid>

        <Grid item md={8} xs={12}>
          <FlexBox flexDirection='column' justifyContent='center' height='100%' p={2}>
            <Link href={productUrl ?? ''} onClick={() => pushGtmEventWidgetClick(widgetProps, id)}>
              <H2 mb={1} title={title} className='title'>
                {title}
              </H2>
            </Link>

            <ProductFields
              {...{
                skuId,
                brand,
                description,
              }}
            />

            {/*<FlexBox alignItems='center' gap={1}>
              <BazaarRating color='warn' fontSize='1.25rem' value={4} readOnly />
              <H6 lineHeight='1'>(50)</H6>
            </FlexBox>*/}

            {showSkuSelect && (
              <FlexBox flexDirection={'column'} gap={2} sx={{marginY: 2}}>
                <FlexBox flexWrap='wrap' gap={1}>
                  {skuColorsOptions?.map((item) => (
                    <ProductSelectedAttribute selected={item === skuColor} key={item}>
                      <Avatar
                        key={item}
                        sx={{
                          bgcolor: item === 'multi' ? 'primary.main' : item,
                          cursor: 'pointer',
                          width: 24,
                          height: 24,
                          textTransform: 'uppercase',
                        }}
                        onClick={() => onSelectVariant(item, skuSize)}
                        variant='square'
                      >
                        {item === 'multi' && 'M'}
                      </Avatar>
                    </ProductSelectedAttribute>
                  ))}
                </FlexBox>
                <FlexBox>
                  {skuSizesOptions && skuSizesOptions.length > 0 && (
                    <ProductTextField
                      select
                      size='small'
                      variant='standard'
                      placeholder='Size'
                      defaultValue={skuSize}
                      onChange={(e) => onSelectVariant(skuColor, e.target.value)}
                    >
                      {skuSizesOptions.map((item) => (
                        <MenuItem value={item} key={item} sx={{fontSize: '0.7rem'}}>
                          {item}
                        </MenuItem>
                      ))}
                    </ProductTextField>
                  )}
                </FlexBox>
              </FlexBox>
            )}

            <ProductPrice
              {...{
                price,
                salePrice,
                size: 'large',
              }}
            />

            {showCart(user) && <ProductCartButton {...{
              variant,
              productParams: props.productParams,
              productContent,
              direction: 'horizontal',
            }} />}
          </FlexBox>
        </Grid>
      </Grid>
    </StyledBazaarCard>
  );
};
