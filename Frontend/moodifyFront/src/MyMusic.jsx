import axios from "axios";
import { useEffect, useState } from "react";
import AddSong from "./AddSong";

function MyMusic({
  userid,
  genreList,
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
        <div className=" dflex">
          <input className="w80pt" type="search" placeholder="Search Music (in progress)" />
          <div className="log" onClick={() => AddSong(
            userid={userid},
            genreList={genreList}
            )}>
            <h2 className="mb-3">Upload</h2>
          </div>
        </div>

        {/* song squares */}
        <h2 className="mt-5 mb-3">My music</h2>
       


      </div>
    </>
  );
}

export default MyMusic;