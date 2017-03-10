<template lang="html">
    <div v-bind:class="klass">
        <!-- <div class="header">{{ formattedDate }}</div> -->
        <calendar v-model="date"
            v-bind:locale="locale" v-on:input="setDate" />
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
            /* Receives a Moment.js object */
            value: {
                type: [Date, moment],
                default: () => moment(),
            },
            visible: {
                type: Boolean,
                required: false,
                default: true,
            }
        },
        computed: {
            date() {
                return moment.isMoment(this.value) && this.value.isValid() ? this.value : moment(this.value).locale(this.locale)
            },
        },
        methods: {
            setDate(value) {
                return this.$emit('input', value);
            }
        },
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