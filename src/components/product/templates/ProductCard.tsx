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
import {FC, useCallback, useContext, useState} from 'react';
//next
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
//mui
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {Avatar, Box, IconButton, MenuItem, Stack, styled, TextField} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {H4, H6, Span} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {ProductTemplateProps} from '@/components/product/ProductComponentTypes';
import {ProductSelectedAttribute} from '@/components/product/templates/ProductSelectedAttribute';
import {BrProductVariant} from '@/utils/CommonTypes';
//functions
import {pushGtmEventWidgetClick} from '@/components/gtm/GTMComponentUtils';
import {
  getProductUrl,
  getSkuColorsOptions,
  getSkuSizesOptions,
} from '@/components/product/ProductComponentUtils';
import {getHexColorCode} from '@/utils/ThemeUtils';
import {showCart} from '@/components/cart/CartComponentUtils';
//templates
import {
  ProductBadge,
  ProductCartButton,
  ProductPrice,
  ProductViewDialog,
} from '@/components/product/templates';

//Custom styled components
const StyledBazaarCard = styled(BazaarCard)(({theme}) => ({
  'height': '100%',
  'margin': 'auto',
  'display': 'flex',
  'overflow': 'hidden',
  'borderRadius': '8px',
  'position': 'relative',
  'flexDirection': 'column',
  'justifyContent': 'space-between',
  'transition': 'all 250ms ease-in-out',
  ':hover': {
    '& .hover-box': {opacity: 1},
    'border': `1px solid ${theme.palette.grey['500']}`,
    '& img': {transform: 'scale(1.05)'},
  },
  '& .title, & .categories': {
    padding: '0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    fontWeight: 'bold',
  },
}));

const ImageWrapper = styled(Box)(({theme}) => ({
  textAlign: 'center',
  position: 'relative',
  display: 'block',
  [theme.breakpoints.down('sm')]: {display: 'block'},
}));

const HoverIconWrapper = styled(Box)({
  zIndex: 2,
  top: '7px',
  opacity: 0,
  right: '15px',
  display: 'flex',
  cursor: 'pointer',
  position: 'absolute',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
});

const ContentWrapper = styled(Box)({
  'padding': '0.5rem',
  '& .title, & .categories': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    fontWeight: 'bold',
  },
});

const ProductTextField = styled(TextField)(({theme}) => ({
  '& div': {
    fontSize: '0.7rem',
  },
}));

const ProductCardH6 = styled(H6)(({theme}) => ({
  'marginBottom': '0px',
  'a:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

const ProductCardH4 = styled(H4)(({theme}) => ({
  'marginBottom': '0px',
  'a:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

const StatusChipBox = styled(Box)(({theme}) => ({
  'width': 40,
  'height': 42,
  //zIndex: 2,
  'top': '0px',
  'right': '25px',
  'fontSize': '12px',
  'position': 'absolute',
  'background': theme.palette.primary.main,
  '& .triangle-left': {
    width: 0,
    height: 0,
    borderTop: '0px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: `20px solid ${theme.palette.primary.main}`,
  },
  '& .triangle-right': {
    width: 0,
    height: 0,
    borderTop: '0px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: `20px solid ${theme.palette.primary.main}`,
  },
}));

const StatusChip = styled(Span)({
  color: '#fff',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface PreviewDialogProps {
  previewDisabled?: boolean;
}

export const ProductCard: FC<ProductTemplateProps & PreviewDialogProps> = (props) => {
  const page = useContext(BrPageContext);
  const {t} = useTranslation('product');
  const {
    userState: {user},
  } = useContext(UserContext)!;

  const {
    productParams: {
      hideSku,
      showSkuSelect,
      showAttributeBadge,
      productUrl: productUrlFunc,
      widgetProps,
      hoverEffect = false,
      size = 'small',
    },
    productContent,
    previewDisabled,
  } = props;

  const {
    pid: id,
    title,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    inStock,
    onSale,
    variants = [],
    brand,
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

  const [openModal, setOpenModal] = useState(false);
  //const [isFavorite, setIsFavorite] = useState(false);

  //const toggleIsFavorite = () => setIsFavorite((fav) => !fav);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

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
  const displaySkuSelect =
    showSkuSelect && (skuColorsOptions?.length > 0 || skuSizesOptions?.length > 0);

  let imageHeight;
  switch (size) {
    case 'medium':
      imageHeight = '250px';
      break;
    case 'large':
      imageHeight = '600px';
      break;
    case 'small':
    default:
      imageHeight = '200px';
      break;
  }

  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      <FlexBox
        flexDirection={'column'}
        sx={{
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <ImageWrapper>
          <ProductBadge
            {...{
              showAttributeBadge,
              discount,
              onSale,
              inStock,
              size,
            }}
          />

          {!!discount && (
            <StatusChipBox>
              <StatusChip>{t('off', {off: discount})}</StatusChip>
              <Box width='100%' display='flex'>
                <Box className='triangle-left' />
                <Box className='triangle-right' />
              </Box>
            </StatusChipBox>
          )}

          <HoverIconWrapper className='hover-box'>
            {previewDisabled ? (
              <></>
            ) : (
              <IconButton onClick={toggleDialog} size={size ?? 'small'}>
                <RemoveRedEyeIcon color='disabled' fontSize={size ?? 'small'} />
              </IconButton>
            )}

            {/*<IconButton onClick={toggleIsFavorite} size={size ?? 'small'}>
              {isFavorite ? (
                <FavoriteIcon color='primary' fontSize={size ?? 'small'} />
              ) : (
                <FavoriteBorder fontSize={size ?? 'small'} color='disabled' />
              )}
            </IconButton>*/}
          </HoverIconWrapper>

          <Link href={productUrl ?? ''} onClick={() => pushGtmEventWidgetClick(widgetProps, id)}>
            <img
              src={imgUrl}
              height={imageHeight}
              style={{
                objectFit: 'cover',
              }}
              alt={title}
            />
          </Link>
        </ImageWrapper>
        {size === 'large' ? (
          <ProductCardH4 mb={1} title={title} className='title'>
            <Link href={productUrl ?? ''} onClick={() => pushGtmEventWidgetClick(widgetProps, id)}>
              {title}
            </Link>
          </ProductCardH4>
        ) : (
          <ProductCardH6 mb={1} title={title} className='title'>
            <Link href={productUrl ?? ''} onClick={() => pushGtmEventWidgetClick(widgetProps, id)}>
              {title}
            </Link>
          </ProductCardH6>
        )}
      </FlexBox>

      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        productContent={productContent}
        productParams={props.productParams}
      />

      <ContentWrapper>
        <FlexBox>
          <Box flex={'1 1 0'} minWidth='0px' mr={1}>
            {/*(!hideSku || displaySkuSelect) && (
              <H6 mb={1} color='text.secondary'>
                {skuId}
              </H6>
            )*/}
            {displaySkuSelect && (
              <Stack direction={'column'} spacing={1}>
                {skuId /*!hideSku || displaySkuSelect*/ && (
                  <FlexBox justifyContent={'center'} color='text.secondary'>
                    {skuId}
                  </FlexBox>
                )}
                <FlexBox
                  flexWrap='wrap'
                  justifyContent='space-between'
                  sx={{maxHeight: 90, marginY: 0}}
                >
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
              </Stack>
            )}
            <ProductPrice
              {...{
                price,
                salePrice,
                size,
                justifyContent: 'center',
              }}
            />
            {brand && (
              <FlexBox
                fontSize={'small'}
                flexWrap='wrap'
                justifyContent='center'
                sx={{
                  mt: 1,
                }}
              >
                <Box color='text.secondary'>{brand}</Box>
              </FlexBox>
            )}
          </Box>
          {showCart(user) && <ProductCartButton {...{
            variant,
            productContent,
            productParams: props.productParams,
          }} />}
        </FlexBox>
      </ContentWrapper>
    </StyledBazaarCard>
  );
};
