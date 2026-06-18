import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'SACH' })
export class SachEntity {
  @PrimaryColumn({ name: 'MaSach', length: 10 })
  maSach: string;

  @Column({ name: 'TenSach', length: 100, nullable: false })
  tenSach: string;

  @Column({ name: 'TacGia', length: 50, nullable: true })
  tacGia: string;

  @Column({ name: 'NhaXuatBan', length: 50, nullable: true })
  nhaXuatBan: string;

  @Column({ name: 'NamXuatBan', type: 'int', nullable: true })
  namXuatBan: number;

  @Column({ name: 'SoLuong', type: 'int', default: 0 })
  soLuong: number;
}