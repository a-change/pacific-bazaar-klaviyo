import { FC } from "react";
import Link from "next/link";
import { Button, Grid, styled } from "@mui/material";
import LazyImage from "../../components/LazyImage";
import { H3, H5 } from "../../components/Typography";
import Carousel from "../../components/carousel/Carousel";

// styled component
const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: "3rem",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    gap: 24,
    flexDirection: "column-reverse",
  },
  [theme.breakpoints.between("sm", "lg")]: {
    "& .grid-2": { display: "none" },
  },
}));

// ============================================================
type Props = { cardList: any[] };
// ============================================================

const Section6: FC<Props> = ({ cardList = [] }) => {
  return (
    <Carousel
      spacing="0px"
      totalSlides={3}
      showDots={true}
      autoPlay={true}
      visibleSlides={1}
      showArrowOnHover={true}
      arrowButtonColor="inherit"
    >
      {cardList.map((item, ind) => (
        <StyledGrid key={ind} container sx={{ bgcolor: item.bgColor }}>
          <Grid item lg={7} sm={9} xs={12}>
            <H5 fontWeight="600" fontSize={{ sm: 18, xs: 14 }} mb={1}>
              {item.subtitle}
            </H5>
            <H3
              mb={{ sm: 4, xs: 3 }}
              fontSize={{ sm: 35, xs: 24 }}
              lineHeight="1.37"
            >
              {item.title}
            </H3>

            <Link href={item.shopUrl}  legacyBehavior>
              <a>
                <Button variant="contained" color="primary">
                  Shop Now
                </Button>
              </a>
            </Link>
          </Grid>

          <Grid item lg={5} xs={12} className="grid-2">
            <LazyImage
              width={320}
              height={200}
              alt={item.title}
              src={item.imgUrl}
              objectFit="contain"
            />
          </Grid>
        </StyledGrid>
      ))}
    </Carousel>
  );
};

export default Section6;
