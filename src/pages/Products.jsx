import React from "react";
import { Col, Container, Row, Breadcrumb, Form } from "react-bootstrap";
import Helmet from "../components/Helmet/Helmet";
import Divide from "../components/UI/Divide";
import "../styles/products.css";
import categoryData from "../assets/data/category";
import StarRatings from "react-star-ratings";
import ProductList from "../components/UI/ProductList";
import { useState, useEffect } from "react";
import Enumerable from "linq";

import UseGetData from "../database/UseGetData";
function Products() {
  const { data: productsData, loading } = UseGetData("products");
  const [products, setProducts] = useState(productsData);
  const categories = categoryData;

  const [sort, setSort] = useState({ key: null, value: null });
  const [filterCategory, setCategory] = useState(null);
  const [filterPrice, setRangePrice] = useState({
    min: 0,
    max: Number.MAX_VALUE,
  });
  const [filterRating, setRating] = useState(0);

  const handleSort = (e) => {
    const typeFilter = e.currentTarget.dataset["filter"];
    const valueFilter = e.currentTarget.value;
    setSort({ key: typeFilter, value: valueFilter });
  };

  const handleFilterCategory = (e) => {
    const typeFilter = e.currentTarget.dataset["filter"];

    setCategory(typeFilter);
  };

  const handleFilterPrice = (e) => {
    const min = parseFloat(document.getElementById("floatingInputFrom").value);
    const max = parseFloat(document.getElementById("floatingInputTo").value);
    setRangePrice({
      min: isNaN(min) ? 0 : min * 1000000,
      max: isNaN(max) ? Number.MAX_VALUE : max * 1000000,
    });
  };

  const handleFilterRating = (e) => {
    const typeFilter = e.currentTarget.dataset["filter"];
    setRating(typeFilter);
  };

  const clearFilter = (e) => {
    setSort({ key: null, value: null });
    setCategory(null);
    setRangePrice({ min: 0, max: Number.MAX_VALUE });
    setRating(0);
  };

  const updateView = () => {
    var filter = Enumerable.from(productsData)
      .where((item) =>
        filterCategory === null ? true : item.category === filterCategory
      )
      .where(
        (item) => item.price >= filterPrice.min && item.price <= filterPrice.max
      )
      .where((item) => item.avgRating >= filterRating);
    switch (sort.key) {
      case "title":
        if (sort.value === "title-ascending")
          filter = filter.orderBy((item) => item.productName);
        else if (sort.value === "title-descending")
          filter = filter.orderByDescending((item) => item.productName);
        break;
      case "price":
        if (sort.value === "price-ascending")
          filter = filter.orderBy((item) => item.price);
        else if (sort.value === "price-descending")
          filter = filter.orderByDescending((item) => item.price);
        break;
      default:
        break;
    }
    setProducts(filter.toArray());
  };

  useEffect(updateView);

  return (
    <Helmet title={"Sản phẩm"}>
      <section className="my-3">
        <Container>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="/products">Product</Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="products__filter">
        <Container>
          <Row>
            <Col lg="3" className="">
              <div className="filter-card filter-card--category mb-3">
                <h5 className="filter-title">Lọc theo loại sản phẩm</h5>
                <div>
                  <ul>
                    {categories.map((item, index) => (
                      <li
                        key={index}
                        className={`text-capitalize ${
                          filterCategory === item.categoryName
                            ? "text-black"
                            : ""
                        }`}
                        onClick={handleFilterCategory}
                        data-filter={item.categoryName}
                      >
                        {item.categoryName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="filter-card filter-card--general mb-3">
                <h5 className="filter-title">Bộ lọc</h5>
                <div>
                  <h6 className="sub-title">Khoảng giá (đơn vị: triệu VNĐ)</h6>
                  <div className="d-flex align-items-center gap-2">
                    <div className="">
                      <input
                        type="number"
                        class="form-control"
                        id="floatingInputFrom"
                        placeholder="₫ TỪ"
                      />
                    </div>
                    <span> - </span>
                    <div>
                      <input
                        type="number"
                        class="form-control"
                        id="floatingInputTo"
                        placeholder="₫ ĐẾN"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary opacity-100 py-2 px-4 w-100 my-4"
                      onClick={handleFilterPrice}
                    >
                      <p>Áp dụng</p>
                    </button>
                  </div>
                </div>
                <div>
                  <h6 className="sub-title">Đánh giá chung</h6>
                  <div className="">
                    <ul>
                      {Array.from({ length: 5 }, (_, i) => i + 1).map(
                        (item, index) => (
                          <li
                            key={index}
                            className="d-flex gap-1 align-items-center"
                            onClick={handleFilterRating}
                            data-filter={item}
                          >
                            <span>
                              <StarRatings
                                rating={item}
                                starRatedColor="#ffa41c"
                                numberOfStars={5}
                                name="rating"
                                starDimension="24px"
                                starSpacing="2px"
                                svgIconViewBox="0 0 24 24"
                                svgIconPath="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
                              />
                            </span>
                            <p className="text-black">&#x2191;</p>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="filter-sort-grid">
                <div className="d-flex align-items-center">
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <h6 className="mb-0 d-block">Lọc theo:</h6>
                    <select
                      onChange={handleSort}
                      className="form-control form-select"
                      aria-label=".form-select"
                      data-filter="title"
                    >
                      <option selected>Bảng chữ cái</option>
                      <option value="title-ascending">A-Z</option>
                      <option value="title-descending">Z-A</option>
                    </select>
                    <select
                      className="form-control form-select"
                      aria-label=".form-select"
                      onChange={handleSort}
                      data-filter="price"
                    >
                      <option selected>Giá tiền</option>
                      <option value="price-ascending">
                        Giá từ thấp lên cao
                      </option>
                      <option value="price-descending">
                        Giá từ cao xuống thấp
                      </option>
                    </select>

                    <button
                      className="btn btn-primary btn-sm py-2 px-4 opacity-100"
                      onClick={clearFilter}
                    >
                      Xóa lọc
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <Row className="my-2 g-3">
                  {loading ? (
                    <h5>Loading....</h5>
                  ) : (
                    <ProductList data={products} />
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Products;
