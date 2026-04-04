import { useState, useEffect } from "react";
import Persons from "./Components/Persons";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import { getAll, create, update, deleteId } from "./services/persons";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    console.log("effect");
    getAll()
      .then((response) => {
        console.log("promise fulfilled");
        setPersons(response);
      })
      .catch((error) => {
        console.log("error is", error);
        alert("failed to fetch data from server");
      });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    //prevent default doesn't catch empty?
    if (!newName || !newPhone) {
      alert("name and phone number cannot be empty");
      return;
    }
    const personObject = {
      name: newName,
      number: newPhone,
      id: persons.length + 1,
    };
    1;
    var existingPerson = persons.find((p) => p.name === personObject.name);
    if (
      existingPerson &&
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      )
    ) {
      update(existingPerson.id, personObject)
        .then((response) => {
          setPersons(
            persons.map((p) => (p.id !== existingPerson.id ? p : response)),
          );
          setNewName("");
          setNewPhone("");
        })
        .catch((error) => {
          console.log("error is", error);
          alert(`failed to update ${newName} in server`);
        });
      return;
    } else if (existingPerson) {
      console.log("update cancelled by user");
      return;
    }

    // this is a very naive validation, just playing
    if (personObject.number.includes("a")) {
      alert(`${newPhone} is not a valid phone number`);
      return;
    }
    console.log("personObject is", personObject);
    create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewPhone("");
      })
      .catch((error) => {
        console.log("error is", error);
        alert("failed to add person to server");
      });
  };
  const onChangeName = (event) => {
    //  console.log("name is", event.target.value);
    setNewName(event.target.value);
  };
  const onPhoneChange = (event) => {
    //console.log("phone is", event.target.value);
    setNewPhone(event.target.value);
  };
  const handleDeletePerson = (id, name) => {
    console.log("delete person with id", id);
    if (!window.confirm(`Delete ${name} ?`)) {
      console.log("deletion cancelled by user");
      return;
    }
    console.log("deletion confirmed by user");
    deleteId(id)
      .then((response) => {
        console.log("delete response is", response);
        setPersons(persons.filter((p) => p.id !== id));
      })
      .catch((error) => {
        console.log("error is", error);
        alert(`failed to delete ${name} from server`);
      });
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
      <Persons
        persons={persons}
        searchTerm={searchTerm}
        deletePerson={(id, name) => handleDeletePerson(id, name)}
      />
    </div>
  );
};

export default App;
