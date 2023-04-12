import { React, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import { hasLogin } from "../database/Auth/Auth";
import { useSelector } from "react-redux";
import numeral from "numeral";
import Divide from "../components/UI/Divide";
import { user } from "../database/Auth/Auth"
import "../assets/data/local.js"
import Country from "../assets/data/local.js";
import { toast } from "react-toastify";
import { cartActions } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { CreateBill } from "../database/AddBill";
import { Timestamp } from "firebase/firestore";
import { Breadcrumb } from "react-bootstrap";
import PaypalCheckoutButtons from "../components/Paypal/paypalbutton";

function Checkout() {
  if (!hasLogin())
    window.location.href = "/account?redirect=/checkout"
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const totalQuanlity = useSelector((state) => state.cart.totalQuanlity);
  const cartItems = useSelector((state) => state.cart.cartItems)
  const dispatch = useDispatch();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();

  const loginInfo = user()
  const name = loginInfo.displayName
  const email = loginInfo.email
  const phoneNumber = loginInfo.phoneNumber

  const [methodShipping, setMethodShipping] = useState(1);
  const [discountCode, setDiscountCode] = useState('');

  const [paymentStatus, setPaymentStatus] = useState('');

  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    setPaymentStatus('Thành công');
    toast.success("Đã thanh toán bằng Paypal thành công");
  };

  const onError = (err) => {
    setPaymentStatus('Lỗi thanh toán');
  };

  const onCancel = (data) => {
    setPaymentStatus('Đã hủy');
  };
  


  const RandomIdOrder = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  var timeoutSubmit = false

  const onSubmit = async (e) => {
    e.preventDefault()
    if (timeoutSubmit)
      return false
    const bill = {
      name: e.target.querySelector('input[name="nameCustomer"]').value,
      email: e.target.querySelector('input[name="emailCustomer"]').value,
      phone: e.target.querySelector('input[name="phoneCustomer"]').value,
      address: {
        province: province,
        district: district,
        ward: e.target.querySelector('select[name="wardShipping"]').value,
        address: e.target.querySelector('input[name="addressShipping"]').value,
      },
      paymentMethod: Array.from(e.target.querySelectorAll('input[name="methodPayment"]')).find(item => item.checked)?.id,
      note: e.target.querySelector('textarea').value,
      products: cartItems.map(item => item.id),
      totalPrice: totalPrice,
      methodShipping: methodShipping,
      discountCode: discountCode,
      dateCreate: Timestamp.now()
    }

    //check validation bill
    var isValid = true
    if (bill.phone.length !== 10 || isNaN(parseInt(bill.phone)) || bill.phone[0] !== "0") {
      toast.error("Số điện thoại không hợp lệ")
      isValid = false
    }
    if (bill.address.province === undefined || bill.address.district === undefined || bill.address.ward === "Phường/Xã" || bill.address.address === undefined) {
      toast.warning("Vui lòng điền địa chỉ nhận hàng")
      isValid = false
    }
    if (bill.paymentMethod === undefined) {
      toast.warning("Vui lòng chọn phương thức thanh toán")
      isValid = false
    }
    if(bill.paymentMethod === "paypalMethod" && paymentStatus !== "Thành công") {
      toast.warning("Vui lòng thanh toán bằng Paypal trước")
      isValid = false
    }

    // var resultSubmitBill = false

    // if(await resultSubmitBill(bill)){
    //   e.target.submit()
    // }
    // else {
    //   toast...
    // }

    if (isValid) {
      timeoutSubmit = true
      await CreateBill(bill)
      toast.success(`Đã đặt hàng thành công\nMã đơn hàng: ${RandomIdOrder(6)}`, { duration: 5000 })
      setTimeout(() => {
        dispatch(
          cartActions.resetCart({})
        );
        timeoutSubmit = false
        e.target.submit()
      }, 5000)
    }

    return false
  }

  const checkDiscountCode = async (e) => {
    const code = e.target.value

    // if (await checkDiscountCode(code)) {
    //   setDiscountCode(code)
    // }
    // else {
    //   toast...
    // }

    setDiscountCode(code)
  }

  return (
    <Helmet title="Thanh toán">
      <section className="my-4">
        <Container>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
                <Breadcrumb.Item href="/checkout">Checkout</Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="cart">
        <form action="/" onSubmit={onSubmit}>
          <Container>
            <Row className="">
              <Col className="col-lg-8 col-12 p-xl-5 py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <h1 className="display-6">Thông tin đơn hàng</h1>
                </div>
                <label for="infoCustomerField" className="form-label"><div className="d-flex"><span className="me-1"><i className="ri-profile-line"></i></span><p>Thông tin khách hàng</p></div></label>
                <div id="infoCustomerField">
                  <input type="text" className="form-control" name="nameCustomer" required placeholder="Họ và tên" defaultValue={name ?? ''}></input>
                  <div className="d-flex">
                    <input type="email" className="form-control my-2 me-2" name="emailCustomer" placeholder="Địa chỉ email" defaultValue={email ?? ''}></input>
                    <input type="tel" className="form-control phone my-2" name="phoneCustomer" required placeholder="Số điện thoại" defaultValue={phoneNumber ?? ''} onInvalid={e => e.target.setCustomValidity('Số điện thoại Việt Nam có 10 số!')} onInput={e => e.target.setCustomValidity('')}></input>
                  </div>
                </div>
                <label for="addressField" className="form-label mt-2"><div className="d-flex"><span className="me-1"><i className="ri-truck-fill"></i></span><p>Địa chỉ nhận hàng</p></div></label>
                <div id="addressField" className="container">
                  <div className="row">
                    <div className="col-md-4 col-12">
                      <select className="form-select form-select-md" onChange={e => setProvince(e.target.value)}>
                        <option selected>Tỉnh/Thành phố</option>
                        {
                          Country.map(province => <option value={province.name}>{province.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="col-md-4 col-12">
                      <select className="form-select form-select-md" onChange={e => setDistrict(e.target.value)}>
                        <option selected>Quận/Huyện</option>
                        {
                          Country.find(item => item.name === province)?.districts.map(district => <option value={district.name}>{district.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="col-md-4 col-12">
                      <select name="wardShipping" className="form-select form-select-md">
                        <option selected>Phường/Xã</option>
                        {
                          Country.find(item => item.name === province)?.districts.find(item => item.name === district)?.wards.map(ward => <option value={ward.name}>{ward.name}</option>)
                        }
                      </select>
                    </div>
                  </div>
                  <input type="text" className="form-control my-2" required name="addressShipping" placeholder="Địa chỉ nhà"></input>
                </div>
                <label for="paymentField" className="form-label mt-2"><div className="d-flex"><span className="me-1"><i className="ri-bank-card-fill"></i></span><p>Phương thức thanh toán</p></div></label>
                <div id="paymentField" className="container">
                  <div className="form-check my-1">
                    <input className="form-check-input" type="radio" name="methodPayment" id="momoMethod" data-bs-toggle="collapse" href="#collapseMoMoMethod" role="button" aria-expanded="false" aria-controls="collapseMoMoMethod"></input>
                    <label className="form-check-label" for="momoMethod">
                      Thanh toán bằng MoMo
                    </label>
                  </div>
                  <div className="collapse my-1 ms-5" id="collapseMoMoMethod" data-bs-parent="#paymentField">
                    Thanh toán qua ví MoMo, sử dụng ....
                  </div>

                  <div className="form-check my-1">
                    <input className="form-check-input" type="radio" name="methodPayment" id="bankTransferMethod" data-bs-toggle="collapse" href="#collapseBankTransferMethod" role="button" aria-expanded="false" aria-controls="collapseBankTransferMethod"></input>
                    <label className="form-check-label" for="bankTransferMethod">
                      Thanh toán bằng chuyển khoản ngân hàng
                    </label>
                  </div>
                  <div className="collapse my-1 ms-5" id="collapseBankTransferMethod" data-bs-parent="#paymentField">
                    <ul className="list-group">
                      <li className="list-group-item">Vietcombank: 4632875623875682</li>
                      <li className="list-group-item">Vietinbank: 43263262235355</li>
                      <li className="list-group-item">VISA: 384716248732653287</li>
                    </ul>
                  </div>

                  <div className="form-check my-1">
                    <input className="form-check-input" type="radio" name="methodPayment" id="codMethod" data-bs-toggle="collapse" href="#collapseCODMethod" role="button" aria-expanded="false" aria-controls="collapseCODMethod"></input>
                    <label className="form-check-label" for="codMethod">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div className="collapse my-1 ms-5" id="collapseCODMethod" data-bs-parent="#paymentField">
                    Khi nhận hàng thì thanh toán cho bên vận chuyển ...
                  </div>

                  <div className="form-check my-1">
                    <input className="form-check-input" type="radio" name="methodPayment" id="installmentMethod" data-bs-toggle="collapse" href="#collapseInstallmentMethod" role="button" aria-expanded="false" aria-controls="collapseInstallmentMethod"></input>
                    <label className="form-check-label" for="installmentMethod">
                      Thanh toán bằng phương thức trả góp
                    </label>
                  </div>
                  <div className="collapse my-1 ms-5" id="collapseInstallmentMethod" data-bs-parent="#paymentField">
                    Liên hệ với FE Credit, FB00 Nhà cái đến từ địa phủ
                  </div>

                  <div className="form-check my-1">
                    <input className="form-check-input" type="radio" name="methodPayment" id="paypalMethod" data-bs-toggle="collapse" href="#collapsePaypalMethod" role="button" aria-expanded="false" aria-controls="collapsePaypalMethod"></input>
                    <label className="form-check-label" for="paypalMethod">
                      Thanh toán bằng Paypal
                    </label>
                  </div>
                  <div className="collapse my-1 ms-5" id="collapsePaypalMethod" data-bs-parent="#paymentField">
                    <PaypalCheckoutButtons
                      amount={totalPrice / 23000}
                      currency="USD"
                      onApprove={onApprove}
                      onError={onError}
                      onCancel={onCancel}
                    />
                      {paymentStatus && (
                      <p>Trạng thái thanh toán: {paymentStatus}</p>
                      )}
                  </div>

                </div>
                <textarea className="form-control mt-2" rows="3" placeholder="Ghi chú"></textarea>
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
                          placeholder="Nhập mã"
                          aria-describedby="addon-wrapping"
                          value={discountCode}
                          onChange={checkDiscountCode}
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
                  type="submit"
                  className="col-12 btn btn-checkout text-uppercase fw-bold"
                >
                  Đặt hàng
                </button>
              </Col>
            </Row>
          </Container>
        </form>
      </section>
    </Helmet>
  );
}

export default Checkout