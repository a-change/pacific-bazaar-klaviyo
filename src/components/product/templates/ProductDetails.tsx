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
import {FC, useContext, useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
//mui
import {ImageSearch} from '@mui/icons-material';
import {Avatar, Badge, Box, Chip, Container, Grid, IconButton, Stack, Tooltip} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import {H1, H6} from '@/components/common/bazaar/Typography';
import {FlexBox, FlexRowCenter} from '@/components/common/flex-box';
import {CommonTitle} from '@/components/common/title/CommonTitle';
//types
import {ProductTemplateProps} from '@/components/product/ProductComponentTypes';
import {BrProductVariant} from '@/utils/CommonTypes';
//functions
import {trackViewItem} from '@/components/exponea/ExponeaUtils';
import {getSkuColorsOptions, getSkuSizesOptions} from '@/components/product/ProductComponentUtils';
import {getContrastColor, getHexColorCode} from '@/utils/ThemeUtils';
import {showCart} from '@/components/cart/CartComponentUtils';
//templates
import {ProductCartButton, ProductFields, ProductPrice} from '@/components/product/templates';
import {ProductSelectedAttribute} from '@/components/product/templates/ProductSelectedAttribute';

interface ProductDetailsProps {
  productId: string;
}

export const ProductDetails: FC<ProductTemplateProps & ProductDetailsProps> = (props) => {
  const {
    userState: {user},
  } = useContext(UserContext)!;
  const router = useRouter();
  const {t} = useTranslation('product');
  const {
    productParams: {title: contentTitle},
    productContent,
    productId,
  } = props;

  const page = useContext(BrPageContext);
  const channelParams = page?.getChannelParameters() ?? {};

  const {
    pid: id,
    title,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    description,
    description_enh,
    brand,
    inStock,
    onSale,
    variants,
  } = productContent;

  const [variant, setVariant] = useState<BrProductVariant>(
    variants?.find((variant) => productId?.endsWith(variant?.skuid as string)) ?? variants?.[0],
  );

  useEffect(() => {
    setVariant(
      variants?.find((variant) => productId?.endsWith(variant?.skuid as string)) ?? variants?.[0],
    );
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    skuid: skuId,
    sku_color: skuColor,
    sku_size: skuSize,
    sku_thumb_images: skuImages,
    sku_price: skuPrice,
    sku_sale_price: skuSalePrice,
  } = variant ?? {};

  useEffect(() => {
    trackViewItem({
      product_id: id,
      product_name: title,
      price: productSalePrice,
      title,
      brand: brand,
      sku: skuId,
      image: skuImages?.[0],
      original_price: productPrice,
      url: window.location.href
    });
    
  }, [id, brand, productSalePrice, title]);

  const skuColorsOptions = getSkuColorsOptions(variants);
  const skuSizesOptions = getSkuSizesOptions(variants);

  const price: any = skuPrice ?? productPrice;
  const salePrice: any = skuSalePrice ?? productSalePrice;

  const onSelectVariant = (color, size) => {
    const selectedVariant = variants?.find(
      (variant) => variant.sku_color === color && variant.sku_size === size,
    );
    if (selectedVariant && selectedVariant.skuid !== variant.skuid) {
      setVariant(selectedVariant);
    }
  };
  const visualSearchEnabled =
    process.env.NEXT_PUBLIC_VISUAL_SEARCH === 'true' && channelParams.visualSearchWidgetID;

  return (
    <Container sx={{mt: 4}}>
      <Box width='100%'>
        <Grid container spacing={3} justifyContent='space-around'>
          {contentTitle && (
            <Grid item xs={12}>
              <CommonTitle title={contentTitle} />
            </Grid>
          )}
          <Grid item md={6} xs={12} alignItems='center'>
            <FlexBox
              justifyContent='center'
              mb={6}
              sx={{
                'position': 'relative',
                '& img': {transition: 'all 250ms ease-in-out'},
              }}
            >
              {visualSearchEnabled && (
                <div style={{position: 'absolute', width: '100%'}}>
                  <Tooltip style={{position: 'absolute', right: 0, top: 0}} title='Visual Search'>
                    <IconButton
                      color='inherit'
                      onClick={() => {
                        router.push(
                          `/${router.query?.channelId}/visual-search?imgUrl=${encodeURIComponent(
                            imgUrl,
                          )}`,
                        );
                      }}
                    >
                      <ImageSearch></ImageSearch>
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              <img
                alt={title}
                width={'100%'}
                height={500}
                style={{
                  objectFit: 'contain',
                }}
                src={imgUrl}
              />
            </FlexBox>

            <FlexRowCenter
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {variants?.map((item, ind) => {
                const {skuid, sku_color, sku_size, sku_thumb_images, sku_swatch_images} = item;
                const itemImage = sku_thumb_images?.[0] ?? sku_swatch_images?.[0];
                const avatarSize = sku_size ? 40 : 64;
                const boxSize = 100;
                const renderAvatar = () => (
                  <Stack direction={'column'} alignItems={'center'} spacing={1}>
                    <Avatar src={itemImage} variant='square' sx={{height: avatarSize}} />
                    {sku_size && <Chip size={'small'} label={sku_size} />}
                  </Stack>
                );
                return (
                  <FlexRowCenter
                    key={ind}
                    width={boxSize}
                    height={boxSize}
                    minWidth={boxSize}
                    bgcolor={'white'}
                    border={`${skuId === skuid ? 2 : 1}px solid`}
                    borderRadius='10px'
                    mb={'10px'}
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setVariant(item);
                    }}
                    ml={ind === 0 ? '0px' : '10px'}
                    borderColor={skuId === skuid ? 'primary.main' : 'grey.400'}
                  >
                    {sku_color ? (
                      <Badge
                        badgeContent=''
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor:
                              sku_color === 'multi' ? 'primary.main' : getHexColorCode(sku_color),
                          },
                        }}
                      >
                        {renderAvatar()}
                      </Badge>
                    ) : (
                      renderAvatar()
                    )}
                  </FlexRowCenter>
                );
              })}
            </FlexRowCenter>
          </Grid>

          <Grid item md={6} xs={12} alignItems='center'>
            <H1 mb={1}>{title}</H1>

            <ProductFields
              {...{
                skuId,
                brand,
                description: description_enh ?? description,
              }}
            />

            {/*<FlexBox alignItems='center' mb={2}>
              <Box lineHeight='1'>Rated:</Box>
              <Box mx={1} lineHeight='1'>
                <BazaarRating
                  color='warn'
                  fontSize='1.25rem'
                  value={4}
                  readOnly
                />
              </Box>
              <H6 lineHeight='1'>(50)</H6>
            </FlexBox>*/}

            {skuColorsOptions.length > 0 && (
              <Box mb={2}>
                <H6 mb={1}>{t('color')}</H6>
                <FlexBox flexWrap='wrap' gap={1}>
                  {skuColorsOptions?.map((item, key) => (
                    <ProductSelectedAttribute selected={item === skuColor} key={item}>
                      <Avatar
                        key={item}
                        sx={{
                          backgroundColor:
                            item === 'multi' ? 'primary.main' : getHexColorCode(item),
                          cursor: 'pointer',
                          color: getContrastColor(item),
                          width: 64,
                          height: 32,
                          fontSize: '0.8125rem',
                          border: '1px solid',
                          borderColor: 'grey.900',
                        }}
                        onClick={() => onSelectVariant(item, skuSize)}
                        variant='square'
                      >
                        {item}
                      </Avatar>
                    </ProductSelectedAttribute>
                  ))}
                </FlexBox>
              </Box>
            )}

            {skuSizesOptions.length > 0 && (
              <Box mb={2}>
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

            <Box pt={1} mb={3}>
              <ProductPrice
                {...{
                  price,
                  salePrice,
                  size: 'large',
                }}
              />
              {inStock && <Box color='inherit'>{t('stock-available')}</Box>}
            </Box>

            {showCart(user) && <ProductCartButton {...{
              variant,
              productContent,
              productParams: props.productParams,
              direction: 'horizontal',
              size: 'large',
            }} />}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
