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

import {ImageSet, Page} from '@bloomreach/spa-sdk';
import {ImageSizeEnum} from './CommonEnums';
import {ImageLink} from './CommonTypes';
import {brxmEndpoint} from '@/utils/CommonUtils';

const UNSPLASH_IMAGE_MAPPING: Partial<Record<string, ImageSizeEnum>> = {
  full: ImageSizeEnum.Large,
  raw: ImageSizeEnum.Original,
  regular: ImageSizeEnum.MediumSquare,
  small: ImageSizeEnum.Small,
  thumb: ImageSizeEnum.Thumbnail,
};

const BYNDER_IMAGE_MAPPING: Partial<Record<string, ImageSizeEnum>> = {
  online: ImageSizeEnum.Original,
  large: ImageSizeEnum.Large,
  webImage: ImageSizeEnum.MediumSquare,
  thumbnail: ImageSizeEnum.Small,
  mini: ImageSizeEnum.Thumbnail,
};

const CLOUDINARY_IMAGE_MAPPING: Partial<Record<string, ImageSizeEnum>> = {
  'c_fit,h_100,w_100': ImageSizeEnum.Thumbnail,
};

const getInternalImageUrl = (url: string): string => {
  if (url.startsWith('/')) {
    const brBaseUrl: string = brxmEndpoint();
    url = brBaseUrl && brBaseUrl.substring(0, brBaseUrl.indexOf('/site')) + '/resources' + url;
  }

  return url;
};

const getImageVariants = (
  imageObject: any,
  page: Page,
): Partial<Record<ImageSizeEnum, ImageLink>> => {
  const images: Partial<Record<ImageSizeEnum, ImageLink>> = {};
  const image = imageObject?.image?.[0] ?? imageObject?.image ?? imageObject;
  if (image) {
    const imageType = image?.contentType?.split(':')?.[1];
    switch (imageType) {
      case 'unsplashImage':
      case 'demoUnsplashImage':
      case 'demoAlphaUnsplashImage':
      case 'bruialphaUnsplash':
        try {
          const imageJson = JSON.parse(image?.unsplashImage ?? image?.unsplash);
          const {urls, width, height} = imageJson;
          Object.keys(UNSPLASH_IMAGE_MAPPING).forEach((key) => {
            const url = urls?.[key];
            if (url) {
              const imageSize = UNSPLASH_IMAGE_MAPPING[key] as ImageSizeEnum;
              images[imageSize] = {
                type: 'unsplash',
                url,
                imageSize,
              } as ImageLink;
            }
          });
          const imageOriginal = images[ImageSizeEnum.Original];
          if (imageOriginal) {
            imageOriginal.width = width;
            imageOriginal.height = height;
          }
        } catch (e) {
        }
        break;
      case 'bynderImage':
      case 'demoBynderImage':
      case 'demoAlphaBynderImage':
      case 'bruialphaBynder':
        try {
          const imageJson = JSON.parse(image?.bynderImage ?? image?.bynder);
          Object.keys(BYNDER_IMAGE_MAPPING).forEach((key) => {
            const file = imageJson?.[0]?.files?.[key];
            if (file) {
              const {fileSize, url, height, width} = file;
              const imageSize = BYNDER_IMAGE_MAPPING[key] as ImageSizeEnum;
              images[imageSize] = {
                type: 'bynder',
                imageSize,
                fileSize,
                url,
                height,
                width,
              } as ImageLink;
            }
          });
          return images;
        } catch (e) {
        }
        break;
      case 'demoCloudinaryImage':
      case 'demoAlphaCloudinaryImage':
        try {
          const imageJson = JSON.parse(image?.cloudinaryImage);
          const {secure_url: url, width, height, bytes: fileSize} = imageJson?.[0];
          images[ImageSizeEnum.Original] = {
            type: 'cloudinary',
            imageSize: ImageSizeEnum.Original,
            fileSize,
            url,
            height,
            width,
          } as ImageLink;
          const files = imageJson?.[0]?.derived;
          files?.forEach((file: any) => {
            if (file?.raw_transformation) {
              const imageSize = CLOUDINARY_IMAGE_MAPPING[file?.raw_transformation] as ImageSizeEnum;
              images[imageSize] = {
                type: 'cloudinary',
                imageSize,
                url: file.secure_url,
              } as ImageLink;
            }
          });
          return images;
        } catch (e) {
        }
        break;
      case 'externalLink':
      case 'demoExternalLink':
      case 'demoAlphaExternalLink':
        let externalLink = image?.externalLink;
        if (externalLink) {
          return {
            [ImageSizeEnum.Original]: {
              type: 'external',
              url: externalLink,
              imageSize: ImageSizeEnum.Original,
            },
          };
        }
        break;
      default:
        const imageDoc = page.getContent(image) as any;
        if (imageDoc) {
          Object.values(ImageSizeEnum).forEach((value) => {
            const imageSize: ImageSizeEnum = value as ImageSizeEnum;
            const file = imageDoc?.model?.data?.[imageSize];
            const url = file?.links?.site?.href;
            if (url) {
              const {width, height, size: fileSize} = file;
              images[imageSize] = {
                type: 'internal',
                url,
                imageSize,
                width,
                height,
                fileSize,
              } as ImageLink;
            }
          });
          const imageSet = page.getContent<ImageSet>(image);
          if (imageSet && imageSet.getOriginal) {
            images[ImageSizeEnum.Original] = {
              type: 'internal',
              url: imageSet.getOriginal()?.getUrl(),
            } as ImageLink;
          } else {
            images[ImageSizeEnum.Original] = {
              type: 'internal',
              url: imageDoc?.model?.links?.site?.href,
            } as ImageLink;
          }
        }
    }
  }
  return images;
};

/*
xs, extra-small: 0px
sm, small: 600px
md, medium: 900px
lg, large: 1200px
xl, extra-large: 1536px
 */
const getImageSize = (
  size: number,
  images: Partial<Record<ImageSizeEnum, ImageLink>>,
): ImageSizeEnum => {
  let imageSize: ImageSizeEnum = ImageSizeEnum.Original;
  if (size < 600) {
    imageSize = ImageSizeEnum.Small; //ImageSizeEnum.Thumbnail;
  }

  if (size >= 600 && size < 900) {
    imageSize = ImageSizeEnum.Small;
  }

  if (size >= 900 && size < 1200) {
    imageSize = ImageSizeEnum.Large;
  }

  if (size >= 1200 && size < 1536) {
    imageSize = ImageSizeEnum.Large;
  }
  if (images[imageSize]?.url) return imageSize;
  return ImageSizeEnum.Original;
};

const getImageVariantBySize = (
  imageVariants: Partial<Record<ImageSizeEnum, ImageLink>>,
  imageSize: ImageSizeEnum,
): string | undefined => {
  return imageVariants?.[imageSize]?.url ?? imageVariants?.[ImageSizeEnum.Original]?.url;
};

export {getImageVariants, getImageSize, getInternalImageUrl, getImageVariantBySize};
