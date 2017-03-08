<template lang="html">
    <div v-bind:class="klass">
        <!-- <div class="header">{{ formattedDate }}</div> -->
        <calendar v-bind:date="$date" v-bind:locale="locale" v-on:input="setDate" />
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
        klass: {
            type: String,
            default: 'ui custom bottom right visible popup for datepicker',
        },
        locale: {
            type: String,
            default: window.navigator.userLanguage || window.navigator.language,
        },
        date: {},
        visible: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    computed: {
        $date() {
            /* Make sure the date param is a valid object */
            if (!moment.isMoment(this.date)) {
                var date = moment()

                /* Reset the locale according to the parameter */
                date.locale(this.locale)

                return date
            }

            return this.date
        },
        formattedDate() {
            var date = this.$date.format('LL')

            /* Fix for Brazilian Portuguese lower case date */
            return this.$date.locale() == 'pt-br' ? date.toLowerCase() : date
        },
    },
    methods: {
        setDate(value) {
            return this.$emit('input', value);
        }
    },
    created() {
        /* Make sure the date param is a valid object */
        if (typeof this.date == 'undefined' || !this.date.isValid()) {
            this.$date = moment()

            /* Reset the locale according to the parameter */
            this.$date.locale(this.locale)
        }
    }
}
</script>

<style lang="less" scoped>
    .ui.custom[class*="bottom right"].popup[class*="for datepicker"] {
        top: 100%;
        // left: 0;
        // max-width: none;
        // width: 25em;
    }
</style>
