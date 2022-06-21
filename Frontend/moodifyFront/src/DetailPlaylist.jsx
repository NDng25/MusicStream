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
  userId,
  prev,
  next,
  playMusic,
  // Webcam,
  // fetchMusic,
}) {
    const history = useHistory()
    const location = useLocation();
    const [state,setState] = useState(location.state.playlistid);
    const playlistname = location.state.playlistname;
    const playlistcover = location.state.playlistcover;
    //console.log(state)
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
  
    const deletePlaylist = async (e, id) => {
      e.preventDefault();
      try {
        let response = await axios.delete(`${BASE_URL}/api/playlist/`,{
          data: {
            user_id: userId,
            playlist_id: id,
          }
        });
        console.log(response);
         history.push("/playlist");
      }
      catch(err){
        console.log(err);
      }
    }

  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div>
          <input type="search" placeholder="Search Music (in progress)" />
        </div>
        <div className=" mt-3 w-100 justify-content-between align-items-center"
         style={{display : "flex" ,
                 }}>
          <div>
            <img src={playlistcover} style={{width : "200px", margin: "30px 0px"}} alt="song-cover" />
          </div>
          <div style={{padding:"", width : "960px"}}>
              <p style={{ fontSize: "30px"}}>{playlistname}</p>
              <p>0 Likes</p>
              <p>0 Followers</p>
         </div>
      </div>
      <a href="#deletePlaylist" data-toggle="modal" class="button-65 mb-3" style={{marginLeft : "0px" }} role="button"><span class="text">Delete PLaylist</span></a>
        {/* song squares */}
        <h2>Your songs</h2>
        <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             songsplaylistid.map((song) => {
               return (
                 console.log(song),
                 <div
                   key={song.id}
                   className="nav-btn1"
                   style={{height : "100px"}}
                   onClick={() => playMusic(song)}
                 >
                   <div>
                     <img src={song.cover} className="w80" alt="song-cover" />
                   </div>
                   <div  className="w300">
                      <p  className="w100 mg">{song.name} </p>
                    </div>
                   <div className="w300" >
                     <p  className="w100 mg" >{song.artist} </p>
                   </div>
                   <div  className="w300" >
                   <div  className="w300">
                      <i className="fa fa-remove w100 mg" style={{marginTop: "35px"}}></i>
                    </div>
                   </div>
                 </div>
               );
             })
           }
      </div>                   {/* Delete Modal HTML */}
                    <div id="deletePlaylist" class="modal fade">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <form onSubmit={(e) => deletePlaylist(e, state)}>
                            <div class="modal-header">						
                              <h4 class="modal-title">Delete Playlist</h4>
                              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </div>
                            <div class="modal-body">					
                              <p>Are you sure you want to delete these Records?</p>
                              <p class="text-warning"><small>This action cannot be undone.</small></p>
                            </div>
                            <div class="modal-footer">
                              <input type="submit" class="btn btn-danger" value="Delete"/>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
      </div>
    </>
  );
}

export default DetailPlaylist;
