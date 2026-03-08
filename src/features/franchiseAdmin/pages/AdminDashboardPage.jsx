import AdminMenu from '../components/adminMenu/AdminMenu';
import StatCard from '../components/statCard/StatCard';
import './AdminDashboardPage.css';

const storeRevenue = [
  { label: 'Store Quận 1', value: 92 },
  { label: 'Store Hà Đông', value: 74 },
  { label: 'Store Cầu Giấy', value: 68 },
  { label: 'Store Hải Châu', value: 53 },
];

const topStores = [
  { name: 'Store Quận 1', revenue: '₫3.2B' },
  { name: 'Store Hà Đông', revenue: '₫2.6B' },
  { name: 'Store Cầu Giấy', revenue: '₫2.4B' },
];

const AdminDashboardPage = () => {
  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Admin Dashboard</h1>
        <p>Tổng quan hệ thống franchise theo thời gian thực.</p>
      </header>

      <AdminMenu />

      <div className="stats-grid">
        <StatCard title="Tổng Franchisee đang hoạt động" value="128" subText="+8 so với tháng trước" />
        <StatCard title="Số hồ sơ chờ duyệt" value="24" variant="danger" subText="Cần xử lý ngay" />
        <StatCard title="Tổng doanh thu toàn hệ thống" value="₫45.8B" />
        <StatCard title="Royalty Fee đã thu trong tháng" value="₫2.9B" />
      </div>

      <div className="admin-section-grid">
        <article className="panel">
          <h2>Doanh thu theo store / khu vực</h2>
          <div className="revenue-bars">
            {storeRevenue.map((item) => (
              <div key={item.label} className="revenue-bars__item">
                <div className="revenue-bars__label-row">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="revenue-bars__track">
                  <div className="revenue-bars__fill" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Top store bán chạy nhất</h2>
          <ol className="top-store-list">
            {topStores.map((store) => (
              <li key={store.name}>
                <span>{store.name}</span>
                <strong>{store.revenue}</strong>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
};

export default AdminDashboardPage;