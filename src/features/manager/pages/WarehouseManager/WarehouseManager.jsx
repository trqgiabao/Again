import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { sendWarehouseReportToFranchise } from '../../api/warehouseApi';
import './WarehouseManager.css';

const defectReasons = [
  'Thiếu số lượng',
  'Hàng bị rách',
  'Hàng bị nhiễm nước',
  'Sai màu / sai sản phẩm',
  'Lỗi khác',
];

const initialInboundItems = [
  { id: 1, sku: 'NK-AF1-WH-42', name: 'Nike Air Force 1 White', expectedQty: 20, receivedQty: 20, status: 'pending', reason: '' },
  { id: 2, sku: 'NK-AM90-BK-41', name: 'Nike Air Max 90 Black', expectedQty: 12, receivedQty: 10, status: 'pending', reason: '' },
  { id: 3, sku: 'NK-RN-JKT-M', name: 'Nike Running Jacket M', expectedQty: 15, receivedQty: 15, status: 'pending', reason: '' },
];

const initialOutboundItems = [
  { id: 1, sku: 'NK-TS-DRY-L', name: 'Nike Dri-FIT T-shirt L', qty: 24, destination: 'Franchise Quận 1' },
  { id: 2, sku: 'NK-CL-ESS-BL', name: 'Nike Club Essentials Blue', qty: 16, destination: 'Franchise Bình Thạnh' },
];

const createSignOff = () => ({
  managerName: '',
  signedAt: null,
});

export default function WarehouseManager() {
  const [inboundItems, setInboundItems] = useState(initialInboundItems);
  const [outboundItems] = useState(initialOutboundItems);
  const [inboundSignOff, setInboundSignOff] = useState(createSignOff());
  const [outboundSignOff, setOutboundSignOff] = useState(createSignOff());
  const [franchiseName, setFranchiseName] = useState('Franchise Quận 1');
  const [isSending, setIsSending] = useState(false);
  const [lastSentInfo, setLastSentInfo] = useState(null);

  const allItemsReviewed = inboundItems.every((item) => item.status !== 'pending');

  const report = useMemo(() => {
    const passed = inboundItems.filter((item) => item.status === 'passed');
    const failed = inboundItems.filter((item) => item.status === 'failed');

    return {
      passed,
      failed,
      total: inboundItems.length,
      generatedAt: new Date().toLocaleString('vi-VN'),
    };
  }, [inboundItems]);

  const updateItem = (id, updates) => {
    setInboundItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleStatusChange = (id, status) => {
    if (status === 'passed') {
      updateItem(id, { status, reason: '' });
      return;
    }

    updateItem(id, { status });
  };

  const handleSignOff = (type) => {
    if (type === 'inbound') {
      if (!allItemsReviewed) {
        toast.warning('Bạn cần kiểm tra và đánh giá toàn bộ sản phẩm trước khi ký nhập hàng.');
        return;
      }

      if (!inboundSignOff.managerName.trim()) {
        toast.warning('Vui lòng nhập tên Warehouse Manager để ký xác nhận nhập hàng.');
        return;
      }

      setInboundSignOff((prev) => ({ ...prev, signedAt: new Date().toISOString() }));
      toast.success('Đã ký xác nhận nhập hàng thành công.');
      return;
    }

    if (!outboundSignOff.managerName.trim()) {
      toast.warning('Vui lòng nhập tên Warehouse Manager để ký xác nhận xuất hàng.');
      return;
    }

    setOutboundSignOff((prev) => ({ ...prev, signedAt: new Date().toISOString() }));
    toast.success('Đã ký xác nhận xuất hàng thành công.');
  };

  const canSendReport =
    !!inboundSignOff.signedAt &&
    !!outboundSignOff.signedAt &&
    report.failed.every((item) => item.reason.trim());

  const handleSendReport = async () => {
    if (!canSendReport) {
      toast.warning('Hoàn tất ký nhập/xuất và đảm bảo mọi item lỗi đều có lý do trước khi gửi báo cáo.');
      return;
    }

    try {
      setIsSending(true);
      const result = await sendWarehouseReportToFranchise({
        franchiseName,
        inboundSignOff,
        outboundSignOff,
        report,
      });

      setLastSentInfo(result);
      toast.success(`Đã gửi báo cáo tới ${franchiseName}. Mã báo cáo: ${result.reportId}`);
    } catch (error) {
      toast.error('Gửi báo cáo thất bại. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="warehouse-page">
      <h1>Warehouse Manager - Ký gửi trạng thái nhập/xuất</h1>

      <section className="panel">
        <h2>1) Ký xác nhận xuất hàng</h2>
        <div className="signoff-row">
          <input
            type="text"
            placeholder="Tên Warehouse Manager"
            value={outboundSignOff.managerName}
            onChange={(e) => setOutboundSignOff((prev) => ({ ...prev, managerName: e.target.value }))}
          />
          <button type="button" onClick={() => handleSignOff('outbound')}>
            Ký xác nhận xuất hàng
          </button>
          {outboundSignOff.signedAt && (
            <span className="signed-time">Đã ký lúc: {new Date(outboundSignOff.signedAt).toLocaleString('vi-VN')}</span>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Sản phẩm</th>
              <th>Số lượng xuất</th>
              <th>Điểm đến</th>
            </tr>
          </thead>
          <tbody>
            {outboundItems.map((item) => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>2) Kiểm tra chất lượng & ký xác nhận nhập hàng</h2>
        <p className="hint">Warehouse Manager cần đánh giá từng item đạt/không đạt và ghi lý do chi tiết cho item không đạt.</p>

        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Sản phẩm</th>
              <th>SL kỳ vọng</th>
              <th>SL thực nhận</th>
              <th>Trạng thái</th>
              <th>Lý do không đạt</th>
            </tr>
          </thead>
          <tbody>
            {inboundItems.map((item) => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.expectedQty}</td>
                <td>
                  <input
                    className="qty-input"
                    type="number"
                    min="0"
                    value={item.receivedQty}
                    onChange={(e) => updateItem(item.id, { receivedQty: Number(e.target.value) || 0 })}
                  />
                </td>
                <td>
                  <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)}>
                    <option value="pending">Chưa đánh giá</option>
                    <option value="passed">Đạt</option>
                    <option value="failed">Không đạt</option>
                  </select>
                </td>
                <td>
                  <select
                    value={item.reason}
                    disabled={item.status !== 'failed'}
                    onChange={(e) => updateItem(item.id, { reason: e.target.value })}
                  >
                    <option value="">-- Chọn lý do --</option>
                    {defectReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="signoff-row">
          <input
            type="text"
            placeholder="Tên Warehouse Manager"
            value={inboundSignOff.managerName}
            onChange={(e) => setInboundSignOff((prev) => ({ ...prev, managerName: e.target.value }))}
          />
          <button type="button" onClick={() => handleSignOff('inbound')}>
            Ký xác nhận nhập hàng
          </button>
          {inboundSignOff.signedAt && (
            <span className="signed-time">Đã ký lúc: {new Date(inboundSignOff.signedAt).toLocaleString('vi-VN')}</span>
          )}
        </div>
      </section>

      <section className="panel report">
        <h2>3) Báo cáo kiểm tra gửi Franchise</h2>
        <div className="report-header">
          <div>
            <label>Franchise nhận báo cáo</label>
            <input value={franchiseName} onChange={(e) => setFranchiseName(e.target.value)} />
          </div>
          <div>
            <button type="button" disabled={isSending} onClick={handleSendReport}>
              {isSending ? 'Đang gửi...' : 'Gửi báo cáo qua API/Notification'}
            </button>
          </div>
        </div>

        <div className="report-grid">
          <div>
            <h3>Sản phẩm đạt yêu cầu ({report.passed.length})</h3>
            <ul>
              {report.passed.map((item) => (
                <li key={item.id}>{item.sku} - {item.name}</li>
              ))}
              {!report.passed.length && <li>Chưa có sản phẩm đạt.</li>}
            </ul>
          </div>

          <div>
            <h3>Sản phẩm không đạt ({report.failed.length})</h3>
            <ul>
              {report.failed.map((item) => (
                <li key={item.id}>
                  {item.sku} - {item.name} | Lý do: <strong>{item.reason || 'Chưa chọn lý do'}</strong>
                </li>
              ))}
              {!report.failed.length && <li>Không có sản phẩm lỗi.</li>}
            </ul>
          </div>
        </div>

        <p className="hint">Generated: {report.generatedAt} | Tổng item kiểm tra: {report.total}</p>
        {lastSentInfo && (
          <p className="success-note">
            Đã gửi thành công tới {lastSentInfo.recipient} ({new Date(lastSentInfo.sentAt).toLocaleString('vi-VN')}) - ID: {lastSentInfo.reportId}
          </p>
        )}
      </section>
    </div>
  );
}