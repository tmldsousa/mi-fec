import { memo } from 'react';
import { SortAscending, SortDescending } from '../icons';
import styles from './sort-indicator.module.css';

export const SortIndicator = memo(({ direction }: { direction: 'asc' | 'desc' | false }) => {
  return (
    <div className={styles.sortIndicator}>
      {direction === 'asc' ? (
        <SortAscending stroke="var(--primary)" />
      ) : direction === 'desc' ? (
        <SortDescending stroke="var(--primary)" />
      ) : undefined}
    </div>
  );
});
