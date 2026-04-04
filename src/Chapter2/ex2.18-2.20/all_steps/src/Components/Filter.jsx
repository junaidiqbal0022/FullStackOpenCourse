const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <h4 style={{ display: "flex", gap: 5 }}>
        find countries
        <input
          id="filter_name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </h4>
    </>
  );
};

export default Filter;
