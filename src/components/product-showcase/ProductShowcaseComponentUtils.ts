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

import {BrProduct} from '@/utils/CommonTypes';
import {ItemId} from '@/hocs/HocTypes';
import {BannerContent} from '@/components/banner/BannerComponentTypes';
import {ProductShowcaseContent} from '@/components/product-showcase/ProductShowcaseComponentTypes';

export const getPickedProducts = (productPicker: any) => {
  return Array.isArray(productPicker?.productPicker) ? getPickedProductsArray(productPicker) : getPickedProductsObject(productPicker);
};
export const getPickedProductsObject = (productPicker: any) => {
  //JSON.parse(productPicker.productPicker);
  if (productPicker?.productPicker) {
    const pickedProducts = JSON.parse(productPicker.productPicker);
    return pickedProducts?.map((pickedProduct: any) => {
      const {itemId, displayName, description, imageSet, listPrice, purchasePrice} = pickedProduct;
      const product: BrProduct = {
        price_range: [],
        sale_price_range: [],
        variants: [],
        pid: itemId?.id,
        title: displayName,
        description,
        thumb_image: imageSet?.thumbnail?.link?.href,
        price: listPrice?.moneyAmounts?.[0]?.amount,
        sale_price: purchasePrice?.moneyAmounts?.[0]?.amount,
      };
      if (itemId.id !== itemId.code) {
        product.variants.push({
          skuid: itemId.code,
          mainItem: product,
        });
      }
      return product;
    });
  } else {
    const relatedProducts = productPicker?.relatedProduct;
    return relatedProducts?.map((relatedProduct: any) => {
      const {productid, variantid} = relatedProduct;
      //"id=95316;code=57004159"
      const itemId: ItemId = new ItemId(productid);
      const product: BrProduct = {
        pid: itemId.id,
        price_range: [],
        sale_price_range: [],
        variants: [],
        title: '',
        description: '',
        thumb_image: '',
        price: 0,
        sale_price: 0,
      };
      if (itemId.id !== itemId.code) {
        product.variants.push({
          skuid: itemId.code,
          mainItem: product,
        });
      }
      return product;
    });
  }
};

export const getPickedProductsArray = (productPicker: any) => {
  return productPicker?.productPicker.map(product => ({
    pid: product?.productid,
  }));
};

export const getMockProductShowcaseContent = () => {
  return {
    banner: null,
    products: [
      {
        title: 'Product for Placement 1',
        pid: '79367___556781',
      },
      {
        title: 'Product for Placement 2',
        pid: '79367___556781',
      },
      {
        title: 'Product for Placement 3',
        pid: '79367___556781',
      },
      {
        title: 'Product for Placement 4',
        pid: '79367___556781',
      },
    ],
  } as ProductShowcaseContent;
};
