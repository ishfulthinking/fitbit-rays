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

const stepsBar = document.getElementById("stepsBar");
const stepsText = document.getElementById("stepsText");
const stepsIcon = document.getElementById("stepsIcon");
//const stepsCap = document.getElementById("stepsCap");

const calBar = document.getElementById("calBar");
const calText = document.getElementById("calText");
const calIcon = document.getElementById("calIcon");
const calCap = document.getElementById("calCap");

const distBar = document.getElementById("distBar");
const distText = document.getElementById("distText");
const distIcon = document.getElementById("distIcon");

const barSlope = -2.78;
const longBarWidth = 94;
const shortBarWidth = 80;

// Update the clock every minute
clock.granularity = "minutes";

clock.ontick = (evt) =>
{ 
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
  updateHeart();
}

// Set the final x/y for each goal bar based on goal progress.
function updateGoalBars()
{
  // I know magic numbers are bad BUT the 4's and 6's are just offsets for the y-intercept on each of the rays. Sorry :-)
  activityBar.x2 = -util.getGoalBar(activityBar.x1, shortBarWidth, today.local.activeMinutes, goals.activeMinutes);
  activityBar.y2 = activityBar.x2 * barSlope - 4;
  
  stepsBar.x2 = util.getGoalBar(stepsBar.x1, longBarWidth, today.local.steps, goals.steps);
  stepsBar.y2 = stepsBar.x2 * barSlope + 6;
  
  calBar.x2 = -util.getGoalBar(calBar.x1, longBarWidth, today.local.calories, goals.calories);
  calBar.y2 = calBar.x2 * barSlope - 4;
  
  distBar.x2 = util.getGoalBar(distBar.x1, shortBarWidth, today.local.distance, goals.distance);
  distBar.y2 = distBar.x2 * barSlope + 6;
}

// Update the stat numbers for each goal and "fill" the icon if the goal is met.
function updateGoalInfo()
{
  activityText.text = today.local.activeMinutes || 0;
  if (today.local.activeMinutes >= goals.activeMinutes)
    activityIcon.href = "img_activityFill.png";
  
  stepsText.text = today.local.steps || 0;
  if (today.local.steps >= goals.steps)
    stepsIcon.href = "img_stepsFill.png";
  
  calText.text = today.local.calories || 0;
  if (today.local.calories >= goals.calories)
    calIcon.href = "img_calorieFill.png";
  
  distText.text = util.calculateDistance(today.local.distance, units.distance);
  if (today.local.distance >= goals.distance)
    distIcon.href = "img_distanceFill.png";  
}

// Update battery line length and percentage.
function updateBattery()
{
  batteryPercentage.text = (Math.floor(battery.chargeLevel) || "--") + "%";
  // The battery line stretches from the start point (184) and shrinks along a scale.
  batteryLine.x2 = 184 + ((battery.chargeLevel / 100) * 108);
}

function updateHeart()
{
  let hrm = new HeartRateSensor();
  hrm.start();

  hrm.onreading = function()
  {
    heartRate.text = hrm.heartRate || "--";
    heartIcon.href = util.getHRIcon(user.heartRateZone(hrm.heartRate));
    heartZone.text = "HR: " + util.getHRZone(user.heartRateZone(hrm.heartRate));
  }
}