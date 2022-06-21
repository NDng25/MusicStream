import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "./App";

function Favorite({
  mood,
  webCamera,
  audioList,
  apiAudioList,
  userId,
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

  const [songsFavoritetid, setsongsFavoriteid] = useState([]);

    useEffect(() =>{
      const fetchSongsFavoriteid =async () => {
        let response = await axios.get(`${BASE_URL}/api/favorite?user_id=${userId}`);
        console.log(`${BASE_URL}/api/favorite/${userId}`);
        let songsfavorite = response.data;
        setsongsFavoriteid(
          songsfavorite.map((song) => {
            return {
              id: song.id,
              name: song.title,
              musicSrc: song.song_file,
              artist:song.artist,
              cover: song.cover,
            };
           }),
            
          );
      }
      fetchSongsFavoriteid();
    }, []);

  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div>
          <input type="search" placeholder="Search Music (in progress)" />
        </div>

        {/* song squares */}
        <h2 className="mt-5 mb-3">Favorite</h2>
        <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             songsFavoritetid.map((song) => {
               return (
                 console.log(song),
                 <div
                   key={song.id}
                   className="nav-btn1"
                   onClick={() => playMusic(song)}
                 >
                   <div>
                     <img src={song.cover} className="w80" alt="song-cover" />
                   </div>
                   <div className="w300" >
                     <p  className="w100 mg" >{song.artist} </p>
                   </div>
                   <div  className="w300" >
                    {/* <p  className="w100 mg" >{song.artist} </p> */}
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

export default Favorite;
