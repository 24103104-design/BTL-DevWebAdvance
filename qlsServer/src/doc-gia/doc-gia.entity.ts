import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PhieuMuonEntity } from '../phieu-muon/phieu-muon.entity';

@Entity({ name: 'DOC_GIA' })
export class DocGiaEntity {
  @PrimaryColumn({ name: 'MaDocGia', length: 10 })
  maDocGia!: string;

  @Column({ name: 'HoTen', length: 50, nullable: false })
  hoTen!: string;

  @Column({ name: 'NgaySinh', type: 'date', nullable: true })
  ngaySinh!: Date;

  @Column({ name: 'SoDienThoai', length: 15, nullable: true })
  soDienThoai!: string;

  @Column({ name: 'Email', length: 50, nullable: true })
  email!: string;

  @OneToMany(() => PhieuMuonEntity, (phieuMuon) => phieuMuon.docGia)
  phieuMuons!: PhieuMuonEntity[];
}
