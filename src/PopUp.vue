<template lang="html">
    <div>
        <calendar
            v-model="date"
            v-bind:min="min"
            v-bind:max="max"
            v-bind:locale="locale"
            v-on:input="setDate" />
    </div>
</template>

<script>
    import moment from 'moment'
    import Calendar from './Calendar.vue'

    export default {
        components: {
            calendar: Calendar,
        },
        props: {
            locale: {
                type: String,
                default: window.navigator.userLanguage || window.navigator.language,
            },
            /* Receives a Moment.js object */
            value: {
                type: [Date, moment],
                // default: () => moment(),
            },
            min: {
                type: [Date, moment],
            },
            max: {
                type: [Date, moment],
            },
        },
        computed: {
            date() {
                return moment.isMoment(this.value) && this.value.isValid() ? this.value : moment(this.value).locale(this.locale)
            },
        },
        methods: {
            setDate(value) {
                return this.$emit('input', value);
            },
        },
    }
</script>

<style lang="less">
    .for.datepicker {
        [class*="calendar container"] {
            margin: 0;
        }
    }
</style>