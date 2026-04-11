import { useState, useEffect } from "react";
import Persons from "./Components/Persons";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import {
  getAll,
  create,
  update,
  deleteId,
  getByName,
} from "./services/persons";
import Error from "./Components/Error";
import Success from "./Components/Success";
import errorCodes from "./helpers/errorCodes";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const setSuccessMessageWithTimeout = (message) => {
    console.log("setting success message to", message);
    setSuccessMessage(message);
    setNewName("");
    setNewPhone("");
    setErrorMessage("");
    console.log("success message is", message);
    const timeout = 5000;
    setTimeout(() => {
      setSuccessMessage("");
    }, timeout);
  };
  const setErrorMessageWithTimeout = (message) => {
    console.log("setting error message to", message);
    setErrorMessage(message);
    setSuccessMessage("");
    const timeout = 5000;
    setTimeout(() => {
      setErrorMessage("");
    }, timeout);
  };

  useEffect(() => {
    console.log("effect");
    getAll()
      .then((response) => {
        console.log("promise fulfilled");
        setPersons(response);
      })
      .catch((error) => {
        setErrorMessageWithTimeout(
          `failed to fetch data from server ${error?.response?.data?.error}`,
        );
      });
  }, []);
  const updatePerson = (personObject) => {
    const existingPerson = persons.find((p) => p.name === personObject.name);

    if (
      existingPerson &&
      window.confirm(
        `${personObject.name} is already added to phonebook, replace the old number with a new one?`,
      )
    ) {
      update(existingPerson.id, personObject)
        .then((response) => {
          var personsCopy = persons.filter((p) => p.id !== existingPerson.id);
          setPersons([]);
          setPersons(personsCopy.concat(response));
          setSuccessMessageWithTimeout(
            `updated ${personObject.name} in server`,
          );
          return true;
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setErrorMessageWithTimeout(
              `Person ${personObject.name} was not found on server side. ${error?.response?.data?.error}`,
            );
            return true;
          }
          setErrorMessageWithTimeout(
            `failed to update ${personObject.name} in server ${error?.response?.data?.error}`,
          );
          return true;
        });
      return;
    } else if (existingPerson) {
      console.log("update cancelled by user");
      return true;
    }
    console.log("person does not exist, create flow should proceed");
    return false;
  };
  const createPerson = async (personObject) => {
    create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        console.log("person added successfully", response);
        setSuccessMessageWithTimeout(`added ${personObject.name} to server`);
        return;
      })
      .catch((error) => {
        console.log(
          `Error updating persons state after adding new person: ${error?.response?.data?.error}`,
        );

        if (
          error.response?.status === 409 &&
          error.response?.data?.errorCode == errorCodes.DuplicateEntry
        ) {
          console.log(
            `Duplicate entry error for ${personObject.name}, fetching existing data from server`,
          );
          setErrorMessageWithTimeout(
            `Person with name ${personObject.name} already exists on server. ${error?.response?.data?.error}`,
          );
          getByName(personObject.name)
            .then(async (response) => {
              if (!response) {
                setErrorMessageWithTimeout(
                  `Person with name ${personObject.name} not found on server after duplicate entry error. ${error?.response?.data?.error}`,
                );
                return;
              }

              setPersons((prev) => [
                ...prev.filter((p) => p.name !== response.name),
                response,
              ]);
              setErrorMessageWithTimeout(
                `Person with name ${personObject.name} already exists on server. Updated local data with server data. ${error?.response?.data?.error}`,
              );
              return;
            })
            .catch((error) => {
              console.log(`some issue: ${error.response.data.error}`);
              setErrorMessageWithTimeout(
                `Failed to fetch existing person data for ${personObject.name} from server. ${error?.response?.data?.error}`,
              );
            });
          return;
        } else {
          setErrorMessageWithTimeout(
            `failed to update local data ${error?.response?.data?.error}`,
          );
          return;
        }
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    //prevent default doesn't catch empty?
    if (!newName || !newPhone) {
      setErrorMessage("name and phone number cannot be empty");
      return;
    }
    const personObject = {
      name: newName,
      number: newPhone,
      id: persons.length + 1,
    };
    if (persons.some((p) => p.name === personObject.name)) {
      updatePerson(personObject);
      return;
    }
    // this is a very naive validation, just playing
    if (personObject.number.includes("a")) {
      setErrorMessage(`${newPhone} is not a valid phone number`);
      return;
    }
    console.log("personObject is", personObject);
    createPerson(personObject);
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
        setSuccessMessageWithTimeout(`deleted ${name} from server`);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setErrorMessageWithTimeout(
            `Person ${newName} was not found on server side. ${error?.response?.data?.error}`,
          );
          return;
        }
        setErrorMessageWithTimeout(
          `failed to delete ${name} from server ${error?.response?.data?.error}`,
        );
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <p>filter shown with</p>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1>add a new</h1>
      <Error errorMessage={errorMessage} />
      <Success successMessage={successMessage} />
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
