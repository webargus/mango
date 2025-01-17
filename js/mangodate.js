

export default class MNGDateUtils {

    currDate;
    weekObjs = [];

    constructor() {
        this.currDate = new Date();
    }

    isToday(date) {
        return date.getDate() == this.currDate.getDate() &&
               date.getMonth() == this.currDate.getMonth() &&
               date.getFullYear() == this.currDate.getFullYear();
    }

    isLeapYear(year) {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }

    /**
     * hack to return number of days of month of a given year
     * IMPORTANT: param month MUST be zero-indexed (0 -> Jan, 1 -> Feb, ..., 11 -> Dec)
     * @param {*} year : Number
     * @param month : Number
     */
    getNumDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    goPreviousMonth(date = null) {
        var dt = date ?? this.currDate;
        let prevMonth = dt.getMonth() - 1;
        let day = dt.getDate();
        if(prevMonth < 0) {
            prevMonth = 11;
             // no need to check for month day between jan and dec, both are 31 day months
            dt = new Date(dt.getFullYear() - 1, prevMonth, day);
            if(date == null) { this.currDate = dt;}
            // update week calendar
            this.getCalendarWeeks();
            return dt;
        }
        const numDays = this.getNumDaysInMonth(dt.getFullYear(), prevMonth);
        day = day > numDays ? numDays : day;
        dt = new Date(dt.getFullYear(), prevMonth, day);
        if(date == null) { this.currDate = dt;}
        // update week calendar
        this.getCalendarWeeks();
        return dt;
    }

    goNextMonth(date = null){
        // save resulting date to currDate if user didn't send a date
        var dt = date ?? this.currDate;
        let nextMonth = dt.getMonth() + 1;
        let day = dt.getDate();
        if(nextMonth > 11) {
            nextMonth = 0;
             // no need to check for month day between dec and jan, both are 31 day months
             dt = new Date(dt.getFullYear() + 1, nextMonth, day);
             if(date == null) { this.currDate = dt;}
             // update week calendar
             this.getCalendarWeeks();
             return dt;
        }
        const numDays = this.getNumDaysInMonth(dt.getFullYear(), nextMonth);
        day = day > numDays ? numDays : day;
        dt = new Date(dt.getFullYear(), nextMonth, day);
        if(date == null) { this.currDate = dt; }
        // update week calendar
        this.getCalendarWeeks();
        return dt;
    }

    getFirstWeekDayOfMonth(date = null) {
        var date = date ?? this.currDate;
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }

    formatDate(fmtString, lang, date = null) {
        date = date ?? this.currDate;
        return fmtString.replace(/\bYYYY\b/, date.getFullYear())
                        .replace(/\bMM\b/, date.toLocaleString(lang, {month: '2-digit'}))
                        .replace(/\bMMMM\b/, date.toLocaleString(lang, {month: 'long'}))
                        .replace(/\bDD\b/, date.toLocaleString(lang, {day: '2-digit'}))
                        .replace(/\bW\b/, date.toLocaleString(lang, {weekday: 'short'}))
                        .replace(/\bWW\b/, date.toLocaleString(lang, {weekday: 'long'}));
    }

    getLocaleWeekDayNames(lang, length = null) {
        var dayNames = [];
        for(let i = 0; i < 7; i++) {
            var date = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), i + 1);
            var name = date.toLocaleString(lang, {weekday: "long"});
            dayNames[date.getDay()] = length == null ? name : name.substring(0, length);
        }
        return dayNames;
    }

    getCurrLocaleMonthName(lang, length = null) {
        var monthName = this.currDate.toLocaleString(lang, {month: "long"});
        return length == null ? monthName : monthName.substring(0, length);
    }

    getPrevMonthDate() {
        const month = this.currDate.getMonth();
        const year = this.currDate.getFullYear();
        return month > 0 ? new Date(year, month - 1, 1) : new Date(year -1, 11, 1);
    }

    getNextMonthDate() {
        const month = this.currDate.getMonth();
        const year = this.currDate.getFullYear();
        return month < 11 ? new Date(year, month + 1, 1) : new Date(year + 1, 0, 1);
    }

    getWeekObj(date = null) {
        date = date ?? this.currDate;
        const d = date.getDate();
        const day = date.getDay();
        var wdays = [];
        const daysInMonth = this.getNumDaysInMonth(date.getFullYear(), date.getMonth());
        for(let ix = d - day; ix < d + 7 - day; ix++) {
            // if(ix <= 0 || ix > daysInMonth) {
            //     wdays.push(new Date(date.getFullYear(), date.getMonth(), ix).getDate());
            // } else {
            //     wdays.push(ix);
            // }
            wdays.push(new Date(date.getFullYear(), date.getMonth(), ix));
        }
        return wdays;
    }

    getCalendarWeeks(date = null) {
        this.weekObjs = [];
        // fetch all weeks in date param
        const allWeeks = this.getCalendarObject(date).matrix;
        let isLastWeek = false;
        let isFirstWeek = false;
        while (allWeeks.length > 0) {
            const week = allWeeks.splice(0, 7);
            isFirstWeek = allWeeks[0] > 1 && this.weekObjs.length == 0;
            isLastWeek = (week[week.length - 1] < week[0]) && !isFirstWeek;
            let initDate = isFirstWeek ? this.getPrevMonthDate() : this.currDate;
            initDate = new Date(initDate.getFullYear(), initDate.getMonth(), week[0]);
            let finalDate = isLastWeek ? this.getNextMonthDate() : this.currDate;
            finalDate = new Date(finalDate.getFullYear(), finalDate.getMonth(), week[week.length - 1]);
            this.weekObjs.push({
                initDate : initDate,
                finalDate : finalDate,
                weekArray : week
            });
            if(isLastWeek) break;
        }
        return this.weekObjs;
    }

    getCalendarObject(date = null) {
        var date = date ?? this.currDate;
        var calendar = [];
        const wday = this.getFirstWeekDayOfMonth(date);
        const year = date.getFullYear();
        const month = date.getMonth();
        var todayPos = date.getDate() + wday - 1;
        const daysInMonth = this.getNumDaysInMonth(year, month);
        for(let d = 1 - wday; d < 6*7 - wday + 1; d++) {
            if(d <= 0 || d > daysInMonth) {
                var dt = new Date(year, month, d);
                calendar.push(dt.getDate());
            } else {
                calendar.push(d);
            }
        }
        return {firstWeekDay: wday, numDays: daysInMonth, matrix: calendar, todayPos: todayPos};
    }

    getDateObject() {
        return this.currDate;
    }

}













