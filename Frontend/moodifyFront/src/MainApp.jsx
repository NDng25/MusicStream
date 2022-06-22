import axios from "axios";
import { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';
import { BASE_URL } from "./App";

function MainApp({
  userId,
  genres,
  isLog,
  audioList,
  prev,
  next,
  playMusic,
  playlist,
}) {
  const history = useHistory();

  const [username, setUsername] = useState("username");

  const [songByGenre, setSongByGenre] = useState([]);

  const [clickedId, setClickedId] = useState(null);

  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    const fetchRecentSongs = async () => {
      let res = await axios.get(`${BASE_URL}/api/recently_played?user_id=${userId}`);
      let songs = res.data;
      setRecentSongs(songs.map(
        (song) => {
          return {
            id: song.id,
            name: song.title,
            musicSrc: song.song_file,
            artist:song.artist,
            cover: song.cover,
          };
        }
      ));
    }
    fetchRecentSongs();
  }, []);


  useEffect(() =>{
    const fetchSongByGenre =async (g) => {
      let genre_name = ((g.name).includes(" "))? (g.name).replace(" ", "+") : g.name;
      let response = await axios.get(`${BASE_URL}/api/songs?genre_name=${genre_name}`);
      console.log(`${BASE_URL}/api/songs?genre_name=${genre_name}`);
        let songs = response.data;
        // console.log("fetched songs: ");
        // console.log(songs);
        setSongByGenre(songByGenre => [...songByGenre, {
          genre: g.name,
          songs: songs.map((song) => {
            return {
              id: song.id,
              name: song.title,
              musicSrc: song.song_file,
              artist:song.artist,
              cover: song.cover,
            };
          })
        } ]);
    }
    const fetchSongAllGenre = async() => {
      if(genres){
        genres.map((g) => {
          fetchSongByGenre(g);
        }
        );
        console.log("fetch all genre. Genres:", genres);
      }
      else{
        console.log("no genres");
      }
    }
    fetchSongAllGenre();
  }, [genres]);

  function addSongPlay(e, song_id, playlist_id){
 
    const addPlay = async (song_id, playlist_id) => {
      console.log(userId);
      let formData = new FormData();
      formData.append("user_id",userId);
      formData.append("song_id",song_id);
      formData.append("playlist_id", playlist_id);
      try{
        let res = await axios.put(`${BASE_URL}/api/playlist/`, formData);
        console.log(res.data);
      }
      catch(err){
        console.log(err);
      }
     
    }
  
    const removeSongplaylist = async (id) => {
      try{
        let res = await axios.delete(`${BASE_URL}/api/playlist/`, {
          data: {
            user_id: userId,
            song_id: id,
          }
        });
        console.log(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
  
    // if(e.target.checked){
      addPlay(song_id, playlist_id);
    // }else{
    //   removeSongplaylist(id);
    // }
  }
       
  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div className=" dflex">
          {
          (!isLog)?
          (
            <div className="log" onClick={() => {
              history.push('/login');
            }}>
              <h2 className="mb-3">Login</h2>
            </div>
          ):
          (
           <></> 
          )
        }
          
        </div>

        {/* song squares */}
        {
          (isLog)?
          (
            <h2 className="mt-5 mb-3">Hi <span className="text-primary" id="username">{username}</span>, Listening is everything</h2>
          ):
          (
            <h2 className="mt-5 mb-3">Hi, Listening is everything</h2>
          )
        }
        
        <div className="d-flex mt-3 w-100 justify-content-between align-items-center">
          <div className="circle" >{/*onClick={() => prev()}*/}
            <i className="fas fa-arrow-left"></i>
          </div>
          {
              recentSongs.map((song) => {
                return (
                  // console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn"
                    onClick={() => playMusic(song)}
                  >
                    <div class="contain">
                      <img src={song.cover} className="mw-100" alt="song-cover" />
                      {
                          (isLog)?
                          (
                            <div class="overlay">
                                
                                <button
                                    href="#Playlist1" data-toggle="modal" 
                                    style={{   
                                      color:"black",
                                      marginTop: "45px"

                                    }} 
                                    onClick={() => setClickedId(song.id)}
                                  >
                                  Add playlist
                                  </button>
                              </div>
                          ):
                          (
                            <div class="overlay">
                                <div
                                     data-toggle="modal" 
                                    style={{   
                                      margin:"40px"
                                    }}
                                  >
                                  <i className="fas fa-play-circle" style={{fontSize: "50px"}}>&#xE254;</i>
                                  </div>     
                              </div>
                          )
                        }
                      
                    </div>
                    <div>
                      <p>{song.name.slice(0, 15)}</p>
                    </div>
                  </div>
                );
              })
            }
          <div className="circle" >{/*onClick={() => next()}*/}
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
        {
          songByGenre.map((item) => {       
            return(
              <div>
              <div >
              <h2 className="mt-5 mb-3">{item.genre} Songs</h2>
              </div>
              <div  className="d-flex mt-3 w-100 justify-content-between align-items-center">
              <div className="circle" onClick={() => prev()}>
                  <i className="fas fa-arrow-left"></i>
              </div>
              {
                  item.songs.map((song) => {
                      return (
                        
                        <div
                          key={song.id}
                          className="nav-btn"
                          onClick={() => playMusic(song)}
                        >
                          <div className="contain">
                            <img src={song.cover} className="mw-100" alt="song-cover" />
                            <div class="overlay">
                                <div data-toggle="modal" 
                                    style={{   
                                      margin:"40px"
                                    }}
                                  >
                                  <i className="fas fa-play-circle" style={{fontSize: "50px"}}>&#xE254;</i>
                                  </div>     
                              </div>
                          </div>
                          <div>
                            <p>{song.name.slice(0, 15)}</p>
                          </div>
                        </div>
                        
                      );
                    })
                  }
                  <div className="circle" onClick={() => next()}>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
              </div>
            );
          })
        }
       <div id="Playlist1" class="modal fade">
                                  <div class="modal-dialog">
                                      <div class="modal-content">
                                      <div class="modal-header">	
                                         <h4 class="modal-title">Playlist Name</h4>					
                                        <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    </div>
                                        <div className=" mt-3 w-100 justify-content-between align-items-center">
                                          {
                                            
                                              playlist.map((p) => {
                                                return (
                                                  console.log(p['songs']),
                                                  <div
                                                    key={p.id}
                                                    className="nav-btn1"
                                                  >
                                                    <div  className="w300 bg" >
                                                      <p  className="w200 ">{p.name} </p>
                                                      <hr></hr>
                                                    </div>
                                                    <div  className="w300">
                                                      <div id ="" className="mt-heart" >
                                                          <input id={p.id} type="checkbox" defaultChecked={(p['songs'].find((i) => i===clickedId) !== undefined)?true:false} onClick={(e) => addSongPlay(e ,clickedId,p.id)}/> 
                                                          <label  for={p.id}></label> 
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
      </div>
    </>
  );
}

export default MainApp;
