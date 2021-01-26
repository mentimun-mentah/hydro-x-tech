import { Chart as ViserChart, Interval, Guide } from 'viser-react';
import { scaleWater, pathWater } from "../../data/graphic"

const TINGGI_AIR = process.env.REACT_APP_TINGGI_AIR;

const AirGraph = ({ data }) => {
  const dataWater = [{
    gender: 'Tinggi Air',
    path: pathWater,
    value: Math.round((data / TINGGI_AIR) * 100),
  }];

  return(
    <ViserChart
      container="mountNode"
      forceFit={true}
      height={163}
      data={dataWater}
      padding={50}
      scale={scaleWater}
    >
      <Interval
        position="gender*value"
        color="gender"
        shape="liquid-fill-gauge"
        style={{ lineWidth: 8, opacity: 0.75, }}
      />
      <Guide
        type="text"
        top={true}
        content={Math.round((data / TINGGI_AIR) * 100) + '%'}
        position={{ gender: 'Tinggi Air', value: 50, }}
        style={{ fontSize: 30, textAlign: 'center', }}
      />
    </ViserChart>
  )
}

export default AirGraph
