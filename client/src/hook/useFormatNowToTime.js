import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import enUsLocale from 'date-fns/locale/en-US';
import { useMemo, useState } from 'react';
import moment from 'moment';
export const useFormatNowToTime = (time) => {
    const [unit, setUnit] = useState('');
    const timeToNow = useMemo(() => {
        if (!time?.length) {
            setUnit('');
            return '--';
        }
        const result = formatDistanceToNowStrict(parseISO(time), {
            locale: enUsLocale,
        }).split(' ');
        if (result[0] === '0') {
            setUnit('Exprired');
            return '';
        } else {
            setUnit(uppercaseFirstLetter(result[1]));
            return `${result[0]}`;
        }
    }, [time]);

    const remainingTimeValue = useMemo(() => {
        const distance = moment(time).diff(moment(), 'seconds')
        const secondsInDay = 60 * 60 * 24
        const secondsInHour = 60 * 60
        const secondsInMinute = 60

        const remainingDays = parseInt(distance / secondsInDay)
        const remainingHours = parseInt(distance % secondsInDay / secondsInHour)
        const remainingMinutes = parseInt((distance - remainingDays * secondsInDay - remainingHours * secondsInHour) / secondsInMinute)

        let timeArrays = [
            {
                text: "Days",
                value: remainingDays
            },
            {
                text: "Hours",
                value: remainingHours
            },
            {
                text: "Minutes",
                value: remainingMinutes
            }
        ]

        timeArrays = timeArrays.filter(el => el.value > 0).filter((el, index) => index < 2)

        return timeArrays.map(el => `${el.value} ${el.text}`).join(' ')
    }, [time])
    return { timeToNow, unit, remainingTimeValue };
};

const uppercaseFirstLetter = (word) => {
    if(!word){
        return word
    }

    const firstLetter = word.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()

    const remainingLetters = word.slice(1)

    const capitalizedWord = firstLetterCap + remainingLetters

    return capitalizedWord
}