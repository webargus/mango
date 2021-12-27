

const MNGDateUtils = (_ => {

    var currDate = new Date();

    const isLeapYear = year => {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }

    /**
     * hack to return number of days of month of a given year
     * IMPORTANT: param month MUST be zero-indexed (0 -> Jan, 1 -> Feb, ..., 11 -> Dec)
     * @param {*} year : Number
     * @param month : Number
     */
    const getNumDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getDateParams = (date = null) => {
        var date = date ?? currDate;
        return [date.getDate(), date.getMonth() + 1, date.getFullYear()];
    }

    const goPreviousMonth = (date = null) => {
        var date = date ?? currDate;
        let prevMonth = date.getMonth() - 1;
        let day = date.getDate();
        if(prevMonth < 0) {
            prevMonth = 11;
             // no need to check for month day between jan and dec, both are 31 day months
            currDate = new Date(date.getFullYear() - 1, prevMonth, day);
            return;
        }
        const numDays = getNumDaysInMonth(date.getFullYear(), prevMonth);
        day = day > numDays ? numDays : day;
        currDate = new Date(date.getFullYear(), prevMonth, day);
    };

    const goNextMonth = (date = null) => {
        var date = date ?? currDate;
        let nextMonth = date.getMonth() + 1;
        let day = date.getDate();
        if(nextMonth > 11) {
            nextMonth = 0;
             // no need to check for month day between dec and jan, both are 31 day months
             currDate = new Date(date.getFullYear() + 1, nextMonth, day);
             return;
        }
        const numDays = getNumDaysInMonth(date.getFullYear(), nextMonth);
        day = day > numDays ? numDays : day;
        currDate = new Date(date.getFullYear(), nextMonth, day);
    };

    const getFirstWeekDayOfMonth = (date = null) => {
        var date = date ?? currDate;
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (fmtString, lang, date = null) => {
        date = date ?? currDate;
        return fmtString.replace(/\bYYYY\b/, date.getFullYear())
                        .replace(/\bMM\b/, date.toLocaleString(lang, {month: '2-digit'}))
                        .replace(/\bMMMM\b/, date.toLocaleString(lang, {month: 'long'}))
                        .replace(/\bDD\b/, date.toLocaleString(lang, {day: '2-digit'}))
                        .replace(/\bW\b/, date.toLocaleString(lang, {weekday: 'short'}))
                        .replace(/\bWW\b/, date.toLocaleString(lang, {weekday: 'long'}));
    };

    return {
        isLeapYear: isLeapYear,
        getNumDaysInMonth: getNumDaysInMonth,
        getDateParams: getDateParams,
        goPreviousMonth: goPreviousMonth,
        goNextMonth: goNextMonth,
        getFirstWeekDayOfMonth: getFirstWeekDayOfMonth,
        formatDate: formatDate,
    };

})();

export default MNGDateUtils;













