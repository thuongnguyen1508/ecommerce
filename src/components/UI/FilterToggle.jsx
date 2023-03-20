import React from "react";
import { AccordionContext } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { useContext } from "react";

function FilterToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <button
      type="button"
      style={{ backgroundColor: isCurrentEventKey ? "pink" : "lavender" }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

export default FilterToggle;
