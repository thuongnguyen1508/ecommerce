import React from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import "../../styles/testimonial.css";
import Arrow from "./Arrow";

function Testimonial({ data }) {
  return (
    <>
      <Carousel
        variant="dark"
        className="testimonnial"
        indicators={false}
        nextIcon={
          <Arrow>
            <i className="ri-arrow-right-line"></i>
          </Arrow>
        }
        prevIcon={
          <Arrow>
            <i className="ri-arrow-left-line"></i>
          </Arrow>
        }
      >
        {data.map((item, index) => (
          <Carousel.Item key={index} className="px-5">
            <Row className="align-items-center p-sm-5 ">
              <Col lg="6" sx="12" className=" text-center">
                <img
                  className="img-fluid testimonnial__avatar"
                  src={item.imgUrl}
                  alt="avar"
                />
              </Col>
              <Col className="testimonnial__content" lg="6" sx="12">
                <p className="text-muted pe-lg-5 ps-lg-1 testimonnial__comment">
                  <i className="ri-double-quotes-l"> </i>
                  {item.comment}
                </p>
                <div className="my-1">
                  <StarRatings
                    rating={item.rate}
                    starRatedColor="#ffd800"
                    numberOfStars={5}
                    name="rating"
                    starDimension="24px"
                    starSpacing="2px"
                    svgIconViewBox="0 0 24 24"
                    svgIconPath="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
                  />
                </div>
                <h5 className="mt-lg-3 fw-bold">{item.name}</h5>
                <p className="my-3">{item.job}</p>
              </Col>
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default Testimonial;
