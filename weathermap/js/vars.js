var parameters = {
  temperature: "temperature.png",
  wind: "wind.png",
  pressure: "pressure.png",
  rainfall: "precip_quantity.png",
  humidity: "humidity.png"
};
var currentParameter = "temperature";
var currentLayer = null;
var currentDate = new Date();
var isLive = true;
var rmiRadarActive = false;
var knmiRadarActive = false;
var thresholds = {
  temperature: [
    [-14, "#212121"],
    [-12, "#131A5E"],
    [-10, "#0023EC"],
    [-8, "#20CFFB"],
    [-6, "#00F5FD"],
    [-4, "#00E6FC"],
    [-2, "#00D5FB"],
    [0, "#00D5FB"],
    [2, "#00CFD1"],
    [4, "#00D7B0"],
    [6, "#00E774"],
    [8, "#00F643"],
    [10, "#00FF46"],
    [12, "#00F442"],
    [14, "#5DE43F"],
    [16, "#BED33C"],
    [18, "#FFBF3A"],
    [20, "#FFA333"],
    [22, "#FF802B"],
    [24, "#FF5B24"],
    [26, "#FF361F"],
    [28, "#FF001B"],
    [30, "#FF0019"],
    [32, "#FF0018"],
    [34, "#EE0014"],
    [36, "#D40019"],
    [38, "#BA0025"],
    [40, "#920037"]
  ],
  wind: [
    [3, "#FFFFFF"],
    [8, "#FFF580"],
    [11, "#FFCF5C"],
    [14, "#FF9324"],
    [17, "#FF6F24"],
    [21, "#FF5124"],
    [24, "#E42F42"],
    [28, "#FF0000"],
    [32, "#B539D0"],
    [36, "#A800CC"]
  ],
  humidity: [
    [10, "#FFF6F4"],
    [20, "#E1E4D8"],
    [30, "#C3D2BB"],
    [40, "#A1C2A6"],
    [50, "#7DB393"],
    [60, "#58A487"],
    [70, "#329381"],
    [80, "#16817A"],
    [90, "#186D71"],
    [100, "#1B5968"]
  ],
  pressure: [
    [980, "#FE2EF7"],
    [984, "#7401DF"],
    [988, "#08088A"],
    [992, "#0174DF"],
    [996, "#58ACFA"],
    [1000, "#A9BCF5"],
    [1004, "#EFFBF8"],
    [1008, "#FBEFF2"],
    [1012, "#F6CECE"],
    [1016, "#FA5858"],
    [1020, "#FE2E2E"],
    [1024, "#FF0000"]
  ],
  rainfall: [
    [0.1, "#FFFFFF"],
    [1, "#D8D8D8"],
    [4, "#F6D90E"],
    [8, "#F1C40F"],
    [16, "#F6AA2D"],
    [24, "#D23245"]
  ],
  snow: [
    [0.1, "#FFFFFF"],
    [1, "#D8D8D8"],
    [4, "#F6D90E"],
    [8, "#F1C40F"],
    [16, "#F6AA2D"],
    [24, "#D23245"]
  ]
};

function getCurrentParameter() {
  return currentParameter
}

function setCurrentParameter(p) {
  currentParameter = p;
  setModalGraphParameter(p)
}

function getCurrentDate() {
  return currentDate
}

function setCurrentDate(d) {
  let date = truncate10min(d);
  currentDate = date;
  let now = new Date();
  isLive = (Math.abs(currentDate.getTime() - now.getTime()) < 1000 * 60 *
    10)
}

function truncate10min(date) {
  let seconds = Math.floor(date.getTime() / 1000);
  seconds = Math.floor(seconds / (60 * 10)) * (60 * 10);
  return new Date(seconds * 1000)
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function lpad(str, lg, c) {
  let res = str.toString();
  while (res.length < lg) {
    res = c + res
  }
  return res
}

function formatBelgianDate(date) {
  let result = "";
  result += lpad(date.getDate(), 2, "0");
  result += "/";
  result += lpad(date.getMonth() + 1, 2, "0");
  result += "/";
  result += date.getFullYear();
  result += " ";
  result += lpad(date.getHours(), 2, "0");
  result += ":";
  result += lpad(date.getMinutes(), 2, "0");
  result += ":";
  result += lpad(date.getSeconds(), 2, "0");
  return result
}

function getUnit(param) {
  var units = {
    temperature: "°C",
    dewpoint: "°C",
    wind: "m/s",
    gust: "m/s",
    winddir: "°",
    rainfall: "mm/h",
    pressure: "hPa",
    humidity: "%",
    snow: "mm",
    weather_code: "",
    image: ""
  };
  let u = units[param];
  return !u ? "" : u
}

function mapParameter(param) {
  var mapping = {
    temperature: ["dt"],
    wind: ["dws", "dwd"],
    rainfall: ["drr"],
    pressure: ["dm"],
    humidity: ["dh"],
    snow: ["ds"],
    weather_code: ["dwc"],
    image: ["dpurl"]
  };
  return mapping[param]
}

function mapPrimary(prim) {
  var mapping = {
    dt: "temperature",
    dws: "wind",
    dwd: "winddir",
    drr: "rainfall",
    dm: "pressure",
    dh: "humidity",
    ds: "snow",
    dwc: "weather_code",
    dpurl: "image"
  };
  return mapping[prim]
};
