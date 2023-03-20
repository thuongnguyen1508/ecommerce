import React from "react";
import "./services.css";
import { motion } from "framer-motion";

function Services({ item }) {
  return (
    <div className="services">
      <div className="services__item">
        <span>
          <motion.i
            whileHover={{ fontsize: "3rem" }}
            style={{ backgroundColor: item.bg }}
            className={item.icon}
          ></motion.i>
        </span>
        <div className="">
          <h5 className="services__item--title my-4 fw-bold">{item.title}</h5>
          <p className="services__item--subtitle fw-light">{item.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
