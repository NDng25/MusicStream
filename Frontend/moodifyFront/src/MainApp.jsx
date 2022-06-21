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
}) {
  const history = useHistory();

  const [username, setUsername] = useState("username");

  const [songByGenre, setSongByGenre] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUsername(localStorage.getItem("username"));
    }
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

  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div className=" dflex">
          {/* <input className="w80pt" type="search" placeholder="Search Music (in progress)" /> */}
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
          <div className="circle" onClick={() => prev()}>
            <i className="fas fa-arrow-left"></i>
          </div>
          {
              audioList.map((song) => {
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
                                <div id ="" className="mt-heart" >
                                    <input id={song.id} type="checkbox"/> 
                                    <label  for={song.id}></label> 
                                </div>
                                <button
                                    href="#Playlist1" data-toggle="modal" 
                                    style={{   
                                      color:"black"

                                    }}
                                  >
                                  Add playlist
                                  </button>
                              </div>
                          ):
                          (
                            <div class="overlay">
                                <div
                                    href="#Playlist1" data-toggle="modal" 
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
          <div className="circle" onClick={() => next()}>
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
                                <div
                                    href="#Playlist1" data-toggle="modal" 
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
       
      </div>
    </>
  );
}

export default MainApp;
