import axios from "axios";
import { useEffect, useState } from "react";

function AllSongs({
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
        <h2 className="mt-5 mb-3">A total songs</h2>
        <div className=" mt-3 w-100 justify-content-between align-items-center">
       
          {
             
              audioList.map((song) => {
                return (
                  console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn1"
                    style={{height: "100px"}}
                    onClick={() => playMusic(song)}
                  >
                    <div>
                      <img src={song.cover} className="w80" alt="song-cover" />
                    </div>
                    <div  className="w300">
                      <p  className="w100 mg">{song.name.slice(0, 15)} </p>
                    </div>
                    <div  className="w300">
                      <p  className="w100 mg">{song.artist.slice(0, 15)} </p>
                    </div>
                    <div  className="w300">
                      <div id ="" className="mt-heart mg" >
                          <input id={song.id} type="checkbox"/> 
                          <label  for={song.id}></label> 
                      </div>
                    </div>
                    <div  className="w300">
                    <a  onclick="" title="Add to Playlist"> <i
                            className="fas fa-ellipsis-h mg"></i>
                    </a>
                    </div>
                  </div>
                );
              })
            }
          
        </div>


      </div>
    </>
  );
}

export default AllSongs;
