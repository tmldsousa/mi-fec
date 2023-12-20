import type { SelectHTMLAttributes, InputHTMLAttributes } from 'react';
import { Stack, StackProps } from './stack';
import styles from './field.module.css';

type FieldProps = {
  error?: any;
} & StackProps;
export const Field = ({ error, children, ...props }: FieldProps) => {
  return (
    <Stack orientation="vertical" {...props} className={[styles.field, error ? styles.fieldError : undefined, props.className].join(' ')}>
      {children}
      {error && error !== true ? <span className={styles.error}>{error}</span> : undefined}
    </Stack>
  );
};

type InputProps = {
  endIcon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ ...props }: InputProps) => {
  return (
    <div className={styles.wrapper}>
      <input {...props} className={[styles.fieldInput, props.className].join(' ')} />
    </div>
  );
};

type SelectProps = {
  endIcon?: JSX.Element;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ ...props }: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <select {...props} className={[styles.fieldInput, props.className].join(' ')} />
    </div>
  );
};
