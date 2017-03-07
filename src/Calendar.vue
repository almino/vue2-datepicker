<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container">{{ month }}</div>
            <div class="year container">{{ year }}</div>
        </div>
        <div class="week days container">
            <div class="week day" v-for="day in weekDays">
                {{ (locale == myLocale) ? day.charAt(0).toUpperCase() : day }}
            </div>
        </div>
        <div class="month container">
            <div class="week" v-for="week in days">
                <time v-bind:class="[day.klass, 'month day']" v-for="day in week">
                    {{ day.text }}
                </time>
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
                /* Make sure the date param is a valid object */
                if (!this.date.isValid()) {
                    /* Calendar will show current date */
                    var date = moment()

                    /* Reset the locale according to the parameter */
                    date.locale(this.locale)

                    return date
                }

                /* We can work with the date given */
                return this.date
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

                /* Get the first day of given month */
                var first = this.$date.clone().startOf('month');
                /* Get the last day of given month */
                var last = first.clone().endOf('month');

                /* If the first day of given month is not a Sunday */
                if (first.day() > 0) {
                    /* Get the last Sunday of the previous month */
                    var current = first.clone().startOf('week');

                    /* Loop through the days of the previous month
                     * in the same week as the first days of given month */
                    while (current.isBefore(first, 'day')) {
                        var obj = {
                            /* Raw moment object */
                            date: current,
                            /* The number of the day */
                            text: current.date(),
                            /* Class attribute to make it different from
                             * given month days */
                            klass: ['previous'],
                        };

                        /* Check if is today */
                        if (this.isToday(current)) {
                            /* Identifies as today */
                            obj.klass.unshift('today');
                        }

                        /* Put in a row */
                        row.push(obj);
                        /* Next day! */
                        current.add(1, 'd');
                    }
                }

                /* Do not mess the condition above */
                var current = first.clone();

                /* Loop through the days of the given month */
                while (current.isSameOrBefore(last, 'day')) {
                    var obj = {
                        /* Raw moment object */
                        date: current,
                        /* The number of the day */
                        text: current.date(),
                        /* Class attribute */
                        klass: ['current'],
                    };

                    if (this.isToday(current)) {
                        obj.klass.unshift('today');
                    }

                    row.push(obj);

                    if (current.day() == 6) {
                        weeks.push(row);
                        row = [];
                    }

                    current.add(1, 'd');
                }

                while (current.day() != 0) {
                    var obj = {
                        /* Raw moment object */
                        date: current,
                        /* The number of the day */
                        text: current.date(),
                        /* Class attribute to make it different from
                         * given month days */
                        klass: ['next'],
                    };

                    /* Check if is today */
                    if (this.isToday(current)) {
                        /* Identifies as today */
                        obj.klass.unshift('today');
                    }

                    /* Put in a row */
                    row.push(obj);
                    /* Next day! */
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
                // return obj.isSame(this.moment('2017-04-01'), 'day');
                return obj.isSame(this.moment(), 'day');
            }
        },
        created() {
            if (typeof this.date == 'undefined' || !this.date.isValid()) {
                this.$date = this.moment();
            }
        },
        mounted() {
            // console.log(this.locale)
            // console.log(this.myLocale)
            // console.log(this.locale == this.myLocale)
            // console.log(this.month)
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
        &>[class*="week days container"] {
            display: flex;
            justify-content: space-around;
            position: relative;
            &.week {
                font-weight: bold;
                &>.day {
                    padding: @padding;
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
                    &.previous, &.next {
                        opacity: .6;
                    }

                    &.today {
                        background-color: black;
                        color: white;
                    }
                }
            }
        }
    }
</style>