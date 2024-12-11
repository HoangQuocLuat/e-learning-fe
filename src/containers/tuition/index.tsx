import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { revenueByMonth } from '@graphql/query/admin/total-revenue-by-month';

type YearData = {
    months: string[];
    revenue: number[];
};

const BarChar: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear().toString(); 
    const previousYear = (parseInt(currentYear) - 1).toString(); 

    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [dataByYear, setDataByYear] = useState<Record<string, YearData>>({
        [currentYear]: { months: [], revenue: [] },
        [previousYear]: { months: [], revenue: [] },
    });

    const fetchRevenueByMonth = async (year: string) => {
        const months = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
        ];
        const revenueData: number[] = [];
        
        for (const month of months) {
            try {
                const response = await revenueByMonth({ month, year });
                if (response.success) {
                    revenueData.push(response.data);
                } else {
                    revenueData.push(0);
                }
            } catch {
                revenueData.push(0);
            }
        }

        return {
            months,
            revenue: revenueData
        };
    };

    useEffect(() => {
        const loadData = async () => {
            const currentData = await fetchRevenueByMonth(selectedYear);
            setDataByYear((prevData) => ({
                ...prevData,
                [selectedYear]: currentData
            }));
        };
        loadData();
    }, [selectedYear]);

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
                        name: 'doanh thu (VnĐ)',
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

            updateChart();

            const handleResize = () => {
                myChart.resize();
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                myChart.dispose();
            };
        }
    }, [dataByYear, selectedYear]);

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="yearSelect">Chọn năm: </label>
                <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                        padding: '5px 12px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        color: '#333',
                        width: '150px',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <option value={currentYear}>{currentYear}</option>
                    <option value={previousYear}>{previousYear}</option>
                </select>
            </div>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default BarChar;
