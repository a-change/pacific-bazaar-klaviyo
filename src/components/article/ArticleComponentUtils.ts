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

import {Document, Page, Reference} from '@bloomreach/spa-sdk';
import {ArticleComponentParams, ArticleContent, ArticleTemplate, CallToActionEntryProps} from './ArticleComponentTypes';
import {getImageVariants} from '@/utils/ImageUtils';
import {getPickedProducts} from '@/components/product-showcase/ProductShowcaseComponentUtils';
import {getSelectValue} from '@/utils/SelectUtils';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {stripePTags} from '@/utils/HtmlUtils';

const getMockArticleContent = () => {
  return {
    title: 'Mock Article Title',
    description: '<p>Vivamus consequat tortor sit amet tortor iaculis finibus. Aliquam quis risus eget libero vehicula interdum.</p>',
    tags: ['Vivamus', 'consequat', 'tortor'],
    images: {
      original: {
        type: 'external',
        imageSize: ImageSizeEnum.Original,
        url: 'https://pacific-saas.bloomreach.io/delivery/resources/content/gallery/pacific-home/banners/menu/edition.jpg',
      },
    },
    entries: [{
      type: 'demoParagraph',
      title: 'Maecenas fermentum consequat ante. Pellentesque quam purus',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat tortor sit amet tortor iaculis finibus. Aliquam quis risus eget libero vehicula interdum. Suspendisse sit amet felis dignissim, ultrices nisi id, facilisis ligula. Proin nec lacus vel purus feugiat tincidunt ut id sem. Etiam commodo vehicula tortor, imperdiet dictum lectus sodales at. Donec viverra efficitur enim non accumsan. Fusce tempor, lectus consequat ullamcorper elementum, eros mi dapibus ex, sed accumsan ex mi ac augue. Quisque efficitur dolor nulla, malesuada venenatis massa venenatis in. Etiam lobortis nulla tellus, et facilisis nibh tempor vel. Maecenas tempus lectus in nulla ullamcorper volutpat. Duis luctus turpis vel dolor semper viverra. Ut imperdiet ligula et nulla blandit, at pulvinar nunc pretium.',
    }],
  } as ArticleContent;
};

const getArticleContent = (
  data: any,
  page: Page,
): ArticleContent => {
  const {
    authors: documentRefs,
    tags,
    entries,
    introduction,
    images: image,
    title,
    date,
    sidebar: sidebars,
  } = data;

  const articleContent: ArticleContent = {
    title,
    description: stripePTags(introduction?.value),
    date,
    tags,
    link: {
      url: 'foo-bar', //content.getUrl()!,
    },
    images: getImageVariants(image, page),
  };

  // Author by line
  const authorDocs = documentRefs?.map((documentRef) => page.getContent<Document>(documentRef));
  articleContent.authors = authorDocs
    ?.filter((authorDoc) => !!authorDoc)
    ?.map((authorDoc) => {
      const {fullName, displayName, picture, role, content: info, accounts} = authorDoc!.getData();
      return {
        fullName: fullName ?? displayName ?? '',
        link: {
          url: authorDoc!.getUrl()!,
        },
        role,
        info,
        images: getImageVariants(picture, page),
        accounts: accounts.map((account: any) => {
          return {
            type: getSelectValue(account.type) ?? account.type,
            accountType: getSelectValue(account.accountType) ?? account.accountType,
            link: {
              url: account.link,
            },
          };
        }),
      };
    });

  // Parse the entries
  articleContent.entries = entries?.map((entry: any) => {
    const entryType = entry.contentType.split(':')[1];
    switch (entryType) {
      case 'paragraph':
      case 'demoParagraph':
      case 'demoAlphaParagraph':
        const {title: entryTitle, description: entryDescription} = entry;
        return {
          type: entryType,
          title: entryTitle,
          description: stripePTags(entryDescription.value),
        };
      case 'calltoaction':
      case 'demoCallToAction':
      case 'demoAlphaCallToAction':
        const {name, info, image: entryImage, internallink: internalLinkRef, externallink: externalLink} = entry;
        const articleProps: CallToActionEntryProps = {
          type: entryType,
          title: name,
          description: stripePTags(info.value),
          images: getImageVariants(entryImage, page),
          externalLink,
        };
        const internalLinkDocument = internalLinkRef && page.getContent(internalLinkRef);
        if (internalLinkDocument) {
          articleProps.internalLink = {
            url: internalLinkDocument.getUrl() || '',
            label: internalLinkDocument.getData().displayName,
          };
        }
        return articleProps;
      case 'demoAIContent':
        const {title: aiTitle, content} = entry;
        return {
          type: entryType,
          title: aiTitle,
          content: content?.value,
        };
      default:
        return null;
    }
  });

  articleContent.sidebars = sidebars?.filter((sidebar: any) => !!sidebar?.sidebarItem?.[0]).map((sidebar: any) => {
    const sidebarItem = sidebar?.sidebarItem?.[0];
    if (sidebarItem?.bannerLink) {
      return {
        type: 'banner',
        banner: sidebarItem.bannerLink as Reference,
      };
    } else if (sidebarItem.productPicker || sidebarItem.relatedProduct) {
      const products = getPickedProducts(sidebarItem);
      return {
        type: 'product',
        products,
      };
    }
  });

  return articleContent;
};

const getArticleParams = (params: any): ArticleComponentParams => {
  const template = params['template'] || 'details';
  return {
    template: template as ArticleTemplate,
  };
};

export {
  getMockArticleContent,
  getArticleContent,
  getArticleParams,
};