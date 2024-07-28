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

import {Page} from '@bloomreach/spa-sdk';
import {MenuComponentParams, MenuContent, MenuContentItem, MenuTemplate} from './MenuComponentTypes';
import {getCategoryUrl} from '@/components/category/ProductCategoryComponentUtils';

const getItem = ({page, siteMenuItem, bannerElem = null}: any): MenuContentItem => {
  const itemParams = siteMenuItem.getParameters() || {};
  const imageUrl = itemParams.image; // TODO: && parseSearchImageUrl(itemParams.image).url;
  let url = siteMenuItem.getUrl();
  if (siteMenuItem.getLink()?.type === 'external' && url?.startsWith('/')) {
    url = page.getUrl(url);
  }
  const {display, icon, category: categoryId} = itemParams;
  const isDynamicCategory = itemParams?.['dynamic category'] === 'true';
  if (!url && categoryId) {
    url = getCategoryUrl(page, categoryId, isDynamicCategory, siteMenuItem.getName());
  }

  let item: MenuContentItem = {
    name: siteMenuItem.getName(),
    url,
    selected: siteMenuItem.isSelected(),
    display,
    icon,
    image: imageUrl,
    userType: itemParams.usertype,
    categoryId,
    isDynamicCategory,
  };

  if (bannerElem) {
    item.banner = bannerElem;
  }

  const children = siteMenuItem.getChildren();
  if (children && children.length > 0) {
    item.childNavItems = children.map((childMenuItem: any) => {
      return getItem({page: page, siteMenuItem: childMenuItem});
    });
  }

  return item;
};

const getMockMenuContent = () => {
  return {
    name: 'Mock Menu',
    menuContentItems: [{
      name: 'Mock item 1',
    } as MenuContentItem, {
      name: 'Mock item 2',
    } as MenuContentItem, {
      name: 'Mock item 3',
    } as MenuContentItem],
  };
};

const getMenuContent = (data: any, page: Page): MenuContent => {
  const {menu, banners} = data;
  return {
    name: menu?.getName(),
    menuContentItems: menu?.getItems().map((siteMenuItem: any) => {
      const bannerTitle = siteMenuItem.getParameters() && siteMenuItem.getParameters()['Related Banner (Title of desired Banner document)'];
      let bannerElem = null;
      if (bannerTitle && banners[bannerTitle]) {
        bannerElem = {
          documentRef: banners[bannerTitle],
          params: {},
          template: 'menu',
        };
        // TODO: disable the search call for now
        //getPersonalizedBanner(siteMenuItem.name);
      }
      return getItem({page, siteMenuItem, bannerElem});
    }),
  };
};

const getMenuParams = (params: any): MenuComponentParams => {
  const template = params['template'] || 'default';
  return {
    siteMenu: params['siteMenu'] ?? params['menu'],
    template: template as MenuTemplate,
  };
};

export {
  getMockMenuContent,
  getMenuContent,
  getMenuParams,
};