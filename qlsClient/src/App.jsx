import { useState } from "react";
import BorrowingPage from "./pages/borrowing/BorrowingPage";
import ReadersPage from "./pages/readers/ReadersPage";
import "./styles/dashboard-ui.css";

const TABS = [
  { key: "borrowing", label: "Borrowing" },
  { key: "readers", label: "Readers" },
  { key: "dashboard", label: "Dashboard" },
];

function DashboardContent() {
  return (
    <div className="page-card">
      <div className="page-card-header">
        <h2>Dashboard</h2>
      </div>
      <div style={{ padding: 16 }}>
        <p>Đây là trang dashboard tạm thời.</p>
        <p>Hiện tại chỉ có trang Reader và Borrowing hoạt động.</p>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("borrowing");

  let content;
  if (activeTab === "borrowing") content = <BorrowingPage />;
  else if (activeTab === "readers") content = <ReadersPage />;
  else content = <DashboardContent />;

  return (
    <div>
      <div className="page-card" style={{ margin: 16 }}>
        <div className="page-card-header">
          <h2>QLS Client Demo</h2>
        </div>
        <div className="tabs-row">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={"tab-item" + (activeTab === tab.key ? " active" : "")}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {content}
    </div>
  );
}

export default App;