import { useEffect, useState } from "react";
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
import { getFranchiseeDashboard } from "../../api/dashboard";
import "./FranchiseeDashboardPage.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n));

const defaultStats = {
  totalRevenue: 0,
  royaltyFeeThisMonth: 0,
  netRevenue: 0,
  activeStoresCount: 0,
  poPendingCount: 0,
};
const defaultRevenueByStore = [];
const defaultRevenueByMonth = [];

const FranchiseeDashboardPage = () => {
  const [stats, setStats] = useState(defaultStats);
  const [revenueByStore, setRevenueByStore] = useState(defaultRevenueByStore);
  const [revenueByMonth, setRevenueByMonth] = useState(defaultRevenueByMonth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("authToken") : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getFranchiseeDashboard({ token })
      .then((data) => {
        if (cancelled) return;
        setStats({
          totalRevenue: data.totalRevenue ?? data.grossRevenue ?? 0,
          royaltyFeeThisMonth: data.royaltyFeeThisMonth ?? data.totalRoyaltyFee ?? 0,
          netRevenue: data.netRevenue ?? (data.totalRevenue - (data.royaltyFeeThisMonth ?? 0)),
          activeStoresCount: data.activeStoresCount ?? data.operationalStoresCount ?? 0,
          poPendingCount: data.poPendingCount ?? data.pendingPurchaseOrdersCount ?? 0,
        });
        setRevenueByStore(Array.isArray(data.revenueByStore) ? data.revenueByStore : defaultRevenueByStore);
        setRevenueByMonth(Array.isArray(data.revenueByMonth) ? data.revenueByMonth : defaultRevenueByMonth);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không tải được dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const maxStoreRevenue = revenueByStore.length ? Math.max(...revenueByStore.map((s) => Number(s.revenue ?? 0))) : 1;
  const maxMonthValue = revenueByMonth.length ? Math.max(...revenueByMonth.map((m) => Number(m.value ?? 0))) : 1;

  if (loading) {
    return (
      <div className="franchisee-dashboard">
        <header className="franchisee-dashboard__header">
          <h1 className="franchisee-dashboard__title">Franchisee Dashboard</h1>
          <p className="franchisee-dashboard__subtitle">Đang tải...</p>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="franchisee-dashboard">
        <header className="franchisee-dashboard__header">
          <h1 className="franchisee-dashboard__title">Franchisee Dashboard</h1>
          <p className="franchisee-dashboard__error">{error}</p>
        </header>
        <p className="franchisee-dashboard__hint">Vui lòng đăng nhập với tài khoản Franchisee (BE Task 1.2 Login).</p>
      </div>
    );
  }

  return (
    <div className="franchisee-dashboard">
      <header className="franchisee-dashboard__header">
        <h1 className="franchisee-dashboard__title">Franchisee Dashboard</h1>
        <p className="franchisee-dashboard__subtitle">Tổng quan doanh thu, Royalty và hoạt động (BE Task 3.3)</p>
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
            <span className="franchisee-dashboard__card-label">Tổng doanh thu (tất cả store) tháng này</span>
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
            <span className="franchisee-dashboard__card-label">Số store đang hoạt động (Operational)</span>
            <span className="franchisee-dashboard__card-value">{stats.activeStoresCount}</span>
          </div>
        </div>
        <div className="franchisee-dashboard__card">
          <ClipboardList size={24} />
          <div>
            <span className="franchisee-dashboard__card-label">Purchase Order đang chờ duyệt (Submitted)</span>
            <span className="franchisee-dashboard__card-value">{stats.poPendingCount}</span>
          </div>
        </div>
      </section>

      <div className="franchisee-dashboard__charts">
        <section className="franchisee-dashboard__chart-card">
          <h2>Doanh thu theo từng store</h2>
          {revenueByStore.length > 0 ? (
            <div className="franchisee-dashboard__bar-chart">
              {revenueByStore.map((item) => (
                <div key={item.storeId ?? item.name} className="franchisee-dashboard__bar-row">
                  <span className="franchisee-dashboard__bar-label">{item.storeName ?? item.name ?? "—"}</span>
                  <div className="franchisee-dashboard__bar-track">
                    <div
                      className="franchisee-dashboard__bar-fill"
                      style={{ width: `${(Number(item.revenue ?? 0) / maxStoreRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="franchisee-dashboard__bar-value">{formatVND(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="franchisee-dashboard__chart-empty">Chưa có dữ liệu doanh thu theo store.</p>
          )}
        </section>
        <section className="franchisee-dashboard__chart-card">
          <h2>Doanh thu theo tháng (6 tháng gần nhất)</h2>
          {revenueByMonth.length > 0 ? (
            <div className="franchisee-dashboard__month-chart">
              {revenueByMonth.map((item) => (
                <div key={item.month ?? item.period ?? item.year} className="franchisee-dashboard__month-bar-wrap">
                  <div
                    className="franchisee-dashboard__month-bar"
                    style={{ height: `${(Number(item.value ?? 0) / maxMonthValue) * 100}%` }}
                    title={`${item.month ?? item.period}: ${item.value}`}
                  />
                  <span className="franchisee-dashboard__month-label">{item.month ?? item.period ?? `T${item.monthIndex ?? ""}`}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="franchisee-dashboard__chart-empty">Chưa có dữ liệu doanh thu theo tháng.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default FranchiseeDashboardPage;
