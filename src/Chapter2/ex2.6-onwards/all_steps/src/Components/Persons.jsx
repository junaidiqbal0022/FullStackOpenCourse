import ButtonDelete from "./ButtonDelete";
const Persons = ({ persons, searchTerm, deletePerson }) => {
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
        <div key={person.id} style={{ display: "flex", gap: "10px" }}>
          <div>
            {person.name}: {person.number}
          </div>
          <ButtonDelete
            id={person.id}
            name={person.name}
            deletePerson={deletePerson}
          />
        </div>
      ))}
    </>
  );
};
export default Persons;
