import React, { useState } from 'react';
import './StoreManager.css';

const mockStores = [
    { id: 1, name: "Nike HCMC 01", address: "123 Lê Lợi, Q1", manager: "Nguyễn Văn A", revenue: "45.2B", status: "Active", area: "Hồ Chí Minh" },
    { id: 2, name: "Nike Hanoi Flagship", address: "45 Trần Hưng Đạo", manager: "Trần Thị B", revenue: "62.8B", status: "Active", area: "Hà Nội" },
    { id: 3, name: "Nike Đà Nẵng", address: "78 Nguyễn Văn Linh", manager: "Lê Văn C", revenue: "31.9B", status: "Inactive", area: "Đà Nẵng" },
];

export default function StoreManager() {
    const [stores, setStores] = useState(mockStores);
    const [showModal, setShowModal] = useState(false);
    const [newStore, setNewStore] = useState({ name: '', address: '', phone: '', area: '' });

    const handleAddStore = (e) => {
        e.preventDefault();
        setStores([...stores, { id: stores.length + 1, ...newStore, manager: 'Chưa gán', revenue: '0B', status: 'Active' }]);
        setShowModal(false);
        setNewStore({ name: '', address: '', phone: '', area: '' });
    };

    return (
        <div className="admin-page">
            <h1 className="page-title">Store Manager</h1>

            <div className="filter-bar">
                <select className="filter-select">
                    <option>Status: All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
                <select className="filter-select">
                    <option>Area: All</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                </select>
                <input type="text" placeholder="Search tên / địa chỉ" className="search-input" />
            </div>

            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + Add Store
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Store</th>
                            <th>Address</th>
                            <th>Manager</th>
                            <th>Revenue</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>{store.address}</td>
                                <td>{store.manager}</td>
                                <td className="revenue">{store.revenue}</td>
                                <td className={`status ${store.status.toLowerCase()}`}>{store.status}</td>
                                <td>
                                    <button className="btn-detail">Detail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Add new store</h2>
                        <form onSubmit={handleAddStore}>
                            <div className="form-group">
                                <label>Store Name</label>
                                <input type="text" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" value={newStore.phone} onChange={e => setNewStore({ ...newStore, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Area</label>
                                <input type="text" value={newStore.area} onChange={e => setNewStore({ ...newStore, area: e.target.value })} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-submit">Thêm Store</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}