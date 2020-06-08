export default function formatValidationErrors(e) {
  const errorObj = {errors: []};

  for (let error in e.errors) {
    const {path, message} = e.errors[error];
    errorObj.errors.push({[path]: message});
  }

  return errors;
}
