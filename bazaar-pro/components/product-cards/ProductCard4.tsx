import { FC } from "react";
import { Box } from "@mui/material";
import HoverBox from "../HoverBox";
import LazyImage from "../LazyImage";
import { H4, Small } from "../Typography";
import BazaarRating from "../BazaarRating";
import { FlexRowCenter } from "../flex-box";
import { currency } from "../../lib";

// ======================================================
interface ProductCardProps {
  price: number;
  title: string;
  imgUrl: string;
  rating: number;
  reviewCount?: number;
}
// ======================================================

const ProductCard4: FC<ProductCardProps> = ({
  title,
  price,
  imgUrl,
  rating = 5,
  reviewCount = 0,
}) => {
  return (
    <Box>
      <HoverBox mb={2} mx="auto" borderRadius="8px">
        <LazyImage
          src={imgUrl}
          width={0}
          height={0}
          layout="responsive"
          alt={title}
          mx="auto"
        />
      </HoverBox>

      <FlexRowCenter mb={0.5}>
        <BazaarRating value={rating} color="warn" readOnly />
        <Small fontWeight={600} pl={0.5}>
          ({reviewCount})
        </Small>
      </FlexRowCenter>

      <H4 fontSize={14} textAlign="center" mb={0.5} title={title} ellipsis>
        {title}
      </H4>

      <H4 fontSize={14} textAlign="center" color="primary.main">
        {currency(price)}
      </H4>
    </Box>
  );
};

export default ProductCard4;
