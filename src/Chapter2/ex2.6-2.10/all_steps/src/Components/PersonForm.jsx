const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
        <div>
          name:
          <input
            id="name_field"
            value={props.newName}
            onChange={(e) => props.onChangeName(e)}
          />
        </div>
        <div>
          phone:
          <input
            id="phone_field"
            value={props.newPhone}
            onChange={(e) => props.onPhoneChange(e)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
