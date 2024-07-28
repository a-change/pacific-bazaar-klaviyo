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

import {Content, Document, Page, Reference} from '@bloomreach/spa-sdk';
import {getImageVariants} from './ImageUtils';
import {getLink} from './LinkUtils';

const syskeys = ['contentType', 'displayName', 'id', 'localeString', 'name'];

export const getDocument = (
  page: Page,
  type: string,
  documentRef?: Reference | string,
): Content | Document | undefined => {
  let content: Content | Document | undefined;
  if (documentRef) {
    content = page!.getContent(documentRef);
  } else {
    const pageDocument = page!.getDocument() as Document;
    const {contentType} = (pageDocument?.getData() as any) ?? {};
    if (contentType === type) {
      content = pageDocument;
    }
  }
  return content;
};

export const getContent = (document: Content | Document | undefined, page: Page): any => {
  if (!(document && page)) return;
  const data = document.getData();
  const sys = getDocumentProperties(data);
  const fields = getDocumentFields(data);

  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      fields[key] = getValueForArray(value, page);
    } else if (typeof value === 'object' && value.contentType) {
      fields[key] = getValueForObject(value, page);
    } else {
      fields[key] = value;
    }
  });

  return {
    sys,
    fields,
  };
};

const getDocumentFields = (data: any): object | undefined => {
  if (!data) return;
  const props = Object.entries(data).filter(([key, value]) => {
    return !syskeys.includes(key);
  });
  return Object.fromEntries(props);
};

const getDocumentProperties = (data: any): object | undefined => {
  if (!data) return;
  const props = Object.entries(data).filter(([key, value]) => {
    return syskeys.includes(key);
  });
  return Object.fromEntries(props);
};

const getValueForArray = (arr: Array<any>, page: Page): Array<any> => {
  return arr.map((entry) => {
    if (Array.isArray(entry)) {
      return getValueForArray(entry, page);
    } else if (typeof entry === 'object' && entry.contentType) {
      return getValueForObject(entry, page);
    } else {
      return entry;
    }
  });
};

const getValueForObject = (obj: any, page: Page): any => {
  if (!obj.contentType) return obj;

  switch (obj.contentType) {
    case 'hippostd:html':
      return obj.value;
      break;
    case 'brxsaas:demoImage':
      return getImageVariants(obj, page);
      break;
    case 'brxsaas:demoLink':
      return getLink(obj, page);
      break;
    default:
      return obj;
  }
};

export const getContentTypePrefix = (page: Page) => {
  const document = page.getDocument<Document>();
  let prefix = '';
  if (document) {
    const contentType = document.getData()?.contentType ?? '';
    if (contentType.indexOf('demoAlpha') !== -1) {
      prefix = 'Alpha';
    }
  }
  return prefix;
};
