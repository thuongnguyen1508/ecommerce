import { React, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import { hasLogin } from "../database/Auth/Auth";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import numeral from "numeral";
import Divide from "../components/UI/Divide";
import { Breadcrumb } from "react-bootstrap";

function ProductCart({ item }) {
  const [quanlity, setQuantity] = useState("");
  const [editQuanlity, setEditQuantity] = useState(false);
  const handleEditQuanlity = () => {
    setEditQuantity(true);
  };
  const dispatch = useDispatch();

  const deleteProduct = () => {
    dispatch(cartActions.deleteItem(item.id));
  };

  const increQuanlity = () => {
    dispatch(cartActions.increItemQuanlity(item.id));
  };

  const decreQuanlity = () => {
    dispatch(cartActions.decreItemQuanlity(item.id));
  };
  const handleBlur = () => {
    setEditQuantity(false);
  };
  return (
    <Row className="d-flex align-items-center product-cart my-3 justify-content-between">
      <Col
        xs="10"
        md="6"
        className="product-cart__img d-flex align-items-center order-0"
      >
        <img src={item.imgThumb} alt="" className="img-fluid" />
        <div className="">
          <p className="text-black fw-bold ">{item.productName}</p>
        </div>
      </Col>
      <Col xs="6" md="auto" className="d-flex order-2">
        <span>
          <i
            onClick={decreQuanlity}
            className="ri-subtract-line rounded btn-quantity cursor-pointer"
          ></i>
        </span>
        <input
          type="text"
          className="rounded border border-1 p-2 fw-light fs-6"
          style={{ width: "2.5rem" }}
          value={item.quanlity}
          onClick={() => handleEditQuanlity()}
          onChange={(e) => setQuantity(e.target.value)}
          onFocus={() => setQuantity("")}
          onBlur={() => handleBlur}
        />
        <span>
          <i
            onClick={increQuanlity}
            className="ri-add-line rounded btn-quantity cursor-pointer"
          ></i>
        </span>
      </Col>
      <Col xs="6" md="auto" className="text-end pe-5 p-md-0 ps-xl-5 order-3">
        <p className="">{numeral(item.price).format("0,0[.]00")}đ</p>
      </Col>
      <Col xs="2" md="auto" className="order-1 order-md-last">
        <span>
          <i
            className="ri-close-line cursor-pointer"
            onClick={deleteProduct}
          ></i>
        </span>
      </Col>
    </Row>
  );
}

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const totalQuanlity = useSelector((state) => state.cart.totalQuanlity);

  const [methodShipping, setMethodShipping] = useState(1);

  const checkout = () => {
    if (hasLogin()) {
      window.location.href = "/checkout";
    } else {
      window.location.href = "/account?redirect=/checkout";
    }
  };

  return (
    <Helmet title="Giỏ hàng">
      <section className="my-4">
        <Container>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="cart">
        <Container>
          <Row className="">
            <Col className="col-lg-8 col-12 p-xl-5 py-5">
              <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="display-6">Giỏ hàng</h1>
              </div>
              <Divide />
              {cartItems.length === 0 ? (
                <h2 className="fs-4 my-3">Chưa có sản phẩm trong giỏ hàng</h2>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index}>
                    <ProductCart item={item} />
                    <Divide />
                  </div>
                ))
              )}
            </Col>
            <Col className="col-lg-4 col-12 cart-modal__summary fw-bold">
              <div className="mb-5">
                <h3>Thanh toán</h3>
              </div>
              <Divide />
              <div className="my-4">
                <div className="d-flex justify-content-between my-2">
                  <p className="">{totalQuanlity} sản phẩm</p>
                  <p className="">{numeral(totalPrice).format("0,0[.]00")}đ</p>
                </div>
                <div className="py-3">
                  <p className="mb-3">Vận chuyển</p>
                  <div className="">
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                      value={methodShipping}
                      onChange={(e) => setMethodShipping(e.target.value)}
                    >
                      <option selected>Phương thức vận chuyển</option>
                      <option value="1">Phương thức 1</option>
                      <option value="2">Phương thức 1</option>
                      <option value="3">Phương thức 1</option>
                    </select>
                  </div>
                </div>
                <div className="py-3">
                  <p className="mb-3">Mã ưu đãi</p>
                  <div className="">
                    <div className="input-group">
                      <p className="input-group-text" id="addon-wrapping">
                        GSM
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã  "
                        aria-label="Username"
                        aria-describedby="addon-wrapping"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>

              <Divide />
              <div className="d-flex justify-content-between my-3">
                <p className="">TỔNG THANH TOÁN</p>
                <p className="">{numeral(totalPrice).format("0,0[.]00")}đ</p>
              </div>

              <button
                className="col-12 btn btn-checkout text-uppercase fw-bold"
                onClick={checkout}
              >
                Đặt hàng
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Cart;
