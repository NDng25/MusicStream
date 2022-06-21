import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "./App";

function AllSongs({
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
  const [searchField, setSearchField] = useState("");
  const [allSongs, setAllSongs] = useState(audioList);
  useEffect(() => {
    const fetchSearchSong = async (query) => {
      try{
        let response = await axios.get(`${BASE_URL}/api/songs?search_field=title&query=${query}`);
        console.log("fetch search song");
        let songs = response.data;
        setAllSongs([]);
        setAllSongs(songs.map(
          (song) => {
            return {
              id: song.id,
              name: song.title,
              musicSrc: song.song_file,
              artist:song.artist,
              cover: song.cover,
              year: song.year,
            }
          }
        ))  
      }
      catch(err){
        console.log(err);
      }
    }
    if(searchField.length > 0){
      fetchSearchSong(searchField);
    }
    else{
      setAllSongs(audioList);
    }
  }, [searchField]);

  function handleChange(e){
    setSearchField(e.target.value);
    console.log(e.target.value);
  }
  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">
        {/* Search box */}
        <div>
          <input type="search" placeholder="Search Music (in progress)" onChange={handleChange}/>
        </div>

        {/* song squares */}
        <h2 className="mt-5 mb-3">A total songs</h2>
        <div className=" mt-3 w-100 justify-content-between align-items-center">
       
          {
             
             allSongs.map((song) => {
                return (
                  console.log(song),
                  <div
                    key={song.id}
                    className="nav-btn1"
                    style={{height: "100px"}}
                    onClick={() => playMusic(song)}
                  >
                    <div>
                      <img src={song.cover} className="w80" alt="song-cover" />
                    </div>
                    <div  className="w300">
                      <p  className="w100 mg">{song.name.slice(0, 15)} </p>
                    </div>
                    <div  className="w300">
                      <p  className="w100 mg">{song.artist.slice(0, 15)} </p>
                    </div>
                    <div  className="w300">
                      <div id ="" className="mt-heart mg" >
                          <input id={song.id} type="checkbox"/> 
                          <label  for={song.id}></label> 
                      </div>
                    </div>
                    <div  className="w300">
                    <a claclassNamess="" onclick="" title="Add to Playlist"> <i
                            className="fas fa-ellipsis-h mg"></i>
                    </a>
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

export default AllSongs;
