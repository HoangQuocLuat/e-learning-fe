import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// Khai báo kiểu của dữ liệu năm
type YearData = {
    months: string[];
    revenue: number[];
};

// Khai báo các năm hợp lệ cho `dataByYear`
type YearKey = '2023' | '2022' | '2021';

const BarChar: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<YearKey>('2023'); // Năm mặc định

    // Giả lập dữ liệu từ API cho các năm
    const dataByYear: Record<YearKey, YearData> = {
        '2023': {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenue: [1200, 1500, 1800, 1300, 1600, 2000, 2200, 1700, 1900, 2100, 2500, 2300]
        },
        '2022': {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenue: [1000, 1400, 1600, 1200, 1500, 1700, 2000, 1600, 1800, 1900, 2300, 2200]
        },
        '2021': {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenue: [900, 1300, 1500, 1100, 1400, 1600, 1900, 1500, 1700, 1800, 2200, 2100]
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            const myChart = echarts.init(chartRef.current);

            const updateChart = () => {
                const currentData = dataByYear[selectedYear];
                const option: echarts.EChartsOption = {
                    xAxis: {
                        type: 'category',
                        data: currentData.months
                    },
                    yAxis: {
                        type: 'value',
                        name: 'Revenue ($)',
                    },
                    series: [
                        {
                            data: currentData.revenue,
                            type: 'bar',
                            name: 'Monthly Revenue',
                            color: '#5470C6'
                        }
                    ]
                };
                myChart.setOption(option);
            };

            // Cập nhật biểu đồ khi chọn năm mới
            updateChart();

            // Xử lý khi resize
            const handleResize = () => {
                myChart.resize();
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                myChart.dispose();
            };
        }
    }, [selectedYear]); // Chạy lại useEffect khi selectedYear thay đổi

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="yearSelect">Chọn năm: </label>
                <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value as YearKey)}
                    style={{
                        padding: '5px 12px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        width: '150px',
                        cursor: 'pointer',
                        outline: 'none', // Loại bỏ đường viền mặc định khi focus
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' // Tạo hiệu ứng bóng mờ nhẹ
                    }}
                >
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                </select>
            </div>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default BarChar;
