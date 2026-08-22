import "./ErrorMessage.css";

function ErrorMessage({ error }) {
  if (!error) return null;
  return <p className="form-error error-message">{error}</p>;
}

export default ErrorMessage;