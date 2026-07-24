CREATE TABLE SACH (
    MaSach VARCHAR(10) PRIMARY KEY,
    TenSach VARCHAR(100) NOT NULL,
    TacGia VARCHAR(50),
    NhaXuatBan VARCHAR(50),
    NamXuatBan INT,
    SoLuong INT DEFAULT 0
);

-- Tạo bảng Độc giả
CREATE TABLE DOC_GIA (
    MaDocGia VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(50) NOT NULL,
    NgaySinh DATE,
    SoDienThoai VARCHAR(15),
    Email VARCHAR(50)
);

-- Tạo bảng Phiếu mượn sách
CREATE TABLE PHIEU_MUON (
    MaPhieu VARCHAR(10) PRIMARY KEY,
    MaDocGia VARCHAR(10),
    MaSach VARCHAR(10),
    NgayMuon DATE NOT NULL,
    NgayHenTra DATE,
    NgayTra DATE,
    TrangThai VARCHAR(30) DEFAULT 'Đang mượn',
    FOREIGN KEY (MaDocGia) REFERENCES DOC_GIA(MaDocGia),
    FOREIGN KEY (MaSach) REFERENCES SACH(MaSach)
);
