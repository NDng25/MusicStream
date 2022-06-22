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
            <a href="#addtoplaylist" data-toggle="modal" class="button-65 mt-5 mb-3" role="button"><span class="text">Add to playlist</span></a>
          </div> 
          <div id="addtoplaylist" class="modal fade">
               <div class="modal-dialog">
                  <div class="modal-content">
                     <div class="modal-header">						
                            <h4 class="modal-title">Add to playlist</h4>
                            <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className=" mt-3 w-100 justify-content-between align-items-center">
       
                      {
                        
                          audioList.map((song) => {
                            return (
                              //console.log(song),
                              <div
                                key={song.id}
                                className="nav-btn2"
                              >
                                <div>
                                  <img src={song.cover} className="w80" alt="song-cover" />
                                </div>
                                <div  className="w190">
                                  <p  className="w200 mg">{song.name.slice(0, 15)} </p>
                                </div>
                                <div  className="w300">
                                <p className="w100 mg"><a href="#Playlist" data-toggle="modal" class="button66" role="button"><span class="text">Add to playlist</span></a></p>
                                <div id="Playlist" class="modal fade">
                                  <div class="modal-dialog">
                                      <div class="modal-content">
                                      <div class="modal-header">	
                                         <h4 class="modal-title">Playlist Name</h4>					
                                        <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    </div>
                                        <div className=" mt-3 w-100 justify-content-between align-items-center">
                                          {
                                            
                                              audioList.map((song) => {
                                                return (
                                                  console.log(song),
                                                  <div
                                                    key={song.id}
                                                    className="nav-btn1"
                                                  >
                                                    <div  className="w300 bg" >
                                                      <p  className="w200 ">{song.name.slice(0, 15)} </p>
                                                      <hr></hr>
                                                    </div>
                                                  </div>
                                                );
                                              })
                                            }
                                          
                                        </div>
                                      </div>
                                    </div>
                                </div> 
                                </div>
                              </div>
                            );
                          })
                        }
                      
                    </div>
                  </div>
                </div>
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
                   <div>
                     <img src={playlist.cover} className="w80" alt="song-cover" />
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
