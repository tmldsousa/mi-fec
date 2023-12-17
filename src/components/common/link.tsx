import { ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styles from './link.module.css';

type LinkProps = ComponentProps<typeof RouterLink>;

export const Link = (props: LinkProps) => {
  return <RouterLink {...props} className={[styles.link, props.className].join(' ')} />;
};
