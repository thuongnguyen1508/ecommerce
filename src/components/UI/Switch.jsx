import styled from "@emotion/styled";
import React from "react";

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CheckBoxLabel = styled.label`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 1rem;
  cursor: pointer;
`;

const CheckBox = styled.div`
  position: relative;
  cursor: pointer;
  width: 50px;
  height: 30px;
  border-radius: 30px;
  background-color: ${({ checked }) => (checked ? "#0ed693" : "#dde0e7")};
`;

const CheckBoxCircle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  transition: left 0.2s;
  ${({ checked }) => (checked ? `left: 24px;` : "")}
`;

export const Switch = ({ id, label, checked, ...rest }) => {
  return (
    <CheckBoxWrapper>
      <CheckBox checked={checked}>
        <input
          id={id}
          type="checkbox"
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "32px",
            height: "20px",
            opacity: 0,
            zIndex: 2,
          }}
          checked={checked}
          {...rest}
        />
        <CheckBoxCircle checked={checked} />
      </CheckBox>
      {label && <CheckBoxLabel htmlFor={id}>{label}</CheckBoxLabel>}
    </CheckBoxWrapper>
  );
};
