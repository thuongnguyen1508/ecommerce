import React from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
  menuClasses,
} from "react-pro-sidebar";
import { Col, Nav, Navbar, Row } from "react-bootstrap";
import logo from "../assets/images/Logo.png";
import { Routes, Route, Navigate } from "react-router-dom";
import { Switch } from "../components/UI/Switch";
import { NavLink } from "react-router-dom";
import AddProduct from "../admin/AddProduct";
import AllProduct from "../admin/AllProduct";
import ProtetedRoute from "../routers/ProtetedRoute";
import Dashboard from "../admin/Dashboard";
import Users from "./Users";
import Bill from "./Bill";
import Deliveries from "./Delivery";

const admin_nav_links = [
  {
    path: "dashboard",
    display: "Thống kê",
  },
  {
    path: "dashboard/all-products",
    display: "Quản lý sản phẩm",
  },
  {
    path: "dashboard/bills",
    display: "Quản lý đơn hàng",
  },
  {
    path: "dashboard/shippings",
    display: "Quản lý giao hàng",
  },
  {
    path: "dashboard/users",
    display: "Quản lý tài khoản",
  },
];

const Theme = "light" | "dark";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function AdminNav({ route }) {
  const { toggleSidebar, collapseSidebar, broken, collapsed } = useProSidebar();
  const [isRTL, setIsRTL] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  const handleRTLChange = (e) => {
    setIsRTL(e.target.checked);
  };
  const handleThemeChange = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const handleImageChange = (e) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles = {
    root: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1
            )
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };
  return (
    <div
      style={{
        height: "100%",
        direction: isRTL ? "rtl" : "ltr",
      }}
      className="d-lg-flex"
    >
      <Sidebar
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={isRTL}
        breakPoint="lg"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div className="d-flex-column">
          <div className="logo my-4 px-3">
            <Nav.Link href="home">
              <img src={logo} className="img-fluid" alt="logo" />
            </Nav.Link>
          </div>
          <div className="px-3">
            <h5>Quản lý chung</h5>
          </div>
          <Menu menuItemStyles={menuItemStyles} className="my-4">
            <SubMenu
              label="E-commerce"
              icon={
                <span>
                  <i className="ri-shopping-cart-2-line icon cursor-pointer"></i>
                </span>
              }
              defaultOpen={true}
            >
              {admin_nav_links.map((item, index) => (
                <MenuItem
                  key={index}
                  component={
                    <NavLink
                      className={(navClass) =>
                        navClass.isActive ? "nav-link active" : "nav-link "
                      }
                      to={item.path}
                    />
                  }
                >
                  {item.display}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
          <div className="px-3">
            <h5>Cài đặt hiển thị</h5>
          </div>
          <div className="my-4 px-3">
            <div className="my-2">
              <Switch
                id="rtl"
                checked={isRTL}
                onChange={handleRTLChange}
                label="RTL"
              />
            </div>
            <div className="my-2">
              <Switch
                id="theme"
                checked={theme === "dark"}
                onChange={handleThemeChange}
                label="Dark theme"
              />
            </div>
            <div className="my-2">
              <Switch
                id="image"
                checked={hasImage}
                onChange={handleImageChange}
                label="Image"
              />
            </div>
          </div>
        </div>
      </Sidebar>

      <div className="flex-fill">
        <div className="ms-2">
          {broken && (
            <span
              className=""
              onClick={() => toggleSidebar()}
              style={{
                fontSize: "1.5rem",
              }}
            >
              <i
                className="ri-menu-line border border-4 rounded"
                style={{
                  fontSize: "3rem",
                }}
              ></i>
            </span>
          )}
        </div>
        <Routes>
          <Route path="/*" element={<ProtetedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/bills" element={<Bill />} />
            <Route path="dashboard/shippings" element={<Deliveries />} />
            <Route path="dashboard/all-products" element={<AllProduct />} />
            <Route path="dashboard/add-products" element={<AddProduct />} />
            <Route path="dashboard/users" element={<Users />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
export default AdminNav;
