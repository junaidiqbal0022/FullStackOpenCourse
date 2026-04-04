const ButtonDelete = ({ id, name, deletePerson }) => {
  return <button onClick={() => deletePerson(id, name)}>Delete</button>;
};

export default ButtonDelete;
