import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getCountry = async (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  var res = await request;
  return res.data;
};
const getAllCountries = async () => {
  const request = axios.get(`${baseUrl}/all`);
  var res = await request;
  return res.data;
};

const weatherBaseurl = "https://api.openweathermap.org/data/2.5/weather?";
const getWeather = async (lat, lon) => {
  var url = `${weatherBaseurl}lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
  const req = axios.get(url);
  const res = await req;
  return res.data;
};

export { getCountry, getAllCountries, getWeather };
