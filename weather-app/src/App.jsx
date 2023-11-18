import { useEffect, useState } from 'react'
import { Audio, ColorRing } from 'react-loader-spinner'
// import './App.css';
import './index.css'

function App() {
  const [cityName, setCityName] = useState('');
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentDays, setCurrentDays] = useState('')
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    geoLocation();
    // getLocalTime();
  }, []);


  const getTemprature = async () => {

    // document.getElementsByClassName("gmap")[0].style.display = "block";
    if (cityName === '') {
      alert('Please enter a city name');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8736bbf85779c81a55c919d5ebf02625`);
      const data = await response.json();
      console.log("city Data----", data);

      if (data?.cod === "404") {
        alert(`${data?.message}`);
        return
      };
      const lat = data.coord.lat
      const lon = data.coord.lon
      // console.log("lat ----", lat);
      // console.log("lon ----", lon);

      let iframe = document.getElementById("gmap_canvas");
      iframe.src = `https://maps.google.com/maps?q=${data?.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

      setStoreData(data);
      setCityName("");

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=700de9c24da762a4b9d5b7fba2e2a5fa`);
      // console.log("forecastResponse ---------", forecastResponse);

      const forecastJson = await forecastResponse.json();
      setWeeklyData(forecastJson.daily);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // console.log("storeDataa", storeData);

  function geoLocation() {
    navigator.geolocation.getCurrentPosition(success);

    function success(pos) {
      let location = pos.coords
      getlocationusingloctaion(location.latitude, location.longitude);
      // console.log("location ---", location);
      // console.log("Your current position is:");
      // console.log(`Latitude : ${location.latitude}`);
      // console.log(`Longitude: ${location.longitude}`);
      // console.log(`More or less ${location.accuracy} meters.`);
    }
  };


  function getlocationusingloctaion(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8736bbf85779c81a55c919d5ebf02625`;
    async function getInfo() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setStoreData(data);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=700de9c24da762a4b9d5b7fba2e2a5fa`);
        console.log("forecastResponse ---------", forecastResponse);
        const forecastJson = await forecastResponse.json();
        setWeeklyData(forecastJson.daily);

      } catch (error) {
        console.log(error);
      }
    }
    getInfo();
  };

  const abc = new Date();
  const getdate = abc.getDate();
  const getYear = abc.getFullYear();
  const getday = days[abc.getDay()];
  const monthName = month[abc.getMonth()];

  // const getLocalTime = () => {
  //   const time = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(time)
  // };
  // console.log("weeklyDataata ---", weeklyData);

  return (
    <>
      <div className="container" id="wrapper">
        <div className='location_content'>
          <div className="container-fluid" id="current-weather">
            <div className='mainDiv'>
              <div className='search_box'>
                <input type='text' placeholder='Enter Your City Name' onChange={(e) => setCityName(e.target.value)} value={cityName} />
                <button onClick={getTemprature}> Search </button>
              </div>
            </div>

            {loading ? (
              <div className='loader_container' style={{ textAlign: "center" }}>
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />
              </div>
            ) :
              <div className="row">
                {/* Right panel */}
                <div className="col-md-4 col-sm-5">
                  <h4>  {storeData?.name && storeData?.sys?.country !== undefined ? `${storeData.name}, ${storeData.sys.country}` : ''} </h4>
                  <h5 >
                    <spam id="cityName" /> {getday},{monthName} {getdate}, {getYear} <spam id="cityCode" />
                  </h5>
                  <h6 id="localDate" />
                  <h5 id="localTime"> {currentTime.toLocaleTimeString()} </h5>
                </div>
                {/* Center panel */}
                <div className="col-md-5 col-sm-7" >
                  <div className="center">
                    <div className='cloud_images'>
                      {storeData?.main?.temp - 273.15 < 25 ? (<img className='cloud_image_02' src="/images/cloudy.png" alt="" />) : storeData?.main?.temp - 273.15 > 25 ? (<img className='cloud_image_02' src="/images/sun.png" alt="" />) : ("")}
                    </div>
                    <div className='temprature'>
                      <p style={{ fontSize: "1.5rem" }}> {storeData?.main?.temp !== undefined ? (storeData.main.temp - 273.15).toFixed(1) : 0} °C  </p>
                      <div className='temp_type'>  <h3> {storeData?.weather !== undefined ? (storeData.weather[0].main) : ""}</h3>  </div>
                    </div>
                  </div>
                  <div className='feels_like' >
                    <h2> Feels Like </h2>
                    <h2> {storeData?.main?.feels_like !== undefined ? (storeData.main.feels_like - 273.15).toFixed(1) : 0} °C  </h2>
                  </div>
                </div>

                {/* Left panel */}
                <div className="col-xs-12 col-sm-12 col-md-3 row">
                  <div className="col-md-12 col-sm-3 col-xs-3 side-weather-info">
                    <h6>
                      Humidity: {storeData?.main?.humidity !== undefined ? storeData.main.humidity : 0} <spam id="humidity" />%
                    </h6>
                  </div>
                  <div className="col-md-12 col-sm-3 col-xs-3 side-weather-info">
                    <h6>
                      Wind: {storeData?.wind?.speed !== undefined ? storeData.wind.speed : 0}  <spam id="wind" /> m/s
                    </h6>
                  </div>
                  <div className="col-md-12 col-sm-3 col-xs-3 side-weather-info">
                    <h6>
                      High:{storeData?.main?.temp !== undefined ? (storeData.main.temp_max - 273.15).toFixed(1) : 0}  <spam id="mainTempHot" /> °C
                    </h6>
                  </div>
                  <div className="col-md-12 col-sm-3 col-xs-3 side-weather-info">
                    <h6>
                      Low:{storeData?.main?.temp !== undefined ? (storeData.main.temp_min - 273.15).toFixed(1) : 0} <spam id="mainTempLow" />°C
                    </h6>
                  </div>
                </div>
              </div>
            }
          </div>

        </div>

        {/* 6 days forecast  */}

        <div className="weekly-forecast-container">
          <div className='forecast_content'>
            {weeklyData.map((ele, index) => {
              // console.log("index", index);
              // console.log("ele",ele);

              if (index < weeklyData.length - 1) {
                var en = "en";
                let obj = { weekday: "long" }
                let getDate = new Date(ele.dt * 1000).toLocaleDateString()
                let getDay = new Date(ele.dt * 1000).toLocaleDateString(en, obj);
                return (
                  <div className='weekly-forecast-item' key={index}>
                    <div className='current-day'>
                      {getDay}
                    </div>
                    <div className='current-date'>
                      {getDate}
                    </div>
                    <div className='current-temp'>
                      <div className='day-temp'>
                        Day - {(ele.temp.day - 273.15).toFixed(1)} °C
                      </div>
                      <div className='night-temp'>
                        Night - {(ele.temp.night - 273.15).toFixed(1)} °C
                      </div>
                      <div className='forecast_image'>
                        {storeData?.main?.temp - 273.15 < 25 ? (<img className='forecast_image_02' src="/images/cloudy.png" alt="" />) : storeData?.main?.temp - 273.15 > 25 ? (<img className='forecast_image_02' src="/images/sun.png" alt="" />) : ("")}
                      </div>
                    </div>

                  </div>
                );
              }
            })}
          </div>
          <div className='gmap'>
            <div className="gmap_canvas">
              <iframe
                width={500}
                height={500}
                id="gmap_canvas"
                frameborder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              />
            </div>
            {/* <h2>sdjvjdsvb</h2> */}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
