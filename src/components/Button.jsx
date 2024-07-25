import React from "react";

const Button = ({ onClick, disabled, customClass, text, children, title }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center hover:scale-95 transition-all duration-100 dark:shadow-dark-mode shadow-light-mode dark:bg-dark-gradient bg-light-gradient rounded-lg ${customClass}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          <span className="hover:text-green-500">{children}</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
