import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../styles/product_card.css";
import { Link } from "react-router-dom";
import colors from "../../assets/data/colorCard";
import numeral from "numeral";
import StarRatings from "react-star-ratings";

import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

function ProductCard({ item, index, isModifyWidth = { isModify: false } }) {
  const price = numeral(item.price);
  const dispatch = useDispatch();
  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgThumb: item.imgThumb,
      })
    );
    toast.success("Thêm thành công");
  };
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card
        className="product-item"
        style={{ backgroundColor: colors[index % colors.length] }}
      >
        <div
          style={
            isModifyWidth.isModify == true
              ? { width: `${isModifyWidth.width}` }
              : {}
          }
          className="product-item__img text-center"
        >
          <a href={"/products/" + item.id}>
            <img
              className="img-fluid"
              src={item.imgThumb}
              alt={item.productName}
            />
          </a>
        </div>

        <Card.Body className="product-item__des">
          <a href={"/products/" + item.id}>
            <Card.Title className="product-item__des--title">
              {item.productName}
            </Card.Title>
          </a>
          <Card.Text className="product-item__des--cate fw-light">
            {item.category}
          </Card.Text>
          <span>
            <StarRatings
              rating={item.avgRating}
              starRatedColor="#ffd800"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="2px"
              svgIconViewBox="0 0 24 24"
              svgIconPath="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
            />
          </span>
          <div className="product-item__bottom d-flex justify-content-between mt-4">
            <Card.Text className="product-item__des--value">
              {price.format("0,0[.]00")}đ
            </Card.Text>
            <motion.span
              whileHover={{ scale: 1.1 }}
              onClick={addToCart}
              className="product-item__des--icon"
            >
              <i className="ri-add-line"></i>
            </motion.span>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
