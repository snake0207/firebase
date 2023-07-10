import { useEffect, useState } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import Nweet from "components/Nweet";
import { dbService } from "fbase";
import NweetForm from "components/NweetForm";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  const getSnapShot = () => {
    onSnapshot(query(collection(dbService, "nweets")), (snapshot) => {
      const nweetsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetsArr);
    });
  };

  useEffect(() => {
    getSnapShot();
  }, []);

  return (
    <div>
      <NweetForm userObj={userObj} />
      {nweets &&
        nweets.map((nweet, i) => (
          <Nweet
            key={i}
            nweetObj={nweet}
            isOwner={nweet.userId === userObj.uid}
          />
        ))}
    </div>
  );
};

export default Home;
