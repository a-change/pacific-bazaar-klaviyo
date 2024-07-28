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

/**
 * Utilities for retrieving documents and assets from a content instance
 *
 * @author Michael Reynolds <michael.reynolds@bloomreach.com>
 *
 */

const BASE_API_URL = process.env.NEXT_PUBLIC_BRXM_ENDPOINT;
const BASE_RESOURCE_URL = process.env.NEXT_PUBLIC_BRXM_RESOURCE_ENDPOINT;
const DOCUMENTS_API_PATH = 'documents';

/**
 * @param {baseUrl} string
 * @returns {string} The channel ID from the endpoint
 */
function getChannelIdFromBaseUrl(baseUrl) {
  return baseUrl.startsWith('/') ? baseUrl.substring(1) : baseUrl;
}

/**
 * @param {endpoint} string
 * @returns {string} The channel ID from the endpoint
 */
function getChannelIdFromEndpoint(endpoint) {
  if (!endpoint) {
    return null;
  }
  const segments = endpoint.split('/');
  return segments[segments.length - 2];
}

/**
 * @param {channelId} string
 * @param {docpath} string
 * @returns {Promise<object>} The json response
 */
async function getDocument(channelId: string, docpath: string) {
  if (!(channelId && docpath)) return;
  if (docpath.startsWith('/')) {
    docpath = docpath.substring(1);
  }
  const endpoint = `${BASE_API_URL}/${channelId}/${DOCUMENTS_API_PATH}/${docpath}`;
  return await fetch(endpoint).then((res) => {
    return res.json();
  });
}

/**
 * @param {assetPath} string
 * @returns {Promise<object>} The file's contents as an object
 */
async function getJsonAsset(assetpath): Promise<object> | null {
  if (!assetpath) return;
  if (assetpath.startsWith('/')) {
    assetpath = assetpath.substring(1);
  }
  const fullPath = `${BASE_RESOURCE_URL}/${assetpath}`;
  return await fetch(fullPath)
    .then((res) => {
      return res.text();
    })
    .then((text) => {
      return JSON.parse(text);
    });
}

/**
 * @param {channelId} string
 * @param {path} string
 * @returns {Promise<Record<string, string>>} An object containing the key:value pairs from the resource bundle file
 */
async function getResourceBundle(channelId, docpath) {
  if (!(channelId && docpath)) return;
  if (docpath.startsWith('/')) {
    docpath = docpath.substring(1);
  }
  const endpoint = `${BASE_API_URL}/${channelId}/${DOCUMENTS_API_PATH}/${docpath}`;
  return await fetch(endpoint)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const {content, document} = json;
      const cid = document?.['$ref']?.split('/')[2];
      const {keys, messages} = content?.[cid]?.data;

      let result: Record<string, string>;
      messages?.forEach((message: string, index: number) => {
        result = {...result, [keys[index]]: message};
      });
      return result;
    });
}

export {
  getChannelIdFromBaseUrl,
  getChannelIdFromEndpoint,
  getDocument,
  getJsonAsset,
  getResourceBundle,
};
