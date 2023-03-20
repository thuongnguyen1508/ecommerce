import React from "react";
import "../../styles/category_card.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CategoryCard({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="shadow-lg text-center position-relative category-card"
    >
      <div
        className="category-card__bg"
        style={{ backgroundImage: `url(${item.imgUrl})` }}
      ></div>
      <div className="category-card__overlay"></div>
      <h1 className="category-card__text text-white display-4 text-uppercase">
        {item.categoryName}
      </h1>
    </motion.div>
  );
}

export default CategoryCard;
