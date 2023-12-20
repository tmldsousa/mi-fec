import type { HTMLAttributes } from 'react';
import styles from './stack.module.css';

export type StackProps = {
  orientation?: 'horizontal' | 'vertical';
} & HTMLAttributes<HTMLDivElement>;

export const Stack = ({ orientation, ...props }: StackProps) => {
  return (
    <div {...props} className={[styles.stack, orientation === 'vertical' ? styles.stackVertical : undefined, props.className].join(' ')} />
  );
};
