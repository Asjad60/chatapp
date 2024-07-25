import React, { useRef, useState } from "react";
import { sendAttachments } from "../../../services/operations/chatAPI";
import toast from "react-hot-toast";
import Button from "../../Button";
import { GrGallery } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";

const SendAttchments = ({ setLastChatWith, id }) => {
  const [album, setAlbum] = useState([]);
  const [previewImg, setPreviewImg] = useState([]);

  const imageRef = useRef(null);

  const selectImage = () => imageRef.current.click();

  const handleSendAttachments = async (e) => {
    e.preventDefault();
    if (album.length > 5) {
      toast.error("Maximum 5 Image Allowed");
      return;
    }

    const formData = new FormData();
    for (const file of album) {
      formData.append("files", file);
    }
    formData.append("receiverId", id);
    sendAttachments(formData, setAlbum, setPreviewImg);
    setLastChatWith(id);
  };

  const handleChangeInputFile = (e) => {
    const files = Array.from(e.target.files);
    setAlbum(files);

    const fileReaders = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });
    Promise.all(fileReaders).then((images) => {
      setPreviewImg(images);
    });
  };

  return (
    <>
      <Button className={" cursor-pointer"} onClick={selectImage}>
        <GrGallery size={20} />
      </Button>
      {previewImg?.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 absolute inset-0 bg-slate-950/60 z-10 overflow-y-auto">
          <picture className="flex flex-wrap gap-2 justify-center">
            {previewImg.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`preview-${index}`}
                className="object-cover h-[10rem] w-[10rem] rounded-md"
              />
            ))}
          </picture>
          <div className="flex gap-6 z-10">
            <Button
              customClass={"p-2"}
              text={"Cancel"}
              onClick={() => {
                setPreviewImg([]);
                setAlbum([]);
                document.getElementById("album").value = "";
              }}
            />
            <Button
              customClass={"p-2 rounded-full"}
              onClick={handleSendAttachments}
            >
              <IoIosSend size={25} />
            </Button>
          </div>
        </div>
      )}
      <input
        type="file"
        id="album"
        multiple
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
        onChange={handleChangeInputFile}
        ref={imageRef}
      />
    </>
  );
};

export default SendAttchments;
