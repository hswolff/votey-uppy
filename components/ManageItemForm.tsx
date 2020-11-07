import { useEffect, useState } from 'react';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { useAddItem, useEditItem, useSessionUser } from 'lib/api-hooks';
import {
  FormItem,
  ItemCategory,
  Item,
  ItemStatus,
  formItemSchema,
} from 'lib/data-types';
import classNames from 'classnames';
import Loading from './Loading';

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

  const [sessionUser] = useSessionUser();
  const isAdmin = sessionUser?.role === 'admin';

  const [addItem] = useAddItem();
  const [editItem] = useEditItem(item?._id.toString());

  const [justSubmittedItem, didJustSubmitItem] = useState<
    'success' | 'error' | undefined
  >(undefined);

  useEffect(() => {
    if (!justSubmittedItem) {
      return;
    }

    const id = setTimeout(() => {
      didJustSubmitItem(undefined);
    }, 4e3);

    return () => {
      clearTimeout(id);
    };
  }, [justSubmittedItem]);

  const submitForm = async (
    values: FormItem,
    { resetForm }: FormikHelpers<FormItem>
  ) => {
    try {
      if (isAdd) {
        await addItem(values);
        resetForm();
      } else {
        await editItem(values);
      }

      didJustSubmitItem('success');
    } catch (error) {
      didJustSubmitItem('error');
    }
  };

  if (!sessionUser) {
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
      {({ isSubmitting, isValid }: FormikProps<FormItem>) => {
        const buttonDisabled = !isValid || isSubmitting;
        const justSubmittedIsSuccess = justSubmittedItem === 'success';
        return (
          <Form className="space-y-4">
            {justSubmittedItem === 'error' && (
              <p className="py-2 leading-6 text-sm text-gray-800 rounded border border-red-300 bg-red-200 text-center">
                Oops! Something went wrong!
              </p>
            )}
            {justSubmittedIsSuccess && isAdd && (
              <p className="py-2 leading-6 text-sm text-gray-800 rounded border border-purple-300 bg-purple-200 text-center">
                Thanks for the idea! We&apos;ll review it shortly!
                <br />
                You&apos;ll see it appear on the homepage if it is accepted.
              </p>
            )}
            {justSubmittedIsSuccess && isEdit && (
              <p className="py-2 leading-6 text-sm text-gray-800 rounded border border-purple-300 bg-purple-200 text-center">
                Updated!
              </p>
            )}
            <Fieldset>
              <Label htmlFor="title">
                Title
                <ErrorMessage component={LabelErrorMesage} name="title" />
              </Label>
              <Field
                name="title"
                id="title"
                type="text"
                autoFocus
                className="border p-2 w-full"
                placeholder="title"
              />
            </Fieldset>

            <Fieldset>
              <Label htmlFor="description">
                Description
                <ErrorMessage component={LabelErrorMesage} name="description" />
              </Label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="border p-2 resize-none w-full h-48"
              />
            </Fieldset>

            <Fieldset>
              <Label htmlFor="category">
                Category
                <ErrorMessage component={LabelErrorMesage} name="category" />
              </Label>
              <Field
                name="category"
                id="category"
                as="select"
                className="border w-full p-2"
              >
                <option value="">---</option>
                {Object.entries(ItemCategory).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
              </Field>
            </Fieldset>

            <Fieldset>
              {isAdmin && (
                <>
                  <Label htmlFor="status">
                    Status
                    <ErrorMessage component={LabelErrorMesage} name="status" />
                  </Label>
                  <Field
                    name="status"
                    id="status"
                    as="select"
                    className="border w-full p-2"
                  >
                    {Object.entries(ItemStatus).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </Field>
                </>
              )}
            </Fieldset>

            <div className="flex flex-row mt-2 justify-end">
              <button
                className={classNames(
                  'text-purple-100  transition-colors ease-in-out duration-150 font-bold rounded py-2 px-4',
                  {
                    'bg-purple-600 hover:bg-purple-500': !buttonDisabled,
                    'bg-purple-300  cursor-not-allowed': buttonDisabled,
                  }
                )}
                type="submit"
                disabled={buttonDisabled}
              >
                {isSubmitting ? (
                  <Loading className="text-purple-100 w-8 h-8" />
                ) : isAdd ? (
                  'Add'
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

const Label = (props: JSX.IntrinsicElements['label']) => (
  <label
    {...props}
    className={classNames(
      'leading-6 text-sm text-gray-700 flex flex-row justify-between',
      props.className
    )}
  />
);

const LabelErrorMesage = (props: JSX.IntrinsicElements['span']) => (
  <span {...props} className="text-red-600" />
);

const Fieldset = (props: JSX.IntrinsicElements['fieldset']) => (
  <fieldset
    {...props}
    className={classNames('flex flex-col w-full mx-auto', props.className)}
  />
);
