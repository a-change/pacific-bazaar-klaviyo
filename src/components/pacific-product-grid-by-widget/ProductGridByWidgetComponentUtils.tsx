import {BrProps} from '@bloomreach/react-sdk';
import {Component, ContainerItem, Document, Page} from '@bloomreach/spa-sdk';
import {NextRouter} from 'next/router';
import {getProductIdFromUrl} from '@/components/product/ProductComponentUtils';
import {ProductGridTemplateProps} from '@/components/common/product-grid/ProductGridTypes';
import {BrProduct, BrWidgetResults} from '@/utils/CommonTypes';
import {UserType} from '@/contexts/UserContext';
import {WidgetPair} from '@/components/widget/ProductWidgetComponentTypes';
import {lastSegmentOfUrl} from '@/utils/UrlUtils';

export const getComponentDefaultName = (name: string) => {
  //Remove generated string from the end of a component name to return base component name
  const segments = name?.split('-');
  segments.pop();
  return segments.length === 1 ? segments[0] : segments.join('-');
};

export const getCategoryComponent = (page: Page) => {
  //Finds the first category-like component on the page, returns the component, its name
  let categoryComponentType = '',
    categoryComponent;

  page!
    .getComponent('main', 'container')
    ?.getChildren()
    .forEach((child) => {
      let defaultComponentName = getComponentDefaultName(child.getName());
      // console.log(defaultComponentName);

      if (defaultComponentName === 'category' || defaultComponentName === 'product-grid-category') {
        categoryComponent = child;
        categoryComponentType = defaultComponentName;
      }
    });

  return {
    categoryComponent,
    categoryComponentType,
  };
};

export const getCategoryIdFromComponent = (
  categoryComponent: Component,
  categoryComponentType: string,
  path: string,
  page: Page,
) => {
  let categoryId;
  if (categoryComponentType === 'category') {
    //If component is page-specific category component, access the cat_id similarly to the ProductGridByCategoryPageComponent
    const containerItem = (categoryComponent as ContainerItem)!;
    const {category}: any = containerItem.getContent(page!);
    categoryId = category?.categoryid;

    if (!categoryId) {
      categoryId = lastSegmentOfUrl(path);
    }
  } else if (categoryComponentType === 'product-grid-category') {
    const {document: documentRef} = categoryComponent.getModels();
    const categoryParams = categoryComponent?.getParameters();
    const content = (documentRef && page.getContent<Document>(documentRef)) || page.getDocument<Document>();

    categoryId = content?.getData()?.relatedexdocids;

    try {
      const selectedCategoryIds = JSON.parse(categoryId);
      if (Array.isArray(selectedCategoryIds)) {
        categoryId = selectedCategoryIds[0];
      }
    } catch (e) {
    }

    if (!categoryId) {
      categoryId = categoryParams?.categoryId;
    }
  }
  return categoryId ?? '';
};

export const extractWidgetPairs = (params: {[x: string]: any}): WidgetPair[] => {
  const widgetPairs = [];

  //This while loop should allow the component to be extensible with further widgetTitle parameters
  //Assuming they follow the same naming convention
  let i = 1;
  while (typeof params[`widgetTitle${i}`] !== 'undefined') {
    const keyValuePair = params[`widgetTitle${i}`];
    if (keyValuePair !== 'widgetId:title') {
      const split = keyValuePair.split(':');
      const widgetId = split.shift();
      const title = split.join(':');
      widgetPairs.push({widgetId: widgetId, title: title === '' ? `Widget ${i}` : title});
    }
    i++;
  }
  return widgetPairs;
};

export interface WidgetParameters {
  query?: string;
  cat_id?: string;
  user_id?: string;
  item_ids?: string;
}

export const constructWidgetParameters = (
  widgetType: string,
  widgetParameter: string,
  router: NextRouter,
  searchQuery: any,
  user: Partial<UserType>,
  page: Page,
) => {
  let error;
  const widgetParameterExists = widgetParameter !== '';

  const widgetParameters: WidgetParameters = {};
  switch (widgetType) {
    case 'item':
      if (widgetParameterExists) {
        widgetParameters.item_ids = widgetParameter;
        break;
      }

      if (!router.asPath.includes('/products')) {
        error =
          'This Product Grid (Widget - Item) is not on a PDP page or has not been passed the required item_id(s) necessary for other page types';
        break;
      }

      widgetParameters.item_ids = (router.query['pid'] ??
        getProductIdFromUrl(true, router.asPath) ??
        '') as string;
      break;
    case 'keyword':
      if (widgetParameterExists) {
        widgetParameters.query = widgetParameter;
        break;
      }

      if (!searchQuery) {
        error =
          'This Product Grid (Widget - Keyword) is not on a search page or has not been passed a required keyword necessary for other page types';
        break;
      }

      widgetParameters.query = searchQuery;
      break;
    case 'category':
      if (widgetParameterExists) {
        widgetParameters.cat_id = widgetParameter;
        break;
      }
      const {categoryComponent, categoryComponentType} = getCategoryComponent(page!);

      if (!categoryComponent || categoryComponentType === '') {
        error =
          'This Product Grid (Widget - Category) is not on a correctly configured category page or has not been passed a required cat_id necessary for other page types';
        break;
      }

      widgetParameters.cat_id = getCategoryIdFromComponent(
        categoryComponent,
        categoryComponentType,
        router.asPath,
        page,
      );
      break;
    case 'personalized':
      widgetParameters.user_id = user?.id && user?.id.length > 0 ? user?.id : 'NO-USER-ID';

      if (widgetParameterExists) {
        widgetParameters.query = widgetParameter;
      } else {
        widgetParameters.query = searchQuery ?? 'NO-QUERY';
      }

      break;
    default:
    //Global recs have no additional inputs
  }
  return {widgetParameters, error};
};

export const getProductGridWidgetProps = (
  widgetSearchResult: BrWidgetResults<BrProduct>,
  widget: WidgetPair,
  props: BrProps,
): ProductGridTemplateProps => {
  const {component, page} = props;
  const {numberOfColumns, pageSize, hideSku, title, cols, rows} = component!.getParameters();
  const {metadata, response} = widgetSearchResult;
  const {rid, id, type} = metadata?.widget || {};

  const defaultSize = numberOfColumns || cols || 4;

  return {
    productGridParams: {
      template: 'default',
      hideSku: true,
      showSkuSelect: true,
      showAttributeBadge: true,
      numberOfColumns: defaultSize,
      pageSize: pageSize || ((cols ?? 0) * (rows ?? 0)) || defaultSize,
      showFacets: false,
      showPagination: false,
      title: title || widget?.title || '',
      subTitle: widget?.subTitle || '',
    },
    productGridContent: {
      facet_counts: {},
      response,
    },
  };
};
