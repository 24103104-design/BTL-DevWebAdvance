import "./StatusBadge.css";

const STATUS_MAP = {
  "Dang muon": { label: "Đang mượn", className: "badge-blue" },
  "Da tra": { label: "Đã trả", className: "badge-green" },
  "Qua han": { label: "Quá hạn", className: "badge-red" },
};

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: "badge-gray" };
  return <span className={`status-badge ${info.className}`}>{info.label}</span>;
}
