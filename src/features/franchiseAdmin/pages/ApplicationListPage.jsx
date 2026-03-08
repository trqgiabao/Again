import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../components/adminMenu/AdminMenu';
import StatusBadge from '../components/statusBadge/StatusBadge';
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

    const normalizedSearch = search.trim().toLowerCase();

  const data = useMemo(() => {
    return mockApplications.filter((item) => {
            const fullName = item.fullName.toLowerCase();
      const email = item.email.toLowerCase();
      const matchStatus = status === 'All' || item.status === status;
      const matchRegion = region === 'All' || item.region === region;
      const matchSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);
      const matchFrom = !fromDate || item.submittedAt >= fromDate;
      const matchTo = !toDate || item.submittedAt <= toDate;

      return matchStatus && matchRegion && matchSearch && matchFrom && matchTo;
    });
   }, [status, region, normalizedSearch, fromDate, toDate]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Danh sách hồ sơ đăng ký Franchisee</h1>
        <p>Quản lý hồ sơ theo trạng thái, khu vực và thời gian nộp.</p>
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
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tên / email"
        />
      </div>

      <div className="table-wrapper">
        <table className="application-table">
          <thead>
            <tr>
              <th>Tên</th>
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