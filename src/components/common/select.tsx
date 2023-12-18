import type { SelectHTMLAttributes } from 'react';

import styles from './select.module.css';

type SelectProps = {
  endIcon?: JSX.Element;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ ...props }: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <select {...props} />
    </div>
  );
};
