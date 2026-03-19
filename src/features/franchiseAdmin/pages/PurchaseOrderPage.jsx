// // import { useEffect, useMemo, useState } from "react";
// import { httpRequest } from "@/shared/api/http";
// import AdminMenu from "../components/adminMenu/AdminMenu.jsx";
// import "./PurchaseOrderPage.css";

// const formatCurrency = (value) => {
//   if (typeof value === "string") return value;

//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: 0,
//   }).format(Number(value) || 0);
// };

// export default function PurchaseOrderPage() {
//   const [purchaseOrders, setPurchaseOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadPurchaseOrders = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const data = await httpRequest(
//           "https://freckly-hyperarchaeological-thea.ngrok-free.dev/api/admin/purchase-orders"
//         );

//         setPurchaseOrders(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setPurchaseOrders([]);
//         setError(err?.message || "Unable to load purchase orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPurchaseOrders();
//   }, []);

//   const sortedOrders = useMemo(() => {
//     return [...purchaseOrders].sort((a, b) =>
//       (b.date || "").localeCompare(a.date || "")
//     );
//   }, [purchaseOrders]);

//   return (
//     <section className="admin-page">
//       <header className="admin-page__header">
//         <h1>Purchase Orders</h1>
//         <p>View and manage purchase orders from the admin panel.</p>
//       </header>

//       <AdminMenu />

//       {loading && <p>Loading purchase orders...</p>}

//       {!!error && (
//         <div className="page-error">
//           <p>{error}</p>
//           <button
//             className="store-card__action"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && sortedOrders.length === 0 && (
//         <p>No purchase orders found.</p>
//       )}

//       {!loading && !error && sortedOrders.length > 0 && (
//         <div className="po-table-wrap">
//           <table className="po-table">
//             <thead>
//               <tr>
//                 <th>PO Code</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Total (USD)</th>
//                 <th>Items</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedOrders.map((po) => (
//                 <tr key={po.id || `${po.date}-${po.total}`}>
//                   <td>{po.id}</td>
//                   <td>{po.date}</td>
//                   <td className={`status ${String(po.status || "").toLowerCase()}`}>
//                     {po.status}
//                   </td>
//                   <td>${formatCurrency(po.total)}</td>
//                   <td>{po.items ?? 0}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AdminMenu from "../components/adminMenu/AdminMenu.jsx";
import "./PurchaseOrderPage.css";

const mockPurchaseOrders = [
  {
    id: "PO-001",
    date: "2025-03-01",
    status: "Submitted",
    total: 2500,
    items: 20,
  },
  {
    id: "PO-002",
    date: "2025-02-20",
    status: "Approved",
    total: 4800,
    items: 35,
  },
  {
    id: "PO-003",
    date: "2025-02-10",
    status: "Rejected",
    total: 1200,
    items: 10,
  },
];

const formatCurrency = (value) => {
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  );
};

export default function PurchaseOrderPage() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoCode, setNewPoCode] = useState("");
  const [newPoTotal, setNewPoTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPurchaseOrders(mockPurchaseOrders);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleCreatePO = () => {
    if (!newPoCode) {
      toast.warning("Please provide a Purchase Order code.");
      return;
    }

    setPurchaseOrders((prev) => [
      {
        id: newPoCode,
        date: new Date().toISOString().slice(0, 10),
        status: "Submitted",
        total: Number(newPoTotal) || 0,
        items: 0,
      },
      ...prev,
    ]);

    setShowCreateModal(false);
    setNewPoCode("");
    setNewPoTotal(0);
    toast.success("Purchase order created (local demo only).");
  };

  const sortedOrders = useMemo(() => {
    return [...purchaseOrders].sort((a, b) =>
      (b.date || "").localeCompare(a.date || ""),
    );
  }, [purchaseOrders]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Purchase Orders</h1>
        <p>View and manage purchase orders from the admin panel.</p>
      </header>

      <AdminMenu />

      {loading && <p>Loading purchase orders...</p>}

      {!loading && sortedOrders.length === 0 && (
        <p>No purchase orders found. Use "Create PO" to add a new one.</p>
      )}

      {!loading && sortedOrders.length > 0 && (
        <div className="po-action-bar">
          <button
            className="po-add-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create PO
          </button>
        </div>
      )}

      {!loading && sortedOrders.length > 0 && (
        <div className="po-table-wrap">
          <table className="po-table">
            <thead>
              <tr>
                <th>PO Code</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total (USD)</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((po) => (
                <tr key={po.id || `${po.date}-${po.total}`}>
                  <td>{po.id}</td>
                  <td>{po.date}</td>
                  <td
                    className={`status ${String(po.status || "").toLowerCase()}`}
                  >
                    {po.status}
                  </td>
                  <td>${formatCurrency(po.total)}</td>
                  <td>{po.items ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}