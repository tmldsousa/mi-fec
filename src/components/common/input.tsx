import type { InputHTMLAttributes } from 'react';

import styles from './input.module.css';

type InputProps = {
  endIcon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ ...props }: InputProps) => {
  return (
    <div className={styles.wrapper}>
      <input {...props} />
    </div>
  );
};
