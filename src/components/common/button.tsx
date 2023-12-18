import type { ButtonHTMLAttributes } from 'react';

import styles from './button.module.css';

type ButtonProps = {
  primary?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ primary, ...props }: ButtonProps) => {
  return <button {...props} className={[styles.button, primary ? styles.primary : undefined, props.className].join(' ')} />;
};
