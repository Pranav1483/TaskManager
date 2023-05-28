import React from 'react';
import Chart from 'react-google-charts';

const MultiLineChart = ({ LineData }) => {
    const getTickLabels = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        const tickLabels = [];
        for (let i = 3; i >= 0; i--) {
          tickLabels.push(weekdays[(today - i + 7) % 7]);
        }
        for (let i = 1; i <= 3; i++) {
          tickLabels.push(weekdays[(today + i) % 7]);
        }
        return tickLabels;
    };

    const LineChartOptions = {
        chartArea: {
            bottom: 50,
            left: 30,
            right: 30,
            top: 30,
        },
        hAxis: {
            ticks: getTickLabels(),
            title: null,
            titleGap: 1,
            gridlines: { color: 'transparent' },
            baselineColor: 'transparent',
            textStyle: {
                color: 'white',
            },
        },
        vAxis: {
            ticks: [],
            title: null,
            titleGap: 1,
            gridlines: { color: 'transparent' },
            baselineColor: 'transparent',
        },
        series: {
            0: { curveType: 'function' },
        },
        legend: 'none',
        backgroundColor: 'transparent',
        intervals: { style: "points", pointSize: 10, fillOpacity: 1 },
    };

    return (
        <Chart
        width={'600px'}
        height={'311px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={LineData}
        options={LineChartOptions}
        rootProps={{ 'data-testid': '2' }}
        />
    );
};

export default MultiLineChart;
