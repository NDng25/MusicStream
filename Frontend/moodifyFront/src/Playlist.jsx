import axios from "axios";
import { useEffect, useState } from "react";
import {useHistory,Link} from 'react-router-dom';
import { BASE_URL } from "./App";


function Playlist({
  mood,
  userid,
  webCamera,
  audioList,
  playlistid,
  apiAudioList,
  prev,
  next,
  playMusic,
}) {
  const history = useHistory();
  
 
  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div>
          <input type="search" placeholder="Search Music (in progress)" />
        </div>

        {/* song squares */}
        <div className="dis">
            <h2 className="mt-5 mb-3">Playlist</h2>
            {/* <a href="#addtoplaylist" data-toggle="modal" class="button-65 mt-5 mb-3" role="button"><span class="text">Add to playlist</span></a> */}
          </div> 
          
      <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             playlistid.map((playlist) => {
               return (
                 console.log(playlist),
                 <div
                   key={playlist.id}
                   className="nav-btn1"
                   style={{height: "100px"}}
                 >
                   <div className="w-h">
                     <img src={playlist.cover} className="w-h-pt" alt="song-cover" />
                   </div>
                   <div className="w300" style={{padding:"30px"}}>
                   <p><Link className="w100 mg"
                     to={{
                      pathname:'/detailplaylist',
                      state: {
                       playlistid: playlist.id,
                       playlistname : playlist.name,
                       playlistcover : playlist.cover
                      }
                     }}
                        >{playlist.name}</Link></p>
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

export default Playlist;
