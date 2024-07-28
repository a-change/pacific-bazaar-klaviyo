import { Box, Grid, styled } from "@mui/material";
import { H4, Span } from "../Typography";
import { FlexBox } from "../flex-box";
import appIcons from "../icons";
import Service from "../../models/Service.model";
import { FC } from "react";

// styled component
const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  flexWrap: "wrap",
  padding: "1.5rem",
  borderRadius: "8px",
  border: `1px solid ${theme.palette.grey[400]}`,
  [theme.breakpoints.between("sm", "md")]: {
    textAlign: "center",
    padding: "1rem 0.5rem",
    flexDirection: "column",
  },
}));

// ==========================================================
type Props = { service: Service };
// ==========================================================

const ServiceCard: FC<Props> = ({ service }) => {
  const { id, icon, title, description } = service;
  const Icon = appIcons[icon];

  return (
    <Grid item lg={3} md={6} sm={6} xs={12}>
      <StyledFlexBox alignItems="center" gap={2}>
        <FlexBox alignItems="center" color="grey.600" fontSize="50px">
          <Icon fontSize="50px" color="grey.600" />
        </FlexBox>

        <Box>
          <H4 color="grey.900" fontSize="1rem" fontWeight="700">
            {title}
          </H4>
          <Span color="grey.600">{description}</Span>
        </Box>
      </StyledFlexBox>
    </Grid>
  );
};

export default ServiceCard;
