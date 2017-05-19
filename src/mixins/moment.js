import moment from 'moment-timezone'

/* Set locale globally for Moment.js */
moment.locale(window.navigator.userLanguage || window.navigator.language)

/* Set default timezone using UTC offset */
moment.utc(moment.tz.zone(moment.tz.guess()))

/* Setting default timezone using String */
moment.tz.setDefault(moment.tz.guess())

export default moment