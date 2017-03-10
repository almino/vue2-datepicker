<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container">
                <i class="left icon" v-on:click="current = current.clone().subtract(1, 'month')"></i>
                {{ month }}
                <i class="right icon" v-on:click="current = current.clone().add(1, 'month')"></i>
            </div>
            <div class="year container">
                <input type="number" v-model="year" >
            </div>
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
            year: {
                get() {
                    this.setLocale();

                    /* Year in four numbers format */
                    return this.current.format('YYYY');
                },
                set(value) {
                    this.current = this.current.clone().year(value);
                },
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

                if (!moment.isMoment(this.current) || !this.current.isValid()) {
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
            year() {
                // console.log(this.current.year())
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
    @font-face {
        font-family: 'FontAwesome';
        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0');
        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    .calendar.container {
        @padding: .25em .5em;
        @width: 100% / 7;
        @gray: rgba(0, 0, 0, 0.4);

        margin: .5em;

        &>[class*="month and year"].container {
            display: flex;
            justify-content: space-around;
            // margin: .5em auto;
            &>.month.container {
                cursor: default;
                min-width: 8em;
                padding: .5em 0;
                text-align: center;

                & > i {
                    /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/icon.css#L27 */
                    display: inline-block;
                    opacity: 1;
                    margin: 0em 0.25rem 0em 0em;
                    width: 1.18em;
                    height: 1em;
                    font-family: 'FontAwesome';
                    font-style: normal;
                    font-weight: normal;
                    text-decoration: inherit;
                    text-align: center;
                    speak: none;
                    font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    -webkit-font-smoothing: antialiased;
                    -webkit-backface-visibility: hidden;
                            backface-visibility: hidden;

                    /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/icon.css#L122 */
                    cursor: pointer;
                    opacity: 0.8;
                    -webkit-transition: opacity 0.1s ease;
                    transition: opacity 0.1s ease;
                    &:hover {
                        /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/icon.css#L131 */
                        opacity: 1 !important;
                    }

                    &.left {
                        float: left;
                        &:before {
                            /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/icon.css#L1491 */
                            content: "\f0d9";
                        }
                    }

                    &.right {
                        float: right;
                        &:before {
                            /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/icon.css#L1495 */
                            content: "\f0da";
                        }
                    }
                }
            }
            &>.year.container {
                >input {
                    outline: 0;
                    padding: 0.5em;
                    text-align: right;
                    width: 5em;
                    /* https://github.com/Semantic-Org/Semantic-UI/blob/master/dist/components/input.css#L199 */
                    border-color: transparent !important;
                    background-color: transparent !important;
                    // padding: 0em !important;
                    box-shadow: none !important;
                }
            }
        }
        &>.table.container {
            &>.week.days.container {
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
            &>.month.container {
                &>.week {
                    display: flex;
                    position: relative;
                    &>.day {
                        cursor: pointer;
                        display: inline-block;
                        flex-grow: 1;
                        padding: @padding;
                        text-align: center;
                        width: @width;

                        &:not(.disabled):not(.selected):hover {
                            background-color: @gray;
                            color: white !important;
                        }

                        &.previous,
                        &.next {
                            color: @gray;
                        }
                        &.today {
                            background-color: @gray;
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