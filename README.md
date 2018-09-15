# Rays
Rays is a clock face for the Fitbit Ionic. I created it because I wanted a decorative clock face that was still functional and data-generous (i.e. shows goals, battery, and heart rate at a glance).

## Features
* Time display is configurable (12 hour or 24 hour)
* Shows current day of the week and date
* Displays current heart rate (if available) in BPM
  - Heart rate zone is displayed as text as well
  - Heart rate icon changes based on intensity
* Displays battery level as both percentage and as a bar
* 4 "rays" display user's progress toward goals as a growing, colored strip, so user knows how close they are to goals
  - Each ray has an icon as a label and text corresponding to the goal, such as number of steps
  - The icon changes from an outline to an opaque symbol when the goal is reached
  - Distance traveled stat checks user settings to scale based on kilometers or miles
    
#### Updates (Current version: 2.1)
* Standardized the math for drawing each ray. No more rays leaning a little too much to the side!
* Added ray "caps" that make the rays a little better looking, and close gaps due to ray length maxing out too.
* Created and implemented heart rate icons that change with current HR intensity.

### Screenshots
##### Example 1
![Keep it up!](https://github.com/ishfulthinking/fitbit-rays/blob/master/Rays-screenshots/Rays-screenshot1.png)

##### Example 2
![You did it!](https://github.com/ishfulthinking/fitbit-rays/blob/master/Rays-screenshots/Rays-screenshot2.png)