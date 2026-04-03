import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-123456", id: 1 },
    { name: "Ada Lovelace", phone: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", phone: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", phone: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      phone: newPhone,
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
    if (personObject.phone.includes("a")) {
      alert(`${newPhone} is not a valid phone number`);
      return;
    }
    console.log("personObject is", personObject);
    setPersons(persons.concat(personObject));
    setNewName("");
    setNewPhone("");
  };
  const onChangeName = (event) => {
    console.log("name is", event.target.value);
    setNewName(event.target.value);
  };
  const onPhoneChange = (event) => {
    console.log("phone is", event.target.value);
    setNewPhone(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <p>filter shown with</p>
      <input
        id="filter_name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h1>add a new</h1>
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
          phone:
          <input
            id="phone_field"
            value={newPhone}
            onChange={(e) => onPhoneChange(e)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
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
    </div>
  );
};

export default App;
