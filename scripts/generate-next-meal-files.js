const fs = require('fs');
const path = require('path');

function dateToTimeString(date) {
    return date.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\.\d{3}Z/g, 'Z');
}

const mealData = require(path.join(__dirname, 'event-details.json'))
    .map((data) => {
        data.date = new Date(data.date);
        return data;
    });

const nextMeal = mealData.find((meal) => (+(new Date()) < +(meal.date)));

const nextMealJsonPath = path.join(__dirname, '..', 'assets', 'next-meal.json');
if (fs.existsSync(nextMealJsonPath)) {
    fs.rmSync(nextMealJsonPath);
}
fs.writeFileSync(nextMealJsonPath, JSON.stringify(nextMeal, null, 4));

let summary = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMeal.date);
summary += ' - Gather at Blue Beauty';
const startTime = new Date(nextMeal.date);
const endTime = new Date(nextMeal.date);
endTime.setHours(endTime.getHours() + 2);
const nowTime = new Date();
const randomUid = new Array(13).fill(0).map(() => `${Math.floor(Math.random() * 9)}`).join('');

const icsPath = path.join(__dirname, '..', 'assets', 'next-meal.ics');
if (fs.existsSync(icsPath)) {
    fs.rmSync(icsPath);
}

fs.writeFileSync(
    icsPath, `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${summary}
DTSTART:${dateToTimeString(startTime)}
DTEND:${dateToTimeString(endTime)}
DTSTAMP:${dateToTimeString(nowTime)}
UID:${randomUid}-${summary.replace(' - ', '').replace(/ /g, '')}
DESCRIPTION:
LOCATION:Muskego, WI
ORGANIZER:Hunter & Maria
STATUS:CONFIRMED
PRIORITY:0
END:VEVENT
END:VCALENDAR
`);