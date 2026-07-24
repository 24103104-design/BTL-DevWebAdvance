import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DocGiaEntity } from '../doc-gia/doc-gia.entity';
import { SachEntity } from '../sach/sach.entity';

export enum TrangThaiPhieuMuon {
  DANG_MUON = 'Dang muon',
  DA_TRA = 'Da tra',
  QUA_HAN = 'Qua han',
}

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

  @Column({ name: 'NgayTra', type: 'date', nullable: true })
  ngayTra?: Date;

  @Column({
    name: 'TrangThai',
    length: 30,
    default: TrangThaiPhieuMuon.DANG_MUON,
  })
  trangThai!: TrangThaiPhieuMuon;

  // maDocGia/maSach columns above stay as-is (matches existing DB schema);
  // these relations let us load full DocGia/Sach info via .find({ relations: [...] })
  @ManyToOne(() => DocGiaEntity, (docGia) => docGia.phieuMuons)
  @JoinColumn({ name: 'MaDocGia' })
  docGia!: DocGiaEntity;

  @ManyToOne(() => SachEntity, (sach) => sach.phieuMuons)
  @JoinColumn({ name: 'MaSach' })
  sach!: SachEntity;
}
