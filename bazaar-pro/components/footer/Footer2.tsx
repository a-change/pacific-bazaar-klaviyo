import { FC } from "react";
import Link from "next/link";
import { Box, Grid, IconButton, styled } from "@mui/material";
import AppStore from "../AppStore";
import { FlexBox } from "../flex-box";
import BazaarImage from "../BazaarImage";
import { Paragraph } from "../Typography";
import Google from "../icons/Google";
import Twitter from "../icons/Twitter";
import Youtube from "../icons/Youtube";
import Facebook from "../icons/Facebook";
import Instagram from "../icons/Instagram";

// styled components
const StyledFooter = styled("footer")(({ theme }) => ({
  [theme.breakpoints.down("md")]: { marginBottom: "4rem" },
}));

const StyledLink = styled("a")(({ theme }) => ({
  borderRadius: 4,
  display: "block",
  cursor: "pointer",
  position: "relative",
  padding: "0.3rem 0rem",
  color: theme.palette.grey[500],
  "&:hover": { color: theme.palette.grey[100] },
}));

const Footer2: FC = () => {
  return (
    <StyledFooter>
      <Box
        sx={{
          p: "40px",
          bgcolor: "#141850",
          color: "white",
          borderRadius: "8px",
        }}
      >
        <Link href="/" legacyBehavior>
          <a>
            <BazaarImage mb={2.5} src="/assets/images/logo.svg" alt="logo" />
          </a>
        </Link>

        <Grid container spacing={6}>
          <Grid item md={6} sm={6} xs={12}>
            <Paragraph mb={2.5} color="grey.500" maxWidth="370px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
              libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat
              et lectus vel ut sollicitudin elit at amet.
            </Paragraph>

            <AppStore />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Box mt={-0.6}>
              {customerCareLinks.map((item, ind) => (
                <Link href="/" key={ind} passHref>
                  <StyledLink>{item}</StyledLink>
                </Link>
              ))}
            </Box>

            <FlexBox className="flex" mx={-0.625} mt={2}>
              {iconList.map((item, ind) => (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopenner"
                  key={ind}
                >
                  <IconButton
                    sx={{
                      margin: 0.5,
                      fontSize: 12,
                      padding: "10px",
                      backgroundColor: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <item.icon fontSize="inherit" sx={{ color: "white" }} />
                  </IconButton>
                </a>
              ))}
            </FlexBox>
          </Grid>
        </Grid>
      </Box>
    </StyledFooter>
  );
};

const customerCareLinks = [
  "Help Center",
  "Track Your Order",
  "Corporate & Bulk Purchasing",
  "Returns & Refunds",
];

const iconList = [
  { icon: Facebook, url: "https://www.facebook.com/UILibOfficial" },
  { icon: Twitter, url: "https://twitter.com/uilibofficial" },
  {
    icon: Youtube,
    url: "https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg",
  },
  { icon: Google, url: "https://www.google.com/search?q=ui-lib.com" },
  { icon: Instagram, url: "https://www.instagram.com/uilibofficial/" },
];

export default Footer2;
