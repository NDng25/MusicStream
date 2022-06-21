import axios from "axios";
import { useEffect, useState } from "react";

function Favourite({
  mood,
  webCamera,
  audioList,
  apiAudioList,
  prev,
  next,
  playMusic,
  // Webcam,
  // fetchMusic,
}) {
  const [username, setUsername] = useState("username");
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.pathname = "/login";
    } else {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}


        {/* song squares */}
        <h2 className="mt-5 mb-3">Favourite</h2>
       


      </div>
    </>
  );
}

export default Favourite;
