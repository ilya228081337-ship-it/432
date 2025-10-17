# Руководство по использованию компонентов

## Содержание

1. [Введение](#введение)
2. [Быстрый старт](#быстрый-старт)
3. [Компоненты форм](#компоненты-форм)
4. [Примеры использования](#примеры-использования)
5. [Расширенные сценарии](#расширенные-сценарии)
6. [API компонентов](#api-компонентов)
7. [Лучшие практики](#лучшие-практики)

## Введение

Этот проект предоставляет набор переиспользуемых React-компонентов для создания динамических форм с валидацией. Все компоненты построены на основе Formik, Yup и Reactstrap, обеспечивая консистентный и простой в использовании API.

### Основные преимущества

- 🚀 Быстрая интеграация - минимум кода для создания сложных форм
- ✅ Встроенная валидация - Yup схемы из коробки
- 🎨 Красивый UI - стилизация Bootstrap 5
- 📱 Адаптивность - работает на всех устройствах
- 🔒 TypeScript - полная типобезопасность
- ♿ Доступность - поддержка a11y стандартов

## Быстрый старт

### 1. Простая форма за 5 минут

```tsx
import { NPSimpleForm } from './components/NPSimpleForm';
import { NPTestForm1 } from './components/NPTestForm1';
import * as Yup from 'yup';

function MyPage() {
  return (
    <NPSimpleForm
      title="Регистрация"
      initialValues={{ firstName: '' }}
      validationSchema={Yup.object({
        firstName: Yup.string().required('Введите имя')
      })}
      onSubmit={(values) => console.log('Отправлено:', values)}
      onCancel={() => console.log('Отменено')}
    >
      <NPTestForm1 />
    </NPSimpleForm>
  );
}
```

### 2. Запуск примера

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Откройте http://localhost:5173
```

## Компоненты форм

### 1. NPSimpleForm - Простая форма

**Назначение:** Базовая форма с одним набором полей и режимами просмотра/редактирования.

**Когда использовать:**
- Регистрационные формы
- Формы профиля пользователя
- Контактные формы
- Формы с одной группой полей

**Пример:**

```tsx
import { NPSimpleForm } from './components/NPSimpleForm';
import { Field } from 'formik';
import { FormGroup, Label, Input } from 'reactstrap';
import * as Yup from 'yup';

const UserProfileForm = () => {
  return (
    <NPSimpleForm
      title="Профиль пользователя"
      initialValues={{
        name: 'Иван',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('Обязательное поле'),
        email: Yup.string().email('Некорректный email').required('Обязательное поле'),
        phone: Yup.string().required('Обязательное поле')
      })}
      onSubmit={(values) => {
        // Отправка на сервер
        console.log('Сохранение:', values);
      }}
      onCancel={() => {
        // Отмена изменений
        console.log('Отмена');
      }}
      isEdit={false}
    >
      <div>
        <FormGroup>
          <Label for="name">Имя</Label>
          <Field name="name">
            {({ field, meta }: any) => (
              <Input
                {...field}
                type="text"
                id="name"
                invalid={meta.touched && !!meta.error}
              />
            )}
          </Field>
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Field name="email">
            {({ field, meta }: any) => (
              <Input
                {...field}
                type="email"
                id="email"
                invalid={meta.touched && !!meta.error}
              />
            )}
          </Field>
        </FormGroup>

        <FormGroup>
          <Label for="phone">Телефон</Label>
          <Field name="phone">
            {({ field, meta }: any) => (
              <Input
                {...field}
                type="tel"
                id="phone"
                invalid={meta.touched && !!meta.error}
              />
            )}
          </Field>
        </FormGroup>
      </div>
    </NPSimpleForm>
  );
};
```

### 2. NPTabbedForm - Форма с вкладками

**Назначение:** Форма с несколькими вкладками для группировки связанных полей.

**Когда использовать:**
- Настройки приложения (разделы: Общие, Безопасность, Уведомления)
- Многошаговые формы без жёсткой последовательности
- Формы с большим количеством полей

**Пример:**

```tsx
import { NPTabbedForm } from './components/NPTabbedForm';
import * as Yup from 'yup';

// Вспомогательный компонент Tab
const Tab: React.FC<any> = ({ children }) => <>{children}</>;

const SettingsForm = () => {
  return (
    <NPTabbedForm
      title="Настройки"
      onSubmit={(allValues) => {
        console.log('Вкладка 1:', allValues[0]);
        console.log('Вкладка 2:', allValues[1]);
        console.log('Вкладка 3:', allValues[2]);
      }}
      onCancel={() => console.log('Отмена')}
    >
      {/* Вкладка 1: Основные настройки */}
      <Tab
        title="Основные"
        initialValues={{ appName: 'Мое приложение', language: 'ru' }}
        validationSchema={Yup.object({
          appName: Yup.string().required('Обязательное поле')
        })}
      >
        <GeneralSettingsFields />
      </Tab>

      {/* Вкладка 2: Безопасность */}
      <Tab
        title="Безопасность"
        initialValues={{ twoFactor: false, sessionTimeout: 30 }}
        validationSchema={Yup.object({
          sessionTimeout: Yup.number().min(5, 'Минимум 5 минут')
        })}
      >
        <SecuritySettingsFields />
      </Tab>

      {/* Вкладка 3: Уведомления */}
      <Tab
        title="Уведомления"
        initialValues={{ emailNotif: true, pushNotif: false }}
        validationSchema={Yup.object({})}
      >
        <NotificationSettingsFields />
      </Tab>
    </NPTabbedForm>
  );
};
```

**Важно:** При переключении вкладок в режиме редактирования происходит валидация текущей вкладки. Переход возможен только при успешной валидации.

### 3. NPWizard - Многостраничная форма (Wizard)

**Назначение:** Пошаговая форма с последовательным прохождением этапов.

**Когда использовать:**
- Процесс регистрации с несколькими шагами
- Оформление заказа (адрес → доставка → оплата)
- Онбординг новых пользователей
- Создание сложных объектов

**Пример:**

```tsx
import { NPWizard } from './components/NPWizard';
import * as Yup from 'yup';

const Page: React.FC<any> = ({ children }) => <>{children}</>;

const CheckoutWizard = () => {
  return (
    <NPWizard
      title="Оформление заказа"
      onSubmit={(allPages) => {
        const [shipping, delivery, payment] = allPages;
        console.log('Адрес:', shipping);
        console.log('Доставка:', delivery);
        console.log('Оплата:', payment);
        // Отправка заказа
      }}
      onCancel={() => {
        console.log('Заказ отменён');
      }}
    >
      {/* Шаг 1: Адрес доставки */}
      <Page
        title="Адрес доставки"
        initialValues={{
          address: '',
          city: '',
          zipCode: ''
        }}
        validationSchema={Yup.object({
          address: Yup.string().required('Введите адрес'),
          city: Yup.string().required('Введите город'),
          zipCode: Yup.string().required('Введите индекс')
        })}
      >
        <ShippingAddressFields />
      </Page>

      {/* Шаг 2: Способ доставки */}
      <Page
        title="Доставка"
        initialValues={{
          method: 'courier',
          date: ''
        }}
        validationSchema={Yup.object({
          date: Yup.date().required('Выберите дату')
        })}
      >
        <DeliveryMethodFields />
      </Page>

      {/* Шаг 3: Способ оплаты */}
      <Page
        title="Оплата"
        initialValues={{
          paymentMethod: 'card',
          cardNumber: ''
        }}
        validationSchema={Yup.object({
          cardNumber: Yup.string()
            .matches(/^\d{16}$/, 'Введите 16 цифр')
            .required('Введите номер карты')
        })}
      >
        <PaymentMethodFields />
      </Page>
    </NPWizard>
  );
};
```

**Особенности:**
- Кнопка "Назад" недоступна на первом шаге
- Кнопка "Далее" доступна только при валидной форме
- На последнем шаге отображается кнопка "Сохранить"
- Все данные сохраняются между шагами

## Примеры использования

### Пример 1: Форма с выбором из списка

```tsx
import { Field } from 'formik';
import { FormGroup, Label, Input } from 'reactstrap';

const CountrySelectField = ({ disabled }: { disabled?: boolean }) => (
  <FormGroup>
    <Label for="country">Страна</Label>
    <Field name="country">
      {({ field, meta }: any) => (
        <Input
          {...field}
          type="select"
          id="country"
          disabled={disabled}
          invalid={meta.touched && !!meta.error}
        >
          <option value="">Выберите страну</option>
          <option value="ru">Россия</option>
          <option value="by">Беларусь</option>
          <option value="kz">Казахстан</option>
        </Input>
      )}
    </Field>
  </FormGroup>
);
```

### Пример 2: Форма с чекбоксами

```tsx
const PreferencesFields = ({ disabled }: { disabled?: boolean }) => (
  <div>
    <FormGroup check>
      <Field name="newsletter" type="checkbox">
        {({ field }: any) => (
          <Label check>
            <Input
              {...field}
              type="checkbox"
              disabled={disabled}
            />{' '}
            Получать рассылку
          </Label>
        )}
      </Field>
    </FormGroup>

    <FormGroup check>
      <Field name="terms" type="checkbox">
        {({ field }: any) => (
          <Label check>
            <Input
              {...field}
              type="checkbox"
              disabled={disabled}
            />{' '}
            Согласен с условиями
          </Label>
        )}
      </Field>
    </FormGroup>
  </div>
);
```

### Пример 3: Форма с загрузкой файлов

```tsx
const FileUploadField = ({ disabled }: { disabled?: boolean }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FormGroup>
      <Label for="avatar">Фото профиля</Label>
      <Field name="avatar">
        {({ field, form, meta }: any) => (
          <>
            <Input
              type="file"
              id="avatar"
              disabled={disabled}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  form.setFieldValue('avatar', selectedFile);
                }
              }}
              invalid={meta.touched && !!meta.error}
            />
            {file && <p className="mt-2">Выбран файл: {file.name}</p>}
          </>
        )}
      </Field>
    </FormGroup>
  );
};
```

## Расширенные сценарии

### Сценарий 1: Интеграция с API

```tsx
const UserRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      const data = await response.json();
      console.log('Пользователь создан:', data);
      // Перенаправление на главную
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert color="danger">{error}</Alert>}
      {loading && <Spinner>Загрузка...</Spinner>}

      <NPSimpleForm
        title="Регистрация"
        initialValues={{ email: '', password: '' }}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
      >
        <RegistrationFields />
      </NPSimpleForm>
    </>
  );
};
```

### Сценарий 2: Сохранение в localStorage

```tsx
const DraftForm = () => {
  // Загрузка сохранённых данных
  const loadDraft = () => {
    const saved = localStorage.getItem('formDraft');
    return saved ? JSON.parse(saved) : { title: '', content: '' };
  };

  const handleSubmit = (values: any) => {
    // Очистка черновика
    localStorage.removeItem('formDraft');
    console.log('Опубликовано:', values);
  };

  return (
    <NPSimpleForm
      title="Создать пост"
      initialValues={loadDraft()}
      validationSchema={postSchema}
      onSubmit={handleSubmit}
      onCancel={() => {
        // Сохранение черновика
        localStorage.setItem('formDraft', JSON.stringify(values));
      }}
    >
      <PostFields />
    </NPSimpleForm>
  );
};
```

### Сценарий 3: Условная валидация

```tsx
const ConditionalValidationForm = () => {
  const validationSchema = Yup.object().shape({
    accountType: Yup.string().required('Выберите тип'),
    companyName: Yup.string().when('accountType', {
      is: 'business',
      then: (schema) => schema.required('Введите название компании'),
      otherwise: (schema) => schema
    }),
    inn: Yup.string().when('accountType', {
      is: 'business',
      then: (schema) => schema
        .matches(/^\d{10}$/, 'ИНН должен содержать 10 цифр')
        .required('Введите ИНН'),
      otherwise: (schema) => schema
    })
  });

  return (
    <NPSimpleForm
      title="Регистрация аккаунта"
      initialValues={{
        accountType: 'personal',
        companyName: '',
        inn: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
      onCancel={() => {}}
    >
      <AccountFields />
    </NPSimpleForm>
  );
};
```

## API компонентов

### NPSimpleForm

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|-------------|--------------|----------|
| `title` | `string` | Да | - | Заголовок формы |
| `initialValues` | `object` | Да | - | Начальные значения полей |
| `validationSchema` | `Yup.ObjectSchema` | Нет | - | Схема валидации |
| `onSubmit` | `(values: any) => void` | Да | - | Обработчик отправки |
| `onCancel` | `() => void` | Да | - | Обработчик отмены |
| `isEdit` | `boolean` | Нет | `false` | Режим редактирования при открытии |
| `isReadOnly` | `boolean` | Нет | `false` | Режим только для чтения |
| `children` | `ReactElement` | Да | - | Содержимое формы |

### NPTabbedForm

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|-------------|--------------|----------|
| `title` | `string` | Да | - | Заголовок формы |
| `onSubmit` | `(values: any[]) => void` | Да | - | Обработчик отправки (массив значений) |
| `onCancel` | `() => void` | Да | - | Обработчик отмены |
| `isEdit` | `boolean` | Нет | `false` | Режим редактирования |
| `isReadOnly` | `boolean` | Нет | `false` | Режим только для чтения |
| `children` | `ReactElement<TabProps>[]` | Да | - | Вкладки формы |

**Параметры вкладки (Tab):**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|-------------|----------|
| `title` | `string` | Да | Название вкладки |
| `initialValues` | `object` | Да | Начальные значения |
| `validationSchema` | `Yup.ObjectSchema` | Нет | Схема валидации |
| `children` | `ReactElement` | Да | Содержимое вкладки |

### NPWizard

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|-------------|--------------|----------|
| `title` | `string` | Да | - | Заголовок формы |
| `onSubmit` | `(values: any[]) => void` | Да | - | Обработчик отправки (массив значений) |
| `onCancel` | `() => void` | Да | - | Обработчик отмены |
| `children` | `ReactElement<PageProps>[]` | Да | - | Страницы wizard |

**Параметры страницы (Page):**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|-------------|----------|
| `title` | `string` | Да | Название шага |
| `initialValues` | `object` | Да | Начальные значения |
| `validationSchema` | `Yup.ObjectSchema` | Нет | Схема валидации |
| `children` | `ReactElement` | Да | Содержимое страницы |

## Лучшие практики

### 1. Структурирование кода

✅ **Правильно:** Разделяйте логику на отдельные компоненты

```tsx
// components/fields/EmailField.tsx
export const EmailField = ({ disabled }: { disabled?: boolean }) => (
  <FormGroup>
    <Label for="email">Email</Label>
    <Field name="email">
      {({ field, meta }: any) => (
        <Input {...field} type="email" disabled={disabled} />
      )}
    </Field>
  </FormGroup>
);

// pages/ProfilePage.tsx
<NPSimpleForm {...props}>
  <EmailField />
  <NameField />
  <PhoneField />
</NPSimpleForm>
```

❌ **Неправильно:** Вся логика в одном компоненте

### 2. Типизация

✅ **Правильно:** Используйте TypeScript интерфейсы

```tsx
interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const schema: Yup.ObjectSchema<UserFormValues> = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required()
});

const handleSubmit = (values: UserFormValues) => {
  // values имеет правильный тип
};
```

### 3. Валидация

✅ **Правильно:** Используйте информативные сообщения об ошибках

```tsx
Yup.string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .matches(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
  .matches(/[0-9]/, 'Должна быть хотя бы одна цифра')
  .required('Введите пароль')
```

### 4. Производительность

✅ **Правильно:** Мемоизируйте схемы валидации

```tsx
const validationSchema = useMemo(
  () => Yup.object({
    email: Yup.string().email().required()
  }),
  []
);
```

### 5. UX

✅ **Правильно:** Показывайте индикацию загрузки

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (values: any) => {
  setIsSubmitting(true);
  try {
    await api.submit(values);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Дополнительные ресурсы

- [Документация Formik](https://formik.org/docs/overview)
- [Документация Yup](https://github.com/jquense/yup)
- [Документация Reactstrap](https://reactstrap.github.io/)
- [Bootstrap 5 Components](https://getbootstrap.com/docs/5.3/components/)
