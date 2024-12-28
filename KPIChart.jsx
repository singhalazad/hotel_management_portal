import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const KPIChart = (props) => {
  const { data } = props;
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    const dom = chartRef.current;
    const chartInstance = echarts.init(dom, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    setMyChart(chartInstance);

    return () => {
      chartInstance.dispose();
    };
  }, []);

  useEffect(() => {
    if (myChart && data) {
      const series = data[0]?.slice(1).map(() => ({
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      }));

      const option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: data
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
          { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
          { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
          { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
          { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: { focus: 'self' },
            label: { formatter: '{b}: {@2024} ({d}%)' },
            encode: { itemName: 'Years' }
          }
        ]
      };

      myChart.setOption(option);

      const updateAxisPointer = (event) => {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: 'pie',
              label: { formatter: '{b}: {@[' + dimension + ']} ({d}%)' },
              encode: { value: dimension, tooltip: dimension }
            }
          });
        }
      };

      myChart.on('updateAxisPointer', updateAxisPointer);

      window.addEventListener('resize', () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener('resize', () => {
          myChart.resize();
        });
      };
    }
  }, [data, myChart]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default KPIChart;
