import { Formik, Form, Field } from 'formik';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FormFields from './FormFields';

const CodeForm = () => {

  const [submitting, setSubmitting] = useState(false);
  const [formatted, setFormatted] = useState("");

  const initialValues: FormFields = {
    code: "const foo = () => {\n\tconst bar = '';\n\t\treturn bar;\n}",
    indents: "tabs",
    size: "1",
  };

  const sendRequest = async (fields: FormFields) => {
    const response = await fetch('/api/indent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields)});
    return response.json();
  }

  const onSubmit = async (fields: FormFields) => {
    setSubmitting(true);
    console.log(fields);
    sendRequest(fields).then(data => setFormatted(data.code));
    setSubmitting(false);
  }

  const validate = (fields: FormFields) => {
    if (!fields.code) {
      return { code: 'Must submit code' };
    } 
    else if (isNaN(Number(fields.size))) {
      return { size: 'Size must be a number' };
    }
    return {};
  }

  useEffect(() => {
    console.log(formatted);
  }, [formatted]);

  return (
    <Container className="mt-3">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: FormFields) => onSubmit(values)}
        validate={(values) => validate(values)}
      >
        <Form>
          <div className="form-group">
            <label className="form-label">Code:</label>
            <Field className="form-control" as="textarea" name="code" type="text" rows={8} />
          </div>
          <div className="form-group">
            <Field className="form-control" as="select" name="indents">
              <option value="tabs">Tabs</option>
              <option value="spaces">Spaces</option>
            </Field>
          </div>
          <div className="form-group" >
            <Field className="form-control" type="text" name="size" placeholder="Size of indent" />
          </div>
          <div className="form-group">
            <Button type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Formik>
      <pre className="pre-scrollable" style={{color: "white"}}><code>
        {formatted}
      </code></pre>
    </Container>
  );
};

export default CodeForm;
