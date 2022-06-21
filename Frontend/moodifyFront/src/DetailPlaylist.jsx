import axios from "axios";
import { useEffect, useState } from "react";
import {useHistory, useLocation} from 'react-router-dom';

import { BASE_URL } from "./App";

function DetailPlaylist({
  mood,
  webCamera,
  audioList,
  apiAudioList,
  playlistid,
  prev,
  next,
  playMusic,
  // Webcam,
  // fetchMusic,
}) {
    const location = useLocation();
    const state = location.state.playlistid;
    //console.log(state);
    const [songsplaylistid, setsongsplaylistid] = useState([]);

    useEffect(() =>{
      const fetchSongsplaylistid =async () => {
        const playlist_id = state;
        let response = await axios.get(`${BASE_URL}/api/playlist/${playlist_id}`);
        console.log(`${BASE_URL}/api/playlist/${playlist_id}`);
        let songsplaylist = response.data;
        setsongsplaylistid(
          songsplaylist.map((song) => {
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
      fetchSongsplaylistid();
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
        <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             songsplaylistid.map((song) => {
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

export default DetailPlaylist;
