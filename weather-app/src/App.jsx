import { useEffect, useState } from 'react'
import { Audio, ColorRing } from 'react-loader-spinner'
import './App.css';

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

    if (cityName === '') {
      alert('Please enter a city name');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8736bbf85779c81a55c919d5ebf02625`);
      const data = await response.json();
      console.log("data ----", data);

      const lat = data.coord.lat
      const lon = data.coord.lon
      console.log("lat ----", lat);
      console.log("lon ----", lon);

      if (data?.cod == 404) {
        alert(`${data?.message}`);
        return
      };

      setStoreData(data);
      setCityName("");

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=58be6fee7bd7c8756dbcc65a94860f02`);
      console.log("forecastResponse ---------", forecastResponse);

      const forecastJson = await forecastResponse.json();
      console.log("fourDays ---------", forecastJson);


      // if (forecastJson?.cod === "404") {
      //   alert(`${forecastJson?.message}`);
      //   return;
      // }
      // const forecastForNextFourDays = forecastJson.list.slice(0, 6);
      // console.log("forecastForNextFourDays=-----", forecastForNextFourDays);
      // setWeeklyData(forecastForNextFourDays)

      // const currentday = new Date(forecastForNextFourDays[0].dt_txt);
      // setCurrentDays(days[currentday.getDay()]);

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
  // }



  return (
    <>
      <div className="container" id="wrapper">
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
                <h5>
                  <spam id="cityName" /> {getday},{monthName} {getdate}, {getYear} <spam id="cityCode" />
                </h5>
                <h6 id="localDate" />
                {/* <h5 id="localTime"> {currentTime.toLocaleTimeString()} </h5> */}
              </div>
              {/* Center panel */}
              <div className="col-md-5 col-sm-7">
                <div className="center">

                  <div className='cloud_images'>
                    {storeData?.main?.temp - 273.15 < 25 ? (<img className='cloud_image_02' src="/images/cloudy.png" alt="" />) : storeData?.main?.temp - 273.15 > 25 ? (<img className='cloud_image_02' src="/images/sun.png" alt="" />) : ("")}
                  </div>

                  <div className='temprature'>
                    <p style={{ fontSize: "1.5rem" }}> {storeData?.main?.temp !== undefined ? (storeData.main.temp - 273.15).toFixed(1) : 0} °C  </p>
                  </div>
                </div>
                <div className='temp_type'>  <h3> {storeData?.weather !== undefined ? (storeData.weather[0].main) : ""}</h3>  </div>
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

        {/* 6 days forecast  */}
        {/* {weeklyData.map((ele, index) => {
          return (
            <div> `CURRENT DAY`${currentDays} </div>
          )
        })} */}

      </div>
    </>
  )
}

export default App
