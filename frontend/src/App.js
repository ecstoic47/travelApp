import { useEffect, useState } from 'react';
import './app.css';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import Axios from "./axios/axios";
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
// import { Button } from '@material-ui/core';

function App() {
  const myStorage = window.localStorage;
  const [currentUserName, setCurrentUserName] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 54.5260,
    longitude: 15.2551,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {

      try {
        const res = await Axios.get("/pins/");
        setPins(res.data);
      }

      catch (err) {
        console.log(err);
      }

    }
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lon) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lon });
  };

  const handleAddClick = (e) => {
    const [lon, lat] = e.lngLat;
    setNewPlace({
      lat,
      lon
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUserName,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      lon: newPlace.lon
    }

    try {
      const res = await Axios.post("/pins/", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      //window.location.reload();
    }
    catch (err) {
      console.log(err);
    }

  };

  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUserName(null);
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >

        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.lon}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}>
              <Room style={{ fontSize: viewport.zoom * 7, color: p.username === currentUserName ? "tomato" : "slateblue", cursor: "pointer" }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lon)}
              />
            </Marker>

            {p._id === currentPlaceId &&
              <Popup onClose={() => setCurrentPlaceId(null)}
                latitude={p.lat}
                longitude={p.lon}
                closeButton={true}
                closeOnClick={false}
                anchor="left" >
                <div className="card">
                  <label >Place</label>
                  <h4>{p.title}</h4>
                  <label >Review</label>
                  <p>{p.desc}</p>
                  <label >Rating</label>
                  <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label >Information</label>
                  <span className="usrename">Created by <b>{p.username}</b>.</span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            }
          </>
        ))}

        {newPlace && (
          <Popup onClose={() => setNewPlace(null)}
            latitude={newPlace.lat}
            longitude={newPlace.lon}
            closeButton={true}
            closeOnClick={false}
            anchor="left" >
            <div>
              <form onSubmit={handleSubmit} >
                <label>Title</label>
                <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Say us something about this place" onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}

        {currentUserName ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)} >
              Log in
            </button>
            <button
                className="button register" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>
        )}

        {
          showLogin && 
          <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUserName={setCurrentUserName} />
        }
        {showRegister && 
          <Register setShowRegister = {setShowRegister}/>
        }
          
      </ReactMapGL>
    </div>
  );
}

export default App;
