import axios from "axios";
import { useEffect, useState } from "react";

function Playlist({
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

  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div>
          <input type="search" placeholder="Search Music (in progress)" />
        </div>

        {/* song squares */}
        <h2 className="mt-5 mb-3">Playlist</h2>
       


      </div>
    </>
  );
}

export default Playlist;
