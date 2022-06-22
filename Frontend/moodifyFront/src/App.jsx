import { useEffect, useRef, useState } from "react";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Webcam from "react-webcam";
import axios from "axios";
import Logo from "./assets/transparent_white.png";
import { BrowserRouter, NavLink, Route, useHistory } from "react-router-dom";
import UserCard from "./UserCard";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import MainApp from "./MainApp";
import Playlist from "./Playlist";
import AllSongs from "./AllSongs";
import MyMusic from "./MyMusic";
import Favorite from "./Favorite";
import DetailPlaylist from "./DetailPlaylist";

export const BASE_URL = "http://127.0.0.1:8000";


function App() {
 
  // states
  const history = useHistory()
  const [audioList, setAudioList] = useState([]); //pagination array

  const [apiAudioList, setApiAudioList] = useState([]); //original array from api

  const [apiAudioListCopy, setApiAudioListCopy] = useState([]); //original array from api -> copy

  const [audioInstance, setAudioInstance] = useState(null);

  const [currAudio, setCurrAudio] = useState([]);

  const [isLog, setIsLoged] = useState(false);

  const [genres, setGenres] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("pk"));

  const [playlistid, setPlaylist] = useState([]);

  const [dataPlay, setDataplay] = useState({
        user_id: userId,
        songs: [],
        name: "",
        cover: null,
  });

  const postPlaylist = async (e) => {
    let formData = new FormData();
    for (let key in dataPlay) {
      formData.append(key, dataPlay[key]);
    }
    
    console.log(formData.get('user_id'));

    try{
      let response = await axios.post(`${BASE_URL}/api/playlist/`, formData, 
      {
        headers: {
            "Content-Type": "multipart/form-data",
        },});
      console.log(response.data);
      //close form
      
      //reset data
      setDataplay({
        user_id: userId,
        name: "",
        cover: null,
      });
     // history.push("/playlist");
    }
    catch(err){
      console.log(err);
    }
  }

  const onImageChange = (e) => {
    const reader = new FileReader();
    let newData = {...dataPlay };
    if(e.target.files && e.target.files[0]){
      newData['cover'] = e.target.files[0];
    
    }
    setDataplay(newData);
  }
  const handleChange = ({ currentTarget: input }) => {
    let newData = {...dataPlay };
    newData[input.name] = input.value;
    
    setDataplay(newData);
};

  useEffect(() =>{
    const fetchPlaylistbyId =async () => {
      const user_id = localStorage.getItem("pk");
      let response = await axios.get(`${BASE_URL}/api/playlist?user_id=${user_id}`);
        console.log(`${BASE_URL}/api/playlist?user_id=${user_id}`);
      let playlists = response.data;
        setPlaylist(
        playlists.map((playlist) => {
            return {
              id : playlist.id,
              user: playlist.user,
              name: playlist.name,
              cover:playlist.cover,
              songs: playlist.songs,
            };
         }),
          
        );
    }
    fetchPlaylistbyId();
  }, []);

  const [favoriteId, setFavorite] = useState([]);
  useEffect(() =>{
    const fetchFavoritebyId =async () => {
      const user_id = localStorage.getItem("pk");
      let response = await axios.get(`${BASE_URL}/api/favorite?user_id=${user_id}`);
        console.log(`${BASE_URL}/api/favorite?user_id=${user_id}`);
      let favorites = response.data;
        setFavorite(
          favorites.map((favorite) => {
            return {
              id : favorite.id,
              user: favorite.user,
              name: favorite.name,
              cover:favorite.cover,
              songs: favorite.songs,
            };
         }),
          
        );
    }
    fetchFavoritebyId();
  }, []);
  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
     setIsLoged(false);
    }
    else setIsLoged(true);
  }, []);
  

  //get genres from api
  useEffect(() => {
    const fetchGenres = async() => {
      try {
        let response = await axios.get(`${BASE_URL}/api/genres/`);
        let genres = response.data;
        console.log("Genres: ");
        console.log(genres);
        setGenres(genres);
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchGenres();
    console.log("Genres: ");
    console.log(genres);
  },[]);


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


  useEffect(() => {
    setAudioList(apiAudioList.slice(0, 8));
  }, [apiAudioList, apiAudioListCopy]);

  function playMusic(song) {
    const addRecentPlay = async ()=>{
      let formData = new FormData();
      formData.append("user_id", userId);
      formData.append("song_id", song.id);
      let res = await axios.post(`${BASE_URL}/api/recently_played/`,formData);
      console.log(res);
    }
    audioInstance.clear();
    // addRecentPlay();
    setTimeout(() => {
      // setCurrAudio([...currAudio,song]);
      setCurrAudio([song]);
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
          <div className="w-15 text-center pt-5 position" id="menu">
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
              {/* check login */}
              {
                (isLog)? (
                  <>
                       <NavLink to="/favorite/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-heart"></i>
                    </span>{" "}
                    Favorite
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
              <div className="" >
                  <a href="#addPlaylist" data-toggle="modal" class="button-64" role="button"><span class="text">New Playlist</span></a>   
                </div>
                  </>
                ):
                (
                  <></>
                )
              }
              <div onClick={() => logout()}>
                <div>{localStorage.getItem("token") && "Logout"}</div>
              </div>
            </nav>

            <div id="info">
              <span>
                <i className="far fa-copyright"></i>
              </span>{" "}
              Team Moodify
            </div>
          </div>
          <div id="addPlaylist" class="modal fade">
                    <div class="modal-dialog">
                      <div class="modal-content">
                      <form  onSubmit={(e) => postPlaylist(e)}>
                      <div class="modal-header">						
                              <h4 class="modal-title">Create Playlist</h4>
                              <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div class="modal-body">					
                              <div class="form-group">
                                <p>Your New Playlist Name</p>
                                <input type="text" id= "name" name="name" class="form-control" value={dataPlay['name']} onChange={(e) => handleChange(e)} required/>	
                              </div>
                              <div class="form-group">
                                <label>Cover</label>
                                <input type="file" id ="cover" name="cover" accept="image/*" onChange={(e) => onImageChange(e)} />
                            </div>
                      </div>
                      <div class="modal-footer">
                              <input type="submit" class="btn btn-success" value="Create Playlist" />
                      </div>
                    </form>
                      </div>
                    </div>
                  </div>  

          <Route path="/" exact>
            <MainApp
              userId={userId}
              genres={genres}
              isLog={isLog}
              audioList={audioList}
              apiAudioList={apiAudioList}
              prev={prev}
              next={next}
              playMusic={playMusic}
              playlist={playlistid}
              // Webcam={Webcam}
              // fetchMusic={fetchMusic}
            />
          </Route>
          <Route path="/allsongs" exact>
            <AllSongs
              audioList={audioList}
              apiAudioList={apiAudioList}
              playMusic={playMusic}
              userId={userId}
            />
          </Route>
          <Route path="/favorite" >
            <Favorite
             audioList={audioList}
             apiAudioList={apiAudioList}
             playMusic={playMusic}
             userId={userId}
             favoriteId={favoriteId}
            />
          </Route>
          <Route path="/mymusic" exact>
            <MyMusic
            userId={userId}
            audioList={audioList}
            genreList={genres}
            apiAudioList={apiAudioList}
            playMusic={playMusic}
            user_id={userId}
            />
          </Route>
          <Route path="/playlist" >
            <Playlist
            audioList={audioList}
            apiAudioList={apiAudioList}
            playMusic={playMusic}
            userId={userId}
            playlistid={playlistid}
            />
          </Route>
          <Route path="/detailplaylist">
             <DetailPlaylist
                userId={userId}
                playlistid={playlistid}
                playMusic={playMusic}
             />
          </Route>

          <Route path="/signup" exact>
            <SignupForm />
          </Route>

          <Route path="/login" exact>
            <LoginForm setUserId={setUserId}/>
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
