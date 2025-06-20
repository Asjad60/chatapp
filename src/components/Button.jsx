import React from "react";

const Button = ({ onClick, disabled, customClass, text, children, title }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${
        children && "flex"
      } items-center hover:scale-95 transition-all duration-100 rounded-md bg-[#145782] text-white ${customClass}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          <span>{children}</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
