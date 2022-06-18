import axios from "axios";
import { useEffect, useState } from "react";

function MainApp({
  mood,
  webCamera,
  audioList,
  apiAudioList,
  prev,
  next,
  playMusic,
  // Webcam,
  // fetchMusic,
}) {
  const tmp_id = 1;

  const [username, setUsername] = useState("username");
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     window.location.pathname = "/login";
  //   } else {
  //     setUsername(localStorage.getItem("username"));
  //   }
  // }, []);
  // fetch songs from api
  // const [songList, setSongList] = useState([]);
  
  // useEffect(() => {
  //   try{
  //     let response = axios.get("http//127.0.0.1:8000/api/songs/");
  //     setSongList(response.data);
  //     console.log('useEffect called');
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
    
  // }, []);
  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div className=" dflex">
          <input className="w80pt" type="search" placeholder="Search Music (in progress)" />
          <div className="log" onClick="">
            <h2 className="mb-3">Logout</h2>
          </div>
        </div>

        {/* song squares */}
        <h2 className="mt-5 mb-3">Hi <span className="text-primary" id="username">{username}</span>, listen to {mood} songs</h2>
        <div className="d-flex mt-3 w-100 justify-content-between align-items-center">
          <div className="circle" onClick={() => prev()}>
            <i className="fas fa-arrow-left"></i>
          </div>
          {
              // print songs
              // audioList.map((song, index) => {
              //   return (
              //     <div
              //       key={index}
              //       className="song-square"
              //       onClick={() => playMusic(song.id)}
              //     >
              //       <div className="song-square-img">
              //         <img src={song.image} alt="song" />
              //       </div>
              //       <div className="song-square-info">
              //         <div className="song-square-title">{song.title}</div>
              //         <div className="song-square-artist">{song.artist}</div>
              //       </div>
              //     </div>
              //   );
              audioList.map((song) => {
                return (
                  console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn"
                    onClick={() => playMusic(song)}
                  >
                    <div>
                      <img src={song.cover} className="mw-100" alt="song-cover" />
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

       { /* Trending Songs  */ }
        <div >
        <h2 className="mt-5 mb-3">Trending Songs</h2>
        </div>
        <div  className="d-flex mt-3 w-100 justify-content-between align-items-center">
        <div className="circle" onClick={() => prev()}>
            <i className="fas fa-arrow-left"></i>
          </div>
        {
        audioList.map((song) => {
                return (
                  console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn"
                    onClick={() => playMusic(song)}
                  >
                    <div>
                      <img src={song.cover} className="mw-100" alt="song-cover" />
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
        { /* Other Hits */ }
        <div >
        <h2 className="mt-5 mb-3">Other Hits</h2>
        </div>
        <div  className="d-flex mt-3 w-100 justify-content-between align-items-center">
        <div className="circle" onClick={() => prev()}>
            <i className="fas fa-arrow-left"></i>
          </div>
        {
        audioList.map((song) => {
                return (
                  console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn"
                    onClick={() => playMusic(song)}
                  >
                    <div>
                      <img src={song.cover} className="mw-100" alt="song-cover" />
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
        
        {/* webcam and list */}
        {/* <h2 className="mt-5">Songs based on your mood</h2> */}
        {/* <div className="d-flex justify-content-between mt-3 w-100"> */}
          {/* list */}
          {/* <div className="list">
            {apiAudioList.map((song) => {
              return (
                <div
                  key={song.id}
                  className="listing text-center py-2 font-weight-bold"
                  onClick={() => playMusic(song)}
                >
                  {song.name.slice(0, 35)}
                </div>
              );
            })}
          </div> */}

          {/* webcam
          <div id="cam-div">
            <Webcam className="webcam" ref={webCamera} mirrored={true} />
            <button onClick={() => fetchMusic()}>Moodify</button>
          </div> */}

          {/* mood indicator */}
          {/* <div
            id="mood-div"
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <p className="mb-3">You seem to be</p>
            <p className="font-weight-bold m-0">{mood}</p>
          </div> */}
        {/* </div> */}
      </div>
    </>
  );
}

export default MainApp;
