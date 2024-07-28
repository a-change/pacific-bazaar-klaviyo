import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import Newsletter from "./components/Newsletter";
import SEO from "./SEO";
import Setting from "./components/Setting";
import SidenavContainer from "./components/SidenavContainer";
import { Footer2 } from "./components/footer";
import HeroWithSearch from './components/hero-banners/HeroWithSearch';
import ShopLayout2 from "./components/layouts/ShopLayout2";
import { MobileNavigationBar2 } from "./components/mobile-navigation";
import SideNavbar from "./components/page-sidenav/SideNavbar";
import ServiceCard from './components/service-cards/ServiceCard';
import CategoryNavList from "./models/CategoryNavList.model";
import Product from "./models/Product.model";
import Service from "./models/Service.model";
import { GetStaticProps, NextPage } from "next";
import AllProducts from "./pages-sections/grocery1/AllProducts";
import DiscountSection from "./pages-sections/grocery1/DiscountSection";
import ProductCarousel from "./pages-sections/grocery1/ProductCarousel";
import { Fragment, useCallback, useEffect, useState } from "react";
import api from "./utils/__api__/grocery1-shop";

// =====================================================
type Grocery1Props = {
  products: Product[];
  serviceList: Service[];
  popularProducts: Product[];
  trendingProducts: Product[];
  grocery1NavList: CategoryNavList[];
};
// =====================================================

const Grocery1: NextPage<Grocery1Props> = (props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);

  // FETCH PRODUCTS BASED ON THE SELECTED CATEGORY
  useEffect(() => {
    axios
      .get("/api/grocery-1/category-based-products", {
        params: { category: selectedCategory },
      })
      .then(({ data }) => setFilterProducts(data));
  }, [selectedCategory]);

  // HANDLE CHANGE CATEGORY
  const handleSelectCategory = (category: string) =>
    setSelectedCategory(category);

  // SIDE NAVBAR COMPONENT
  const SideNav = useCallback(
    () => (
      <SideNavbar
        navList={props.grocery1NavList}
        handleSelect={handleSelectCategory}
      />
    ),
    [props.grocery1NavList]
  );

  const servicesData = props?.serviceList?.slice(0, 4);

  return (
    <ShopLayout2 showNavbar={false} showTopbar={false}>
      <SEO title="Grocery store template v1" />
      {/* TOP HERO AREA */}
      {/* <Section1 /> */}
      <HeroWithSearch />

      {/* SERVICE AREA */}
      {/* <Section2 id="grocery1Services" services={props.serviceList} /> */}
      <Container id='grocery1Services' sx={{ pt: 12, pb: 8 }}>
        <Grid container spacing={3}>
          {servicesData?.map((item, key) => {
            return <ServiceCard key={key} service={item} />
          })}
        </Grid>
      </Container>

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <SidenavContainer
        navFixedComponentID="grocery1Services"
        SideNav={SideNav}
      >
        <Stack spacing={6} mt={2}>
          {selectedCategory ? (
            // FILTERED PRODUCT LIST
            <AllProducts products={filterProducts} title={selectedCategory} />
          ) : (
            <Fragment>
              {/* POPULAR PRODUCTS AREA */}
              <ProductCarousel
                title="Popular Products"
                products={props.popularProducts}
              />

              {/* TRENDING PRODUCTS AREA */}
              <ProductCarousel
                title="Trending Products"
                products={props.trendingProducts}
              />

              {/* ALL PRODUCTS AREA */}
              <AllProducts products={props.products} />
            </Fragment>
          )}

          {/* DISCOUNT BANNER AREA */}
          <DiscountSection />

          {/* FOOTER AREA */}
          <Footer2 />
        </Stack>
      </SidenavContainer>

      {/* POPUP NEWSLETTER FORM */}
      <Newsletter image="/assets/images/newsletter/bg-2.png" />

      {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
      <Setting />

      {/* MOBILE NAVIGATION WITH SIDE NAVABAR */}
      <MobileNavigationBar2>
        <SideNavbar navList={props.grocery1NavList} />
      </MobileNavigationBar2>
    </ShopLayout2>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.getProducts();
  const serviceList = await api.getServices();
  const popularProducts = await api.getPopularProducts();
  const trendingProducts = await api.getTrendingProducts();
  const grocery1NavList = await api.getGrocery1Navigation();

  return {
    props: {
      products,
      serviceList,
      grocery1NavList,
      popularProducts,
      trendingProducts,
    },
  };
};

export default Grocery1;
