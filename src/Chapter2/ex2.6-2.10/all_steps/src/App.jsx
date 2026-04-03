import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas", id: 1 }]);
  const [newName, setNewName] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      id: persons.length + 1,
    };
    if (persons.some((p) => p.name === personObject.name)) {
      console.log(
        "personObject is {0}, while existing {1}",
        personObject,
        persons,
      );

      alert(`${newName} is already added to phonebook`);
      return;
    }
    console.log("personObject is", personObject);
    setPersons(persons.concat(personObject));
    setNewName("");
  };
  const onChangeName = (event) => {
    console.log("name is", event.target.value);
    setNewName(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={onSubmit}>
        <div>
          name:
          <input
            id="name_field"
            value={newName}
            onChange={(e) => onChangeName(e)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {/* <div>debug: {newName}</div> */}
      {persons.map((person) => (
        //can there be duplicated names?
        // if not, we can use name as key,
        // otherwise we need to generate a unique id for each person
        //<div key={person.name}>{person.name}</div>
        <div key={person.id}>{person.name}</div>
      ))}
    </div>
  );
};

export default App;
