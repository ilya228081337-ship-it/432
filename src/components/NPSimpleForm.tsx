import { useState, ReactElement, cloneElement } from 'react';
import { Formik, Form } from 'formik';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import { NPCancelButton } from './NPCancelButton';
import { NPSubmitButton } from './NPSubmitButton';

interface NPSimpleFormProps {
  isReadOnly?: boolean;
  isEdit?: boolean;
  initialValues: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  validationSchema?: any;
  title: string;
  children: ReactElement;
}

export const NPSimpleForm: React.FC<NPSimpleFormProps> = ({
  isReadOnly = false,
  isEdit = false,
  initialValues,
  onSubmit,
  onCancel,
  validationSchema,
  title,
  children,
}) => {
  const [editMode, setEditMode] = useState(isEdit);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSubmit = (values: any, { setTouched }: any) => {
    onSubmit(values);
    if (!isReadOnly) {
      setEditMode(false);
      setTouched({});
    }
  };

  const isEditing = isReadOnly ? false : editMode;

  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount={false}
        validateOnChange={isEditing}
        validateOnBlur={isEditing}
      >
        {({ isValid }) => (
          <Form>
            <CardBody>
              {cloneElement(children, { disabled: !isEditing })}
            </CardBody>
            <CardFooter className="d-flex gap-2">
              <NPCancelButton onClick={onCancel}>
                Отмена
              </NPCancelButton>
              {!isReadOnly && (
                <>
                  {!isEditing ? (
                    <NPSubmitButton type="button" onClick={handleEdit}>
                      Изменить
                    </NPSubmitButton>
                  ) : (
                    <NPSubmitButton type="submit" disabled={!isValid}>
                      Сохранить
                    </NPSubmitButton>
                  )}
                </>
              )}
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
};
