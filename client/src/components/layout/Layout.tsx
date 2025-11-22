import { Outlet, Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdBarChart, MdPerson, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '@hooks/useTheme.ts';
import { useCurrentModerator } from '@hooks/useModerators';
import styles from './Layout.module.css';

export const Layout = () => {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { data: moderator } = useCurrentModerator();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/list" className={styles.logo}>
              <img src="/logo.ico" alt="Avito Tech Logo" className={styles.logoImage} />
            <h1 className={styles.logoText}>Avito Tech</h1>
          </Link>

          <nav className={styles.nav}>
            <Link
              to="/list"
              className={`${styles.navLink} ${isActive('/list') || isActive('/item') ? styles.active : ''}`}
            >
              <MdDashboard className={styles.navIcon} />
              Объявления
            </Link>
            <Link
              to="/stats"
              className={`${styles.navLink} ${isActive('/stats') ? styles.active : ''}`}
            >
              <MdBarChart className={styles.navIcon} />
              Статистика
            </Link>
          </nav>

          <div className={styles.headerRight}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              title={isDark ? 'Светлая тема' : 'Темная тема'}
            >
              {isDark ? <MdLightMode /> : <MdDarkMode />}
            </button>

            <div className={styles.user}>
              <div className={styles.userAvatar}>
                <MdPerson />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{moderator?.name || 'Загрузка...'}</div>
                <div className={styles.userRole}>{moderator?.role || 'Модератор'}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};
