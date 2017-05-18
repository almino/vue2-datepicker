import moment from 'moment-timezone'

moment.tz.setDefault(moment.tz.guess());

export default {
    methods: {
        moment: () => moment().utc(moment.tz.zone(moment.tz.guess())),
    },
}