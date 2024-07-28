import { FC } from "react";
import { Pagination } from "@mui/material";
import { FlexBetween } from "../flex-box";
import ProductCard9 from "../product-cards/ProductCard9";
import { Span } from "../Typography";
import Product from "../../models/Product.model";

// ==========================================================
type ProductCard9ListProps = { products: Product[] };
// ==========================================================

const ProductCard9List: FC<ProductCard9ListProps> = ({ products }) => {
  return (
    <div>
      {products.map((item) => (
        <ProductCard9
          id={item.id}
          key={item.id}
          slug={item.slug}
          title={item.title}
          price={item.price}
          off={item.discount}
          rating={item.rating}
          imgUrl={item.thumbnail}
        />
      ))}

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">Showing 1-9 of 1.3k Products</Span>
        <Pagination count={10} variant="outlined" color="primary" />
      </FlexBetween>
    </div>
  );
};

export default ProductCard9List;
