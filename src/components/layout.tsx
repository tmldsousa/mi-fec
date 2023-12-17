import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';
import { LayoutContextProvider, useLayoutContext } from './contexts/layout.context';
import { Link } from './common/link';

type LayoutProps = React.PropsWithChildren;

export const Layout = (props: LayoutProps) => (
  <LayoutContextProvider>
    <LayoutView {...props} />
  </LayoutContextProvider>
);

const LayoutView = ({ children }: LayoutProps) => {
  const { title, renderActions } = useLayoutContext();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navigation}>
          <span className={styles.title}>{title || 'Videos'}</span>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div>{renderActions}</div>
      </header>

      <main className={styles.main}>{children || <Outlet />}</main>

      <footer className={styles.footer}>VManager Demo v0.0.1</footer>
    </>
  );
};
