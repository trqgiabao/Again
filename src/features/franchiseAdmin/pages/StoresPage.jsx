// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { httpRequest } from "@/shared/api/http";
// import AdminMenu from "../components/adminMenu/AdminMenu.jsx";
// import "./StoresPage.css";

// export default function StoresPage() {
//   const navigate = useNavigate();
//   const [stores, setStores] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadStores = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const data = await httpRequest(
//           "https://freckly-hyperarchaeological-thea.ngrok-free.dev/api/admin/stores"
//         );
//         setStores(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setStores([]);
//         setError(
//           err?.message ||
//             "Unable to load stores. Please verify the backend API or check network connectivity.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStores();
//   }, []);

//   const handleCreatePO = (store) => {
//     navigate("/admin/purchase-orders", { state: { store } });
//   };

//   return (
//     <section className="admin-page">
//       <header className="admin-page__header">
//         <h1>Stores</h1>
//         <p>View store inventory and manage purchase orders.</p>
//       </header>

//       <AdminMenu />

//       {loading && <p>Loading stores...</p>}
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

//       {!loading && !error && stores.length === 0 && (
//         <p>
//           No stores available. Please check the backend API or contact your
//           system administrator.
//         </p>
//       )}

//       {!loading && !error && stores.length > 0 && (
//         <div className="stores-grid">
//           {stores.map((store) => (
//             <article key={store.id} className="store-card admin-surface">
//               <div className="store-card__info">
//                 <div className="store-card__icon" aria-hidden="true">
//                   🏬
//                 </div>
//                 <div>
//                   <h2 className="store-card__name">{store.name}</h2>
//                   <p className="store-card__address">{store.address}</p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 className="store-card__action"
//                 onClick={() => handleCreatePO(store)}
//               >
//                 + Create Purchase Order
//               </button>
//             </article>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../components/adminMenu/AdminMenu.jsx";
import "./StoresPage.css";

const mockStores = [
  {
    id: "ST-001",
    name: "Store Quận 1",
    address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    manager: "Nguyễn Văn An",
    phone: "0901 234 567",
    email: "storeq1@franchise.vn",
    status: "Operating",
    openTime: "07:00 - 22:00",
  },
  {
    id: "ST-002",
    name: "Store Cầu Giấy",
    address: "88 Trần Thái Tông, Cầu Giấy, Hà Nội",
    manager: "Lê Thu Hà",
    phone: "0902 888 999",
    email: "storecaugiay@franchise.vn",
    status: "Operating",
    openTime: "07:30 - 21:30",
  },
  {
    id: "ST-003",
    name: "Store Hải Châu",
    address: "35 Bạch Đằng, Hải Châu, Đà Nẵng",
    manager: "Phạm Đức Minh",
    phone: "0903 111 222",
    email: "storehaichau@franchise.vn",
    status: "Maintenance",
    openTime: "08:00 - 21:00",
  },
  {
    id: "ST-004",
    name: "Store Ninh Kiều",
    address: "102 Hòa Bình, Ninh Kiều, Cần Thơ",
    manager: "Trần Kim Oanh",
    phone: "0904 456 123",
    email: "storeninhkieu@franchise.vn",
    status: "Operating",
    openTime: "07:00 - 22:00",
  },
];

export default function StoresPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    setStores(mockStores);
    setSelectedStore(mockStores[0]);
  }, []);

  const handleCreatePO = (store) => {
    navigate("/admin/purchase-orders", { state: { store } });
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Stores</h1>
        <p>View store inventory and manage purchase orders.</p>
      </header>

      <AdminMenu />

      {stores.length === 0 && (
        <p>No stores available for demo display.</p>
      )}

      {stores.length > 0 && (
        <div className="stores-layout">
          <div className="stores-grid">
            {stores.map((store) => (
              <article
                key={store.id}
                className={`store-card admin-surface ${selectedStore?.id === store.id ? "is-active" : ""}`}
                onClick={() => setSelectedStore(store)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedStore(store);
                  }
                }}
              >
                <div className="store-card__info">
                  <div className="store-card__icon" aria-hidden="true">
                    🏬
                  </div>
                  <div>
                    <h2 className="store-card__name">{store.name}</h2>
                    <p className="store-card__address">{store.address}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="store-card__action"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCreatePO(store);
                  }}
                >
                  + Create Purchase Order
                </button>
              </article>
            ))}
          </div>

          {selectedStore && (
            <aside className="store-detail admin-surface">
              <h2>Store Details</h2>
              <dl className="store-detail__list">
                <div>
                  <dt>Store ID</dt>
                  <dd>{selectedStore.id}</dd>
                </div>
                <div>
                  <dt>Name</dt>
                  <dd>{selectedStore.name}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{selectedStore.address}</dd>
                </div>
                <div>
                  <dt>Manager</dt>
                  <dd>{selectedStore.manager}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{selectedStore.phone}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{selectedStore.email}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{selectedStore.status}</dd>
                </div>
                <div>
                  <dt>Open Time</dt>
                  <dd>{selectedStore.openTime}</dd>
                </div>
              </dl>
            </aside>
          )}
        </div>
      )}
    </section>
  );
}