import { FC } from "react";
import { Box, Container, styled } from "@mui/material";
import { H5 } from "../Typography";
import appIcons from "../icons";
import Scrollbar from "../Scrollbar";
import { FlexRowCenter } from "../flex-box";
import Category from "../../models/Category.model";

// styled compoentents
const StyledScrollbar = styled(Scrollbar)({
  "& .simplebar-content": {
    height: "5rem",
    display: "flex",
    backgroundColor: "white",
    justifyContent: "center",
  },
});

const Title = styled(H5)<{ selected: number }>(({ selected, theme }) => ({
  fontSize: "12px",
  textAlign: "center",
  fontWeight: selected ? "600" : "400",
  color: selected ? theme.palette.primary.main : "inherit",
}));

// ==========================================================================
type SaleNavbarProps = {
  selected: string;
  categories: Category[];
  onChangeCategory: (value: string) => () => void;
};
// ==========================================================================

const SaleNavbar: FC<SaleNavbarProps> = ({
  categories,
  selected,
  onChangeCategory,
}) => {
  return (
    <Box bgcolor="background.paper">
      <Container>
        <StyledScrollbar autoHide={false}>
          {categories.map((item) => {
            const Icon = appIcons[item.icon];
            const selectedItem = item.slug === selected ? 1 : 0;

            return (
              <FlexRowCenter
                key={item.id}
                onClick={onChangeCategory(item.slug)}
                sx={{
                  cursor: "pointer",
                  minWidth: "100px",
                  flexDirection: "column",
                  background: selectedItem ? "primary.light" : "transparent",
                }}
              >
                <Icon
                  sx={{ fontSize: "1.75rem" }}
                  color={selectedItem ? "primary" : "secondary"}
                />
                <Title selected={selectedItem}>{item.name}</Title>
              </FlexRowCenter>
            );
          })}
        </StyledScrollbar>
      </Container>
    </Box>
  );
};

export default SaleNavbar;
