import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "./App";

function MyMusic({
  mood,
  webCamera,
  audioList,
  genreList,
  apiAudioList,
  prev,
  next,
  playMusic,
  // Webcam,
  // fetchMusic,
}) {
  const [username, setUsername] = useState("username");
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     window.location.pathname = "/login";
  //   } else {
  //     setUsername(localStorage.getItem("username"));
  //   }
  // }, []);

  const postSong = async (song) => {
    try{
      let form = document.getElementById('addEmployeeModal');
      let song = {
        title: form.elements.title.value,
        artist: form.elements.artist.value,
        year: form.elements.year.value,
        cover: form.elements.cover.value,
        song_file: form.elements.songfile.value,
      }
      let response = axios.post(BASE_URL + "/api/songs/", song)
      .then ((res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      });
      console.log(response);
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

        {/* song squares */}
        <div className="dis">
            <h2 className="mt-5 mb-3">My music</h2>
            <a href="#addEmployeeModal" data-toggle="modal" class="button-63 mt-5 mb-3" role="button"><span class="text">Add Song</span></a>
          </div> 

           <div id="addEmployeeModal" class="modal fade">
                    <div class="modal-dialog">
                      <div class="modal-content">
                      <form>
                     <div class="modal-header">						
                            <h4 class="modal-title">Add Song</h4>
                            <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                            <div class="form-group">
                              <label>Title</label>
                              <input type="text" id="title" class="form-control" required/>
                            </div>
                            <div class="form-group">
                              <label>Artist</label>
                              <input type="text" id="artist" class="form-control" required/>
                            </div>
                            <div class="form-group">
                              <label>Cover</label>
                              <input type="file" id="cover" name="cover" accept="image/*"/>
                            </div>
                            <div class="form-group">
                              <label>Song file</label>
                              <input type="file" id="songfile" name="songfile" accept=".mp3" required/>
                            </div>		
                            	
                    </div>
                    <div class="modal-footer">
                            <input type="submit" class="btn btn-success" value="Add" onSubmit={postSong()}/>
                    </div>
                   </form>
                      </div>
                    </div>
                  </div>  
        <div className=" mt-3 w-100 justify-content-between align-items-center">
        {
             
             audioList.map((song) => {
               return (
                 console.log(song),
                 <div
                   key={song.id}
                   className="nav-btn1"
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
                    
                   <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i className="fas fa-edit mg" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
						      	<a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i className="fas fa-trash mg" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
						       
                   {/* Edit Modal HTML */}
                    <div id="editEmployeeModal" class="modal fade">
                    <div class="modal-dialog">
                      <div class="modal-content">
                      <form>
                     <div class="modal-header">						
                            <h4 class="modal-title">Edit Song</h4>
                            <button  class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                            <div class="form-group">
                              <label>Title</label>
                              <input type="text" class="form-control" required/>
                            </div>
                            <div class="form-group">
                              <label>Artist</label>
                              <input type="text" class="form-control" required/>
                            </div>
                            <div class="form-group">
                              <label>Cover</label>
                              <input type="file" id="img" name="img" accept="image/*"/>
                            </div>
                            <div class="form-group">
                              <label>Song file</label>
                              <input type="text" class="form-control" required/>
                            </div>		
                            	
                    </div>
                    <div class="modal-footer">
                            <input type="submit" class="btn btn-success" value="Add"/>
                    </div>
                   </form>
                      </div>
                    </div>
                  </div>  
                   {/* Delete Modal HTML */}
                    <div id="deleteEmployeeModal" class="modal fade">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <form>
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
