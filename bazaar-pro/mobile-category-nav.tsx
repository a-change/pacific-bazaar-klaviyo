import { Box, Divider, Grid, Typography, styled } from "@mui/material";
import Accordion from "./components/accordion/Accordion";
import AccordionHeader from "./components/accordion/AccordionHeader";
import CategoryCard2 from "./components/category-cards/CategoryCard2";
//import Header from "components/layouts/Header";
import { MobileNavigationBar } from "./components/mobile-navigation";
import SearchInputWithCategory from "./components/search-box/SearchInputWithCategory";
import navigations from "./data/navigations";
import { NextPage } from "next";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { layoutConstant } from "./utils/constants";
import Header from './components/header/Header';

// styled component
const Wrapper = styled("div")(({ theme }) => ({
  position: "relative",

  "& .header": {
    top: 0,
    left: 0,
    right: 0,
    position: "fixed",
  },

  "& .main-category-holder": {
    left: 0,
    position: "fixed",
    overflowY: "auto",
    background: theme.palette.grey[300],
    top: layoutConstant.mobileHeaderHeight,
    bottom: layoutConstant.mobileNavHeight,

    "& .main-category-box": {
      width: "90px",
      height: "80px",
      display: "flex",
      cursor: "pointer",
      padding: "0.5rem",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      borderBottom: "1px solid",
      borderLeftColor: theme.palette.grey[600],
      borderBottomColor: theme.palette.grey[300],
    },
  },

  "& .container": {
    left: "90px",
    flex: "1 1 0",
    position: "fixed",
    overflowY: "auto",
    padding: "0.5rem 1rem",
    top: layoutConstant.mobileHeaderHeight,
    bottom: layoutConstant.mobileNavHeight,
  },

  "& .ellipsis": {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const MobileCategoryNav: NextPage = () => {
  const [category, setCategory] = useState<any>(null);
  const [suggestedList, setSuggestedList] = useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);

  const handleCategoryClick = (cat: any) => () => {
    let menuData = cat.menuData;
    if (menuData) setSubCategoryList(menuData.categories || menuData);
    else setSubCategoryList([]);

    setCategory(cat);
  };

  useEffect(() => setSuggestedList(suggestion), []);

  return (
    <Wrapper>
      <Header className="header" searchInput={<SearchInputWithCategory />} />

      <Box className="main-category-holder">
        {navigations.map((item) => (
          <Box
            key={item.title}
            className="main-category-box"
            onClick={handleCategoryClick(item)}
            borderLeft={`${category?.href === item.href ? "3" : "0"}px solid`}
          >
            <item.icon sx={{ fontSize: "28px", mb: "0.5rem" }} />
            <Typography
              className="ellipsis"
              textAlign="center"
              fontSize="11px"
              lineHeight="1"
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box className="container">
        <Typography fontWeight="600" fontSize="15px" mb={2}>
          Recommended Categories
        </Typography>

        <Box mb={4}>
          <Grid container spacing={3}>
            {suggestedList.map((item: any, ind: number) => (
              <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                <Link href="/product/search/mobile" legacyBehavior>
                  <a>
                    <CategoryCard2 {...item} />
                  </a>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        {category?.menuComponent === "MegaMenu1" ? (
          subCategoryList.map((item, ind) => (
            <Fragment key={ind}>
              <Divider />
              <Accordion>
                <AccordionHeader px={0} py={1.25}>
                  <Typography fontWeight="600" fontSize="15px">
                    {item.title}
                  </Typography>
                </AccordionHeader>

                <Box mb={4} mt={1}>
                  <Grid container spacing={3}>
                    {item.subCategories?.map((item: any, ind: number) => (
                      <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                        <Link href="/product/search/mobile" legacyBehavior>
                          <a>
                            <CategoryCard2 {...item} />
                          </a>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Accordion>
            </Fragment>
          ))
        ) : (
          <Box mb={4}>
            <Grid container spacing={3}>
              {subCategoryList.map((item, ind) => (
                <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                  <Link href="/product/search/mobile" legacyBehavior>
                    <a>
                      <CategoryCard2 {...item} />
                    </a>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <MobileNavigationBar />
    </Wrapper>
  );
};

const suggestion = [
  {
    title: "Belt",
    href: "/belt",
    imgUrl: "/assets/images/products/categories/belt.png",
  },
  {
    title: "Hat",
    href: "/Hat",
    imgUrl: "/assets/images/products/categories/hat.png",
  },
  {
    title: "Watches",
    href: "/Watches",
    imgUrl: "/assets/images/products/categories/watch.png",
  },
  {
    title: "Sunglasses",
    href: "/Sunglasses",
    imgUrl: "/assets/images/products/categories/sunglass.png",
  },
  {
    title: "Sneakers",
    href: "/Sneakers",
    imgUrl: "/assets/images/products/categories/sneaker.png",
  },
  {
    title: "Sandals",
    href: "/Sandals",
    imgUrl: "/assets/images/products/categories/sandal.png",
  },
  {
    title: "Formal",
    href: "/Formal",
    imgUrl: "/assets/images/products/categories/shirt.png",
  },
  {
    title: "Casual",
    href: "/Casual",
    imgUrl: "/assets/images/products/categories/t-shirt.png",
  },
];

export default MobileCategoryNav;