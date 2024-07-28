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
import {PacificLink} from './CommonTypes';

const getLinks = (linkRefs: Array<any>, page: Page): Array<PacificLink> => {
  return (
    linkRefs &&
    linkRefs.map((linkRef: any) => {
      return getLink(linkRef, page);
    })
  );
};

const getLink = (linkRef: any, page: Page): any => {
  const link = linkRef?.link?.[0] ?? linkRef?.primaryLink?.[0];
  let url = link?.externalLink;

  const {label, openInNewWindow} = linkRef;
  if (url) {
    if (!url.startsWith('/') && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    if (url.startsWith('/')) {
      url = page.getUrl(url);
    }
  } else {
    const linkContent = page.getContent<Document>(link) as any;
    url = linkContent?.getUrl();
  }
  return {
    url,
    label,
    openInNewWindow,
    isExternal: !!url,
  };
};

const getResourceLink = (resource: any): PacificLink => {
  return (
    resource &&
    resource.url && {
      disableElevation: false,
      label: 'Download resource',
      url: resource.url,
      openInNewWindow: true,
    }
  );
};

export {getLink, getLinks, getResourceLink};
