import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'PHIEU_MUON' })
export class PhieuMuonEntity {
  @PrimaryColumn({ name: 'MaPhieu', length: 10 })
  maPhieu!: string;

  @Column({ name: 'MaDocGia', length: 10 })
  maDocGia!: string;

  @Column({ name: 'MaSach', length: 10 })
  maSach!: string;

  @Column({ name: 'NgayMuon', type: 'date' })
  ngayMuon!: Date;

  @Column({ name: 'NgayHenTra', type: 'date', nullable: true })
  ngayHenTra?: Date;

  @Column({ name: 'TrangThai', length: 30, default: 'Dang muon' })
  trangThai!: string;
}
