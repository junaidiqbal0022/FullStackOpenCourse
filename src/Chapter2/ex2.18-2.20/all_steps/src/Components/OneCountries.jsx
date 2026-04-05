import { useEffect, useState } from "react";
import { getWeather } from "../services/CountriesApi";
const OneCountries = ({ country, setError }) => {
  const [weather, setWeather] = useState("");
  const [capital, setCapital] = useState("");
  const [icon, setIcon] = useState("");
  useEffect(() => {
    if (!country?.capital) {
      setError("Capital Not Found");
      return;
    }
    setWeather("");
    setCapital(country.capital[0]);

    if (!country?.capitalInfo) {
      //console.log("capital not found in ", country);
      return;
    }
    //console.log("caitalinfo", country.capitalInfo);
    if (!country.capitalInfo || !country.capitalInfo.latlng) {
      setError("Country's Capital's Latitude and longitude not found");
      return;
    }
    var latLng = country.capitalInfo.latlng;
    getWeather(latLng[0], latLng[1])
      .then((res) => {
        if (!res) {
          setError("Weather Details Not Found");
          return;
        }
        setWeather(res);
        //console.log("Weather", res);
      })
      .catch((error) => {
        setError(`Error: ${error}`);
      });
  }, [country]);
  useEffect(() => {
    setIcon("");
    if (!weather || !weather.weather) {
      return;
    }
    const iconBase = "https://openweathermap.org/payload/api/media/file";
    var url = `${iconBase}/${weather.weather[0].icon}.png`;
    setIcon(url);
  }, [weather]);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>region {country.region}</p>
      <p>Area {country.area}</p>
      <p>Border: {country.borders?.join(", ") || "None"}</p>
      <p>population {country.population}</p>
      <h1>Languages</h1>
      <ul
        style={{
          listStyleType: "none",
          alignItems: "flex-start",
          paddingLeft: 0,
        }}
      >
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <h1 style={{ marginBottom: 20 }}>Flag</h1>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
      {capital ? (
        <>
          <h1>Weather in {capital}</h1>
          {weather && (
            <>
              <h4>Temperature {weather.main.temp} celcius.</h4>
              {icon && <img src={icon} alt={`Weather of ${capital}`} />}
              <p>Wind {weather.wind.speed} m/s.</p>
            </>
          )}
        </>
      ) : (
        <p>capital not located to get weather info...</p>
      )}{" "}
    </div>
  );
};
export default OneCountries;
