<template lang="html">
    <section class="calendar container">
        <div class="month and year container">
            <div class="month container" v-on:wheel.prevent="rotate($event)">
                <i v-bind:class="[{ 'disabled' : !canSubMonth }, 'left icon']" v-on:click="subMonth"></i>
                {{ month }}
                <i v-bind:class="[{ 'disabled' : !canAddMonth }, 'right icon']" v-on:click="addMonth"></i>
            </div>
            <div class="year container">
                <input
                    type="number"
                    v-model="year"
                    v-bind:min="minYear"
                    v-bind:max="maxYear" />
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
                        <time
                            v-bind:datetime="day.date.format('YYYY-MM-DD')"
                            v-bind:class="[day.klass, 'month day']"
                            v-on:click="setDate(day.date)"
                            v-bind:ref="day.date.format('MMDD')">
                            {{ day.text }}
                        </time>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import moment from 'moment'
    
    /* Get locale of the browser */
    const locale = window.navigator.userLanguage || window.navigator.language;

    /* Set locale globally for Moment.js */
    moment.locale(locale)

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
            readonly: {
                type: Boolean,default() {
                    return typeof this.$vnode.componentOptions.propsData.value == 'undefined'
                },
            },
            min: {
                type: [moment, Date],
                required: false,
            },
            max: {
                type: [moment, Date],
                required: false,
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
                return moment.isMoment(this.value) ? this.value : moment(this.value)
            },
            year: {
                get() {
                    this.setLocale();

                    /* Year in four numbers format */
                    return this.current.format('YYYY');
                },
                set(value) {
                    var updated = this.current.clone().year(value);

                    if (this.isBetween(updated)) {
                        this.current = updated;
                    }
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
                    this.current = moment().locale(this.locale);
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

                    /* Make sure we are working between min and max inclusive */
                    if (!this.isBetween(current)) {
                        obj.klass.unshift('disabled');
                    }

                    /* Class to identify today */
                    if (this.isToday(current)) {
                        obj.klass.unshift('today');
                    }

                    /* We don't want interactions here */
                    if (this.readonly) {
                        obj.klass.unshift('readonly');
                    }
                    
                    /* Mark as selected */
                    if (!this.readonly && current.isSame(this.$date, 'day')) {
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
            },
            minimum() {
                if (moment.isDate(this.min)) {
                    return moment(this.min);
                }
                
                return this.min;
            },
            maximum() {
                if (moment.isDate(this.max)) {
                    return moment(this.max);
                }
                
                return this.max;
            },
            canAdd() {
                if (!this.isMax()) {
                    return true;
                }

                return this.current.isBefore(this.maximum, 'day');
            },
            canSub() {
                if (!this.isMin()) {
                    return true;
                }
                
                return this.current.isAfter(this.minimum, 'day');
            },
            canAddMonth() {
                if (typeof this.max == 'undefined') {
                    return true;
                }

                return this.current.isBefore(this.maximum, 'month');
            },
            canSubMonth() {
                if (typeof this.min == 'undefined') {
                    return true;
                }
                
                return this.current.isAfter(this.minimum, 'month');
            },
            minYear() {
                if (!this.min) {
                    return false;
                }

                return this.minimum.format('YYYY');
            },
            maxYear() {
                if (!this.max) {
                    return false;
                }

                return this.maximum.format('YYYY');
            },
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
            },
            addMonth() {
                if (this.canAdd) {
                    this.current = this.current.clone().add(1, 'month')
                }
            },
            subMonth() {
                if (this.canSub) {
                    this.current = this.current.clone().subtract(1, 'month')
                }
            },
            rotate(event) {
                if (event.deltaY > 0) {
                    this.subMonth();
                }

                if (event.deltaY < 0) {
                    this.addMonth();
                }
            },
            setDate(value) {
                if (this.readonly || value.isSame(this.value, 'day')) {
                    return false;
                }

                if (this.isBetween(value)) {
                    this.current = value;
                    this.$emit('input', this.value instanceof Date ? value.toDate() : value);
                }

                return false;
            },
            isBetween(value) {
                if (!this.min && !this.max) {
                    return true;
                }

                if (!this.min && value.isSameOrBefore(this.max, 'day')) {
                    return true;
                }

                if (!this.max && value.isSameOrAfter(this.min, 'day')) {
                    return true;
                }

                /*
                 * http://momentjs.com/docs/#/query/is-between/
                 * Is between inclusive
                 */
                return value.isBetween(this.minimum, this.maximum, 'day', '[]');
            },
            isMin() { return (moment.isMoment(this.min) && this.min.isValid()) || moment.isDate(this.min) },
            isMax() { return (moment.isMoment(this.max) && this.max.isValid()) || moment.isDate(this.max) },
        },
        created() {
            if (!this.current.isValid()) {
                this.current = moment().locale(this.locale);
            }
            
            if (this.isMax() && this.current.isAfter(this.max, 'day')) {
                this.current = this.maximum;
            }
            if (this.isMin() && this.current.isBefore(this.min, 'day')) {
                this.current = this.minimum;
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
        max-width: 15em;

        & > [class*="month and year"].container {
            display: flex;
            justify-content: space-around;

            & > .month.container {
                cursor: default;
                min-width: 8em;
                padding: .5em 0;
                text-align: center;

                & > i {
                    /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/icon.css#L27 */
                    display: inline-block;
                    // opacity: 1;
                    margin: 0em 0.25rem 0em 0em;
                    width: 1.18em;
                    height: 1em;
                    // font-family: 'Icons';
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

                    /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/icon.css#L122 */
                    cursor: pointer;
                    opacity: 0.6;
                    -webkit-transition: opacity 0.1s ease;
                    transition: opacity 0.1s ease;

                    &.disabled {
                        cursor: default;
                        opacity: 0;
                    }

                    &:before {
                        opacity: 0.6;
                    }

                    &:not(.disabled):hover {
                        /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/icon.css#L131 */
                        opacity: 1 !important;
                    }

                    &.left {
                        float: left;

                        &:before {
                            /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/icon.css#L1491 */
                            content: "\f0d9";
                        }
                    }

                    &.right {
                        float: right;

                        &:before {
                            /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/icon.css#L1495 */
                            content: "\f0da";
                        }
                    }
                }
            }

            & > .year.container {
                & > input {
                    outline: 0;
                    padding: 0.5em;
                    text-align: right;
                    width: 5em;
                    /* https://github.com/Semantic-Org/Semantic-UI/blob/2.2.10/dist/components/input.css#L202 */
                    border-color: transparent !important;
                    background-color: transparent !important;
                    // padding: 0em !important;
                    box-shadow: none !important;
                }
            }
        }

        & > .table.container {
            & > .week.days.container {
                display: flex;
                pointer-events: none;
                position: relative;

                &.week {
                    font-weight: bold;
                    pointer-events: none;

                    & > .day {
                        flex-basis: @width;
                        padding: @padding;
                        pointer-events: none;
                        text-align: center;
                    }
                }
            }

            & > .month.container {
                & > .week {
                    display: flex;
                    position: relative;
                    justify-content: space-around;
                    
                    & > .day {
                        cursor: pointer;
                        display: inline-block;
                        flex-basis: @width;
                        padding: @padding;
                        text-align: center;

                        &.readonly, &.disabled {
                            cursor: default;
                        }

                        &:not(.readonly):not(.disabled):not(.selected):hover {
                            background-color: @gray;
                            color: white;
                        }

                        &.previous,
                        &.next,
                        &.disabled {
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