/*
 * Copyright 2020-2023 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//contexts
import {UserType} from '@/contexts/UserContext';
//types
import {AttributesMapItemType, Constants, ResultsItemType, VisitorType} from './VisitorHelperTypes';

export const SEGMENTATION_PREFIX = 'segmentation:';
export const ATTRIBUTE_PREFIX = 'attribute:';
export const AGGREGATE_PREFIX = 'aggregate:';

export function getVisitorFromResults(
  results: Array<ResultsItemType>,
  engagementVisitorProperties: string,
  engagementVisitorAggregates: string,
  engagementVisitorSegmentations: string,
  user: Partial<UserType>,
  externalLocale: string,
): VisitorType | null {
  const theVisitor: VisitorType = {};
  const userSegments = getUserSegments(user);

  if (results) {
    const attributesMap = buildAttributesMap(
      engagementVisitorProperties,
      engagementVisitorAggregates,
      engagementVisitorSegmentations,
      userSegments,
    );

    attributesMap.forEach((entry: AttributesMapItemType, index: number) => {
      const {type, name} = entry;

      let val = results[index]?.value;

      if (
        val &&
        name !== Constants.PROP_BIRTHDATE &&
        (name?.toLowerCase().indexOf('timestamp') > -1 || name?.toLowerCase().indexOf('date') > -1)
      ) {
        const theDate = new Date(val * 1000);
        val = getFormattedDate(externalLocale, theVisitor, theDate);
      }

      if (val && name?.toLowerCase().indexOf('price') > -1) {
        val = getFormattedCurrency(externalLocale, theVisitor, val);
      }

      switch (type) {
        case Constants.CAT_AGGREGATE:
          if (!theVisitor.aggregates) {
            theVisitor.aggregates = {};
          }
          theVisitor.aggregates[name] = val;
          break;
        case Constants.CAT_SEGMENTATION:
          if (!theVisitor.segmentations) {
            theVisitor.segmentations = {};
          }
          if (!theVisitor.segmentations[name]) {
            theVisitor.segmentations[name] = [];
          }
          theVisitor.segmentations[name].push(val);
          break;
        default:
          getPropertyFromResult(theVisitor, name, val);
          break;
      }
    });
  } else {
    return null;
  }
//console.log('[DEBUG]', theVisitor);
  return theVisitor;
}

export function getUserSegments(user: Partial<UserType>) {
  return [user.contentSegments, user.discoverySegments, user.merchandisingSegments].filter(Boolean).join(',');
}

export function getAPIUrl(domain: string, project: string): string | undefined {
  if (!(domain && project)) {
    const msg = 'unable to retrieve the API Domain and Project Token from system env';
    console.error(msg);
    throw new Error(msg);
  }
  return `${domain}/data/v2/projects/${project}/customers/attributes`;
}

export function getCustomerIds(registered: string | undefined, cookie: string) {
  let ids: any = {
    cookie,
  };
  if (registered) {
    ids.registered = registered;
  }
  return ids;
}

export function buildAttributes(properties: string, aggregates: string, /*segmentations: string, */user: Partial<UserType>): any {
  const getAttributesArray = (type: string, src: string): Array<any> => {
    return src.split(',').map((entry) => {
      const entrySet = entry.split('|');
      const attr: any = {type};
      if (type !== 'property') {
        attr.id = entrySet[0];
      } else {
        attr.property = entrySet[0];
      }
      return attr;
    });
  };

  const propertiesAttributes = properties ? getAttributesArray('property', properties) : [];

  const aggregatesAttributes = aggregates ? getAttributesArray('aggregate', aggregates) : [];
  //const segmentationsAttributes1 = segmentations ? getAttributesArray('segmentation', segmentations) : [];
  const baseAttributes = [{type: 'id', id: 'registered'}];

  const segmentationsAttributes = getUserSegments(user)
    .split(',')
    .map(segment => {
      const segmentParts = segment.split(':');
      return {
        id: segmentParts[0],
        type: 'segmentation',
      };
    });

  return [
    ...baseAttributes,
    ...propertiesAttributes,
    ...aggregatesAttributes,
    ...segmentationsAttributes,
  ];
}


function buildAttributesMap(properties: string, aggregates: string, segmentations: string, userSegments: string): any {
  const propertiesAttributes = getAttributesArray(Constants.CAT_PROPERTY, properties);
  const aggregatesAttributes = getAttributesArray(Constants.CAT_AGGREGATE, aggregates);
  //const segmentationsAttributes = getAttributesArray(Constants.CAT_SEGMENTATION, segmentations);
  const baseAttributes = [{type: 'id', id: 'registered'}];

  const segmentationPairs = {};
  segmentations.split(',').forEach(segmentation => {
    const segmentationParts = segmentation.split('|');
    if (segmentationParts?.[0] && segmentationParts?.[1]) {
      segmentationPairs[segmentationParts?.[0]] = segmentationParts?.[1];
    }
  });

  const segmentationsAttributes = userSegments.split(',')
    .filter(userSegment => userSegment.indexOf(':') !== -1)
    .map(userSegment => {
      const userSegmentParts = userSegment.split(':');
      return {
        type: Constants.CAT_SEGMENTATION,
        name: segmentationPairs[userSegmentParts?.[0]] || userSegmentParts?.[0],
      };
    });

  return [
    ...baseAttributes,
    ...propertiesAttributes,
    ...aggregatesAttributes,
    ...segmentationsAttributes,
  ];
}

function getAttributesArray(type: string, src: string): Array<any> {
  return src.split(',').map((entry) => {
    const entrySet = entry.split('|');
    const name = type === Constants.CAT_PROPERTY ? entrySet[0] : entrySet[1];
    return {type, name};
  });
}

function getFormattedCurrency(
  channelLocale: string,
  visitor: VisitorType,
  currencyValue: any,
  forceChannelLocale?: boolean,
): string | undefined {
  let locale = `${channelLocale.substring(0, 2)}-${channelLocale.substring(3)}`;

  if (!forceChannelLocale && visitor.language && visitor.country) {
    locale = `${visitor.language.substring(0, 2).toLowerCase()}-${visitor.country
      .substring(0, 2)
      .toUpperCase()}`;
  }
  const currencyType =
    locale === Constants.LOCALE_US
      ? Constants.CURRENCY_USD
      : locale === Constants.LOCALE_GB
        ? Constants.CURRENCY_GBP
        : Constants.CURRENCY_EURO;
  try {
    const currencyFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyType,
    });
    return currencyFormatter.format(currencyValue);
  } catch (e) {
    return getFormattedCurrency(channelLocale, visitor, currencyValue, true);
  }
}

function getFormattedDate(
  channelLocale: string,
  visitor: VisitorType,
  dateValue: any,
  forceChannelLocale?: boolean,
): string | undefined {
  let locale = channelLocale ? `${channelLocale.substring(0, 2)}-${channelLocale.substring(3)}` : 'en-US';

  if (!forceChannelLocale && visitor.language && visitor.country) {
    locale = `${visitor.language.substring(0, 2).toLowerCase()}-${visitor.country
      .substring(0, 2)
      .toUpperCase()}`;
  }
  try {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    return dateFormatter.format(dateValue);
  } catch (e) {
    return getFormattedCurrency(channelLocale, visitor, dateValue, true);
  }
}

function getPropertyFromResult(theVisitor: VisitorType, propName: string, propValue: any): void {
  switch (propName) {
    case Constants.PROP_EMAIL:
      theVisitor[Constants.PROP_EMAIL] = propValue || '';
      break;
    case Constants.PROP_FIRSTNAME:
      theVisitor[Constants.PROP_FIRSTNAME] = propValue || '';
      break;
    case Constants.PROP_LASTNAME:
      theVisitor[Constants.PROP_LASTNAME] =
        propValue && typeof propValue === 'string' ? `${propValue/*.substring(0, 1).*/}` : '';
      break;
    case Constants.PROP_BIRTHDATE:
      const dob = propValue !== 0 && propValue !== null ? new Date(propValue * 1000) : null;
      theVisitor[Constants.PROP_BIRTHDATE] = dob ? dob.toLocaleDateString() : '';
      theVisitor[Constants.PROP_AGE] = dob ? getVisitorAge(dob) : 0;
      theVisitor[Constants.PROP_GENERATION] = dob ? getVisitorGeneration(dob) : '';
      break;
    case Constants.PROP_GENDER:
      theVisitor[Constants.PROP_GENDER] =
        propValue && typeof propValue === 'string' ? `${propValue.substring(0, 1)}.` : '';
      break;
    case Constants.PROP_CITY:
      theVisitor[Constants.PROP_CITY] = propValue || '';
      break;
    case Constants.PROP_COUNTRY:
      theVisitor[Constants.PROP_COUNTRY] = propValue || '';
      break;
    case Constants.PROP_LANGUAGE:
      theVisitor[Constants.PROP_LANGUAGE] = propValue || '';
      break;
    case Constants.PROP_LOYALTYPOINTS:
      theVisitor[Constants.PROP_LOYALTYPOINTS] = propValue || 0;
      break;
    case Constants.PROP_EXTSCORE:
      theVisitor[Constants.PROP_EXTSCORE] = propValue || 0;
      break;
    case Constants.PROP_AVATAR:
      theVisitor[Constants.PROP_AVATAR] = propValue || 0;
      break;
    case Constants.PROP_ID:
      theVisitor[Constants.PROP_ID] = propValue || undefined;
      break;
    default:
      theVisitor[propName] = propValue || undefined;
      break;
    //theVisitor[Constants.PROP_ID] = propValue || undefined;
  }
}

function getVisitorAge(dob: Date): number {
  if (!dob) {
    return 0;
  }
  let diff = (new Date().getTime() - dob.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
}

function getVisitorGeneration(dob: Date): string {
  if (!dob) {
    return '';
  }
  const byear = dob.getFullYear();
  if (byear < 1946) {
    return 'Traditionalist';
  }
  if (byear < 1965) {
    return 'Boomer';
  }
  if (byear < 1981) {
    return 'Gen X';
  }
  if (byear < 2001) {
    return 'Millenial';
  }
  if (byear < 2021) {
    return 'Gen Z';
  }
  return '';
}
