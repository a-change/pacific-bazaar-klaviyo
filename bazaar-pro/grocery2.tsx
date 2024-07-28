import { Box, Grid, Stack } from "@mui/material";
import Newsletter from "./components/Newsletter";
import SEO from "./SEO";
import Scrollbar from "./components/Scrollbar";
import Setting from "./components/Setting";
import SidenavContainer from "./components/SidenavContainer";
import { Footer2 } from "./components/footer";
import ShopLayout2 from "./components/layouts/ShopLayout2";
import { MobileNavigationBar2 } from "./components/mobile-navigation";
import Grocery2SideNav from "./components/page-sidenav/Grocery2Sidenav";
import ServiceCard from './components/service-cards/ServiceCard';
import { GroceryTwoCarouselItem } from "./models/Carousel.model";
import Category from "./models/Category.model";
import { CategoryItem } from "./models/CategoryNavList.model";
import Product from "./models/Product.model";
import Service from "./models/Service.model";
import { GetStaticProps, NextPage } from "next";
import ProductCarousel from "./pages-sections/grocery2/ProductCarousel";
import Section1 from "./pages-sections/grocery2/Section1";
import Section3 from "./pages-sections/grocery2/Section3";
import Section6 from "./pages-sections/grocery2/Section6";
import Section9 from "./pages-sections/grocery2/Section9";
import api from "./utils/__api__/grocery2-shop";

// ========================================================
type Grocery2Props = {
  categories: Category[];
  serviceList: Service[];
  dairyProducts: Product[];
  featuredProducts: Product[];
  bestSellProducts: Product[];
  bestHomeProducts: Product[];
  navigationList: CategoryItem[];
  mainCarouselData: GroceryTwoCarouselItem[];
  testimonials: any[];
  discountBanners: any[];
};
// ========================================================

const Grocery2: NextPage<Grocery2Props> = (props) => {
  return (
    <ShopLayout2 showTopbar={false}>
      <SEO title="Grocery store template v2" />
      <Box id="grocerySection" />

      <SidenavContainer
        navFixedComponentID="grocerySection"
        SideNav={() => (
          <Grocery2SideNav groceryNavigation={props.navigationList} />
        )}
      >
        <Stack spacing={6}>
          {/* TOP HERO AREA */}
          <Section1 carouselData={props.mainCarouselData} />

          {/* SERIVICE LIST AREA */}
          {/* <Section2 services={props.serviceList} /> */}
          <Box>
            <Grid container spacing={3}>
              {props.serviceList.slice(0, 3)?.map((item, key) => {
                return <ServiceCard key={key} service={item} />
              })}
            </Grid>
          </Box>

          {/* SHOP BY CATEGORY LIST AREA */}
          <Section3 categories={props.categories} />

          {/* FEATURED ITEMS AREA */}
          <ProductCarousel
            title="Featured Items"
            products={props.featuredProducts}
          />

          {/* BEST SELLER IN YOUR AREA */}
          <ProductCarousel
            title="Best Seller in Your Area"
            products={props.bestSellProducts}
          />

          {/* DISCOUNT BANNER AREA */}
          <Section6 cardList={props.discountBanners} />

          {/* BEST OF HOME ESSENTIALS PRODUCTS AREA  */}
          <ProductCarousel
            title="Best of Home Essentials"
            products={props.bestHomeProducts}
          />

          {/* SNACKS-DRINKS-DAIRY PRODUCTS AREA */}
          <ProductCarousel
            title="Snacks, Drinks, Dairy & More"
            products={props.dairyProducts}
          />

          {/* CLIENT TESTIMONIALS AREA */}
          <Section9 testimonials={props.testimonials} />

          {/* FOOTER AREA */}
          <Footer2 />
        </Stack>
      </SidenavContainer>

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />

      {/* POPUP NEWSLETTER FORM */}
      <Newsletter image="/assets/images/newsletter/bg-2.png" />

      {/* SMALL DEVICE BOTTOM NAVIGATION */}
      <MobileNavigationBar2>
        <Scrollbar>
          <Grocery2SideNav groceryNavigation={props.navigationList} />
        </Scrollbar>
      </MobileNavigationBar2>
    </ShopLayout2>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const serviceList = await api.getServices();
  const categories = await api.getCategories();
  const testimonials = await api.getTestimonials();
  const dairyProducts = await api.getDairyProducts();
  const navigationList = await api.getNavigationList();
  const mainCarouselData = await api.getMainCarousel();
  const featuredProducts = await api.getFeaturedProducts();
  const bestHomeProducts = await api.getBestHomeProducts();
  const bestSellProducts = await api.getBestSellProducts();
  const discountBanners = await api.getDiscountBannerList();

  return {
    props: {
      categories,
      serviceList,
      testimonials,
      dairyProducts,
      navigationList,
      discountBanners,
      featuredProducts,
      bestSellProducts,
      bestHomeProducts,
      mainCarouselData,
    },
  };
};

export default Grocery2;
