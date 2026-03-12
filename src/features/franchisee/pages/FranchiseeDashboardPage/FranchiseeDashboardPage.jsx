import { Link } from "react-router-dom";
import {
  Store,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  TrendingUp,
  Wallet,
  ClipboardList,
} from "lucide-react";
import "./FranchiseeDashboardPage.css";

const MOCK_STATS = {
  totalRevenue: 1250000000,
  royaltyFeeThisMonth: 100000000,
  netRevenue: 1150000000,
  activeStores: 3,
  poPendingCount: 2,
};

const MOCK_REVENUE_BY_STORE = [
  { name: "Store Quận 1", revenue: 500000000 },
  { name: "Store Quận 7", revenue: 450000000 },
  { name: "Store Bình Thạnh", revenue: 300000000 },
];

const MOCK_REVENUE_BY_MONTH = [
  { month: "T10", value: 800 },
  { month: "T11", value: 950 },
  { month: "T12", value: 1100 },
  { month: "T1", value: 1050 },
  { month: "T2", value: 1200 },
  { month: "T3", value: 1150 },
];

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const FranchiseeDashboardPage = () => {
  const stats = MOCK_STATS;
  const maxStoreRevenue = Math.max(...MOCK_REVENUE_BY_STORE.map((s) => s.revenue));
  const maxMonthValue = Math.max(...MOCK_REVENUE_BY_MONTH.map((m) => m.value));

  return (
    <div className="franchisee-dashboard">
      <header className="franchisee-dashboard__header">
        <h1 className="franchisee-dashboard__title">Franchisee Dashboard</h1>
        <p className="franchisee-dashboard__subtitle">Tổng quan doanh thu, Royalty và hoạt động của bạn</p>
      </header>

      <nav className="franchisee-dashboard__menu">
        <Link to="/franchisee/stores" className="franchisee-dashboard__nav-item">
          <Store size={20} /> Store
        </Link>
        <Link to="/franchisee/nhan-su" className="franchisee-dashboard__nav-item">
          <Users size={20} /> Nhan su
        </Link>
        <Link to="/franchisee/purchase-order" className="franchisee-dashboard__nav-item">
          <ShoppingCart size={20} /> Purchase Order
        </Link>
        <Link to="/franchisee/hop-dong" className="franchisee-dashboard__nav-item">
          <FileText size={20} /> Hop dong
        </Link>
        <Link to="/franchisee/bao-cao" className="franchisee-dashboard__nav-item">
          <BarChart3 size={20} /> Bao cao
        </Link>
      </nav>

      <section className="franchisee-dashboard__cards">
        <div className="franchisee-dashboard__card franchisee-dashboard__card--revenue">
          <TrendingUp size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Tổng doanh thu (tất cả store)</span>
            <span className="franchisee-dashboard__card-value">{formatVND(stats.totalRevenue)}</span>
          </div>
        </div>
        <div className="franchisee-dashboard__card franchisee-dashboard__card--royalty">
          <Wallet size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Royalty Fee phải trả tháng này</span>
            <span className="franchisee-dashboard__card-value">{formatVND(stats.royaltyFeeThisMonth)}</span>
          </div>
        </div>
        <div className="franchisee-dashboard__card franchisee-dashboard__card--net">
          <BarChart3 size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Lợi nhuận thuần (Doanh thu - Royalty)</span>
            <span className="franchisee-dashboard__card-value">{formatVND(stats.netRevenue)}</span>
          </div>
        </div>
        <div className="franchisee-dashboard__card">
          <Store size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Số store đang hoạt động</span>
            <span className="franchisee-dashboard__card-value">{stats.activeStores}</span>
          </div>
        </div>
        <div className="franchisee-dashboard__card">
          <ClipboardList size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Purchase Order đang chờ duyệt</span>
            <span className="franchisee-dashboard__card-value">{stats.poPendingCount}</span>
          </div>
        </div>
      </section>

      <div className="franchisee-dashboard__charts">
        <section className="franchisee-dashboard__chart-card">
          <h2>Doanh thu theo từng store</h2>
          <div className="franchisee-dashboard__bar-chart">
            {MOCK_REVENUE_BY_STORE.map((item) => (
              <div key={item.name} className="franchisee-dashboard__bar-row">
                <span className="franchisee-dashboard__bar-label">{item.name}</span>
                <div className="franchisee-dashboard__bar-track">
                  <div
                    className="franchisee-dashboard__bar-fill"
                    style={{ width: `${(item.revenue / maxStoreRevenue) * 100}%` }}
                  />
                </div>
                <span className="franchisee-dashboard__bar-value">{formatVND(item.revenue)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="franchisee-dashboard__chart-card">
          <h2>Doanh thu theo tháng</h2>
          <div className="franchisee-dashboard__month-chart">
            {MOCK_REVENUE_BY_MONTH.map((item) => (
              <div key={item.month} className="franchisee-dashboard__month-bar-wrap">
                <div
                  className="franchisee-dashboard__month-bar"
                  style={{ height: `${(item.value / maxMonthValue) * 100}%` }}
                  title={`${item.month}: ${item.value}`}
                />
                <span className="franchisee-dashboard__month-label">{item.month}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FranchiseeDashboardPage;
