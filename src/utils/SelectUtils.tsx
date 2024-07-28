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
 * Utilities for retrieving the selected item's value (aka key) in the
 * proper format
 *
 * @author Michael Reynolds <michael.reynolds@bloomreach.com>
 *
 * @typedef {object} SelectValue
 * @prop {string} key
 * @prop {string} label
 *
 * @typedef {object} SelectItem
 * @prop {SelectValue[]} selectionValues
 */

/**
 * @param {SelectItem} select
 * @returns {string} The key of the selected item
 */
const getSelectValue = (select) => {
  if (!select) return;
  return select?.selectionValues?.[0]?.key;
};

/**
 *
 * @param {SelectItem} select
 * @returns {boolean} The boolean value of the selected item's key
 */
const getSelectValueAsBoolean = (select) => {
  if (!select) return false;
  const trueStrings = /(true|on|1)/i;
  return getSelectValue(select).test(trueStrings);
};

/**
 *
 * @param {SelectItem} select
 * @returns {number} The float value of the selected item's key
 */
const getSelectValueAsFloat = (select) => {
  if (!select) return 0;
  return parseFloat(getSelectValue(select));
};

/**
 *
 * @param {SelectItem} select
 * @returns {number} The int value of the selected iteem's key
 */
const getSelectValueAsInt = (select) => {
  if (!select) return 0;
  return parseInt(getSelectValue(select));
};

/**
 *
 * @param {SelectItem} select
 * @returns {number} The number value of the selected item's key
 */
const getSelectValueAsNumber = (select) => {
  if (!select) return 0;
  return Number(getSelectValue(select));
};

const getSelectedPair = (select) => {
  const {key, label} = select?.selectionValues?.[0] ?? {};
  return {
    key,
    label,
  };
};

export {
  getSelectValue,
  getSelectValueAsBoolean,
  getSelectValueAsFloat,
  getSelectValueAsInt,
  getSelectValueAsNumber,
  getSelectedPair,
};

