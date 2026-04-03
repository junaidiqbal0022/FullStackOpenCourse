const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <input
        id="filter_name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </>
  );
};

export default Filter;
