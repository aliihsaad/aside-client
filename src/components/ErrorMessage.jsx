function ErrorMessage({ error }) {
  if (!error) return null;
  return <p className="form-error">{error}</p>;
}

export default ErrorMessage;