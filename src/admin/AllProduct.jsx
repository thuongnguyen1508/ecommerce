import React from "react";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import Divide from "../components/UI/Divide";
import Enumerable from "linq";
import Helmet from "../components/Helmet/Helmet";
import numeral from "numeral";
import { firebaseFirestore } from "../database/InstanceFiresbase";
import { doc, deleteDoc } from "@firebase/firestore";
import UseGetData from "../database/UseGetData";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { Link } from "react-router-dom";
import categoryData from "../assets/data/category";
function AllProduct() {
  const { data: productsData, loading } = UseGetData("products");
  const [products, setProducts] = useState(productsData);
  const [sort, setSort] = useState({ key: null, value: null });
  const [filterPrice, setRangePrice] = useState({
    min: 0,
    max: Number.MAX_VALUE,
  });
  const [filterCategory, setCategory] = useState([]);
  const [filterName, setFilterName] = useState("");
  const handleFilterPrice = (e) => {
    const min = parseFloat(document.getElementById("floatingInputFrom").value);
    const max = parseFloat(document.getElementById("floatingInputTo").value);
    setRangePrice({
      min: isNaN(min) ? 0 : min * 1000000,
      max: isNaN(max) ? Number.MAX_VALUE : max * 1000000,
    });
  };
  const handleFilterName = (e) => {
    const typeFilter = e.target.value;
    setFilterName(typeFilter);
  };

  const clearFilter = (e) => {
    setSort({ key: null, value: null });
    setCategory([]);
    setRangePrice({ min: 0, max: Number.MAX_VALUE });
    setFilterName("");
  };
  const handleFilterCategory = (e) => {
    const typeFilter = e.target.dataset["filter"];
    if (e.target.checked) {
      setCategory([...filterCategory, typeFilter]);
    } else {
      setCategory(filterCategory.filter((item) => item !== typeFilter));
      console.log(filterCategory);
    }
  };
  const updateView = () => {
    var filter = Enumerable.from(productsData)
      .where((item) =>
        filterCategory === null || filterCategory.length <= 0
          ? true
          : filterCategory.includes(item.category)
      )
      .where(
        (item) => item.price >= filterPrice.min && item.price <= filterPrice.max
      )
      .where((item) =>
        item.productName.toLowerCase().includes(filterName.toLowerCase())
      );

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
  const deleteProduct = async (id) => {
    await deleteDoc(doc(firebaseFirestore, "products", id));
    toast.success("Đã xóa sản phẩm");
  };
  const categories = categoryData;
  const handleSort = (e) => {
    const typeFilter = e.target.dataset["filter"];
    const valueFilter = e.target.value;
    setSort({ key: typeFilter, value: valueFilter });
  };
  return (
    <Helmet title={"Quản lý sản phẩm"}>
      <section className="my-3">
        <Container fluid>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item active aria-current="page">
                  Quản lý sản phẩm
                </Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="my-5">
        <Container fluid>
          <Row>
            <Col className="d-flex justify-content-end align-items-center gap-5">
              <h5>Tổng: {products.length}</h5>

              <Link reloadDocument to="/dashboard/add-products">
                <button className="btn btn-primary opacity-100">
                  Thêm sản phẩm
                </button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col xl="9">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Loại sản phẩm</th>
                    <th className=" text-end">Giá sản phẩm</th>
                    <th className=" text-center">Hình ảnh</th>
                    <th className=" text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <h3>Loading....</h3>
                  ) : (
                    products.map((item, index) => (
                      <tr key={index} class="align-middle">
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td className="text-capitalize">{item.category}</td>
                        <td className="text-end ">
                          {numeral(item.price).format("0,0[.]00")}đ
                        </td>
                        <td className=" text-center">
                          <img
                            src={item.imgThumb}
                            alt=""
                            className=""
                            height={"100px"}
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteProduct(item.id);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
            <Col className="order-first order-xl-last">
              <Form.Group className="my-3" controlId="formBasicEmail">
                <h5>Tìm kiếm</h5>
                <Form.Control
                  placeholder=""
                  onChange={(e) => handleFilterName(e)}
                  value={filterName}
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-block">Bộ lọc tìm kiếm</h5>
                <button
                  className="btn btn-primary btn-sm py-2 px-4 opacity-100"
                  onClick={clearFilter}
                >
                  Xóa lọc
                </button>
              </div>

              <Form.Group className="my-3" controlId="formBasicEmail">
                <h6 className="text-black fw-bold">Loại sản phẩm</h6>
                {categories.map((item, index) => (
                  <Form.Check
                    key={index}
                    className="text-capitalize text-black"
                    type="checkbox"
                    label={item.categoryName}
                    data-filter={item.categoryName}
                    onChange={(e) => handleFilterCategory(e)}
                    checked={filterCategory.includes(item.categoryName)}
                  />
                ))}
              </Form.Group>

              <div className="d-flex align-items-center gap-3">
                <p className="mb-0 d-block">Lọc theo:</p>
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
                  <option value="price-ascending">Giá từ thấp lên cao</option>
                  <option value="price-descending">
                    Giá từ cao xuống thấp
                  </option>
                </select>
              </div>

              <div>
                <h6 className="text-black fw-bold my-3">
                  Khoảng giá (đơn vị: triệu VNĐ)
                </h6>
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
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default AllProduct;
