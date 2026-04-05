const Button = ({ country, onShow }) => {
  //console.log("rendering Button component with country", country);
  return (
    <button style={{ marginLeft: 10 }} onClick={onShow}>
      show
    </button>
  );
};
export default Button;
