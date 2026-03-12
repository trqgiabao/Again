import React, { useState } from 'react';
import './StaffManager.css';

const mockStaff = [
    { id: 1, name: "Nguyễn Văn A", email: "vana@nike.vn", role: "Manager", store: "Nike HCMC 01", status: "Active" },
    { id: 2, name: "Trần Thị B", email: "thib@nike.vn", role: "Staff", store: "Nike HCMC 01", status: "Active" },
    { id: 3, name: "Lê Văn C", email: "vanc@nike.vn", role: "Staff", store: "Nike Hanoi Flagship", status: "Inactive" },
    { id: 4, name: "Phạm Thị D", email: "thid@nike.vn", role: "Staff", store: "Nike Đà Nẵng", status: "Active" },
    { id: 5, name: "Hoàng Văn E", email: "vane@nike.vn", role: "Manager", store: "Nike Đà Nẵng", status: "Active" },
];

export default function StaffManager() {
    const [staffList, setStaffList] = useState(mockStaff);
    const [showModal, setShowModal] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Staff', store: '' });

    // Filter states
    const [roleFilter, setRoleFilter] = useState('All');
    const [storeFilter, setStoreFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStaff = staffList.filter(staff => {
        const matchRole = roleFilter === 'All' || staff.role === roleFilter;
        const matchStore = storeFilter === 'All' || staff.store === storeFilter;
        const matchSearch =
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.store.toLowerCase().includes(searchTerm.toLowerCase());
        return matchRole && matchStore && matchSearch;
    });

    const handleAddStaff = (e) => {
        e.preventDefault();
        if (!newStaff.name || !newStaff.email || !newStaff.store) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        setStaffList([
            ...staffList,
            {
                id: staffList.length + 1,
                ...newStaff,
                status: 'Active'
            }
        ]);
        setShowModal(false);
        setNewStaff({ name: '', email: '', role: 'Staff', store: '' });
    };

    const toggleStatus = (id) => {
        setStaffList(staffList.map(s =>
            s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
        ));
    };

    // Lấy danh sách store unique để filter
    const uniqueStores = [...new Set(staffList.map(s => s.store))];

    return (
        <div className="admin-page">
            <h1 className="page-title">Staff Management</h1>

            <div className="filter-bar">
                <select
                    className="filter-select"
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                >
                    <option>Role: All</option>
                    <option>Manager</option>
                    <option>Staff</option>
                </select>

                <select
                    className="filter-select"
                    value={storeFilter}
                    onChange={e => setStoreFilter(e.target.value)}
                >
                    <option>Store: All</option>
                    {uniqueStores.map(store => (
                        <option key={store}>{store}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Tìm theo tên, email, store..."
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + Add staff
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Store</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.map(staff => (
                            <tr key={staff.id}>
                                <td>{staff.name}</td>
                                <td>{staff.email}</td>
                                <td>{staff.role}</td>
                                <td>{staff.store}</td>
                                <td className={`status ${staff.status.toLowerCase()}`}>
                                    {staff.status}
                                </td>
                                <td>
                                    <button
                                        className={`btn-toggle ${staff.status === 'Active' ? 'deactivate' : 'activate'}`}
                                        onClick={() => toggleStatus(staff.id)}
                                    >
                                        {staff.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                    </button>
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
                        <h2>Tạo tài khoản mới</h2>
                        <form onSubmit={handleAddStaff}>
                            <div className="form-group">
                                <label>Full name</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newStaff.email}
                                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={newStaff.role}
                                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Store</label>
                                <input
                                    type="text"
                                    value={newStaff.store}
                                    onChange={e => setNewStaff({ ...newStaff, store: e.target.value })}
                                    required
                                    placeholder="Ví dụ: Nike HCMC 01"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add staff
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}