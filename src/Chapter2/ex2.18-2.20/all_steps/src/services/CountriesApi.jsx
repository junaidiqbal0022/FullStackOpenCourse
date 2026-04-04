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
export { getCountry, getAllCountries };
