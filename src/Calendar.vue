<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container">{{ month.text }}</div>
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

    const locale = window.navigator.userLanguage || window.navigator.language;
    moment.locale(locale)

    export default {
        props: {
            date: {},
            locale: {
                type: String,
                default: window.navigator.userLanguage || window.navigator.language,
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
                    var date = moment()

                    /* Reset the locale according to the parameter */
                    date.locale(this.locale)

                    return date
                }

                return this.date
            },
            year() {
                return this.$date.format('YYYY');
            },
            month() {
                var a = this.$date.clone().startOf('month');
                var z = this.$date.clone().endOf('month');

                return {
                    text: this.$date.format('MMMM'),
                    previous: moment(z).month(-1).endOf('month').date(),
                    day: {
                        last: z.date(),
                        week: {
                            first: a.day(),
                            last: z.day(),
                        },
                    },
                }

            },
            weekDays() {
                /* http://stackoverflow.com/a/29641375/437459 */
                // var formatL = moment.localeData().longDateFormat('L');

                return this.locale == this.myLocale ? moment.weekdays() : moment.weekdaysMin()
            },
            days() {
                var row = [];
                var weeks = [];

                var first = this.$date.clone().startOf('month');
                var last = first.clone().endOf('month');

                if (first.day() > 0) {
                    var prev = first.clone().subtract(1, 'd');
                    var sun = prev.date() - first.day();

                    for (var i = sun; i < prev.date(); i++) {
                        row.push({
                            text: i + 1,
                            klass: 'previous',
                        });
                    }
                }

                for (var i = 0; i < last.date(); i++) {
                    row.push({
                        text: i + 1,
                        klass: 'current',
                    });

                    if (row.length == 7) {
                        weeks.push(row);
                        row = [];
                    }
                }

                if (last.day() < 6) {
                    for (var i = last.day(); i < 6; i++) {
                        row.push({
                            text: i - 1,
                            klass: 'previous month'
                        });
                    }
                }

                weeks.push(row);

                return weeks;
            },
        },
        watch: {
            date(newValue, oldValue) {
                if (newValue != this.$date) {
                    this.$date = newValue
                }

                console.log(this.month)
            },
        },
        methods: {
            moment(value, format) {
                var date = moment(value, format);
                date.locale(this.locale);

                return date;
            },
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
            console.log(this.month)
        },
    }
</script>
<style lang="less">
    [class*="calendar container"] {
        @margin: .25em .5em;
        @width: 100% / 7;

        & > [class*="month and year container"] {
            display: flex;
            justify-content: space-around;
        }

        & > [class*="week days container"] {
            display: flex;
            justify-content: space-around;
            position: relative;

            &.week {
                font-weight: bold;

                & > .day {
                    margin: @margin;
                    text-align: center;
                    width: @width;
                }
            }
        }

        & > [class*="month container"] {
            & > .week {
                display: flex;
                position: relative;

                & > .day {
                    display: inline-block;
                    flex-grow: 1;
                    margin: @margin;
                    text-align: center;
                    width: @width;

                    &.previous {
                        opacity: .6;
                    }
                }
            }
        }
    }
</style>