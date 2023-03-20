import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./footer.css";
import logo from "../../assets/images/Logo.png";

const footer_links = [
  {
    title: "My Account",
    links: [
      {
        path: "",
        display: "Sign in",
      },
      {
        path: "",
        display: "Register",
      },
      {
        path: "",
        display: "Order Status",
      },
    ],
  },
  {
    title: "Help",
    links: [
      {
        path: "",
        display: "Shipping",
      },
      {
        path: "",
        display: "Returns",
      },
      {
        path: "",
        display: "Sizing",
      },
    ],
  },
  {
    title: "Shop",
    links: [
      {
        path: "",
        display: "All Products",
      },
      {
        path: "",
        display: "Bedroom",
      },
      {
        path: "",
        display: "Dinning Room",
      },
    ],
  },
  {
    title: "Legal Stuff",
    links: [
      {
        path: "",
        display: "Shipping & Delivery",
      },
      {
        path: "",
        display: "Terms & Conditions",
      },
      {
        path: "",
        display: "Privacy & Policy",
      },
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <Container className="pt-5 pb-3">
        <Row>
          <Col sm="12" lg="4">
            <div className="logo bg-white d-inline border rounded-2 p-2">
              <Link to="home">
                <img src={logo} alt="logo" />
              </Link>
            </div>
            <ul className="d-flex justify-content-start gap-4 my-2">
              <li>
                <Link to="">
                  <span>
                    <i className="ri-facebook-box-fill icon"></i>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="">
                  <span>
                    <i className="ri-twitter-fill icon"></i>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="">
                  <span>
                    <i className="ri-snapchat-fill icon"></i>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="">
                  <span>
                    <i className="ri-github-fill icon"></i>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="">
                  <span>
                    <i className="ri-government-fill icon"></i>
                  </span>
                </Link>
              </li>
            </ul>
            <div>
              <h6 className="pb-3 fw-bold">Address</h6>
              <ul>
                <li>
                  <p className="">+123 654 987</p>
                </li>
                <li>
                  <p className="">877 The Bronx, NY</p>
                </li>
                <li>
                  <p className="">14568, USA</p>
                </li>
              </ul>
            </div>
          </Col>
          {footer_links.map((item0, index0) => (
            <Col key={index0} xs="12" sm="6" lg={true}>
              <h5 className="pb-3 fw-bold">{item0.title}</h5>
              <ul>
                {item0.links.map((item1, index1) => (
                  <li key={index1}>
                    <Link to={item1.path}>
                      <p>{item1.display}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
        <Row className="py-4">
          <Col>
            <p className="">Copyright &#169;2022 INWOOD. ALL Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
