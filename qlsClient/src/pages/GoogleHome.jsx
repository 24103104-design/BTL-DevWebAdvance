import { useState } from "react";

export default function GoogleHome() {
  const [query, setQuery] = useState("");

  return (
    <div style={styles.page}>
      {/* Top nav */}
      <header style={styles.header}>
        <div style={styles.navLinks}>
          <a href="#" style={styles.navLink}>Giới thiệu</a>
          <a href="#" style={styles.navLink}>Cửa hàng</a>
        </div>
        <div style={styles.navIcons}>
          <a href="#" style={styles.navLink}>Gmail</a>
          <a href="#" style={styles.navLink}>Hình ảnh</a>
          <span style={styles.gridIcon}>⠿</span>
          <span style={styles.avatar}>N</span>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <h1 style={styles.logo}>
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </h1>

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
            placeholder=""
          />
          <span style={styles.micIcon}>🎤</span>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.btn}>Tìm kiếm với Google</button>
          <button style={styles.btn}>Tôi đang thấy may mắn</button>
        </div>

        <p style={styles.langLine}>
          Google cung cấp bằng: <a href="#" style={styles.langLink}>Tiếng Việt</a>
        </p>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>Việt Nam</div>
        <div style={styles.footerBottom}>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.navLink}>Giới thiệu</a>
            <a href="#" style={styles.navLink}>Quảng cáo</a>
            <a href="#" style={styles.navLink}>Kinh doanh</a>
          </div>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.navLink}>Quyền riêng tư</a>
            <a href="#" style={styles.navLink}>Điều khoản</a>
            <a href="#" style={styles.navLink}>Cài đặt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    fontSize: 14,
  },
  navLinks: { display: "flex", gap: 24 },
  navIcons: { display: "flex", gap: 20, alignItems: "center" },
  navLink: { color: "#3c4043", textDecoration: "none" },
  gridIcon: { fontSize: 20, cursor: "pointer" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#4285F4",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  logo: { fontSize: 90, marginBottom: 30, letterSpacing: 2 },
  searchBox: {
    display: "flex",
    alignItems: "center",
    width: 580,
    maxWidth: "90vw",
    border: "1px solid #dfe1e5",
    borderRadius: 24,
    padding: "10px 18px",
    boxShadow: "0 1px 6px rgba(32,33,36,.15)",
  },
  searchIcon: { marginRight: 12, color: "#4285F4" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 16 },
  micIcon: { marginLeft: 12, color: "#4285F4" },
  buttonRow: { display: "flex", gap: 12, marginTop: 28 },
  btn: {
    background: "#f8f9fa",
    border: "1px solid #f8f9fa",
    borderRadius: 4,
    color: "#3c4043",
    fontSize: 14,
    padding: "10px 16px",
    cursor: "pointer",
  },
  langLine: { marginTop: 24, fontSize: 13, color: "#3c4043" },
  langLink: { color: "#1a0dab", textDecoration: "none" },
  footer: { background: "#f2f2f2", fontSize: 14, color: "#70757a" },
  footerTop: { padding: "15px 30px", borderBottom: "1px solid #dadce0" },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
  },
  footerLinks: { display: "flex", gap: 24 },
};