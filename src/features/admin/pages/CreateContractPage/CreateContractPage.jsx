import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button, Input } from "@/shared/components/atoms";
import { getAdminApplicationDetail } from "@/features/franchiseAdmin/api/adminApplications";
import { createContract, sendContract } from "../../api/contracts";
import "./CreateContractPage.css";

const CreateContractPage = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(!!applicationId);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [region, setRegion] = useState("");
  const [contractFileUrl, setContractFileUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("authToken") : null;

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAdminApplicationDetail(applicationId, { token })
      .then((data) => {
        if (!cancelled) {
          setApplication(data);
          if (!region && data.preferredRegion) setRegion(data.preferredRegion);
          if (!startDate) {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            setStartDate(d.toISOString().slice(0, 10));
          }
          if (!endDate) {
            const d = new Date();
            d.setFullYear(d.getFullYear() + 3);
            setEndDate(d.toISOString().slice(0, 10));
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không tải được thông tin hồ sơ.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [applicationId, token]);

  const handleSendContract = (e) => {
    e.preventDefault();
    const packageSelectionId = application?.packageSelectionId;
    if (!packageSelectionId) {
      setSendError("Hồ sơ chưa có gói được chọn. Consultant cần chọn gói trước (Task 1.9).");
      return;
    }
    if (!startDate || !endDate) {
      setSendError("Vui lòng nhập Ngày bắt đầu và Ngày kết thúc.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setSendError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    setSending(true);
    setSendError(null);
    createContract(
      packageSelectionId,
      { startDate, endDate, region, contractFileUrl },
      { token }
    )
      .then((created) => {
        const contractId = created?.id ?? created?.contractId;
        if (!contractId) {
          throw new Error("Không nhận được ID hợp đồng từ server.");
        }
        return sendContract(contractId, { token });
      })
      .then(() => {
        setSent(true);
      })
      .catch((err) => {
        setSendError(err.message || "Tạo hoặc gửi hợp đồng thất bại.");
      })
      .finally(() => {
        setSending(false);
      });
  };

  const formatVND = (value) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value));
  };

  if (!applicationId) {
    return (
      <div className="create-contract-page">
        <header className="create-contract-page__header">
          <h1 className="create-contract-page__title">Tạo & Gửi hợp đồng</h1>
          <p className="create-contract-page__subtitle">Chưa chọn hồ sơ. Vui lòng chọn hồ sơ từ danh sách hoặc vào từ trang chi tiết sau khi Approve.</p>
        </header>
        <div className="create-contract-card">
          <Link to="/admin/applications" className="create-contract-page__link">← Quay lại danh sách hồ sơ</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="create-contract-page">
        <header className="create-contract-page__header">
          <h1 className="create-contract-page__title">Tạo & Gửi hợp đồng</h1>
        </header>
        <div className="create-contract-card">
          <p className="create-contract-page__loading">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="create-contract-page">
        <header className="create-contract-page__header">
          <h1 className="create-contract-page__title">Tạo & Gửi hợp đồng</h1>
        </header>
        <div className="create-contract-card">
          <p className="create-contract-page__error">{error || "Không tìm thấy hồ sơ."}</p>
          <Link to="/admin/applications" className="create-contract-page__link">← Quay lại danh sách hồ sơ</Link>
        </div>
      </div>
    );
  }

  const franchisee = application;
  const packageSelectionId = application.packageSelectionId;
  const canCreate = !!packageSelectionId;

  return (
    <div className="create-contract-page">
      <header className="create-contract-page__header">
        <h1 className="create-contract-page__title">Tạo & Gửi hợp đồng</h1>
        <p className="create-contract-page__subtitle">
          Hồ sơ đã chọn gói (PackageSelected) — điền thông tin hợp đồng, tạo rồi gửi cho Franchisee ký.
        </p>
      </header>

      <section className="create-contract-page__franchisee create-contract-card">
        <h2>Thông tin Franchisee</h2>
        <div className="create-contract-page__franchisee-grid">
          <div><strong>Họ tên:</strong> {franchisee.fullName}</div>
          <div><strong>Email:</strong> {franchisee.email}</div>
          <div><strong>Số điện thoại:</strong> {franchisee.phoneNumber}</div>
          <div><strong>Khu vực mong muốn:</strong> {franchisee.preferredRegion}</div>
          <div><strong>Vốn đầu tư dự kiến:</strong> {formatVND(franchisee.expectedCapital)}</div>
        </div>
      </section>

      {!canCreate && (
        <div className="create-contract-card create-contract-page__warning">
          <p><strong>Chưa thể tạo hợp đồng.</strong> Hồ sơ chưa có gói được chọn (Consultant cần thực hiện Task 1.9 — Chọn gói Franchise). Khi backend trả về <code>packageSelectionId</code> trong chi tiết hồ sơ, form bên dưới sẽ mở.</p>
          <Link to="/admin/applications" className="create-contract-page__link">← Quay lại danh sách hồ sơ</Link>
        </div>
      )}

      {canCreate && !sent ? (
        <form onSubmit={handleSendContract} className="create-contract-page__form create-contract-card">
          <h2>Thông tin hợp đồng (BE Task 2.4 + 2.5)</h2>
          {sendError && <p className="create-contract-page__error">{sendError}</p>}
          <div className="create-contract-page__form-grid">
            <div className="create-contract-page__field">
              <label>Ngày bắt đầu (startDate)</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="create-contract-page__field">
              <label>Ngày kết thúc (endDate)</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="create-contract-page__field">
              <label>Khu vực (region)</label>
              <Input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="VD: Binh Duong"
              />
            </div>
            <div className="create-contract-page__field">
              <label>URL file hợp đồng (contractFileUrl, tùy chọn)</label>
              <Input
                type="url"
                value={contractFileUrl}
                onChange={(e) => setContractFileUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <section className="create-contract-page__preview create-contract-card create-contract-card--preview">
            <h3>Xem trước</h3>
            <div className="create-contract-page__preview-body">
              <p><strong>Bên nhận quyền:</strong> {franchisee.fullName}</p>
              <p><strong>Ngày bắt đầu:</strong> {startDate}</p>
              <p><strong>Ngày kết thúc:</strong> {endDate}</p>
              <p><strong>Khu vực:</strong> {region || "—"}</p>
              <p className="create-contract-page__preview-note">Sau khi bấm Gửi: tạo hợp đồng (Drafted) rồi gửi email link ký cho Franchisee (Sent).</p>
            </div>
          </section>

          <div className="create-contract-page__actions">
            <Button type="submit" variant="primary" size="large" disabled={sending}>
              {sending ? "Đang tạo & gửi…" : "Tạo hợp đồng & Gửi cho Franchisee"}
            </Button>
          </div>
        </form>
      ) : canCreate && sent ? (
        <div className="create-contract-page__success create-contract-card">
          <h2>Đã tạo và gửi hợp đồng</h2>
          <p>Hợp đồng đã được gửi tới <strong>{franchisee.email}</strong> kèm link ký.</p>
          <p><strong>Trạng thái:</strong> <span className="create-contract-page__status create-contract-page__status--sent">Sent</span></p>
          <p className="create-contract-page__next">Franchisee ký xong (FranchiseeSigned) → Admin ký (Task 2.6) → FullySigned → IAM tạo tài khoản Franchisee.</p>
          <Link to="/admin/applications" className="create-contract-page__link">← Quay lại danh sách hồ sơ</Link>
        </div>
      ) : null}
    </div>
  );
};

export default CreateContractPage;
