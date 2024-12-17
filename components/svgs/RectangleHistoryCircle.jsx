import * as React from "react"
import Svg, { Path } from "react-native-svg"
const RectangleHistoryCircle = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props} style={{transform:[{scale:1.2}]}}>
    <Path
      d="M496 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm0-32c-30.2 0-57.5-11.9-77.7-31.3 6.2-19 24-32.7 45.1-32.7h65.2c21 0 38.9 13.7 45.1 32.7-20.2 19.4-47.5 31.3-77.7 31.3zm0-192a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
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
export default RectangleHistoryCircle
