import React from "react";
import { Container, Row, Navbar, Nav, Offcanvas, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/Logo.png";
import "./header.css";
import { hasLogin } from "../../database/Auth/Auth";

const nav_links = [
  {
    path: "home",
    display: "Trang chủ",
  },
  {
    path: "about",
    display: "Giới thiệu",
  },
  {
    path: "products",
    display: "Sản phẩm",
  },
  {
    path: "contact",
    display: "Liên hệ",
  },
  // {
  //   path: "project",
  //   display: "Dự án",
  // },
];

function Header() {
  const totalQuanlity = useSelector((state) => state.cart.totalQuanlity);
  return (
    <header className="header sticky-top">
      <Container>
        <Container>
          <div className="header__bg"></div>
        </Container>
        <Row>
          <Col>
            <Navbar key="lg" expand="lg" className="my-2">
              <Navbar.Brand href="#">
                <div className="logo">
                  <Nav.Link href="/home">
                    <img src={logo} className="img-fluid" alt="logo" />
                  </Nav.Link>
                </div>
              </Navbar.Brand>
              <Navbar.Toggle
                className="nav-toggler"
                aria-controls={`offcanvasNavbar-expand-lg`}
              />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-md`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                    Menu
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-center flex-grow-1 pe-3 nav gap-lg-3 gap-xl-5">
                    {nav_links.map((item, index) => (
                      <NavLink
                        reloadDocument
                        key={index}
                        className={`nav-link ${(navClass) =>
                          navClass.isActive ? "active" : ""}`}
                        to={item.path}
                      >
                        {item.display}
                      </NavLink>
                    ))}
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
              <div className="nav-icons">
                <span>
                  <i className="ri-search-line icon cursor-pointer"></i>
                </span>
                <span className="position-relative">
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                    {totalQuanlity}
                    <span className="visually-hidden">cart</span>
                  </span>
                  <NavLink to="/cart" activeclassname="active">
                    <i className="ri-shopping-cart-2-fill icon cursor-pointer"></i>
                  </NavLink>
                </span>
                {hasLogin() ? (
                  <>
                    <div className="dropdown">
                      <i
                        className="ri-user-fill icon cursor-pointer dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></i>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <NavLink
                            to="/account"
                            activeclassname="active"
                            className="dropdown-item"
                          >
                            Tài khoản
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/dashboard"
                            activeclassname="active"
                            className="dropdown-item"
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/account?logout=true"
                            activeclassname="active"
                            className="dropdown-item"
                          >
                            Đăng xuất
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <NavLink to="/account" activeclassname="active">
                    <i className="ri-user-fill icon cursor-pointer"></i>
                  </NavLink>
                )}
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Header;
