import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { units } from "user-settings";
import { goals } from "user-activity";
import { battery } from "power";
import { user } from "user-profile";
import { HeartRateSensor } from "heart-rate";
import * as util from "../common/utils";
import * as messaging from "messaging";

const display = document.getElementById("display");
const dayText = document.getElementById("dayText");
const timeText = document.getElementById("timeText");
const dateText = document.getElementById("dateText");

const batteryPercentage = document.getElementById("batteryPercentage");
const batteryLine = document.getElementById("batteryLine");
const heartRate = document.getElementById("heartRate");
const heartIcon = document.getElementById("heartIcon");
const heartZone = document.getElementById("heartZone");

const activityBar = document.getElementById("activityBar");
const activityText = document.getElementById("activityText");
const activityIcon = document.getElementById("activityIcon");
const activityCap = document.getElementById("activityCap");

const stepsBar = document.getElementById("stepsBar");
const stepsText = document.getElementById("stepsText");
const stepsIcon = document.getElementById("stepsIcon");
const stepsCap = document.getElementById("stepsCap");

const calBar = document.getElementById("calBar");
const calText = document.getElementById("calText");
const calIcon = document.getElementById("calIcon");
const calCap = document.getElementById("calCap");

const distBar = document.getElementById("distBar");
const distText = document.getElementById("distText");
const distIcon = document.getElementById("distIcon");
const distCap = document.getElementById("distCap");

let textuse = document.getElementById("textuse");
let textgroup = textuse.getElementById("textgroup");
let distuse = document.getElementById("distuse");
let distgroup = distuse.getElementById("distgroup");

let currTemp = "--";
let currWeather = "";
let currWeatherIcon = "img_sun.png";

const barSlope = -2.78;
const longBarWidth = 94;
const shortBarWidth = 80;

let baseInfo = true;
let changingInfo = false;

// Update the clock every minute
clock.granularity = "minutes";

clock.ontick = (evt) => { 
  const todayDate = evt.date;
  dayText.text = util.seizeTheDay(todayDate);
  dateText.text = todayDate.getDate() + ' ' + util.seizeTheMonth(todayDate);
  
  const hours = todayDate.getHours();
  const mins = util.zeroPad(todayDate.getMinutes());
  
  // The ternary operator makes me happy
  hours = (preferences.clockDisplay == "12h") ? (hours % 12 || 12) : util.zeroPad(hours);
  
  timeText.text = `${hours}:${mins}`;
  
  updateGoalBars();
  updateGoalInfo();
  updateBattery();
  updateBottomText();
}

display.onclick = () => {
  // First check that we're not in the middle of editing the info.
  if (!changingInfo)
  {
    changingInfo = true;
    baseInfo = !baseInfo;
    textuse.animate("enable");
    distuse.animate("enable");
    updateGoalBars();
    updateGoalInfo();
    updateBottomText();
    textuse.animate("disable");
    distuse.animate("disable");
    changingInfo = false;
  }
}

// Set the final x/y for each goal bar based on goal progress.
function updateGoalBars() {
  // The bars aren't actually all solid -- they're mostly drawn lines, with images for the caps. So we have to do
  // some math to make sure they line up correctly and are the right size.
  
  // I know magic numbers are bad but there are quite a few here just for adjustment of the bars and caps. Sorry!
  activityBar.x2 = -util.getGoalBar(activityBar.x1, shortBarWidth, today.local.activeMinutes, goals.activeMinutes);
  activityBar.y2 = activityBar.x2 * barSlope - 4;
  activityCap.x = activityBar.x2 - 19;
  activityCap.y = activityCap.x * barSlope - 61;
  
  stepsBar.x2 = util.getGoalBar(stepsBar.x1, longBarWidth, today.local.steps, goals.steps);
  stepsBar.y2 = stepsBar.x2 * barSlope + 6;
  stepsCap.x = stepsBar.x2 - 19;
  stepsCap.y = stepsCap.x * barSlope - 55;
  
  calBar.x2 = -util.getGoalBar(calBar.x1, longBarWidth, today.local.calories, goals.calories);
  calBar.y2 = calBar.x2 * barSlope - 4;
  calCap.x = calBar.x2 - 20;
  calCap.y = calCap.x * barSlope - 65;
  
  if (baseInfo) {
    distBar.x2 = util.getGoalBar(distBar.x1, shortBarWidth, today.local.distance, goals.distance);
  } else {
    distBar.x2 = util.getGoalBar(distBar.x1, shortBarWidth, today.local.elevationGain, goals.elevationGain);
  }
  distBar.y2 = distBar.x2 * barSlope + 6;
  distCap.x = distBar.x2 - 18;
  distCap.y = distCap.x * barSlope - 50;
}

// Update the stat numbers for each goal and "fill" the icon if the goal is met.
function updateGoalInfo() {
  activityText.text = today.local.activeMinutes || 0;
  if (today.local.activeMinutes >= goals.activeMinutes)
    activityIcon.href = "img_activityFill.png";
  
  stepsText.text = today.local.steps || 0;
  if (today.local.steps >= goals.steps)
    stepsIcon.href = "img_stepsFill.png";
  
  calText.text = today.local.calories || 0;
  if (today.local.calories >= goals.calories)
    calIcon.href = "img_calorieFill.png";
  
  if (baseInfo) {
    distText.text = util.calculateDistance(today.local.distance, units.distance);
    if (today.local.distance >= goals.distance)
      distIcon.href = "img_distanceFill.png";  
    else
      distIcon.href = "img_distanceLine.png";
  } else {
    distText.text = today.local.elevationGain || 0;
    if (today.local.elevationGain >= goals.elevationGain)
      distIcon.href = "img_floorFill.png";  
    else
      distIcon.href = "img_floorLine.png";
  }
}

// Update battery line length and percentage.
function updateBattery() {
  batteryPercentage.text = (Math.floor(battery.chargeLevel) || "--") + "%";
  // The battery line stretches from the start point (184) and shrinks along a scale.
  batteryLine.x2 = 184 + ((battery.chargeLevel / 100) * 108);
}

// This runs constantly so that heart rate text and icon are accurate and current.
function updateBottomText() {
  let hrm = new HeartRateSensor();
  
  if (baseInfo) {
    hrm.start();
    heartRate.text = "--";
    heartIcon.href = "img_hr_resting.png";
    heartZone.text = "Sensing..."
    hrm.onreading = function() {
      heartRate.text = hrm.heartRate || "--";
      heartIcon.href = util.getHRIcon(user.heartRateZone(hrm.heartRate));
      heartZone.text = "HR: " + util.getHRZone(user.heartRateZone(hrm.heartRate));
    }
  } else {
    hrm.stop();
    console.log("Fahrenheit temperature returned is " + currTemp + ". User setting for unit is " + units.temperature);
    heartRate.text = (units.temperature == "F" ? currTemp : util.fahrenheitToCelsius(currTemp));
    if (heartRate.text == null || isNaN(heartRate.text))
      heartRate.text = "--"
    else
      heartRate.text += "°";
    heartIcon.href = currWeatherIcon;
    heartZone.text = currWeather || "Searching...";
    console.log("Adjusting currWeather to " + currWeather);
  }
}

// Request weather data from the companion
function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Display the weather data received from the companion
function processWeatherData(data) {
  console.log("Weather ID: " + data.weatherid);
  currTemp = Math.round(data.temperature);
  currWeather = util.getWeather(data.weatherid);
  console.log("currWeather is " + currWeather);
  currWeatherIcon = util.getWeatherIcon(currWeather);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processWeatherData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the weather every 30 minutes
setInterval(fetchWeather, 30 * 1000 * 60);