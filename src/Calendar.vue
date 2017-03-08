<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container" v-on:click="current = current.clone().add(1, 'month')">{{ month }}</div>
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
                        <time v-bind:class="[day.klass, 'month day']" v-on:click="$emit('input', value instanceof Date ? day.date.toDate() : day.date)">
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
    moment.locale(locale);

    export default {
        props: {
            /* Receives a Moment.js object */
            value: {
                type: [moment, Date],
                default: () => moment(),
            },
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
                current: moment(this.value),
            }
        },
        computed: {
            $date() {
                return moment.isMoment(this.value) ? this.value : moment(this.value).locale(this.locale)
            },
            year() {
                this.setLocale();

                /* Year in four numbers format */
                return this.current.format('YYYY');
            },
            month() {
                this.setLocale();

                /* Month full name */
                return this.current.format('MMMM');
            },
            weekDays() {
                /* Fix locale */
                moment.locale(this.locale);

                /* https://momentjs.com/docs/#/i18n/listing-months-weekdays/ */
                return this.locale == this.myLocale ? moment.weekdays() : moment.weekdaysMin()
            },
            days() {
                /* Contains days for a week */
                var row = [];
                /* Contains weeks for a month */
                var weeks = [];

                if (!moment.isMoment(this.current)) {
                    this.current = moment();
                }

                this.setLocale();

                /* We should start somewhere */
                var current = this.current.clone().startOf('month').startOf('week');
                var fin = this.current.clone().endOf('month').endOf('week');

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

                    if (current.month() < this.current.month()) {
                        obj.klass = ['previous']
                    }

                    if (current.month() > this.current.month()) {
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
                    if (current.weekday() == 6) {
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
            value(newValue, oldValue) {
                this.current = moment.isMoment(this.value) ? newValue : moment(this.value);
            },
        },
        methods: {
            isToday(obj) {
                return obj.isSame(moment(), 'day');
            },
            setLocale(locale) {
                /* Optional parameter. Default is the locale attr / prop */
                locale = (typeof locale === 'undefined') ? this.locale : locale;

                this.current.locale(locale);
            }
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