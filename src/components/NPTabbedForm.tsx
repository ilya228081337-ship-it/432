import { useState, ReactElement, Children, cloneElement } from 'react';
import { Formik, Form } from 'formik';
import { Card, CardBody, CardHeader, CardFooter, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { NPCancelButton } from './NPCancelButton';
import { NPSubmitButton } from './NPSubmitButton';

interface TabProps {
  initialValues: any;
  validationSchema?: any;
  title: string;
  children: ReactElement;
}

interface NPTabbedFormProps {
  isReadOnly?: boolean;
  isEdit?: boolean;
  onSubmit: (values: any[]) => void;
  onCancel: () => void;
  title: string;
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

export const NPTabbedForm: React.FC<NPTabbedFormProps> = ({
  isReadOnly = false,
  isEdit = false,
  onSubmit,
  onCancel,
  title,
  children,
}) => {
  const [editMode, setEditMode] = useState(isEdit);
  const [activeTab, setActiveTab] = useState(0);
  const childrenArray = Children.toArray(children) as ReactElement<TabProps>[];
  const [tabValues, setTabValues] = useState<any[]>(
    childrenArray.map(child => child.props.initialValues)
  );

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleTabChange = async (newTab: number, validateForm: any, values: any, setTouched: any) => {
    if (editMode) {
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        const newTabValues = [...tabValues];
        newTabValues[activeTab] = values;
        setTabValues(newTabValues);
        setActiveTab(newTab);
      } else {
        setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
      }
    } else {
      setActiveTab(newTab);
    }
  };

  const handleSubmit = (values: any, { setTouched }: any) => {
    const newTabValues = [...tabValues];
    newTabValues[activeTab] = values;
    onSubmit(newTabValues);
    if (!isReadOnly) {
      setEditMode(false);
      setTouched({});
    }
  };

  const isEditing = isReadOnly ? false : editMode;
  const currentChild = childrenArray[activeTab];

  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <Formik
        initialValues={tabValues[activeTab] || {}}
        validationSchema={currentChild.props.validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount={false}
        validateOnChange={isEditing}
        validateOnBlur={isEditing}
      >
        {({ isValid, validateForm, values, setTouched }) => (
          <Form>
            <Nav tabs>
              {childrenArray.map((child, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={activeTab === index ? 'active' : ''}
                    onClick={() => handleTabChange(index, validateForm, values, setTouched)}
                    style={{ cursor: 'pointer' }}
                  >
                    {child.props.title}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <CardBody>
              <TabContent activeTab={activeTab}>
                {childrenArray.map((child, index) => (
                  <TabPane key={index} tabId={index}>
                    {activeTab === index && cloneElement(child.props.children, { disabled: !isEditing })}
                  </TabPane>
                ))}
              </TabContent>
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
