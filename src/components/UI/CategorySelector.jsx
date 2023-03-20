import React from "react";
import { Link } from "react-router-dom";
import "../../styles/category_selector.css";

function CategorySelector({ item }) {
  return (
    <Link>
      <p className="text-uppercase category-selector p-4">
        {item.categoryName}
      </p>
    </Link>
  );
}

export default CategorySelector;
