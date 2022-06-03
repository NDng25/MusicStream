import { useEffect, useRef, useState } from "react";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Webcam from "react-webcam";
import axios from "axios";
import Logo from "./assets/transparent_white.png";
import { BrowserRouter, NavLink, Route } from "react-router-dom";
import UserCard from "./UserCard";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import MainApp from "./MainApp";
import Playlist from "./Playlist";
import AllSongs from "./AllSongs";
import MyMusic from "./MyMusic";

export const BASE_URL = "http://127.0.0.1:8000";


function App() {
  // states
  const [audioList, setAudioList] = useState([]); //pagination array
  const [genreList, setGenreList] = useState([]); //pagination array

  const [apiAudioList, setApiAudioList] = useState([]); //original array from api
  const [apiAudioListCopy, setApiAudioListCopy] = useState([]); //original array from api -> copy

  const [mood, setMood] = useState("");

  const [audioInstance, setAudioInstance] = useState(null);

  const [currAudio, setCurrAudio] = useState([]);

  const [userid, setUserid] = useState(1);


  // refs
  var webCamera = useRef(null);
  axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        console.log("fetching music");
        let response = await axios.get(`${BASE_URL}/api/songs`);
        let songs = response.data;
        // let resMood = response.data.mood;
        setApiAudioList([]);
        setApiAudioListCopy([]);
        setApiAudioList(
          songs.map((song) => {
            return {
              id: song.id,
              name: song.title,
              musicSrc: song.song_file,
              artist:song.artist,
              cover: song.cover,
            };
          })
        );
        
        // setMood(resMood);
      } catch (error) {
        if(error.response){
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        else{
          console.log(error.message);
        }
      }
    }
    fetchMusic();
  }, []);
  axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
  useEffect(() => {
    const fetchGenres = async () => {
        try {
            console.log("fetching genres");
            let response = await axios.get(`${BASE_URL}/api/genres`);
            let genres = response.data;
            setGenreList(
                genres.map((genre) => {
                    return {
                        id: genre.id,
                        name: genre.name,
                    };
                })
            );
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        }
    };
    fetchGenres();
}, []);

  useEffect(() => {
    setAudioList(apiAudioList.slice(0, 6));
  }, [apiAudioList, apiAudioListCopy]);

  function playMusic(song) {
    // audioInstance.clear();
    setTimeout(() => {
      setCurrAudio([...currAudio,song]);
      console.log("playing music");
      console.log(song);
      audioInstance.play();
    }, 300);
  }

  function reverse(arr = [], l, r) {
    while (l < r) {
      var temp = arr[l];
      arr[l] = arr[r];
      arr[r] = temp;
      l++;
      r--;
    }
  }

  function rotateDec(arr = []) {
    reverse(arr, 0, arr.length - 2);
    reverse(arr, 0, arr.length - 1);
  }

  function rotateInc(arr = []) {
    reverse(arr, 1, arr.length - 1);
    reverse(arr, 0, arr.length - 1);
  }

  function next() {
    rotateInc(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
      return "";
    });
    setAudioList(em);
  }

  function prev() {
    rotateDec(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
      return "";
    });
    setAudioList(em);
  }

  function logout() {
    localStorage.clear();
    window.location.pathname = "/login";
  }

  return (
    <div >
      {/* top */}
      <BrowserRouter>
        <div className="d-flex h-90">
          {/* menu */}
          <div className="w-15 text-center pt-5 posi" id="menu">
            {/* logo */}
            <div>
              <img src={Logo} alt="logo" className="logo" />
            </div>

            {/* navs */}
            <nav className="d-flex flex-column justify-content-around">
              <NavLink to="/" activeClassName="active" exact>
                <div>
                  <div className="item">
                    <span>
                      <i className="fas fa-home"></i>
                    </span>{" "}
                    Home
                  </div>
                </div>
              </NavLink>
              <NavLink to="/allsongs/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-compact-disc"></i>
                    </span>{" "}
                    AllSongs
                  </div>
                </div>
              </NavLink>
              <NavLink to="/mymusic/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-headphones"></i>
                    </span>{" "}
                    MyMusic
                  </div>
                </div>
              </NavLink>
              <NavLink to="/playlist/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-book"></i>
                    </span>{" "}
                    Playlist
                  </div>
                </div>
              </NavLink>
              <NavLink to="/addplaylist/"  exact>
                <div>
                  <div className="glow-on-hover ">
                    <a >
                      <i className="fas fa-plus"></i>
                    New Playlist
                    </a>{" "}
                  </div>
                </div>
              </NavLink>

              <div onClick={() => logout()}>
                <div>{localStorage.getItem("token") && "Logout"}</div>
              </div>
            </nav>

            <div id="info">
              <span>
                <i className="far fa-copyright"></i>
              </span>{" "}
              Team Moodify 2020
            </div>
          </div>

          <Route path="/" exact>
            <MainApp
              mood={mood}
              webCamera={webCamera}
              audioList={audioList}
              apiAudioList={apiAudioList}
              prev={prev}
              next={next}
              playMusic={playMusic}
              // Webcam={Webcam}
              // fetchMusic={fetchMusic}
            />
          </Route>
          <Route path="/allsongs" exact>
            <AllSongs
              mood={mood}
              audioList={audioList}
              apiAudioList={apiAudioList}
              playMusic={playMusic}
            />
          </Route>
          <Route path="/mymusic" exact>
            <MyMusic
              userid={userid}
              genreList={genreList}
            />
          </Route>
          <Route path="/playlist" exact>
            <Playlist
            />
          </Route>

          <Route path="/signup" exact>
            <SignupForm />
          </Route>

          <Route path="/login" exact>
            <LoginForm />
          </Route>
        </div>
      </BrowserRouter>

      {/* player */}
      <div>
        <ReactJkMusicPlayer
          mode="full"
          showDownload={false}
          showDestroy={false}
          showReload={false}
          showLyric={false}
          showThemeSwitch={false}
          showPlayMode={false}
          toggleMode={false}
          audioLists={currAudio}
          autoPlay={false}
          seeked={false}
          getAudioInstance={(audioObj) => {
            setAudioInstance(audioObj);
          }}
        />
      </div>
    </div>
  );
}

export default App;