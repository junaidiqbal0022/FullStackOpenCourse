const Countries = (props) => {
  console.log("rendering Countries component with props", props);
  return (
    <ul>
      {props.countries.map((country) => (
        <li
          key={country.name.common}
          style={{ display: "flex", alignItems: "left", marginBottom: 2 }}
        >
          {country.name.common}
        </li>
      ))}
    </ul>
  );
};
export default Countries;
