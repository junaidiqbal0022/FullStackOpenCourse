export const Display = ({ values }) => {
  return (
    <>
      <table style={{ border: "1px solid black" }}>
        <header>
          <tr>
            <th>text</th>
            <th>value</th>
            <th>percentage</th>
          </tr>
        </header>
        <tbody>
          {values.map((item) => (
            <tr key={item.text}>
              <td>{item.text}</td>
              <td>{item.value}</td>
              <td>{item.percentage ? "%" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
