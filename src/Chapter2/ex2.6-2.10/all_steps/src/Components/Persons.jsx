const Persons = ({ persons, searchTerm }) => {
  return (
    <>
      {/* <div>debug: {newName}</div> */}
      {(searchTerm
        ? persons.filter((person) =>
            person.name
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase()),
          )
        : persons
      ).map((person) => (
        //can there be duplicated names?
        // if not, we can use name as key,
        // otherwise we need to generate a unique id for each person
        //<div key={person.name}>{person.name}</div>
        <div key={person.id}>
          {person.name}: {person.phone}
        </div>
      ))}
    </>
  );
};
export default Persons;
