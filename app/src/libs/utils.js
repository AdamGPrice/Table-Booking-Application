function getWeekDay(date) {
    let day = date.getDay();
    if (day == 0) {
        day = 7;
    }
    return day;
}

function compareTime(time, date) {
    const time1 = new Date('2001-01-01 ' + time);
    const time2 = new Date(date);
    time2.setFullYear(2001, 0, 1);

    if (time1.getTime() > time2.getTime()) {
        return -1;
    } else if (time1.getTime() < time2.getTime()) {
        return 1;
    } else if (time1.getTime() == time2.getTime()) {
        return 0;
    }
}

function DateObjToString(dateObj) {
    const date = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
    const mintues = dateObj.getMinutes();
    const time = `${dateObj.getHours()}:${mintues > 9 ? mintues : mintues + '0'}`;

    return date + ' ' + time;
}

// Stole this from stack overflow to add days and hour to the js date object
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function(h) {
    var date = new Date(this.valueOf())
    date.setTime(date.getTime() + (h*60*60*1000));
    return date;
}

module.exports = {
    getWeekDay,
    compareTime,
    DateObjToString
}