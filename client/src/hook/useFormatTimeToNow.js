import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import enUsLocale from 'date-fns/locale/en-US';
import { useMemo, useState } from 'react';
export const useFormatTimeToNow = (time) => {
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
            setUnit('Now');
            return '';
        } else {
            setUnit(result[1]);
            return `${result[0]}`;
        }
    }, [time]);
    return { timeToNow, unit };
};

export const formatTimeToNow = (time) => {
    let timeToNow = null;
    let unit = null;
    if(!time){
        return { timeToNow, unit };
    }

    const result = formatDistanceToNowStrict(parseISO(time), {
        locale: enUsLocale,
    }).split(' ');
    if (result[0] === '0') {
        timeToNow = 0
        unit = 'Now'
    } else {
        unit = result[1]
        timeToNow = result[0]
    }
    return { timeToNow, unit };
}
