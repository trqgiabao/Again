import { NavLink } from 'react-router-dom';
import './AdminMenu.css';

const menuItems = [
  { label: 'Hồ sơ', to: '/admin/applications' },
  { label: 'Franchisee', to: '/admin/dashboard' },
  { label: 'Store', to: '/admin/dashboard' },
  { label: 'Purchase Order', to: '/admin/dashboard' },
  { label: 'Báo cáo', to: '/admin/dashboard' },
];

const AdminMenu = () => {
  return (
    <nav className="admin-menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `admin-menu__item ${isActive ? 'admin-menu__item--active' : ''}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminMenu;
