import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import PropTypes from "prop-types";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editable, setEditable] = useState(false);
  const [editNweet, setEditNweet] = useState(nweetObj.text);

  const nweetRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const storageRef = ref(storageService, `${nweetObj.imageUrl}`);

  const onDeleteClick = async () => {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await deleteDoc(nweetRef);
      if (nweetObj.imageUrl) {
        await deleteObject(storageRef)
          .then(() => {
            // File deleted successfully
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  const toggleEdit = () => setEditable((prev) => !prev);
  const onNewChange = ({ target: { value } }) => {
    setEditNweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(nweetObj, editNweet);
    await updateDoc(nweetRef, { text: editNweet });
    setEditable(false);
  };

  return (
    <div>
      {editable ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              onChange={onNewChange}
              value={editNweet}
              placeholder="Edit our nweet."
              required
            />
            <input type="submit" value="Update nweet" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{nweetObj.text}</h3>
          {nweetObj.imageUrl && (
            <img
              src={nweetObj.imageUrl}
              alt="preview"
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEdit}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

Nweet.propTypes = {
  nweetObj: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
};

export default Nweet;
