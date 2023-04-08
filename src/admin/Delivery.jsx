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
import { Timestamp } from "firebase/firestore";
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

function Deliveries() {
    const { data: shippingData, loading } = UseGetData("shippings");
    const [shippings, setShipping] = useState(shippingData);
    const [sort, setSort] = useState({ key: null, value: null });
    const [filterPrice, setRangePrice] = useState({
        min: 0,
        max: Number.MAX_VALUE,
    });
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
        setRangePrice({ min: 0, max: Number.MAX_VALUE });
        setFilterName("");
    };

    const updateView = () => {
        var filter = Enumerable.from(shippingData)
            .where(
                (item) => item.totalFee >= filterPrice.min && item.totalFee <= filterPrice.max
            )
            .where((item) =>
                item.shipping.toLowerCase().includes(filterName.toLowerCase())
            );

        switch (sort.key) {
            case "title":
                if (sort.value === "title-ascending")
                    filter = filter.orderBy((item) => item.dateCreate);
                else if (sort.value === "title-descending")
                    filter = filter.orderByDescending((item) => item.dateCreate);
                break;
            case "price":
                if (sort.value === "price-ascending")
                    filter = filter.orderBy((item) => item.totalPrice);
                else if (sort.value === "price-descending")
                    filter = filter.orderByDescending((item) => item.totalPrice);
                break;
            default:
                break;
        }
        setShipping(filter.toArray());
    };
    useEffect(updateView);

    const handleSort = (e) => {
        const typeFilter = e.target.dataset["filter"];
        const valueFilter = e.target.value;
        setSort({ key: typeFilter, value: valueFilter });
    };

    return (
        <Helmet title={"Quản lý giao hàng"}>
            <section className="my-3">
                <Container fluid>
                    <Row>
                        <Col xs="auto">
                            <Breadcrumb>
                                <Breadcrumb.Item active aria-current="page">
                                    Quản lý giao hàng
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
                            <h5>Tổng: {shippings.length}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="9">
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên khách hàng</th>
                                        <th>Kiểu giao hàng</th>
                                        <th>Mã vận chuyển</th>
                                        <th>Nơi nhận hàng</th>
                                        <th className="text-end">Phí vận chuyển</th>
                                        <th>Ngày tạo</th>
                                        <th>Dự kiến nhận hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? (
                                            <h3>Loading....</h3>
                                        ) : (
                                            shippings.map((item, index) => (
                                                    <tr key={index} className="align-middle">
                                                        <td>{index + 1}</td>
                                                        <td>{`${item.name}`}</td>
                                                        <td>{`${item.shipping}`}</td>
                                                        <td>{`${item.shippingService}`}</td>
                                                        <td>{`${item.address ? item.address : 'Đông Hoà, Dĩ An, Bình Dương'}`}</td>
                                                        <td className="text-end ">
                                                            {numeral(item.totalFee).format("0,0[.]00")}đ
                                                        </td>
                                                        <td>{item.dateCreate  
                                                                ? item.dateCreate.toDate().toLocaleTimeString('en-US')
                                                                : '12:32:01 AM'
                                                            }</td>
                                                        <td>{`${item.estimatedTime ? item.estimatedTime : item.expectedDeliveryTime}`}</td>
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

                            <div className="d-flex align-items-center gap-3">
                                <p className="mb-0 d-block">Lọc theo:</p>
                                <select
                                    onChange={handleSort}
                                    className="form-control form-select"
                                    aria-label=".form-select"
                                    data-filter="title"
                                >
                                    <option selected>Ngày tạo</option>
                                    <option value="title-ascending">Tăng dần</option>
                                    <option value="title-descending">Giảm dần</option>
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
                                            className="form-control"
                                            id="floatingInputFrom"
                                            placeholder="₫ TỪ"
                                        />
                                    </div>
                                    <span> - </span>
                                    <div>
                                        <input
                                            type="number"
                                            className="form-control"
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

export default Deliveries;
