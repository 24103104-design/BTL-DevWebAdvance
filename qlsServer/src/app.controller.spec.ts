import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SachService } from './sach/sach.service';
import { DocGiaService } from './doc-gia/doc-gia.service';
import { PhieuMuonService } from './phieu-muon/phieu-muon.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: SachService,
          useValue: { countAll: jest.fn().mockResolvedValue(5) },
        },
        {
          provide: DocGiaService,
          useValue: { countAll: jest.fn().mockResolvedValue(4) },
        },
        {
          provide: PhieuMuonService,
          useValue: {
            countByStatus: jest.fn().mockResolvedValue(2),
            countOverdue: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('dashboard summary', () => {
    it('should return real dashboard summary values', async () => {
      const result = await appController.getDashboardSummary();

      expect(result).toEqual({
        totalBooks: 5,
        totalReaders: 4,
        activeBorrows: 2,
        overdueBorrows: 1,
      });
    });
  });
});
