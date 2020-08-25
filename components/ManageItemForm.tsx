import { useSession } from 'next-auth/client';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { useAddItem, useEditItem } from 'services/api-hooks';
import {
  FormItem,
  ItemCategory,
  Item,
  ItemStatus,
  formItemSchema,
} from 'services/data-types';

const initialState: FormItem = {
  title: '',
  description: '',
  category: '',
  status: ItemStatus.Pending,
};

interface Props {
  mode?: 'add' | 'edit';
  item?: Item;
}

export default function ManageItemForm({ mode = 'add', item }: Props) {
  const isAdd = mode === 'add';
  const isEdit = mode === 'edit';

  const [session] = useSession();

  const [addItem] = useAddItem();
  const [editItem] = useEditItem(item?._id);

  const submitForm = async (
    values: FormItem,
    { resetForm }: FormikHelpers<FormItem>
  ) => {
    if (isAdd) {
      await addItem(values);
      resetForm();
    } else {
      try {
        await editItem(values);
      } catch (e) {
        console.error(e);
        return;
      }
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Formik
      initialValues={{
        ...initialState,
        ...item,
      }}
      onSubmit={submitForm}
      validationSchema={formItemSchema}
    >
      {({ isSubmitting }: FormikProps<FormItem>) => (
        <Form className="flex flex-col mx-auto max-w-sm border border-gray-400 rounded p-2">
          <ErrorMessage name="title" />
          <ErrorMessage name="description" />
          <ErrorMessage name="category" />
          <ErrorMessage name="status" />
          {isSubmitting && <p>Updating...</p>}
          <fieldset className="flex flex-col w-full mx-auto space-y-4">
            <Field
              name="title"
              type="text"
              autoFocus
              className="border p-2"
              placeholder="title"
            />
            <Field
              as="textarea"
              name="description"
              className="border p-2 resize-none"
            />
            <Field name="category" as="select" className="border">
              <option value="">Select category</option>
              {Object.entries(ItemCategory).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </Field>
          </fieldset>

          {isEdit && (
            <Field name="status" as="select" className="border">
              {Object.entries(ItemStatus).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </Field>
          )}

          <div className="flex flex-row  mt-2">
            <button
              className="p-1 border bg-gray-400 shadow-sm flex-grow"
              type="submit"
              disabled={isSubmitting}
            >
              {isAdd ? 'Add' : 'Update'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
