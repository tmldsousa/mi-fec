import { Formik, FormikHelpers } from 'formik';
import { Author, Category, SubmitVideo } from '../common/interfaces';
import { Field, Input, Select } from './common/field';
import { useCallback, useMemo } from 'react';
import { Button } from './common/button';
import { array, number, object, string } from 'yup';
import { Stack } from './common/stack';
import styles from './video-form.module.css';

type VideoFormProps = {
  video?: SubmitVideo;
  authors: Author[];
  categories: Category[];
  onSubmit: (data: SubmitVideo) => Promise<void>;
  onCancel?: () => void;
};

// SubmitVideo validation schema
const validationSchema = object({
  name: string().required('Required'),
  authorId: number().moreThan(0, 'Required'),
  catIds: array().of(number()).min(1, 'Required'),
});

export const VideoForm = ({ video, authors, categories, onSubmit, onCancel }: VideoFormProps) => {
  const isLoading = useMemo(() => !categories || !authors, [authors, categories]);

  const onFormSubmit = useCallback(
    async (values: SubmitVideo, { setSubmitting }: FormikHelpers<SubmitVideo>) => {
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit]
  );

  return isLoading ? (
    <>Loading...</>
  ) : (
    <Formik<SubmitVideo>
      initialValues={video || { name: '', catIds: [], authorId: 0 }}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}>
      {({ dirty, values, isValid, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
        // We have to do this to make sure we convert selected options to number (instead of string)
        const handleNumberSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
          const values = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value, 10));
          setFieldValue(e.target.name, e.target.multiple ? values : values[0]);
        };

        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.stackLayout}>
              <Field error={touched.name && errors.name}>
                <label htmlFor="name">Name</label>
                <Input type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} disabled={isSubmitting} />
              </Field>

              <Field error={touched.authorId && errors.authorId}>
                <label htmlFor="authorId">Author</label>
                <Select
                  name="authorId"
                  onChange={handleNumberSelectChange}
                  onBlur={handleBlur}
                  value={values.authorId}
                  disabled={isSubmitting}>
                  <option key="" value="0">
                    -- Select author --
                  </option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field error={touched.catIds && errors.catIds}>
                <label htmlFor="catIds">Categories</label>
                <Select
                  multiple
                  name="catIds"
                  onChange={handleNumberSelectChange}
                  onBlur={handleBlur}
                  value={values.catIds.map((id) => id.toString())}
                  disabled={isSubmitting}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Stack>
                <Button type="submit" primary disabled={!dirty || !isValid || isSubmitting}>
                  Submit
                </Button>
                {onCancel && (
                  <Button type="button" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                )}
              </Stack>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
