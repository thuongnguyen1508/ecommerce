import React, { useEffect, useState } from "react";
import "../../styles/clock.css";

function Clock() {
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  let interval;
  const countDown = () => {
    const destination = new Date(2023, 2, 7).getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const countDown = destination - now;
      const day = Math.floor(countDown / (1000 * 60 * 60 * 24));
      const hour = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minute = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
      const second = Math.floor((countDown % (1000 * 60)) / 1000);
      if (destination < 0) clearInterval(interval.current);
      else {
        setDay(day);
        setHour(hour);
        setMinute(minute);
        setSecond(second);
      }
    });
  };
  useEffect(() => countDown());
  return (
    <div className="clock-wrapper d-flex align-items-center gap-4">
      <div className="clock-data">
        <h1 className="clock-data--digit">{day}</h1>
        <h1 className="clock-data--string">Ngày</h1>
      </div>
      <span className="clock-data--dot">:</span>
      <div className="clock-data">
        <h1 className="clock-data--digit">{hour}</h1>
        <h1 className="clock-data--string">Giờ</h1>
      </div>
      <span className="clock-data--dot">:</span>
      <div className="clock-data">
        <h1 className="clock-data--digit">{minute}</h1>
        <h1 className="clock-data--string">Phút</h1>
      </div>
      <span className="clock-data--dot">:</span>
      <div className="clock-data">
        <h1 className="clock-data--digit">{second}</h1>
        <h1 className="clock-data--string">Giây</h1>
      </div>
    </div>
  );
}

export default Clock;
