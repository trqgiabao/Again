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
  'app-002': {
    code: 'FA-2026-002',
    fullName: 'Trần Thị B',
    email: 'b.tran@mail.com',
    phoneNumber: '0912345678',
    nationalId: '001298009876',
    address: '95 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    businessExperience: '3 năm quản lý cửa hàng thời trang',
    expectedCapital: '2,500,000,000',
    preferredRegion: 'Hà Nội',
    createdAt: '2026-02-28 09:05',
    status: 'Approved',
    history: [
      { time: '2026-02-28 09:05', status: 'Pending', note: 'Hồ sơ vừa được tạo.' },
      { time: '2026-03-01 15:10', status: 'Approved', note: 'Đã duyệt sau vòng phỏng vấn.' },
    ],
  },
  'app-003': {
    code: 'FA-2026-003',
    fullName: 'Lê Minh C',
    email: 'c.le@mail.com',
    phoneNumber: '0933334444',
    nationalId: '048201006543',
    address: '22 Ông Ích Khiêm, Hải Châu, Đà Nẵng',
    businessExperience: '2 năm kinh doanh chuỗi đồ uống',
    expectedCapital: '1,800,000,000',
    preferredRegion: 'Đà Nẵng',
    createdAt: '2026-02-25 14:40',
    status: 'Rejected',
    history: [
      { time: '2026-02-25 14:40', status: 'Pending', note: 'Hồ sơ vừa được tạo.' },
      { time: '2026-02-26 10:00', status: 'Rejected', note: 'Ứng viên chưa đáp ứng mức vốn tối thiểu.' },
    ],
  },
  'app-004': {
    code: 'FA-2026-004',
    fullName: 'Phạm Thu D',
    email: 'd.pham@mail.com',
    phoneNumber: '0977771122',
    nationalId: '025196002468',
    address: '118 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    businessExperience: '4 năm vận hành nhà hàng gia đình',
    expectedCapital: '2,900,000,000',
    preferredRegion: 'Hồ Chí Minh',
    createdAt: '2026-02-24 08:50',
    status: 'Pending',
    history: [
      { time: '2026-02-24 08:50', status: 'Pending', note: 'Hồ sơ vừa được tạo.' },
      { time: '2026-02-24 09:15', status: 'Pending', note: 'Đã chuyển HR kiểm tra ban đầu.' },
    ],
  },
};

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const application = useMemo(() => mockData[id], [id]);

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!application) {
    return (
      <section className="admin-page">
        <header className="admin-page__header">
          <h1>Chi tiết hồ sơ Franchisee</h1>
          <p>Không tìm thấy hồ sơ với mã đã chọn.</p>
        </header>

        <AdminMenu />

        <article className="detail-panel admin-surface">
          <button
            className="btn btn--ghost"
            onClick={() => navigate('/admin/applications')}
          >
            Quay lại danh sách hồ sơ
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Chi tiết hồ sơ Franchisee</h1>
        <p>Theo dõi thông tin ứng viên, trạng thái xét duyệt và lịch sử xử lý hồ sơ.</p>
      </header>

      <AdminMenu />

      <article className="detail-panel admin-surface">
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
          <button
            className="btn btn--ghost"
            onClick={() => navigate('/admin/applications')}
          >
            Quay lại
          </button>
          <button
            className="btn btn--danger"
            onClick={() => setOpenReject(true)}
          >
            Reject
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setOpenApprove(true)}
          >
            Approve
          </button>
        </div>
      </article>

      <article className="detail-panel admin-surface">
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
        actions={
          <>
            <button
              className="btn btn--ghost"
              onClick={() => setOpenApprove(false)}
            >
              Hủy
            </button>
            <button
              className="btn btn--primary"
              onClick={() => setOpenApprove(false)}
            >
              Xác nhận Approve
            </button>
          </>
        }
      >
        Hồ sơ sẽ được chuyển bước tạo hợp đồng.
      </Modal>

      <Modal
        isOpen={openReject}
        title="Từ chối hồ sơ"
        onClose={() => setOpenReject(false)}
        actions={
          <>
            <button
              className="btn btn--ghost"
              onClick={() => setOpenReject(false)}
            >
              Hủy
            </button>
            <button
              className="btn btn--danger"
              onClick={() => setOpenReject(false)}
              disabled={!rejectReason.trim()}
            >
              Xác nhận Reject
            </button>
          </>
        }
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