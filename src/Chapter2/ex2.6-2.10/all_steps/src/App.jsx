import { useState } from "react";
import Persons from "./Components/Persons";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
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
    // this is a very naive validation, just playing
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
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>add a new</h1>
      <PersonForm
        onSubmit={onSubmit}
        onChangeName={onChangeName}
        onPhoneChange={onPhoneChange}
        newName={newName}
        newPhone={newPhone}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} searchTerm={searchTerm} />
    </div>
  );
};

export default App;
