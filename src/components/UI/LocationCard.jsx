import React from "react";
import { motion } from "framer-motion";
import "../../styles/location.css";
import { Link } from "react-router-dom";

function LocationCard({ item }) {
  window.scrollTo(0, 0);
  return (
    <Link to={"/project/" + item.id}>
      <motion.div whileHover={{ scale: 1.01 }}>
        <div className="loca-img">
          <img src={item.imgURL} alt="" />
        </div>
        <div className="loca-content border border-dark p-2">
          <span className="loca-title fw-bold">{item.title}</span>
          <br></br>
          <span className="loca-title fw-bold">{item.date}</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default LocationCard;
