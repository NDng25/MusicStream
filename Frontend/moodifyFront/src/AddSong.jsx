import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";

const onClick = () => {
    console.log("clicked");
}

function AddSong({
    userid,
    genreList,
    }
){

    // const [selectedGenre, setSelectedGenre] = useState("");

    return (
        <>
        {/* songs */}
        <div className="p-5 w-85 mar_left">
            {/* Search box */}
            <div className=" d-flex">
            <div className="log" onClick="">
                <h2 className="mb-3">Upload</h2>
            </div>
            </div>
            <form className="d-flex flex-column align-items-center">
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Song Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter song name" />
                    <label htmlFor="exampleInputEmail1">Artist</label>
                    <input type="text" className="form-control" id="artist" placeholder="Artist name" />
                    <label htmlFor="exampleInputEmail1">Year</label>
                    <input type="text" className="form-control" id="year" placeholder="Release year" />
                    <label htmlFor="exampleInputEmail1">Year</label>
                    <input type="text" className="form-control" id="year" placeholder="Release year" />
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Dropdown Button
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {
                                genreList.map((genre) => {
                                    return (
                                        <Dropdown.Item onClick={onClick} >{genre.name}</Dropdown.Item>
                                    );
                                }
                                )
                            }
                            
                            
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </form>
         
        </div>
        </>
    );
    }

    export default AddSong;