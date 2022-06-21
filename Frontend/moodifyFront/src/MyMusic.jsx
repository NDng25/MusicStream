import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "./App";
import {useHistory} from "react-router-dom";

function MyMusic({
  mood,
  webCamera,
  audioList,
  genreList,
  apiAudioList,
  prev,
  next,
  playMusic,
  user_id,
  // Webcam,
  // fetchMusic,
}) {

  const history = useHistory();

  const [tracks, setTracks] = useState([]);

  const [data, setData] = useState({
    title: "",
    artist: "",
    genre: [],
    year: new Date().getFullYear(),
    cover: null,
    song_file: null,
    user: user_id,
  });

  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get(`${BASE_URL}/api/songs?user=${user_id}`);
      let songs = res.data;
      setTracks(songs.map((song) => {
        return {
          id: song.id,
          name: song.title,
          musicSrc: song.song_file,
          artist:song.artist,
          cover: song.cover,
          year: song.year,
        };
      }));
    }
    fetchData();
  }, []);

  let postSong = async (e) => {
    //create form data from data object
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    try{
      let response = await axios.post(`${BASE_URL}/api/songs/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },});
      console.log(response.data);
      //close form
      console.log(formData);
      // history.push("/mymusic");
    }
    catch(err){
      console.log(err);
    }
  }

  const editSong = async (e, song) => {
    //e.preventDefault();
    //create form data from data object
    let formData = new FormData();
    data['year'] = song.year;
    for (let key in data) {
      formData.append(key, data[key]);
    }
    try{
      let response = await axios.put(`${BASE_URL}/api/songs/${song.id}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },})
      console.log(response);
      //close form
      e.target.reset();
      //reset data
      setData({
        title: "",
        artist: "",
        genre: [],
        year: new Date().getFullYear(),
        cover: '',
        song_file: '',
        user: user_id,
      });
      // history.push("/mymusic");
    }
    catch(err){
      console.log(err);
    }
  }

  const deleteSong = async (e, id) => {
    //e.preventDefault();
    try{
      let response = await axios.delete(`${BASE_URL}/api/songs/${id}/`);
      console.log(response);
      // history.push("/mymusic");
    }
    catch(err){
      console.log(err);
    }
  }

  const onImageChange = (e) => {
    const reader = new FileReader();
    let newData = {...data };
    if(e.target.files && e.target.files[0]){
      newData['cover'] = e.target.files[0];
    
    }
    
    setData(newData);
  }

  const onFileChange = (e) => {
    const reader = new FileReader();
    let newData = {...data };
    if(e.target.files && e.target.files[0]){
      newData['song_file'] = e.target.files[0];
      
    }
    
    setData(newData);
  }
  const handleChange = ({ currentTarget: input }) => {
    let newData = {...data };
    if(input.name === "genre"){
      newData['genre'] = [input.value];
    }
    else{
      newData[input.name] = input.value;
    }
    
    setData(newData);
};

const handleEdit = (song) => {
  setData({
    title: song.title,
    artist: song.artist,
    genre: song.genre,
    year: Date.parse(`01 Jan ${song.year} 00:00:00 GMT`).getFullYear,
    cover: '',
    song_file: '',
    user: user_id,
  });
}
 


  return (
    <>
      {/* songs */}
      <div className="p-5 w-85 mar_left">

        {/* song squares */}
        <div className="dis">
            <h2 className="mt-5 mb-3">My music</h2>
            <a href="#addEmployeeModal" data-toggle="modal" class="button-63 mt-5 mb-3" role="button"><span class="text">Add Song</span></a>
          </div> 
      
           <div id="addEmployeeModal" class="modal fade">
                    <div class="modal-dialog">
                      <div class="modal-content">
                      <form onSubmit={(e) => postSong(e)}>
                     <div class="modal-header">						
                            <h4 class="modal-title">Add Song</h4>
                            <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                            <div class="form-group">
                              <label>Title</label>
                              <input type="text" id="title" name="title" class="form-control" value={data['title']} onChange={(e) => handleChange(e)} required/>
                            </div>
                            <div class="form-group">
                              <label>Artist</label>
                              <input type="text" id="artist" name="artist" class="form-control" value={data['artist']} onChange={(e) => handleChange(e)} required/>
                            </div>
                            <div class="form-group">
                              <label>Genre</label>
                              <select id="genre" class="form-control" name="genre" value={data['genre']} onChange={(e) => handleChange(e)} required>
                                {genreList.map((genre) => {
                                  return (
                                    <option value={genre.id}>{genre.name}</option>
                                  );
                                }
                                )}
                              </select>
                            </div>
                            <div class="form-group">
                              <label>Cover</label>
                              <input type="file" id="cover" name="cover" accept="image/*" onChange={(e) => onImageChange(e)}/>
                            </div>
                            <div class="form-group">
                              <label>Song file</label>
                              <input type="file" id="songfile" name="song_file" accept=".mp3" onChange={(e) => onFileChange(e)} required/>
                            </div>		  	
                    </div>
                    <div class="modal-footer">
                            <input type="submit" class="btn btn-success" value="Add" />
                    </div>
                   </form>
                      </div>
                    </div>
                  </div>  
        <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             tracks.map((song) => {
               return (
                 console.log(song),
                 <div
                   key={song.id}
                   className="nav-btn2"
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
                    
                   <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i className="fas fa-edit mg" data-toggle="tooltip" title="Edit" onClick={() => handleEdit(song)} >&#xE254;</i></a>
						      	<a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i className="fas fa-trash mg" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
						       
                   {/* Edit Modal HTML */}
                    <div id="editEmployeeModal" class="modal fade">
                    <div class="modal-dialog">
                      <div class="modal-content">
                      <form onSubmit={(e) => editSong(e, song)}>
                     <div class="modal-header">						
                            <h4 class="modal-title">Edit Song</h4>
                            <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                    <div class="form-group">
                              <label>Title</label>
                              <input type="text" id="title" name="title" class="form-control" value={data['title']} onChange={(e) => handleChange(e)} required/>
                            </div>
                            <div class="form-group">
                              <label>Artist</label>
                              <input type="text" id="artist" name="artist" class="form-control" value={data['artist']} onChange={(e) => handleChange(e)} required/>
                            </div>
                            <div class="form-group">
                              <label>Genre</label>
                              <select id="genre" class="form-control" name="genre" value={data['genre']} onChange={(e) => handleChange(e)} required>
                                {genreList.map((genre) => {
                                  return (
                                    <option value={genre.id}>{genre.name}</option>
                                  );
                                }
                                )}
                              </select>
                            </div>
                            <div class="form-group">
                              <label>Cover</label>
                              <input type="file" id="cover" name="cover" accept="image/*" onChange={(e) => onImageChange(e)}/>
                            </div>
                            <div class="form-group">
                              <label>Song file</label>
                              <input type="file" id="songfile" name="song_file" accept=".mp3" onChange={(e) => onFileChange(e)}/>
                            </div>		  	
                    </div>
                    <div class="modal-footer">
                            <input type="submit" class="btn btn-success" value="Update"/>
                    </div>
                   </form>
                      </div>
                    </div>
                  </div>  
                   {/* Delete Modal HTML */}
                    <div id="deleteEmployeeModal" class="modal fade">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <form onSubmit={(e) => deleteSong(e, song.id)}>
                            <div class="modal-header">						
                              <h4 class="modal-title">Delete Song</h4>
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
                 
                  
                 </div>
                 
               );
             })
           }
         

      </div>
      </div>
    </>
  );
}

export default MyMusic;
