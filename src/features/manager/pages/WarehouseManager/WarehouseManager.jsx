import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { sendWarehouseReportToFranchise } from '../../api/warehouseApi';
import './WarehouseManager.css';

const defectReasons = [
  'Quantity shortage',
  'Torn packaging',
  'Water damage',
  'Wrong color / wrong product',
  'Other issue',
];

const initialInboundItems = [
  { id: 1, sku: 'NK-AF1-WH-42', name: 'Nike Air Force 1 White', expectedQty: 20, receivedQty: 20, status: 'pending', reason: '' },
  { id: 2, sku: 'NK-AM90-BK-41', name: 'Nike Air Max 90 Black', expectedQty: 12, receivedQty: 10, status: 'pending', reason: '' },
  { id: 3, sku: 'NK-RN-JKT-M', name: 'Nike Running Jacket M', expectedQty: 15, receivedQty: 15, status: 'pending', reason: '' },
];

const initialOutboundItems = [
  { id: 1, sku: 'NK-TS-DRY-L', name: 'Nike Dri-FIT T-shirt L', qty: 24, destination: 'District 1 Franchise' },
  { id: 2, sku: 'NK-CL-ESS-BL', name: 'Nike Club Essentials Blue', qty: 16, destination: 'Binh Thanh Franchise' },
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
  const [franchiseName, setFranchiseName] = useState('District 1 Franchise');
  const [inboundQuery, setInboundQuery] = useState('');
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
      generatedAt: new Date().toLocaleString('en-US'),
    };
  }, [inboundItems]);

  const filteredInboundItems = useMemo(() => {
    const keyword = inboundQuery.trim().toLowerCase();

    if (!keyword) {
      return inboundItems;
    }

    return inboundItems.filter((item) =>
      item.name.toLowerCase().includes(keyword) || item.sku.toLowerCase().includes(keyword),
    );
  }, [inboundItems, inboundQuery]);

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
        toast.warning('Please review every inbound item before signing the inbound confirmation.');
        return;
      }

      if (!inboundSignOff.managerName.trim()) {
        toast.warning('Please enter the Warehouse Manager name before signing inbound confirmation.');
        return;
      }

      setInboundSignOff((prev) => ({ ...prev, signedAt: new Date().toISOString() }));
      toast.success('Inbound confirmation signed successfully.');
      return;
    }

    if (!outboundSignOff.managerName.trim()) {
      toast.warning('Please enter the Warehouse Manager name before signing outbound confirmation.');
      return;
    }

    setOutboundSignOff((prev) => ({ ...prev, signedAt: new Date().toISOString() }));
    toast.success('Outbound confirmation signed successfully.');
  };

  const canSendReport =
    !!inboundSignOff.signedAt &&
    !!outboundSignOff.signedAt &&
    report.failed.every((item) => item.reason.trim());

  const handleSendReport = async () => {
    if (!canSendReport) {
      toast.warning('Complete both confirmations and provide failure reasons for all failed items before sending.');
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
      toast.success(`Report sent to ${franchiseName}. Report ID: ${result.reportId}`);
    } catch (error) {
      toast.error('Failed to send report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="warehouse-page">
      <header className="page-header card">
        <p className="eyebrow">Warehouse Operations</p>
        <h1>Warehouse Manager Dashboard</h1>
        <p className="page-subtitle">
          Confirm outbound shipments, inspect inbound quality, and submit structured reports to the franchise team.
        </p>
      </header>

      <section className="panel card">
        <div className="section-header">
          <h2>
            <span aria-hidden="true">📤</span>
            Outbound Confirmation
          </h2>
          <p>Review outgoing items and capture manager sign-off for dispatch confirmation.</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th className="align-right">Quantity</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              {outboundItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td className="align-right">{item.qty}</td>
                  <td>{item.destination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="signoff-row">
          <div className="field manager-field">
            <label htmlFor="outbound-manager-name">Warehouse Manager Name</label>
            <input
              id="outbound-manager-name"
              type="text"
              placeholder="Enter full name"
              value={outboundSignOff.managerName}
              onChange={(e) => setOutboundSignOff((prev) => ({ ...prev, managerName: e.target.value }))}
            />
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => handleSignOff('outbound')}>
            Sign Outbound Confirmation
          </button>
          {outboundSignOff.signedAt && (
            <span className="signed-time">Signed at: {new Date(outboundSignOff.signedAt).toLocaleString('en-US')}</span>
          )}
        </div>
      </section>

      <section className="panel card">
        <div className="section-header">
          <h2>
            <span aria-hidden="true">📥</span>
            Inbound Confirmation
          </h2>
          <p>Evaluate each inbound item as Passed or Failed. Failed items require a clear failure reason.</p>
        </div>

        <div className="controls-row">
          <div className="field search-field">
            <label htmlFor="inbound-search">Search inbound items</label>
            <input
              id="inbound-search"
              type="search"
              value={inboundQuery}
              onChange={(e) => setInboundQuery(e.target.value)}
              placeholder="Filter by SKU or product name"
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th className="align-right">Expected Qty</th>
                <th className="align-right">Received Qty</th>
                <th>Status</th>
                <th>Failure Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredInboundItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td className="align-right">{item.expectedQty}</td>
                  <td className="align-right">
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
                      <option value="pending">Pending</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.reason}
                      disabled={item.status !== 'failed'}
                      onChange={(e) => updateItem(item.id, { reason: e.target.value })}
                    >
                      <option value="">Select reason</option>
                      {defectReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!filteredInboundItems.length && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <p>No inbound items match this search.</p>
                      <span>Try a different SKU or product keyword.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="signoff-row">
          <div className="field manager-field">
            <label htmlFor="inbound-manager-name">Warehouse Manager Name</label>
            <input
              id="inbound-manager-name"
              type="text"
              placeholder="Enter full name"
              value={inboundSignOff.managerName}
              onChange={(e) => setInboundSignOff((prev) => ({ ...prev, managerName: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" type="button" onClick={() => handleSignOff('inbound')}>
            Sign Inbound Confirmation
          </button>
          {inboundSignOff.signedAt && (
            <span className="signed-time">Signed at: {new Date(inboundSignOff.signedAt).toLocaleString('en-US')}</span>
          )}
        </div>
      </section>

      <section className="panel card report">
        <div className="section-header">
          <h2>
            <span aria-hidden="true">📊</span>
            Franchise Inspection Report
          </h2>
          <p>Send finalized inbound/outbound confirmations and quality results to the receiving franchise.</p>
        </div>

        <div className="report-header">
          <div className="field franchise-field">
            <label htmlFor="franchise-name">Report recipient</label>
            <input
              id="franchise-name"
              value={franchiseName}
              onChange={(e) => setFranchiseName(e.target.value)}
              placeholder="Franchise name"
            />
          </div>
          <div>
            <button className="btn btn-primary" type="button" disabled={isSending} onClick={handleSendReport}>
              {isSending ? 'Sending...' : 'Send Report'}
            </button>
          </div>
        </div>

        <div className="report-grid">
          <div className="report-block passed">
            <h3>Passed Items ({report.passed.length})</h3>
            <ul>
              {report.passed.map((item) => (
                <li key={item.id}>{item.sku} - {item.name}</li>
              ))}
              {!report.passed.length && <li className="empty-list">No passed items yet.</li>}
            </ul>
          </div>

          <div className="report-block failed">
            <h3>Failed Items ({report.failed.length})</h3>
            <ul>
              {report.failed.map((item) => (
                <li key={item.id}>
                  {item.sku} - {item.name} | Reason: <strong>{item.reason || 'Reason pending'}</strong>
                </li>
              ))}
              {!report.failed.length && <li className="empty-list">No failed items.</li>}
            </ul>
          </div>
        </div>

        <p className="hint">Generated: {report.generatedAt} | Total items reviewed: {report.total}</p>
        {lastSentInfo && (
          <div className="success-note" role="status">
            <span aria-hidden="true">✅</span>
            <div>
              <p>Successfully sent to {lastSentInfo.recipient}.</p>
              <small>
                Sent at {new Date(lastSentInfo.sentAt).toLocaleString('en-US')} · Report ID: {lastSentInfo.reportId}
              </small>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}