import { useState } from "react";
import anonymousImg from "../assets/anonymous.jpg";

const ImageUpload = ({ setFile, customClass, acceptType }) => {
  const [previewImg, setPreviewImg] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    const createdImgUrl = URL.createObjectURL(file);
    setPreviewImg(createdImgUrl);
  };

  return (
    <div className={`w-[50px] h-[40px] ${customClass}`}>
      <input
        type="file"
        name="groupProfile"
        id="groupProfile"
        onChange={handleFileChange}
        accept={acceptType || "image/*"}
        hidden
      />
      <label htmlFor="groupProfile" className="cursor-pointer">
        <img
          src={previewImg || anonymousImg}
          alt={"Group Profile"}
          className="h-full w-full rounded-full object-cover"
        />
      </label>
    </div>
  );
};

export default ImageUpload;
