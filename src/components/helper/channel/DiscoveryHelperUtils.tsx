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
 *  This function loops through all the cookies and returns the value of the cookie name passes in the parameter,
 *  if the cookie name doesn't match then the function returns ''/empty string.
 *  Ref: https://www.w3schools.com/js/js_cookies.asp
 *
 * @param cname Cookie name
 * @returns {string}
 */
export const getCookie = (cname: string) => {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (0 === c.indexOf(name)) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

/**
 *  This function updated the vale and the Expiration date of the given cookie name
 *  Ref: https://www.w3schools.com/js/js_cookies.asp
 *
 * @param cname name of the cookie which needs to be modifies
 * @param cvalue new value of the cookie
 * @param exdays  Pass the Expiration in unit days
 */
export const setCookie = (cname: any, cvalue: any, exdays: any) => {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  let domainName = getBaseDomain(window.location.hostname);
  document.cookie = cname + '=' + encodeURIComponent(cvalue) + ';' + expires + ';path=/;domain=' + domainName;
};

/**
 *  This function fetches the uid value from the _br_uid_2 cookie which is at first location
 *  Eg: str = uid=7747225917007:v=12.0:ts=1559084402663:hc=28
 *  The function with return the value of uid i.e. '7747225917007'
 *
 * @param str value of _br_uid_2 cookie
 * @returns {string}
 */
export const getUidFromCookie = (str: string) => {
  return str.split(':')[0].split('=')[1];
};

/**
 *  This function override the UID value with newUID(leng: 2digit) at the end of the string
 *  Eg: str:7747225917007
 *  newUID: 14
 *  retun: 7747225917014
 *
 * @param str This is an UID which needs to be updated with newUID(len: 2digit) at the end
 * @param newUID This is a UID which was previously converted from binary to 2 digit decimal
 * @returns {string}
 */
export const getReplacedCookie = (str: string, newUID: string) => {
  if (str) {
    str = str.toString();
    return str.substring(0, str.length - 2) + newUID.toString();
  } else {
    return null;
  }
};

/**
 * This function, converter the given binary number to decimal number in 2 digit string format
 * Eg: 0000: 00
 * 0001: 01
 * 0010: 02
 * -
 * -
 * 1111: 15
 * @param searchBinNumber this is a binary number in the number format
 * @returns {string}
 */
export const get2DigitUidFromBinary = (searchBinNumber: string) => {
  const searchBinNumberAsInt = parseInt(searchBinNumber, 2);
  if (searchBinNumberAsInt / 10 >= 1) {
    return searchBinNumberAsInt.toString();
  } else {
    return '0' + searchBinNumberAsInt.toString();
  }
};

export const get2DigitUidFromUID = (uid?: string) => {
  return uid ? Number(uid.substring(uid.length - 2, uid.length)) : null;
};

export const getBaseDomain = (host: string) => {
  const j = host.split('.');
  const k = j.length;
  if (k <= 2) {
    return host;
  }
  if (j[k - 1].length <= 2 && j[k - 2].length <= 3) {
    return j[k - 3] + '.' + j[k - 2] + '.' + j[k - 1];
  } else {
    return j[k - 2] + '.' + j[k - 1];
  }
};
