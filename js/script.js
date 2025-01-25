/**
 * @typedef {Object} MealInfo
 * @property {string[]} [appetizers]
 * @property {string[]} [entrees]
 * @property {string[]} [desserts]
 * @property {string[]} [drinks]
 */
/**
 * @typedef {Object} Meal
 * @property {Date} date
 * @property {MealInfo} mealInfo
 */
/**
 * @type {Array<Meal>}
 */
const meals = [
    {
        date: new Date(2025, 1, 2, 10, 30), // Feb 2, 2025, 10:30 AM
        mealInfo: {
            entrees: [
                'English muffins with apple or cherry butter',
                'Sausage egg bake',
                'Kringle',
                'Fruit'
            ],
            drinks: [
                'Water',
                'Orange juice',
                'Lemonade',
                'Milk'
            ]
        }
    },
    {
        date: new Date(2025, 2, 23), // Mar 23, 2025
    },
    {
        date: new Date(2025, 3, 6), // April 6, 2025
    },
    {
        date: new Date(2025, 4, 4), // May 4, 2025
    }
];

$(document).ready(main);

/**
 * Get the next scheduled meal relative to now or override, if specified.
 * @param {Date} [override] Override of reference date, defaults to `new Date()`.
 * @returns {Meal}
 */
function getNextMeal(override = new Date()) {
    const ref = override;
    for (const meal of meals) {
        if (+ref < +(meal.date)) {
            return meal;
        }
    }
}

function populateFooter() {
    $('<p>')
        .html(`&copy; ${new Date().getFullYear()} Gather at Blue Beauty &mdash; All Rights Reserved.`)
        .appendTo($('footer'));

}

/**
 * @param {Meal} nextMeal
 */
function populateNextMeal(nextMeal) {
    const nextMealDate = nextMeal.date;

    const nextMealMonthElement = $('#next-meal-month');
    nextMealMonthElement.text(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMealDate));

    const nextMealTimeElement = $('#next-meal-time');
    nextMealTimeElement.text(new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(nextMealDate));

    const nextMealDateElement = $('#next-meal-date');
    nextMealDateElement.text(new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(nextMealDate));

    const nextMealDayElement = $('#next-meal-day');
    nextMealDayElement.text(new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(nextMealDate));

    const nextMealCountdownElement = $('#next-meal-countdown');
    const formatter = new Intl.RelativeTimeFormat(navigator.language, { style: 'long' });
    /**
     * @type {Array<[number, Intl.RelativeTimeFormatUnit]>}
     */
    const maximums = [
        [60, 'seconds'],
        [60, 'minutes'],
        [24, 'hours'],
        [7, 'days'],
        [4.34524, 'weeks'],
        [12, 'months'],
        [Number.POSITIVE_INFINITY, 'years']
    ];
    /**
     * @param {Date} date 
     */
    const formatTimeAgo = (date) => {
        let duration = (date.getTime() - Date.now()) / 1000;
        const [, unit] = maximums.find(([amount]) => {
            if (Math.abs(duration) < amount) {
                return true;
            }
            duration /= amount;
        });
        return formatter.format(Math.round(duration), unit);
    }
    nextMealCountdownElement.text(`See you ${formatTimeAgo(nextMealDate).replace('in', 'in about')}!`)
}

/**
 * @param {string} courseName 
 * @param {string[]} courseInfo
 */
function generateCourse(courseName, courseInfo = []) {
    const element = $('<div>');
    element.addClass('course');
    const header = $('<h3>');
    header.html(`<span>${courseName.slice(0, 1)}</span>${courseName.slice(1)}`);
    header.appendTo(element);
    for (const item of courseInfo) {
        $('<p>').text(item).appendTo(element);
    }

    return element;
}

/**
 * @param {Meal} nextMeal 
 */
function populateMenu(nextMeal) {
    const element = $('#meal-menu');
    if (!nextMeal.mealInfo) {
        const determinedCourse = generateCourse('determined');
        determinedCourse.appendTo(element);
        return;
    }
    if (nextMeal.mealInfo.appetizers?.length) {
        const course = generateCourse("appetizers", nextMeal.mealInfo.appetizers);
        course.appendTo(element);
    }
    if (nextMeal.mealInfo.entrees?.length) {
        const course = generateCourse("entrées", nextMeal.mealInfo.entrees);
        course.appendTo(element);
    }
    if (nextMeal.mealInfo.desserts?.length) {
        const course = generateCourse("desserts", nextMeal.mealInfo.desserts);
        course.appendTo(element);
    }
    if (nextMeal.mealInfo.drinks?.length) {
        const course = generateCourse("drinks", nextMeal.mealInfo.drinks);
        course.appendTo(element);
    }
}

async function main() {
    populateFooter();
    const nextMeal = getNextMeal();
    populateNextMeal(nextMeal);
    populateMenu(nextMeal);
}