import * as React from "react"
import Svg, { Path } from "react-native-svg"
const RectangleHistoryCirclePlus = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props} style={{transform:[{scale:1.2}]}}>
    <Path
      d="M352 368a144 144 0 1 1 288 0 144 144 0 1 1-288 0zm144-80c-8.8 0-16 7.2-16 16v48h-48c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16v-48h48c8.8 0 16-7.2 16-16s-7.2-16-16-16h-48v-48c0-8.8-7.2-16-16-16z"
      className="fa-primary"
    />
    <Path
      d="M394.8 512c-45.3-31.9-74.8-84.5-74.8-144 0-97.2 78.8-176 176-176 2.5 0 5 .1 7.5.2-11-19.2-31.8-32.2-55.5-32.2H64c-35.3 0-64 28.7-64 64v224c0 35.3 28.7 64 64 64h330.8zM464 104c0-13.3-10.7-24-24-24H72c-13.3 0-24 10.7-24 24s10.7 24 24 24h368c13.3 0 24-10.7 24-24zm-48-80c0-13.3-10.7-24-24-24H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24z"
      style={{
        opacity: 0.6,
      }}
    />
  </Svg>
)
export default RectangleHistoryCirclePlus
