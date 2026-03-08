import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminMenu from '../components/adminMenu/AdminMenu';
import StatusBadge from '../components/statusBadge/StatusBadge';
import Modal from '../components/modal/Modal';
import './ApplicationDetailPage.css';

const mockData = {
  'app-001': {
    code: 'FA-2026-001',
    fullName: 'Nguyễn Văn A',
    email: 'a.nguyen@mail.com',
    phoneNumber: '0901234567',
    nationalId: '079204001111',
    address: '12 Nguyễn Huệ, Q1, TP.HCM',
    businessExperience: '5 năm vận hành chuỗi cafe',
    expectedCapital: '3,000,000,000',
    preferredRegion: 'Hồ Chí Minh',
    createdAt: '2026-03-01 10:20',
    status: 'Pending',
    history: [
      { time: '2026-03-01 10:20', status: 'Pending', note: 'Hồ sơ vừa được tạo.' },
      { time: '2026-03-01 10:22', status: 'Pending', note: 'Email xác nhận đã gửi ứng viên.' },
    ],
  },
};

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const application = useMemo(() => mockData[id] ?? mockData['app-001'], [id]);

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Chi tiết hồ sơ Franchisee</h1>
      </header>

      <AdminMenu />

      <article className="detail-panel">
        <div className="detail-panel__head">
          <div>
            <p className="detail-code">Mã hồ sơ: {application.code}</p>
            <h2>{application.fullName}</h2>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="detail-grid">
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phoneNumber}</p>
          <p><strong>CCCD:</strong> {application.nationalId}</p>
          <p><strong>Khu vực mong muốn:</strong> {application.preferredRegion}</p>
          <p><strong>Ngày nộp:</strong> {application.createdAt}</p>
          <p><strong>Vốn dự kiến:</strong> {application.expectedCapital} VND</p>
        </div>

        <p><strong>Địa chỉ:</strong> {application.address}</p>
        <p><strong>Kinh nghiệm kinh doanh:</strong> {application.businessExperience}</p>

        <div className="detail-actions">
          <button className="btn btn--ghost" onClick={() => navigate('/admin/applications')}>Quay lại</button>
          <button className="btn btn--danger" onClick={() => setOpenReject(true)}>Reject</button>
          <button className="btn btn--primary" onClick={() => setOpenApprove(true)}>Approve</button>
        </div>
      </article>

      <article className="detail-panel">
        <h3>Lịch sử trạng thái hồ sơ (Audit trail)</h3>
        <ul className="history-list">
          {application.history.map((entry) => (
            <li key={`${entry.time}-${entry.note}`}>
              <span>{entry.time}</span>
              <strong>{entry.status}</strong>
              <p>{entry.note}</p>
            </li>
          ))}
        </ul>
      </article>

      <Modal
        isOpen={openApprove}
        title="Xác nhận duyệt hồ sơ"
        onClose={() => setOpenApprove(false)}
        actions={(
          <>
            <button className="btn btn--ghost" onClick={() => setOpenApprove(false)}>Hủy</button>
            <button className="btn btn--primary" onClick={() => setOpenApprove(false)}>Xác nhận Approve</button>
          </>
        )}
      >
        Hồ sơ sẽ được chuyển bước tạo hợp đồng (Trang 7).
      </Modal>

      <Modal
        isOpen={openReject}
        title="Từ chối hồ sơ"
        onClose={() => setOpenReject(false)}
        actions={(
          <>
            <button className="btn btn--ghost" onClick={() => setOpenReject(false)}>Hủy</button>
            <button className="btn btn--danger" onClick={() => setOpenReject(false)} disabled={!rejectReason.trim()}>
              Xác nhận Reject
            </button>
          </>
        )}
      >
        <label htmlFor="rejectReason">Nhập lý do từ chối:</label>
        <textarea
          id="rejectReason"
          rows="4"
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
          placeholder="Ví dụ: Chưa đủ vốn theo yêu cầu khu vực..."
        />
      </Modal>
    </section>
  );
};

export default ApplicationDetailPage;