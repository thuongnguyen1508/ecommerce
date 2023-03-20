import React from "react";
import { Col } from "react-bootstrap";

import ProductCard from "./ProductCard";

function ProductList({ data }) {
  return (
    <>
      {data.map((item, index) => (
        <Col key={index} xs="12" sm="6" lg="4" xl="3">
          <ProductCard
            itemId={item.id}
            key={item.id}
            item={item}
            index={index}
          />
        </Col>
      ))}
    </>
  );
}

export default ProductList;
