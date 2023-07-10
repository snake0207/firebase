import React, { useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

const NweetForm = ({ userObj }) => {
  const [text, setText] = useState("");
  const [attachImage, setAttachImage] = useState("");
  const fileRef = useRef();

  const onChange = ({ target: { value } }) => {
    setText(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let imageUrl = "";
    if (attachImage) {
      // Image를 firebase.storage 전송하는 부분
      const storageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //   const response = await uploadString(storageRef, attachImage, "data_url");
      // imageUrl = await getDownloadURL(response.ref);
      await uploadString(storageRef, attachImage, "data_url").then(
        async (snapshot) => {
          console.log("Uploaded a data_url string!");
          imageUrl = await getDownloadURL(snapshot.ref);
        }
      );
      console.log(imageUrl);
    }

    // tweet 메시지를 firebase.db 전송하는 부분
    await addDoc(collection(dbService, "nweets"), {
      text,
      createdAt: Date.now(),
      userId: userObj.uid,
      imageUrl,
    });
    setText("");
    setAttachImage("");
    fileRef.current.value = null;
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("loadend", (event) => {
      console.log(event);
      const {
        currentTarget: { result },
      } = event;
      setAttachImage(result);
    });
    if (file) reader.readAsDataURL(file);
  };

  const onClearattachImage = () => {
    setAttachImage();
    fileRef.current.value = null;
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        onChange={onChange}
        placeholder="Enter new twit"
        value={text}
        required
      />
      <input type="submit" value="Send" />
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={onFileChange}
      />
      {attachImage && (
        <div>
          <img src={attachImage} width="50px" height="50px" alt="attachImage" />
          <button onClick={onClearattachImage}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetForm;
