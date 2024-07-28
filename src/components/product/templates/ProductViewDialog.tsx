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
import {useTranslation} from 'next-i18next';
//mui
import CloseIcon from '@mui/icons-material/Close';
import {Avatar, Box, Chip, Dialog, DialogContent, Divider, Grid, IconButton, Stack, styled} from '@mui/material';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import {FlexBox} from '@/components/common/flex-box';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
import Carousel from '@/components/carousel/templates/Carousel';
import {H2, H6} from '@/components/common/bazaar/Typography';
//types
import {BrProduct, BrProductVariant} from '@/utils/CommonTypes';
import {getHexColorCode} from '@/utils/ThemeUtils';
import {getSkuColorsOptions, getSkuSizesOptions} from '@/components/product/ProductComponentUtils';
//functions
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {showCart} from '@/components/cart/CartComponentUtils';
//template
import {ProductCartButton, ProductFields, ProductPrice, ProductSelectedAttribute} from '@/components/product/templates';

// styled components
const ContentWrapper = styled(Box)(({theme}) => ({
  '& .carousel:hover': {
    'cursor': 'pointer',
    '& .carousel__back-button': {opacity: 1, left: 10},
    '& .carousel__next-button': {opacity: 1, right: 10},
  },
  '& .carousel__next-button, & .carousel__back-button': {
    'opacity': 0,
    'boxShadow': 'none',
    'transition': 'all 0.3s',
    'background': 'transparent',
    'color': theme.palette.primary.main,
    ':disabled': {color: theme.palette.grey[500]},
    ':hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  '& .carousel__back-button': {left: 0},
  '& .carousel__next-button': {right: 0},
}));

type ProductViewDialogProps = {
  productContent: BrProduct,
  productParams: ProductComponentParams,
  openDialog: boolean;
  handleCloseDialog: () => void;
};

export const ProductViewDialog: FC<ProductViewDialogProps> = (props) => {
  const {productContent, productParams, openDialog, handleCloseDialog} = props;
  const {
    userState: {user},
  } = useContext(UserContext)!;
  const {t} = useTranslation('product');

  const {
    pid: id,
    title,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    description,
    brand,
    variants = [],
  } = productContent;

  const {
    hideSku,
    showSkuSelect,
  } = productParams;

  const [variant, setVariant] = useState<BrProductVariant>(variants?.[0]);

  const {
    skuid: skuId,
    sku_color: skuColor,
    sku_size: skuSize,
    sku_thumb_images: skuImages,
    sku_price: skuPrice,
    sku_sale_price: skuSalePrice,
  } = variant ?? {};

  const price: any = skuPrice ?? productPrice;
  const salePrice: any = skuSalePrice ?? productSalePrice;

  const skuColorsOptions = getSkuColorsOptions(variants);
  const skuSizesOptions = getSkuSizesOptions(variants);

  const displaySkuSelect =
    showSkuSelect && (skuColorsOptions?.length > 0 || skuSizesOptions?.length > 0);

  const onSelectVariant = (color, size) => {
    const selectedVariant = variants?.find(
      (variant) => variant.sku_color === color && variant.sku_size === size,
    );
    if (selectedVariant && selectedVariant.skuid !== variant.skuid) {
      setVariant(selectedVariant);
    }
  };

  return (
    <Dialog open={openDialog} maxWidth={false} onClose={handleCloseDialog} sx={{zIndex: 1501}}>
      <DialogContent sx={{maxWidth: 900, width: '100%'}}>
        <ContentWrapper>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Carousel totalSlides={[imgUrl].length} visibleSlides={1}>
                {[imgUrl].map((item: string, index: number) => (
                  <BazaarImage
                    key={index}
                    src={item}
                    sx={{
                      mx: 'auto',
                      width: '100%',
                      objectFit: 'contain',
                      height: {sm: 400, xs: 250, md: 600},
                    }}
                  />
                ))}
              </Carousel>
            </Grid>

            <Grid item md={6} xs={12} alignSelf='center'>
              <Stack direction={'column'} spacing={2}>
                <H2>{title}</H2>

                <ProductFields {...{
                  skuId,
                  brand,
                  description,
                }} />

                <ProductPrice {...{
                  price,
                  salePrice,
                  size: 'large',
                }} />

                {/*<FlexBox alignItems='center' gap={1}>
                <BazaarRating color='warn' fontSize='1.25rem' value={4} readOnly />
                <H6 lineHeight='1'>(50)</H6>
              </FlexBox>*/}

                <Box flex={'1 1 0'} minWidth='0px' mr={1}>
                  {!hideSku && (
                    <H6 mb={1} color='text.secondary'>
                      {skuId}
                    </H6>
                  )}
                  {displaySkuSelect && (
                    <Stack direction={'column'}>
                      {skuColorsOptions && skuColorsOptions.length > 0 && <H6 mb={1}>{t('color')}</H6>}
                      <FlexBox flexWrap='wrap' gap={1}>
                        {skuColorsOptions?.map((item) => (
                          <ProductSelectedAttribute selected={item === skuColor} key={item}>
                            <Avatar
                              key={item}
                              sx={{
                                backgroundColor:
                                  item === 'multi' ? 'primary.main' : getHexColorCode(item),
                                cursor: 'pointer',
                                width: 24,
                                height: 24,
                                textTransform: 'uppercase',
                                border: '1px solid',
                                borderColor: 'grey.900',
                              }}
                              onClick={() => onSelectVariant(item, skuSize)}
                              variant='square'
                            >
                              {item === 'multi' && 'M'}
                            </Avatar>
                          </ProductSelectedAttribute>
                        ))}
                      </FlexBox>
                      {skuSizesOptions.length > 0 && (
                        <Box my={2}>
                          <H6 mb={1}>{t('size')}</H6>

                          <FlexBox flexWrap='wrap' gap={1}>
                            {skuSizesOptions?.map((item, key) => (
                              <ProductSelectedAttribute selected={item === skuSize} key={item}>
                                <Chip
                                  key={key}
                                  label={item}
                                  onClick={() => onSelectVariant(skuColor, item)}
                                  sx={{borderRadius: '4px', cursor: 'pointer'}}
                                  color={'primary'}
                                />
                              </ProductSelectedAttribute>
                            ))}
                          </FlexBox>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Box>

                {showCart(user) && <ProductCartButton {...{
                  variant,
                  productParams,
                  productContent,
                  direction: 'horizontal',
                }} />}
              </Stack>
            </Grid>
          </Grid>
        </ContentWrapper>

        <IconButton sx={{position: 'absolute', top: 3, right: 3}} onClick={handleCloseDialog}>
          <CloseIcon fontSize='small' color='secondary' />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};
