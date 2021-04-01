import React, { useState, useEffect } from "react";
import API from "../../utils/API"

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { formatRelative} from "date-fns";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxIput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox"

import Search from "../../components/Search"
import Locate from "../../components/Locate";

const libraries = ["places"]
const mapContainerStyle = {
  width: "100vh",
  height: "100vh",
}

const center = {
  lat: 30.2672 ,
  lng: -97.7431
}

const options = {
  disableDefaultUI: true ,
  zoomControl : true
}

function Map() {
  
  const {isLoaded,loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries
  })


  const [markers, setMarkers ] = useState([]);
  const [selected, setSelected] = useState(null);
  const [info,setInfo] = useState(null);
  const [amenities,setAmenities] = useState(null);

  function setAmenity(data){
    let array=[];
    if(info){
      if(info.handicapAccess){
        array.push("Handicap Accessible")
      };
      if(info.babyChangingTable){
        array.push("Baby Changing Table")
      };
      if(info.singlePersonBath){
        array.push("Single Person Bathroom")
      };
      if(info.feminineHygieneProducts){
        array.push("Feminine Hygiene Available")
      };
      if(info.public){
        array.push("Public Access")
      }
    }
    setAmenities(array.join(", "));
  }

  function loadMarkers(){
    API.getReviews()
      .then( res => {
        let markerArray=[]
        res.data.forEach(item => {
        let obj = {
          lat:item.lat,
          lng:item.lon,
          time: new Date()
        }
        markerArray.push(obj)
       })
        setMarkers(markerArray)
      }
      )
      .catch(error=>console.log(error))
  }

  function loadReviewInfo(id){
    API.getReview(id)
      .then(res=>
        {setInfo(res.data);
        setAmenities(res.data.review)}
        )
      .catch(error=>console.log(error))
  }

  useEffect(()=>{
    loadMarkers()
  },[])

  const onMapClick = React.useCallback ((event)=> {
    setMarkers ( (current) => [
      ...current, {
        lat: event.latLng.lat() ,
      lng: event.latLng.lng() ,
      time: new Date()
      },
    ])
  },[])

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map)=> {
    mapRef.current = map
  }, [])

  const panTo = React.useCallback(({lat,lng})=> {
    mapRef.current.panTo({lat,lng});
    mapRef.current.setZoom(14)
  },[])

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps"

  return (
    <div>
      {/* <h2>WePoo</h2> */}
        <Locate panTo = {panTo}/>
        <Search panTo = {panTo}/>
        <GoogleMap
          mapContainerStyle = {mapContainerStyle}
          zoom = {14}
          center = {center}
          options = {options}
          onClick = {onMapClick}
          onLoad={onMapLoad}
        >
          {markers.map((marker) =>( 
            <Marker 
            key={marker.time.toISOString()} 
            position={{lat: marker.lat, lng : marker.lng}}
            onClick={()=> {
              setSelected(marker);
              let id = marker.lat.toString()+marker.lng.toString();
              loadReviewInfo(id)
            }}
            // icon={{
            //   url: "./toiletpaper.svg",
            //   scalredSize: new window.google.maps.Size(30,30),
            //   origin: new window.google.maps.Point(0,0),
            //   anchor: new window.google.maps.Point(15,15)
            // }}
            />
            ))}

            {selected ? (<InfoWindow
              position={{lat:selected.lat,lng:selected.lng}}
              onCloseClick={()=> {
                setSelected(null);
                setInfo(null);
                setAmenities(null)
              }}
            >
              <div>
                <h2>Place</h2>
                <p>Rating: </p>
                <p>Amenities:</p>
                <button>Leave A Review</button>
              </div>
              {/* <div>
                <h2>{info.id}</h2>
                <p>Rating: {info.review[0].rating}</p>
                <p>Amenities{amenities}</p>
                <button>Leave A Review</button>
              </div> */}
            </InfoWindow>): null}
        </GoogleMap>
    </div>
  );
}

export default Map;
