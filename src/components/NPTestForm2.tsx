import { Field } from 'formik';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';

interface NPTestForm2Props {
  disabled?: boolean;
}

export const NPTestForm2: React.FC<NPTestForm2Props> = ({ disabled = false }) => {
  return (
    <FormGroup>
      <Label for="lastName">Фамилия</Label>
      <Field name="lastName">
        {({ field, meta }: any) => (
          <>
            <Input
              {...field}
              type="text"
              id="lastName"
              disabled={disabled}
              invalid={meta.touched && !!meta.error}
            />
            {meta.touched && meta.error && (
              <FormFeedback>{meta.error}</FormFeedback>
            )}
          </>
        )}
      </Field>
    </FormGroup>
  );
};
