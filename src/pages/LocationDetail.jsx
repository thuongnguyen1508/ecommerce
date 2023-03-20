import React, { useState } from "react";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../styles/location_detail.css";
import SliderLocationCard from "../components/UI/SliderLocationCard";
import LocationCard from "../components/UI/LocationCard";
import locationData from "../assets/data/location";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Breadcrumb } from "react-bootstrap";

function LocationDetail() {
  const id = useParams();

  var check = true;
  if (id.id === "1") {
    check = false;
  }
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  window.scrollTo(0, 0);

  const locations = locationData.find((item) => item.id === id.id);
  const relateItem = locationData.filter(
    (item) => item.relate === locations.relate && item.id !== id.id
  );

  var settings2 = {
    className: "center",
    focusOnSelect: true,
    infinite: check,
    centerPadding: "10px",
    slidesToShow: 4,
    swipeToSlide: true,
    beforeChange: (oldIndex, newIndex) => {
      //setTimeout(() => {
      const sample = document.querySelectorAll(".slider-img2");

      for (let i = 0; i < sample.length; i++) {
        sample[i].classList.remove("content_animation");
        console.log("beforeChange", oldIndex, newIndex);
      }

      //});
    },
    afterChange: (index) => {
      //setTimeout(() => {
      const sample = document.querySelector(".slick-current .slider-img2");
      sample.classList.add("content_animation");
      console.log("afterChange", index);
      //});
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  var settings = {
    fade: true,
    centerPadding: "10px",
    arrows: false,
  };
  return (
    <Helmet title={locations.title}>
      <div className="container detail-container">
        <div>
          <Breadcrumb className="bread-detail">
            <Breadcrumb.Item href="/home">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item href="/location">Địa chỉ</Breadcrumb.Item>
            <Breadcrumb.Item active>Chi tiết địa chỉ</Breadcrumb.Item>
          </Breadcrumb>
          <hr className="line-loc-detail"></hr>
        </div>
        <div className="row row-1">
          <div className="col-sm-12">
            <h2 className="title-detail-loc">
              {locations.title} | {locations.date}
            </h2>
            <Slider
              asNavFor={nav2}
              ref={(slider1) => setNav1(slider1)}
              className="p-2"
              {...settings}
            >
              {locations.listURL.map((item) => (
                <SliderLocationCard item={item} index="1"></SliderLocationCard>
              ))}
            </Slider>

            <Slider
              asNavFor={nav1}
              ref={(slider2) => setNav2(slider2)}
              className="p-2"
              {...settings2}
            >
              {locations.listURL.map((item, index) => (
                <SliderLocationCard
                  item={item}
                  index="2"
                  current={index}
                ></SliderLocationCard>
              ))}
            </Slider>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-md-7 d-flex field-head div-btn-detail-loc">
            {locations.tag.map((item) => (
              <div className="field-item">{item}</div>
            ))}
          </div>

          <div className="col-md-5 div-btn-detail-loc">
            <Link to={"/location"}>
              <button className="btn-detail-loc btn btn-primary btn-lg">
                <i class="	fa fa-angle-left"></i>
                &nbsp;BACK TO
              </button>
            </Link>
          </div>
        </div>
        <div className="relate-div">
          <span className="relate">RELATED</span>
          <hr className="line-relate"></hr>
          <div className="row m-3">
            {relateItem.map((item, index) => (
              <div lg="4" className="p-3 col-md-4 relate-item" key={index}>
                <LocationCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Helmet>
  );
}

export default LocationDetail;
