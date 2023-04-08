/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import { hasLogin } from "../database/Auth/Auth";
import { useSelector } from "react-redux";
import numeral from "numeral";
import Divide from "../components/UI/Divide";
import { user } from "../database/Auth/Auth"
import "../assets/data/local.js"
import Province from "../assets/data/province.js";
import { toast } from "react-toastify";
import { cartActions } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { CreateBill } from "../database/AddBill";
import { Timestamp } from "firebase/firestore";
import { Breadcrumb } from "react-bootstrap";
import { CreateShipping } from "../database/AddShipping";
import { DeliveryService } from "../Helper/DeliveryService";

function Checkout() {
  if (!hasLogin())
    window.location.href = "/account?redirect=/checkout"
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const totalQuanlity = useSelector((state) => state.cart.totalQuanlity);
  const cartItems = useSelector((state) => state.cart.cartItems)
  const deliveryService = new DeliveryService(`${process.env.REACT_APP_GHN_API}`, `${process.env.REACT_APP_GHN_TOKEN}`)

  const dispatch = useDispatch();
  const [province, setProvince] = useState({ProvinceID: null, ProvinceName: null});
  const [district, setDistrict] = useState({DistrictID: null, DistrictName: null});
  const [ward, setWard] = useState({WardCode: null, WardName: null});

  const loginInfo = user()
  const name = loginInfo.displayName
  const email = loginInfo.email
  const phoneNumber = loginInfo.phoneNumber

  const [discountCode, setDiscountCode] = useState('');
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [methodsList, setMethodsList] = useState([]); 
  const [shipping, setShipping] = useState({
    ServiceID: null,
    ShortName: null,
    TotalFee: null,
    EstimatedTime: null,
    Note: null,
    PaymentTypeID: null,
    Weight: 200,
    Length: 15,
    Width: 10,
    Height: 5,
    Number: totalQuanlity
  });

  // Get districts list from province
  useEffect(() => {
    if (province.ProvinceID) {
      deliveryService.getDistrict(province.ProvinceID)
        .then((res) => {
          setDistrictsList(res);
        });
    }
  }, [province.ProvinceID]);

  // Get wards list from district
  useEffect(() => {
    if (district.DistrictID) {
      deliveryService.getWard(district.DistrictID)
        .then((res) => {
          setWardsList(res);
        });
    }
  }, [district.DistrictID]);

  // Get delivery methods
  useEffect(() => {
    if (ward.WardCode) {
      const fromDistrictID = parseInt(process.env.REACT_APP_SHOP_DISTRICT_ID);
      const toDistrictID = parseInt(district.DistrictID);
      const shopID = parseInt(process.env.REACT_APP_SHOP_ID);

      deliveryService.getDeliveryMethod(shopID, fromDistrictID, toDistrictID)
        .then((res) => {
          setMethodsList(res);
          setShipping((old) => ({...old, TotalFee: 50000}));
        });
    }

  }, [district.DistrictID, ward.WardCode]);

  // Get calculate shipping fee
  useEffect(() => {
    if (shipping?.ServiceID) {
      const fromDistrictID = parseInt(process.env.REACT_APP_SHOP_DISTRICT_ID);
      const toDistrictID = parseInt(district.DistrictID);
      const toWardCode = ward.WardCode;
      const serviceID = shipping.ServiceID;

      const dimemtion = {
        height: 50,
        length: 20,
        weight: parseInt(200*totalQuanlity),
        width: 20
      }

      deliveryService.getEstimatedFee(fromDistrictID, toDistrictID, toWardCode, serviceID, totalQuanlity, dimemtion)
        .then((res) => {
          setShipping((old) => ({...old, TotalFee: res}));
        })
    }
  }, [district.DistrictID, shipping.ServiceID, totalQuanlity, ward.WardCode]);

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
        province: province.ProvinceName,
        district: district.DistrictName,
        ward: ward.WardName,
        address: e.target.querySelector('input[name="addressShipping"]').value,
      },
      paymentMethod: Array.from(e.target.querySelectorAll('input[name="methodPayment"]')).find(item => item.checked)?.id,
      note: e.target.querySelector('textarea').value,
      products: cartItems.map(item => item.id),
      totalPrice: totalPrice,
      methodShipping: shipping.ShortName,
      discountCode: discountCode,
      dateCreate: Timestamp.now()
    }

    const shippingService = {
      billID: null,
      products: cartItems.map(item => item.id),
      name: e.target.querySelector('input[name="nameCustomer"]').value,
      shippingService: shipping.ServiceID,
      shipping: shipping.ShortName,
      totalFee: shipping.TotalFee,
      FromDistrictID: parseInt(process.env.REACT_APP_SHOP_DISTRICT_ID),
      ToDistrictID: parseInt(district.DistrictID),
      ToWardCode: parseInt(ward.WardCode),
      address: `${bill.address.address}, ${bill.address.ward}, ${bill.address.district}, ${bill.address.province}`,
      Height: shipping.Height,
      Weight: shipping.Weight,
      Width: shipping.Weight,
      Number: totalQuanlity,
      expectedDeliveryTime: null,
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

    if (isValid) {
      timeoutSubmit = true
      shippingService.billID = await CreateBill(bill);
      deliveryService.createShippingOrder(
        2, bill.note, bill.name, bill.phone, bill.address.address,
        ward.WardName, district.DistrictName, province.ProvinceName, 
        { 
          weight: shipping.Weight, 
          height: shipping.Height, 
          length: shipping.Length, 
          width: shipping.Width 
        },
        cartItems.map((item) => ({ 
          name: item.productName, 
          price: parseInt(item.totalPrice),
          quantity: parseInt(item.quanlity)
        })),
        shipping.ServiceID
      ).then((res) => {
        shippingService.totalFee = res.total_fee;
        shippingService.expectedDeliveryTime = res.expected_delivery_time;
        CreateShipping(shippingService)
      });

      toast.success(`Đã đặt hàng thành công\nMã đơn hàng: ${RandomIdOrder(6)}`, { duration: 5000 });
      setTimeout(() => {
        dispatch(
          cartActions.resetCart({})
        );
        timeoutSubmit = false
        e.target.submit()
      }, 5000);
    }

    return false
  }

  const checkDiscountCode = async (e) => {
    const code = e.target.value

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
                      <select className="form-select form-select-md" onChange={e => {
                        const selectedProvince = Province.find(province => province.ProvinceID === parseInt(e.target.value));
                        setProvince((old) => ({...old, ProvinceID: selectedProvince.ProvinceID, ProvinceName: selectedProvince.ProvinceName}));
                        setDistrict((old) => ({...old,  DistrictID: null, DistrictName: null }));
                      }}>
                        <option defaultValue>Tỉnh/Thành phố</option>
                        {
                          Province.map(province => <option value={province.ProvinceID} key={province.ProvinceID}>{province.NameExtension[1]}</option>)
                        }
                      </select>
                    </div>
                    <div className="col-md-4 col-12">
                      <select className="form-select form-select-md" onChange={e => {
                        const selectedDistrict = districtsList.find(district => district.DistrictID === parseInt(e.target.value));
                        setDistrict((old) => ({...old, DistrictID: selectedDistrict.DistrictID, DistrictName: selectedDistrict.DistrictName }));
                      }}>
                        <option defaultValue>Quận/Huyện</option>
                        {
                          districtsList.map(district => <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>)
                        }
                      </select>
                    </div>
                    <div className="col-md-4 col-12">
                      <select name="wardShipping" className="form-select form-select-md" onChange={e => {
                        const selectedWard = wardsList.find(ward => parseInt(ward.WardCode) === parseInt(e.target.value));
                        setWard((old) => ({...old, WardCode: selectedWard.WardCode, WardName: selectedWard.WardName }));
                      }}>
                        <option defaultValue>Phường/Xã</option>
                        {
                          wardsList.map(ward => <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>)
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
                  <div className="d-flex justify-content-between my-2">
                    <p className="">Phí vận chuyển</p>
                    <p className="">{numeral(shipping.TotalFee).format("0,0[.]00")}đ</p>
                  </div>
                  <div className="py-3">
                    <p className="mb-3">Vận chuyển</p>
                    <div className="">
                      <select
                        className="form-select form-select-md"
                        onChange={e => {
                          const selectedMethod = methodsList.find(method => parseInt(method.service_id) === parseInt(e.target.value));
                          setShipping((old) => ( { ...old, ServiceID: selectedMethod.service_id, ShortName: selectedMethod.short_name }));
                        }}
                      >
                        {
                          methodsList.map(method => <option key={method.service_id} value={method.service_id}>{method.short_name}</option>)
                        }
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
                  <p className="">{numeral(totalPrice + shipping.TotalFee).format("0,0[.]00")}đ</p>
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