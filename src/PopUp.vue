<template lang="html">
    <div v-bind:class="['ui', 'custom' , 'bottom', 'center', { 'visible' : visible }, 'popup', 'for', 'datepicker']">
        <div class="header">{{ formattedDate }}</div>
        <calendar v-bind:date="$date" v-bind:locale="locale" />
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
        date: {},
        visible: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    data() {
        return {
            $date: this.date
        }
    },
    computed: {
        year() {
            return this.$date.format('YYYY')
        },
        formattedDate() {
            var date = this.$date.format('LL')

            /* Fix for Brazilian Portuguese lower case date */
            return this.$date.locale() == 'pt-br' ? date.toLowerCase() : date
        },
        $date() {
            /* Make sure the date param is a valid object */
            if (!this.date.isValid()) {
                date = moment()

                /* Reset the locale according to the parameter */
                date.locale(this.locale)

                return date
            }

            return this.date
        },
    },
    created() {
        /* Make sure the date param is a valid object */
        if (!this.date.isValid()) {
            this.$date = moment()

            /* Reset the locale according to the parameter */
            this.$date.locale(this.locale)
        }
    }
}
</script>

<style lang="css" scoped>
    .ui.custom[class*="bottom center"].popup[class*="for datepicker"] {
        top: 100%;
    }
</style>
