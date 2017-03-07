<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container" v-on:click="$date.add(1, 'month')">{{ month }}</div>
            <div class="year container">{{ year }}</div>
        </div>
        <div class="table container">
            <div class="week days container">
                <div class="week day" v-for="day in weekDays">
                    {{ (locale == myLocale) ? day.charAt(0).toUpperCase() : day }}
                </div>
            </div>
            <div class="month container">
                <div class="week" v-for="week in days">
                    <template v-for="day in week">
                        <time v-bind:class="[day.klass, 'month day']" v-on:click="$emit('input', day.date)">
                            {{ day.text }}
                        </time>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import moment from 'moment';

    /* Get locale of the browser */
    const locale = window.navigator.userLanguage || window.navigator.language;
    /* Set locale globally for Moment.js */
    moment.locale(locale)

    export default {
        props: {
            /* Receives a Moment.js object */
            date: {},
            /* Customize locale */
            locale: {
                type: String,
                default: locale,
            },
        },
        data() {
            return {
                /* DO NOT change this */
                myLocale: 'pt-BR',
            }
        },
        computed: {
            $date() {
                return moment.isMoment(this.date) ? this.date : moment()
            },
            year() {
                /* Year in four numbers format */
                return this.$date.format('YYYY');
            },
            month() {
                /* Month full name */
                return this.$date.format('MMMM');
            },
            weekDays() {
                /* https://momentjs.com/docs/#/i18n/listing-months-weekdays/ */
                return this.locale == this.myLocale ? moment.weekdays() : moment.weekdaysMin()
            },
            days() {
                /* Contains days for a week */
                var row = [];
                /* Contains weeks for a month */
                var weeks = [];

                var ini = moment(this.date).startOf('month').startOf('week');
                var fin = moment(this.date).endOf('month').endOf('week');

                /* We should start somewhere */
                var current = ini.clone();

                /* Loop through the days  */
                while (current.isSameOrBefore(fin, 'day')) {
                    var obj = {
                        /* Raw moment object */
                        date: current.clone(),
                        /* The number of the day */
                        text: current.date(),
                        /* Class attribute */
                        klass: ['current'],
                    };

                    if (current.month() < this.date.month()) {
                        obj.klass = ['previous']
                    }

                    if (current.month() > this.date.month()) {
                        obj.klass = ['next']
                    }

                    /* Class to identify today */
                    if (this.isToday(current)) {
                        obj.klass.unshift('today');
                    }

                    /* Mark as selected */
                    if (current.isSame(this.$date, 'day')) {
                        obj.klass.unshift('selected');
                    }

                    row.push(obj);

                    /* One week per row */
                    if (current.day() == 6) {
                        weeks.push(row);
                        row = [];
                    }

                    /* Next iteration, next day */
                    current.add(1, 'd');
                }

                weeks.push(row);

                return weeks;
            }
        },
        watch: {
            date(newValue, oldValue) {
                if (newValue != this.$date) {
                    this.$date = newValue
                }

                // console.log(this.month)
            },
        },
        methods: {
            moment(value, format) {
                var date = moment(value, format);
                date.locale(this.locale);

                return date;
            },
            isToday(obj) {
                // return obj.isSame(this.moment('2017-04-01'), 'day');
                // return obj.isSame(this.moment('2017-02-28'), 'day');
                return obj.isSame(this.moment(), 'day');
            }
        },
        // created() {
        //     if (!moment.isMoment(this.date)) {
        //         this.$date = this.moment();
        //     }
        // },
        mounted() {
            // console.log(this.locale)
            // console.log(this.myLocale)
            // console.log(this.locale == this.myLocale)
            // console.log(this.month)
            // console.log(this.days[0][0].date.format('DD/MM/YYYY'))
            // console.log(this.ini.format('L'))
            // console.log(this.fin.format('L'))
        },
    }
</script>
<style lang="less">
    [class*="calendar container"] {
        @padding: .25em .5em;
        @width: 100% / 7;
        &>[class*="month and year container"] {
            display: flex;
            justify-content: space-around;
        }
        &>[class*="table container"] {
            &>[class*="week days container"] {
                display: flex;
                justify-content: space-around;
                pointer-events: none;
                position: relative;
                &.week {
                    font-weight: bold;
                    pointer-events: none;
                    &>.day {
                        padding: @padding;
                        pointer-events: none;
                        text-align: center;
                        width: @width;
                    }
                }
            }
            &>[class*="month container"] {
                &>.week {
                    display: flex;
                    position: relative;
                    &>.day {
                        display: inline-block;
                        flex-grow: 1;
                        padding: @padding;
                        text-align: center;
                        width: @width;
                        &.previous,
                        &.next {
                            color: rgba(0, 0, 0, 0.4);
                        }
                        &.today {
                            background-color: rgba(0, 0, 0, 0.4);
                            color: white;
                        }
                        &.selected {
                            background-color: black;
                            color: white;
                        }
                    }
                }
            }
        }
    }
</style>