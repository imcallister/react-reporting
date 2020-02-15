import numeral from 'numeral';
import moment from 'moment';



const DATE_FORMATS = [
    'MMM Do, YYYY',
    'MMM Do, YYYY H:mm:ss'
]

const NUMBER_FORMATS = [
    '0,0',
    '0,0.00',
    '$0,0',
    '$0,0.00',
    '($0,0)',
    '($0,0.00)',
    '(0,0.00)',
    '(0,0)'
]


export const formatter = (fmt) => {
    if (NUMBER_FORMATS.includes(fmt)) {
        return (value) => numeral(value).format(fmt)
    } else if (DATE_FORMATS.includes(fmt)) {
        return (value) => moment(value).format(fmt)
    } else {
        return (value) => value
    }
}
