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
//react
import {useEffect} from 'react';
//mui
import {useTheme} from '@mui/material';
//bloomreach sdk
import {BrPage, BrPageContext} from '@bloomreach/react-sdk';
import {Configuration, PageModel} from '@bloomreach/spa-sdk';
//other libs
import axios from 'axios';
//contexts
import {GlobalSearchProvider} from '@/contexts/GlobalSearchContext';
import {SEOProvider} from '@/contexts/SEOContext';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {FlexStart} from '@/components/common/flex-box';
import {ArticleListComponent} from '@/components/article-list/ArticleListComponent';
import {ArticleComponent} from '@/components/article/ArticleComponent';
import {BannerCollectionComponent} from '@/components/banner-collection/BannerCollectionComponent';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {CarouselComponent} from '@/components/carousel/CarouselComponent';
import BaseLayout from '@/components/layouts/BaseLayout';
import PageContainers from '@/components/layouts/body/PageContainers';
import {MenuComponent} from '@/components/menu/MenuComponent';
import {SimpleContentComponent} from '@/components/simple-content/SimpleContentComponent';
import {TypeformComponent} from '@/components/typeform/TypeformComponent';
import {ProductComponent} from '@/components/product/ProductComponent';
import {SearchComponent} from '@/components/search/SearchComponent';
import {SearchBoxComponent} from '@/components/search-box/SearchBoxComponent';
import {HeaderToolbarComponent} from '@/components/header-toolbar/HeaderToolbarComponent';
import {VideoComponent} from '@/components/video/VideoComponent';
import {CategoryShowcaseComponent} from '@/components/category-showcase/CategoryShowcaseComponent';
import {ProductShowcaseComponent} from '@/components/product-showcase/ProductShowcaseComponent';
import {
  EngagementRecommendationsComponent,
} from '@/components/engagement-recommendations/EngagementRecommendationsComponent';
import {UserProvider} from '@/contexts/UserContext';
import {GTMComponent} from '@/components/gtm/GTMComponent';
import {AuthorBioComponent} from '@/components/author/AuthorBioComponent';
import {UserProfileComponent} from '@/components/user-profile/UserProfileComponent';
import {CampaignP18NComponent} from '@/components/campaign-p18n/CampaignP18nComponent';
import {GeneratedTextComponent} from '@/components/generated-text/GeneratedTextComponent';
import {
  BannersCrossPillarComponent,
  GenericContentCrossPillarComponent,
  ProductDetailCrossPillarComponent,
  ProductGridCrossPillarComponent,
  ProductsCrossPillarComponent,
  ProductWidgetCrossPillarComponent,
  TeleportHQCrossPillarComponent,
  VideoCrossPillarComponent,
} from 'components/cross-pillar';
import {GuidedSellingFlowComponent} from '@/components/guided-selling-flow/GuidedSellingFlowComponent';
import {ThematicPageComponent} from '@/components/thematic-page/ThematicPageComponent';
import {PageNotFoundComponent} from '@/components/page-not-found/PageNotFoundComponent';
import {ProductCategoryComponent} from '@/components/category/ProductCategoryComponent';
import {ProductWidgetComponent} from '@/components/widget/ProductWidgetComponent';
import SEOComponent from '@/components/seo/SEOComponent';
import {VisualSearchComponent} from '@/components/visual-search/VisualSearchComponent';
import {FooterComponent} from '@/components/footer/FooterComponent';
import {HeaderComponent} from '@/components/header/HeaderComponent';
import {VisualSearchProvider} from '@/contexts/VisualSearchContext';
import {SegmentationComponent} from './exponea/SegmentationComponent';
import {CategoryNavigatorComponent} from '@/components/category-navigator/CategoryNavigatorComponent';
import {GuidedSellingComponent} from '@/components/cross-pillar/guided-selling/GuidedSellingComponent';
import {CartComponent} from '@/components/cart/CartComponent';
import {OrderComponent} from '@/components/order';
import {
  CategoryNavigatorCrossPillarComponent,
} from '@/components/cross-pillar/category-navigator/CategoryNavigatorCrossPillarComponent';
import {ProductGridByWidgetComponent} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponent';
import {
  ProductRecommendationsComponent,
} from '@/components/pacific-product-recommendations/ProductRecommendationsComponent';
import {InlineAssetComponent} from '@/components/inline-assets/InlineAssetComponent';
//functions
import {getChannelIdFromBaseUrl, getChannelIdFromEndpoint} from '@/utils/ApiUtils';
import {ENDPOINT_PARAMETER} from '@/utils/CommonUtils';

interface AppProps {
  configuration: Omit<Configuration, 'httpClient'>;
  page: PageModel;
}

export const App = ({configuration, page}: AppProps) => {
  const theme = useTheme();
  const {settings, updateSettings} = useSettings();

  useEffect(() => {
    let channelId =
      configuration?.[ENDPOINT_PARAMETER] && getChannelIdFromEndpoint(configuration[ENDPOINT_PARAMETER]);
    if (!channelId) {
      channelId = configuration?.['baseUrl'] && getChannelIdFromBaseUrl(configuration['baseUrl']);
    }
    if (channelId) {
      updateSettings({...settings, channelId});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapping: any = {
    Banners: BannersCrossPillarComponent, // Cross-pillar
    Category: ProductCategoryComponent,
    Categories: CategoryNavigatorCrossPillarComponent, // Cross-pillar
    ContentComponent: SimpleContentComponent,
    GeneratedText: GeneratedTextComponent,
    GenericContent: GenericContentCrossPillarComponent, // Cross-pillar
    Form: TypeformComponent,
    GuidedSelling: GuidedSellingComponent, // Cross-pillar
    InlineAsset: InlineAssetComponent,
    Menu: MenuComponent,
    PathwaysRecommendations: ProductWidgetCrossPillarComponent, // Cross-pillar
    Product: ProductComponent,
    ProductDetail: ProductDetailCrossPillarComponent, // Cross-pillar
    ProductGrid: ProductGridCrossPillarComponent, // Cross-pillar
    Products: ProductsCrossPillarComponent, // Cross-pillar
    RetailGuidedSelling: GuidedSellingComponent,
    Search: SearchComponent,
    TeleportHQ: TeleportHQCrossPillarComponent, // Cross-pillar
    TypeForm: TypeformComponent, // Cross-pillar
    ThematicPage: ThematicPageComponent,
    Video: VideoCrossPillarComponent, // Cross-pillar
    Widget: ProductWidgetComponent,
    ArticleComponent,
    ArticleListComponent,
    AuthorBioComponent,
    BannerComponent,
    BannerCollectionComponent,
    CampaignP18NComponent,
    CarouselComponent,
    CartComponent,
    CategoryNavigatorComponent,
    CategoryShowcaseComponent,
    EngagementRecommendationsComponent,
    FooterComponent,
    GuidedSellingFlowComponent,
    GeneratedTextComponent,
    HeaderComponent,
    HeaderToolbarComponent,
    MenuComponent,
    OrderComponent,
    PageNotFoundComponent,
    ProductComponent,
    ProductGridBySearchComponent: SearchComponent,
    ProductGridByWidgetComponent, // Backward compatibility
    ProductRecommendationsComponent, // Backward compatibility
    ProductShowcaseComponent,
    SearchBoxComponent,
    SearchComponent,
    SimpleContentComponent,
    TypeformComponent,
    UserProfileComponent,
    VideoComponent,
    VisualSearchComponent,
  };

  return (
    <BrPage configuration={{...configuration, httpClient: axios}} mapping={mapping} page={page}>
      <VisualSearchProvider>
        <UserProvider>
          <GlobalSearchProvider>
            <BaseLayout>
              <SEOProvider>
                <BrPageContext.Consumer>
                  {(contextPage) => <SegmentationComponent page={contextPage} perPage />}
                </BrPageContext.Consumer>
                <SEOComponent />
                <FlexStart
                  role='main'
                  width='100%'
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    overFlow: 'hidden',
                  }}
                >
                  <PageContainers />
                </FlexStart>
              </SEOProvider>
            </BaseLayout>
            {/*<HelperComponent />*/}
            <GTMComponent />
          </GlobalSearchProvider>
        </UserProvider>
      </VisualSearchProvider>
    </BrPage>
  );
};
