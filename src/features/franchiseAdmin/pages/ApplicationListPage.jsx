import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../components/adminMenu/AdminMenu';
import StatusBadge from '../components/statusBadge/StatusBadge';
import { getAdminApplications } from '../api/franchiseAdminApi';
import './ApplicationListPage.css';

const mockApplications = [
  {
    id: 'app-001',
    fullName: 'Nguyễn Văn A',
    email: 'a.nguyen@mail.com',
    region: 'Hồ Chí Minh',
    submittedAt: '2026-03-01',
    status: 'Pending',
  },
  {
    id: 'app-002',
    fullName: 'Trần Thị B',
    email: 'b.tran@mail.com',
    region: 'Hà Nội',
    submittedAt: '2026-02-28',
    status: 'Approved',
  },
  {
    id: 'app-003',
    fullName: 'Lê Minh C',
    email: 'c.le@mail.com',
    region: 'Đà Nẵng',
    submittedAt: '2026-02-25',
    status: 'Rejected',
  },
  {
    id: 'app-004',
    fullName: 'Phạm Thu D',
    email: 'd.pham@mail.com',
    region: 'Hồ Chí Minh',
    submittedAt: '2026-02-24',
    status: 'Pending',
  },
];

const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setApiError('');
        const data = await getAdminApplications();
        setApplications(data);
      } catch (error) {
        setApiError(`Không gọi được API, đang hiển thị mock data. Chi tiết: ${error.message}`);
        setApplications(mockApplications);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const data = useMemo(() => {
    return applications.filter((item) => {
      const fullName = String(item.fullName || '').toLowerCase();
      const email = String(item.email || '').toLowerCase();
      const matchStatus = status === 'All' || item.status === status;
      const matchRegion = region === 'All' || item.region === region;
      const matchSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);
      const submittedAt = String(item.submittedAt || '').slice(0, 10);
      const matchFrom = !fromDate || submittedAt >= fromDate;
      const matchTo = !toDate || submittedAt <= toDate;

      return matchStatus && matchRegion && matchSearch && matchFrom && matchTo;
    });
  }, [applications, status, region, normalizedSearch, fromDate, toDate]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Danh sách hồ sơ đăng ký Franchisee</h1>
        <p>Quản lý hồ sơ theo trạng thái, khu vực và thời gian nộp.</p>
        {loading && <p>Đang tải dữ liệu từ API...</p>}
        {!!apiError && <p>{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="filters">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="All">Trạng thái: Tất cả</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="All">Khu vực: Tất cả</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          aria-label="Từ ngày"
        />

        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          aria-label="Đến ngày"
        />

        <input
          type="search"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Tìm hồ sơ"
        />
      </div>

      <div className="admin-table-wrap admin-surface">
        <table className="application-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Khu vực</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="application-table__row"
                onClick={() => navigate(`/admin/applications/${item.id}`)}
              >
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.region}</td>
                <td>{item.submittedAt}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ApplicationListPage;