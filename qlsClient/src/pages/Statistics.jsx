import { useEffect, useMemo, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as XLSX from 'xlsx';
import {
  getBorrowTrend,
  getBorrowByCategory,
  getBorrowStatus,
  getTopReaders,
} from '../services/statisticsService.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const periodOptions = [
  { label: '7 ngày', value: '7d' },
  { label: '30 ngày', value: '30d' },
  { label: '3 tháng', value: '3m' },
  { label: '1 năm', value: '1y' },
];

const rankIcon = (index) => {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return `${index + 1}`;
};

const parseIsoWeekToDate = (isoWeekString) => {
  const [year, week] = isoWeekString.split('-').map(Number);
  if (!year || !week) return null;

  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay();
  const isoWeekStart = new Date(simple);
  isoWeekStart.setDate(simple.getDate() - ((day + 6) % 7) + 1);
  return isoWeekStart;
};

const formatTrendLabel = (label, currentPeriod) => {
  if (!label) return '';

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return label;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  if (currentPeriod === '7d' || currentPeriod === '30d' || currentPeriod === 'custom') {
    return formatDateLabel(label);
  }

  if (currentPeriod === '3m') {
    const date = parseIsoWeekToDate(label);
    if (!date) return label;
    return `Th${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  if (currentPeriod === '1y') {
    const [year, month] = label.split('-');
    if (!month) return label;
    return `Th${Number(month)}/${year}`;
  }

  return label;
};

const getReaderDisplayName = (reader) => reader.name || reader.hoTen || reader.fullName || 'Chưa có tên';

export default function Statistics() {
  const [period, setPeriod] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topReaders, setTopReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const useCustomRange = period === 'custom';

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');

      const trendParams = useCustomRange
        ? { startDate: customStart, endDate: customEnd }
        : { period };

      const [trendRes, categoryRes, statusRes, readersRes] = await Promise.all([
        getBorrowTrend(trendParams),
        getBorrowByCategory(),
        getBorrowStatus(),
        getTopReaders(),
      ]);

      setTrendData(Array.isArray(trendRes) ? trendRes : []);
      setCategoryData(Array.isArray(categoryRes) ? categoryRes : []);
      setStatusData(Array.isArray(statusRes) ? statusRes : []);
      setTopReaders(Array.isArray(readersRes) ? readersRes : []);
    } catch (err) {
      console.error('Statistics load error:', err);
      setError(err?.message || 'Không tải được dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useCustomRange && (!customStart || !customEnd)) return;
    loadStatistics();
  }, [period, customStart, customEnd]);

  const chartTrend = useMemo(
    () => ({
      labels: trendData.map((item) => item.period),
      datasets: [
        {
          label: 'Lượt mượn',
          data: trendData.map((item) => item.count),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.16)',
          fill: true,
          tension: 0.25,
          pointRadius: 4,
          pointBackgroundColor: '#f97316',
        },
      ],
    }),
    [trendData],
  );
  const chartCategory = useMemo(
    () => ({
      labels: categoryData.map((item) => item.category),
      datasets: [
        {
          label: 'Số lượt mượn',
          data: categoryData.map((item) => item.borrowCount),
          backgroundColor: '#f97316',
          borderRadius: 10,
        },
      ],
    }),
    [categoryData],
  );

  const totalStatusCount = statusData.reduce((sum, item) => sum + Number(item.count), 0);
  const statusWithPercent = statusData.map((item) => ({
    ...item,
    percent: totalStatusCount ? ((Number(item.count) / totalStatusCount) * 100).toFixed(1) : '0.0',
  }));

  const chartStatus = useMemo(
    () => ({
      labels: statusData.map((item) => item.status),
      datasets: [
        {
          data: statusData.map((item) => item.count),
          backgroundColor: ['#2563eb', '#16a34a', '#dc2626'],
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    }),
    [statusData],
  );

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    const trendSheet = XLSX.utils.json_to_sheet(
      trendData.map((item) => ({
        'Chu kỳ': item.period,
        'Lượt mượn': item.count,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, trendSheet, 'Lượt mượn theo thời gian');

    const categorySheet = XLSX.utils.json_to_sheet(
      categoryData.map((item) => ({
        'Thể loại / Tác giả': item.category,
        'Số lượt mượn': item.borrowCount,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Theo thể loại');

    const statusSheet = XLSX.utils.json_to_sheet(
      statusWithPercent.map((item) => ({
        'Trạng thái': item.status,
        'Số lượng': item.count,
        'Phần trăm': `${item.percent}%`,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Tình trạng phiếu');

    const readersSheet = XLSX.utils.json_to_sheet(
      topReaders.map((item, index) => ({
        Hạng: index + 1,
        'Tên độc giả': getReaderDisplayName(item),
        'Tổng lượt mượn': item.totalBorrows,
        'Số sách đang mượn': item.currentBorrows ?? 0,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, readersSheet, 'Top độc giả');

    XLSX.writeFile(workbook, `thong-ke-thu-vien-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return;
    setPeriod('custom');
  };

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <div>
          <h2>Phân tích thống kê thư viện</h2>
          <p>Đánh giá hoạt động mượn sách theo thời gian và độc giả hàng đầu.</p>
        </div>
        <button className="btn btn-primary statistics-export-button" onClick={exportToExcel} disabled={loading}>
          Xuất Excel
        </button>
      </div>

      <div className="statistics-filters">
        <div className="statistics-filter-buttons">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`btn ${period === option.value ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setPeriod(option.value);
                setCustomStart('');
                setCustomEnd('');
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="statistics-filter-custom">
          <label>
            Từ ngày
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
          </label>
          <label>
            Đến ngày
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </label>
          <button type="button" className="btn btn-outline-secondary" onClick={applyCustomRange} disabled={!customStart || !customEnd}>
            Áp dụng
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="statistics-grid statistics-grid-top">
        <div className="statistics-card statistics-card-chart">
          <div className="statistics-card-header">
            <h3>Lượt mượn sách theo thời gian</h3>
          </div>
          <div className="statistics-chart-wrapper">
            <Line
              data={chartTrend}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#334155',
                      callback: function(value) {
                        const label = this.getLabelForValue ? this.getLabelForValue(value) : String(value);
                        return formatTrendLabel(String(label), period);
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="statistics-card statistics-card-chart">
          <div className="statistics-card-header">
            <h3>Thể loại sách được mượn nhiều nhất</h3>
          </div>
          <div className="statistics-chart-wrapper">
            <Bar
              data={chartCategory}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { color: '#334155' } },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#334155',
                      stepSize: 1,
                      precision: 0,
                      callback: (value) => (Number.isInteger(value) ? value : ''),
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="statistics-grid statistics-grid-bottom">
        <div className="statistics-card statistics-card-compact">
          <div className="statistics-card-header">
            <h3>Tình trạng phiếu mượn</h3>
          </div>
          <div className="statistics-chart-wrapper statistics-donut-wrapper">
            <Doughnut data={chartStatus} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
          <div className="statistics-status-list">
            {statusWithPercent.map((item) => (
              <div key={item.status} className="status-item">
                <span>{item.status}</span>
                <span>{item.count} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="statistics-card statistics-card-readers">
          <div className="statistics-card-header">
            <h3>Top 5 độc giả mượn nhiều nhất</h3>
          </div>
          <div className="statistics-table-wrap">
            <table className="table statistics-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Độc giả</th>
                  <th>Lượt mượn</th>
                  <th>Đang mượn</th>
                </tr>
              </thead>
              <tbody>
                {topReaders.map((reader, index) => (
                  <tr key={getReaderDisplayName(reader) + index}>
                    <td>{rankIcon(index)}</td>
                    <td>{getReaderDisplayName(reader)}</td>
                    <td>{reader.totalBorrows ?? 0}</td>
                    <td>{reader.currentBorrows ?? 0}</td>
                  </tr>
                ))}
                {topReaders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      Chưa có dữ liệu độc giả
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {loading && <div className="statistics-loading">Đang tải dữ liệu...</div>}
    </div>
  );
}
