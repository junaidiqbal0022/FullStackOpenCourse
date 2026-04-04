import { useState } from "react";
import Button from "./Button";
import OneCountries from "./OneCountries";

const Countries = (props) => {
  const [oneCountry, setoneCountry] = useState();
  const onShow = (country) => {
    setoneCountry(country);
  };
  console.log("rendering Countries component with props", props);
  return (
    <>
      <ul>
        {props.countries.map((country) => (
          <li
            key={country.name.common}
            style={{ display: "flex", alignItems: "left", marginBottom: 2 }}
          >
            {country.name.common}
            <Button country={oneCountry} onShow={() => onShow(country)} />
          </li>
        ))}
      </ul>
      {oneCountry && <OneCountries country={oneCountry} />}
    </>
  );
};
export default Countries;
