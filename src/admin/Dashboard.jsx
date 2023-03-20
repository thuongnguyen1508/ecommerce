import React from "react";
import Helmet from "../components/Helmet/Helmet";
import { Col, Container, Row, Breadcrumb, Card } from "react-bootstrap";
import Divide from "../components/UI/Divide";
import numeral from "numeral";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import UseGetData from "../database/UseGetData";
import category from "../assets/data/category";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Dashboard() {
  const { data: productsData, loading } = UseGetData("products");
  const { data: usersData } = UseGetData("users");
  return (
    <Helmet title={"Thống kê"}>
      <section className="my-3">
        <Container fluid>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item active aria-current="page">
                  Thống kê
                </Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="my-5">
        <Container>
          <Row className="gap-4 gap-md-0">
            <Col xs="auto">
              <Card style={{ width: "18rem", backgroundColor: "#fff4e7  " }}>
                <Card.Body>
                  <Card.Title>Tổng doanh thu</Card.Title>
                  <Card.Text>
                    {numeral(150000000000).format("0,0[.]00")}đ
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="auto">
              <Card style={{ width: "18rem", backgroundColor: "#eeebff  " }}>
                <Card.Body>
                  <Card.Title>Tổng số hóa đơn</Card.Title>
                  <Card.Text>175</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="auto">
              <Card style={{ width: "18rem", backgroundColor: "#e0eff6  " }}>
                <Card.Body>
                  <Card.Title>Tổng số sản phẩm</Card.Title>
                  <Card.Text>{productsData?.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="auto">
              <Card style={{ width: "18rem", backgroundColor: "#caf3e5  " }}>
                <Card.Body>
                  <Card.Title>Tổng số người dùng</Card.Title>
                  <Card.Text>{usersData?.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Bar
                data={{
                  labels: category.map((item) =>
                    item.categoryName.toUpperCase()
                  ),
                  datasets: [
                    {
                      label: "Số lượng (đơn vị)",
                      backgroundColor: [
                        "#3e95cd",
                        "#8e5ea2",
                        "#3cba9f",
                        "#e8c3b9",
                        "#c45850",
                        "#c48850",
                      ],
                      data: category.map(
                        (item) =>
                          productsData.filter(
                            (i) => i.category === item.categoryName
                          ).length
                      ),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Biểu đồ số lượng loại hàng trong kho",
                    },
                  },
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Dashboard;
