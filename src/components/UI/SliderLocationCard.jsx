import React from "react";
import { motion } from "framer-motion";
import "../../styles/location.css";
import season from "../../assets/images/season.jpg"
function SliderLocationCard({item, index, current}) {
  console.log( " nè má ba" + current);
  var x = "slider-img" + index;
  if (current === 0) {
    x += " " + "content_animation";
  }
  
  return (
    <motion.div className={x}>
        <img  src={item} alt="" />
    </motion.div>
  );
}

export default SliderLocationCard;