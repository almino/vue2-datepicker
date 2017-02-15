<template lang="html">
    <div v-bind:class="['ui', 'custom', 'popup' , 'bottom', 'center', { 'visible' : visible }]">
        <div class="header">{{ year }}</div>
        {{ formattedDate }}
    </div>
</template>

<script>
import moment from 'moment'

export default {
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
            return this.$date.format('LL')
        }
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

<style lang="css">
</style>
