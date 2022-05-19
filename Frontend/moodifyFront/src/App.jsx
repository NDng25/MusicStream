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
import FriendsApp from "./FriendsApp";

export const BASE_URL = "http://127.0.0.1:8000";


function App() {
  // states
  const [audioList, setAudioList] = useState([]); //pagination array

  const [apiAudioList, setApiAudioList] = useState([]); //original array from api
  const [apiAudioListCopy, setApiAudioListCopy] = useState([]); //original array from api -> copy

  const [mood, setMood] = useState("");

  const [audioInstance, setAudioInstance] = useState(null);

  const [currAudio, setCurrAudio] = useState([]);


  // refs
  var webCamera = useRef(null);
  axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        console.log("fetching music");
        let response = await axios.get(`${BASE_URL}/api/songs/`);
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
    <div>
      {/* top */}
      <BrowserRouter>
        <div className="d-flex h-90">
          {/* menu */}
          <div className="w-15 text-center pt-5" id="menu">
            {/* logo */}
            <div>
              <img src={Logo} alt="logo" className="logo" />
            </div>

            {/* navs */}
            <nav className="d-flex flex-column justify-content-around">
              <NavLink to="/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-home"></i>
                    </span>{" "}
                    Home
                  </div>
                </div>
              </NavLink>
              <NavLink to="/friends/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-user-friends"></i>
                    </span>{" "}
                    Friends
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

          <Route path="/friends" exact>
            <FriendsApp
              UserCard={UserCard}
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
