import { useState } from "react";
import { getAllCountries } from "./services/CountriesApi";
import Filter from "./Components/Filter";
import Countries from "./Components/Countries";
import Error from "./Components/Error";
import OneCountries from "./Components/OneCountries";
import { useEffect } from "react";

function App() {
  const [displayCountries, setDisplayCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const seterrorMessageWithTimeout = (message) => {
    console.log("setting error message to", message);
    setErrorMessage(message);
    const timeout = 5000;
    setTimeout(() => {
      setErrorMessage("");
    }, timeout);
  };
  useEffect(() => {
    getAllCountries()
      .then((response) => {
        if (!response || response.length === 0) {
          setCountries([]);
          seterrorMessageWithTimeout("no countries found");
          return;
        }
        setCountries(response);
      })
      .catch((error) => {
        setCountries([]);
        console.log("error fetching country data", error);
        seterrorMessageWithTimeout(error, setErrorMessage);
      });
  }, []);
  useEffect(() => {
    if (!searchTerm) {
      return;
    }
    //console.log("filtering countries with search term", searchTerm);
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (filteredCountries.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayCountries([]);
      return;
    }
    setDisplayCountries(filteredCountries);
    //  console.log("filtered countries", filteredCountries);
  }, [countries, searchTerm]);
  return (
    <div style={{ margin: "10px", padding: "10px" }}>
      <h1>Country Search</h1>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Error errorMessage={errorMessage} />
      {displayCountries.length == 0 ? (
        <p style={{ color: "red" }}>No countries found.</p>
      ) : displayCountries.length > 10 ? (
        <p style={{ color: "orange" }}>
          Too many matches, please be more specific.
        </p>
      ) : displayCountries.length == 1 ? (
        <>
          {/* {console.log("displaying country", displayCountries[0])} */}
          <OneCountries country={displayCountries[0]} />
        </>
      ) : (
        <>
          {/* {console.log("displaying countries", displayCountries)} */}
          <Countries countries={displayCountries} />
        </>
      )}
    </div>
  );
}

export default App;
