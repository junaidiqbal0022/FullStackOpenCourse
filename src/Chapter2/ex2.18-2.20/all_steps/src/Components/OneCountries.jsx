const OneCountries = ({ country }) => {
  console.log("rendering OneCountries component with country", country);
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
    </div>
  );
};
export default OneCountries;
