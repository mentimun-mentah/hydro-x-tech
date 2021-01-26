import { Chart as ViserChart, View, Coord, Axis, Interval, Guide } from 'viser-react';
import { scale, insideScale, frontIntervalColor, frontGuidePosition, frontGuideStyle } from "../../data/graphic"

const SUHU = process.env.REACT_APP_SUHU;

const SuhuGraph = ({ data }) => { 

  const dataBackground = [];
  for (let i = 0; i < SUHU; i++) {
    dataBackground.push({
      type: i + '',
      value: 10,
    });
  }

  const dataFront = [];
  for (let i = 0; i < SUHU; i++) {
    const item = { type: i + '', value: 10, };
    if (i === data) {
      item.value = 14;
    }
    if (i > data) {
      item.value = 0;
    }
    dataFront.push(item);
  }

  return(
    <ViserChart 
      container="mountNode"
      forceFit={true}
      height={170}
      scale={scale} animate padding={0}
    >
      <View data={dataBackground}>
        <Coord type="polar" startAngle={-202.5} endAngle={22.5} innerRadius={0.75} radius={0.8} />
        <Interval position="type*value" color="#CBCBCB" size={4} />
      </View>
      <View data={dataBackground} scale={insideScale}>
        <Axis dataKey="value" show={false} />
        <Axis show={false} dataKey="type" grid={null} line={null} tickLine={null} />
        <Coord type="polar" startAngle={-202.5} endAngle={22.5} innerRadius={0.95} radius={0.55} />
        <Interval position="type*value" color="#CBCBCB" size={6} />
      </View>
      <View data={dataFront}>
        <Coord type="polar" startAngle={-202.5} endAngle={22.5} innerRadius={0.75} radius={0.8} />
        <Interval position="type*value" color={frontIntervalColor} opacity={1} size={6} />
        <Guide type="text" position={frontGuidePosition} content={`${data}°C`} style={frontGuideStyle} />
      </View>
    </ViserChart>
  )
}

export default SuhuGraph
