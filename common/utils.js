// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Return the first three letters of the current day of the week.
export function seizeTheDay(dateIn)
{ 
  switch(dateIn.getDay()) {
    case(0):
      return "SUN";
      break;
    case(1):
      return "MON";
      break;
    case(2):
      return "TUE";
      break;
    case(3):
      return "WED";
      break;
    case(4):
      return "THU";
      break;
    case(5):
      return "FRI";
      break;
    case(6):
      return "SAT";
      break;
    default:
      return "NUL";
  }
}

// Like above, return the first three letters of the current month.
export function seizeTheMonth(dateIn)
{ 
  switch(dateIn.getMonth()) {
    case(0):
      return "JAN";
      break;
    case(1):
      return "FEB";
      break;
    case(2):
      return "MAR";
      break;
    case(3):
      return "APR";
      break;
    case(4):
      return "MAY";
      break;
    case(5):
      return "JUN";
      break;
    case(6):
      return "JUL";
      break;
    case(7):
      return "AUG";
      break;
    case(8):
      return "SEP";
      break;
    case(9):
      return "OCT";
      break;
    case(10):
      return "NOV";
      break;
    case(11):
      return "DEC";
      break;
    default:
      return "NUL";
  }
}

// Return distance multiplied by the right scale, based on user's units.
export function calculateDistance(distance, units)
{
  if (distance == undefined)
    return 0;
  else
    return (distance * ((units === "us") ? 0.000621371 : 0.001)).toFixed(2);
}

// Return the x or y coordinate for the goal bar based on its final location ('scale')
export function getGoalBar(startPoint, width, goalProgress, goalEnd)
{
  if (goalProgress == undefined)
    return 0;
  else if (goalProgress >= goalEnd)
    return startPoint + width;
  else
    return startPoint + ((goalProgress/goalEnd) * width);
}

export function getBatteryColor(percentage)
{
  if (percentage <= 16)
    return "tomato";
  if (percentage <= 32)
    return "orange";
  
  return "white";
}

export function getHRIcon(heartZone)
{
  if (heartZone === "fat-burn")
    return "icons/heart/fatburn.png";
  else if (heartZone === "cardio" || heartZone === "peak")
    return "icons/heart/peak.png";
  else
    return "icons/heart/resting.png";
}

export function getHRZone(heartZone)
{
  if (heartZone === "out-of-range")
    return "Resting";
  if (heartZone === "fat-burn")
    return "Fat Burn";
  if (heartZone === "cardio")
    return "Cardio";
  if (heartZone === "peak")
    return "Peak";
  
  return "--";
}

export function fahrenheitToCelsius(temperature)
{
  return Math.round((temperature - 32.0) * (5.0/9.0));
}

export function getWeather(weatherid)
{
  if (weatherid < 300)
    return "Thunderstorm";
  if (weatherid < 600)
    return "Raining";
  if (weatherid < 700)
    return "Snowing";
  if (weatherid < 800)
    return "Misty";
  if (weatherid == 800)
    return "Clear Skies";
  if (weatherid < 900)
    return "Cloudy";
  
  return "--";
}

export function getWeatherIcon(weathertype)
{
  if (weathertype == "Thunderstorm" || weathertype == "Raining")
    return "icons/weather/rain.png";
  if (weathertype == "Snowing")
    return "icons/weather/snow.png";
  if (weathertype == "Misty" || weathertype == "Cloudy")
    return "icons/weather/cloud.png";
  
  return "icons/weather/sun.png";
}