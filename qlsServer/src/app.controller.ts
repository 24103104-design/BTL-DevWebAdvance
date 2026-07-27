import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SachService } from './sach/sach.service';
import { DocGiaService } from './doc-gia/doc-gia.service';
import { PhieuMuonService } from './phieu-muon/phieu-muon.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sachService: SachService,
    private readonly docGiaService: DocGiaService,
    private readonly phieuMuonService: PhieuMuonService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.getDashboardSummary();
  }

  @Get('dashboard/summary')
  async getDashboardSummary() {
    const [totalBooks, totalReaders, activeBorrows, overdueBorrows] =
      await Promise.all([
        this.sachService.countAll(),
        this.docGiaService.countAll(),
        this.phieuMuonService.countByStatus('Dang muon'),
        this.phieuMuonService.countOverdue(),
      ]);

    return {
      totalBooks,
      totalReaders,
      activeBorrows,
      overdueBorrows,
    };
  }

  @Get('dashboard/recent-activity')
  async getRecentActivity() {
    const items = await this.phieuMuonService.recentActivity(5);
    return items;
  }

  @Get('dashboard/top-books')
  async getTopBooks() {
    const items = await this.phieuMuonService.topBorrowedBooks(3);
    return items;
  }

  @Get('dashboard/overdues')
  async getOverdues() {
    const items = await this.phieuMuonService.findOverdueDetails();
    return items;
  }

  @Get('statistics/borrow-trend')
  async getBorrowTrend(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.phieuMuonService.borrowTrend({ period, startDate, endDate });
  }

  @Get('statistics/by-category')
  async getBorrowByCategory() {
    return this.phieuMuonService.borrowByCategory();
  }

  @Get('statistics/borrow-status')
  async getBorrowStatus() {
    return this.phieuMuonService.borrowStatus();
  }

  @Get('statistics/top-readers')
  async getTopReaders() {
    return this.phieuMuonService.topReaders(5);
  }
}
