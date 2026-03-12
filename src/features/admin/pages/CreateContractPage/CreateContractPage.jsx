import { useState } from "react";
import { Button, Input } from "@/shared/components/atoms";
import "./CreateContractPage.css";

const MOCK_FRANCHISEE = {
  id: "FR-001",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0901234567",
  idNumber: "001099012345",
  address: "123 Đường XYZ, Quận 1, TP.HCM",
  experience: "5 năm kinh doanh bán lẻ",
  investmentAmount: 5000000000,
  region: "TP. Hồ Chí Minh",
  appliedAt: "2026-03-01",
};

const CONTRACT_TERM_OPTIONS = [
  { value: "3", label: "3 năm" },
  { value: "5", label: "5 năm" },
  { value: "10", label: "10 năm" },
];

const CreateContractPage = () => {
  const [royaltyRate, setRoyaltyRate] = useState("8");
  const [term, setTerm] = useState("5");
  const [exclusiveArea, setExclusiveArea] = useState("TP. Hồ Chí Minh");
  const [effectiveDate, setEffectiveDate] = useState("2026-04-01");
  const [contractStatus, setContractStatus] = useState("draft");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const franchisee = MOCK_FRANCHISEE;

  const handleSendContract = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setContractStatus("sent");
    }, 1200);
  };

  return (
    <div className="create-contract-page">
      <header className="create-contract-page__header">
        <h1 className="create-contract-page__title">Tạo & Gửi hợp đồng</h1>
        <p className="create-contract-page__subtitle">
          Franchisee vừa được duyệt — điền thông tin hợp đồng và gửi để ký
        </p>
      </header>

      <section className="create-contract-page__franchisee create-contract-card">
        <h2>Thông tin Franchisee</h2>
        <div className="create-contract-page__franchisee-grid">
          <div><strong>Họ tên:</strong> {franchisee.fullName}</div>
          <div><strong>Email:</strong> {franchisee.email}</div>
          <div><strong>Số điện thoại:</strong> {franchisee.phone}</div>
          <div><strong>Khu vực đăng ký:</strong> {franchisee.region}</div>
          <div><strong>Vốn đầu tư dự kiến:</strong> {franchisee.investmentAmount?.toLocaleString("vi-VN")} VND</div>
        </div>
      </section>

      {!sent ? (
        <form onSubmit={handleSendContract} className="create-contract-page__form create-contract-card">
          <h2>Điều khoản hợp đồng</h2>
          <div className="create-contract-page__form-grid">
            <div className="create-contract-page__field">
              <label>Royalty Rate (%)</label>
              <Input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={royaltyRate}
                onChange={(e) => setRoyaltyRate(e.target.value)}
                placeholder="VD: 8"
              />
              <span className="create-contract-page__hint">Tỷ lệ HQ thu trên mỗi đơn hàng</span>
            </div>
            <div className="create-contract-page__field">
              <label>Thời hạn hợp đồng</label>
              <select
                className="create-contract-page__select"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                {CONTRACT_TERM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="create-contract-page__field">
              <label>Khu vực hoạt động độc quyền</label>
              <Input
                type="text"
                value={exclusiveArea}
                onChange={(e) => setExclusiveArea(e.target.value)}
                placeholder="VD: TP. Hồ Chí Minh"
              />
            </div>
            <div className="create-contract-page__field">
              <label>Ngày bắt đầu hiệu lực</label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>
          </div>

          <section className="create-contract-page__preview create-contract-card create-contract-card--preview">
            <h3>Xem trước nội dung hợp đồng</h3>
            <div className="create-contract-page__preview-body">
              <p><strong>Bên nhượng quyền:</strong> Nike Vietnam (HQ)</p>
              <p><strong>Bên nhận quyền:</strong> {franchisee.fullName}</p>
              <p><strong>Royalty:</strong> {royaltyRate}% trên doanh thu mỗi đơn hàng.</p>
              <p><strong>Thời hạn:</strong> {CONTRACT_TERM_OPTIONS.find((o) => o.value === term)?.label}.</p>
              <p><strong>Khu vực độc quyền:</strong> {exclusiveArea}.</p>
              <p><strong>Ngày hiệu lực:</strong> {effectiveDate}.</p>
              <p className="create-contract-page__preview-note">
                Các quyền và nghĩa vụ chi tiết theo bản hợp đồng chính thức gửi qua email.
              </p>
            </div>
          </section>

          <div className="create-contract-page__actions">
            <Button type="submit" variant="primary" size="large" disabled={sending}>
              {sending ? "Đang gửi…" : "Gửi hợp đồng cho Franchisee"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="create-contract-page__success create-contract-card">
          <h2>Đã gửi hợp đồng</h2>
          <p>Hợp đồng đã được gửi tới <strong>{franchisee.email}</strong> kèm link ký.</p>
          <p><strong>Trạng thái:</strong> <span className="create-contract-page__status create-contract-page__status--sent">Sent</span></p>
          <p className="create-contract-page__next">Sau khi Franchisee ký xong → Hệ thống cấp phát tài khoản tự động.</p>
          <Button variant="secondary" onClick={() => setSent(false)}>Chỉnh sửa lại</Button>
        </div>
      )}
    </div>
  );
};

export default CreateContractPage;
