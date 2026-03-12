import React, { useState } from 'react';
import './PurchaseOrder.css';

const mockCatalog = [
    { id: 1, name: "Nike Air Max 90", price: 139, maxQty: 100 },
    { id: 2, name: "Nike Dunk Low Retro", price: 125, maxQty: 80 },
    { id: 3, name: "Nike Air Jordan 1 Mid", price: 145, maxQty: 50 },
    { id: 4, name: "Nike Pegasus 40", price: 139, maxQty: 120 },
];

const mockPOs = [
    { id: 'PO-001', date: '2025-03-01', status: 'Submitted', total: 2500, items: 20 },
    { id: 'PO-002', date: '2025-02-20', status: 'Approved', total: 4800, items: 35 },
    { id: 'PO-003', date: '2025-02-10', status: 'Rejected', total: 1200, items: 10, reason: 'Thiếu ngân sách' },
    { id: 'PO-004', date: '2025-01-15', status: 'Delivered', total: 3800, items: 28 },
];

export default function PurchaseOrder() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [poList] = useState(mockPOs);

    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPOs = poList.filter(po => {
        const matchStatus = statusFilter === 'All' || po.status === statusFilter;
        const matchSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    const addToPO = (product, qty = 1) => {
        const existing = selectedItems.find(item => item.id === product.id);
        if (existing) {
            setSelectedItems(selectedItems.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + qty } : item
            ));
        } else {
            setSelectedItems([...selectedItems, { ...product, qty }]);
        }
    };

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    };

    const handleSubmitPO = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm!");
            return;
        }
        alert("PO đã được gửi lên HQ! (Mock success)");
        setSelectedItems([]);
        setShowCreateModal(false);
    };

    return (
        <div className="admin-page">
            <h1 className="page-title">Purchase Order</h1>

            <div className="filter-bar">
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option>Status: All</option>
                    <option>Submitted</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Delivered</option>
                </select>

                <input
                    type="text"
                    placeholder="Tìm theo mã PO..."
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowCreateModal(true)}>
                    + Create New PO
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>PO code</th>
                            <th>Date of Creation</th>
                            <th>Status</th>
                            <th>Total (USD)</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPOs.map(po => (
                            <tr key={po.id}>
                                <td>{po.id}</td>
                                <td>{po.date}</td>
                                <td className={`status ${po.status.toLowerCase()}`}>
                                    {po.status}
                                </td>
                                <td>${po.total.toLocaleString()}</td>
                                <td>{po.items}</td>
                                <td>
                                    <button className="btn-detail">Detail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Tạo Purchase Order mới</h2>

                        <div className="sub-title">Catalog sản phẩm từ HQ</div>
                        <div className="catalog-grid">
                            {mockCatalog.map(product => (
                                <div key={product.id} className="catalog-card">
                                    <h4>{product.name}</h4>
                                    <p>Giá: ${product.price}</p>
                                    <p>Tối đa: {product.maxQty} đôi</p>
                                    <div className="add-controls">
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.maxQty}
                                            defaultValue="1"
                                            className="qty-input"
                                            id={`qty-${product.id}`}
                                        />
                                        <button
                                            className="add-btn-small"
                                            onClick={() => {
                                                const qtyInput = document.getElementById(`qty-${product.id}`);
                                                const qty = parseInt(qtyInput.value) || 1;
                                                addToPO(product, qty);
                                            }}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sub-title">Sản phẩm trong PO</div>
                        {selectedItems.length > 0 ? (
                            <div className="selected-items">
                                {selectedItems.map((item, idx) => (
                                    <div key={idx} className="selected-row">
                                        <span>{item.name} × {item.qty}</span>
                                        <span>${(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="total-row">
                                    <span>Tổng giá trị</span>
                                    <span>${calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="no-items">Chưa chọn sản phẩm nào</p>
                        )}

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                                Hủy
                            </button>
                            <button className="btn-submit" onClick={handleSubmitPO}>
                                Gửi lên HQ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}