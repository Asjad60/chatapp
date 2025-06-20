import React from "react";

const TextHighlighter = ({ text, tag: Tag, customClass }) => {
  return (
    <Tag
      className={`bg-clip-text [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] fill-transparent bg-gradient-to-r via-[#2d5aef] to-[#0596F0] from-[#544cf2] ${customClass}`}
    >
      {text}
    </Tag>
  );
};

export default TextHighlighter;
