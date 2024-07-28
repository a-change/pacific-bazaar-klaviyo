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
import {useRouter} from 'next/router';
//mui
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {IconButton, ImageListItem, ImageListItemBar, styled} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//types
import {ProductTemplateProps} from '@/components/product/ProductComponentTypes';
//functions
import {getProductUrl} from '@/components/product/ProductComponentUtils';
import {formattedPrice} from '@/utils/CurrencyUtils';
//templates
import {ProductBadge, ProductViewDialog} from '@/components/product/templates';

//Custom styled components
const StyledImageListItem = styled(ImageListItem)(({theme}) => ({
  '& img:hover': {
    cursor: 'pointer',
    border: '1px solid',
  },
}));

interface PreviewDialogProps {
  previewDisabled?: boolean;
}

export const ProductImage: FC<ProductTemplateProps & PreviewDialogProps> = (props) => {
  const page = useContext(BrPageContext);
  const router = useRouter();

  const {
    productContent,
    productParams: {showAttributeBadge = true, rows, cols},
  } = props;

  const {
    pid: id,
    title,
    sale_price: productSalePrice,
    thumb_image: imgUrl,
    price: productPrice,
    inStock,
    onSale,
  } = productContent;

  const price: any = productPrice;
  const salePrice: any = productSalePrice;
  const discount = Math.round(((price - salePrice) / price) * 100);

  const [openModal, setOpenModal] = useState(false);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

  const productUrl = getProductUrl(page, id, id);

  return (
    <StyledImageListItem rows={rows ?? 1} cols={cols ?? 1}>
      <ProductBadge
        {...{
          showAttributeBadge,
          discount,
          onSale,
          inStock,
          size: 'small',
        }}
      />

      <img
        srcSet={`${imgUrl}`}
        src={`${imgUrl}`}
        alt={title}
        onClick={() => router.push(productUrl)}
        loading='lazy'
        style={{objectFit: 'cover'}}
      />
      {
        <ImageListItemBar
          title={<Link href={productUrl}>{title}</Link>}
          subtitle={formattedPrice(salePrice)}
          sx={{
            ':hover': {
              'fontWeight': 'bold',
              '& a': {
                whiteSpace: 'pre-wrap',
              },
            },
          }}
          actionIcon={
            <IconButton
              sx={{color: 'rgba(255, 255, 255, 0.54)'}}
              aria-label={`info about ${title}`}
              onClick={toggleDialog}
            >
              <RemoveRedEyeIcon fontSize={'small'} />
            </IconButton>
          }
        />
      }
      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        productParams={props.productParams}
        productContent={productContent}
      />
    </StyledImageListItem>
  );
};
