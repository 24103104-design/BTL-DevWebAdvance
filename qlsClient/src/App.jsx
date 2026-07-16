import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">LibraryHub</a>
          <div className="navbar-nav ms-auto">
            <a className="nav-link active" href="#">Trang chủ</a>
            <a className="nav-link" href="#">Sách</a>
            <a className="nav-link" href="#">Mượn trả</a>
            <a className="nav-link" href="#">Liên hệ</a>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">Quản lý thư viện</h1>
          <p className="lead text-muted">Một giao diện Bootstrap đơn giản và đẹp mắt.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">Sách</h5>
                <p className="card-text">Quản lý danh mục sách và số lượng tồn kho.</p>
                <a href="#" className="btn btn-primary">Xem chi tiết</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">Độc giả</h5>
                <p className="card-text">Theo dõi thông tin độc giả và lịch sử mượn.</p>
                <a href="#" className="btn btn-outline-primary">Xem chi tiết</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">Mượn trả</h5>
                <p className="card-text">Kiểm soát quy trình mượn, trả sách nhanh chóng.</p>
                <a href="#" className="btn btn-success">Xem chi tiết</a>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title">Danh sách sách</h5>
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Mã sách</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S001</td>
                  <td>React cho người mới</td>
                  <td>Nguyễn A</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>S002</td>
                  <td>NestJS thực chiến</td>
                  <td>Trần B</td>
                  <td>7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>© 2026 LibraryHub. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;
