export const scale = [{
  dataKey: 'type',
  range: [0, 1],
}, {
  dataKey: 'value',
  sync: true,
}];

export const insideScale = [{ dataKey: 'type', tickCount: 3 }];
export const frontIntervalColor = ['value', '#80c8f7-#3590ff'];
export const frontGuidePosition = ['50%', '68%'];
export const frontGuideStyle = {
  fill: '#8a8a8a',
  fontSize: 34,
  textAlign: 'center',
  textBaseline: 'middle',
};



export const scaleWater = [ { dataKey: 'value', min: 0, max: 100, }, ];
export const pathWater = 'M381.759 0h292l-.64 295.328-100.127-100.096-94.368 94.368C499.808 326.848 512 369.824 512 415.712c0 141.376-114.56 256-256 256-141.376 0-256-114.624-256-256s114.624-256 256-256c48.8 0 94.272 13.92 133.12 37.632l93.376-94.592L381.76 0zM128.032 415.744c0 70.688 57.312 128 128 128s128-57.312 128-128-57.312-128-128-128-128 57.312-128 128z'


export const defaultOptionPH = {
  chart: {
    id: 'realtime',
    type: 'area',
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
  },
  yaxis: { min: 0 },
  sparkline: { enabled: true },
  dataLabels: { enabled: false },
  xaxis: {
    type: 'datetime',
    range: 10,
    labels: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  plotOptions: {
    bar: { columnWidth: '45%', }
  },
  stroke: { curve: 'smooth', width: 3, },
  subtitle: {
    text: 'Power of Hydrogen',
    offsetX: 30,
    style: {
      fontSize: '14px',
      cssClass: 'apexcharts-yaxis-title'
    }
  },
  colors: ['#54a0ff'],
}
