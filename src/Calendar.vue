<template lang="html">
    <div class="calendar container">
        <div class="week days container">
            <div class="week day" v-for="day in weekDays">{{ day }}</div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';

    export default {
        props: {
            date: {},
            locale: {
                type: String,
                default: window.navigator.userLanguage || window.navigator.language,
            },
        },
        computed: {
            weekDays() {
                /* http://stackoverflow.com/a/29641375/437459 */
                /* https://www.youtube.com/watch?v=ISB5i__z9bI&t=1843s */
                // var formatL = moment.localeData().longDateFormat('L');

                var date = moment();
                var days = [];

                date.locale(this.locale)

                for (var i = 0; i < 7; i++) {
                    days.push(date.day(i).format('dddd').charAt(0).toUpperCase())
                }

                return days

            }
        }
    }
</script>
<style lang="less">
    [class*="calendar container"] {
        >[class*="week days container"] {
            display: flex;
            justify-content: space-between;
            // > [class*="week day"] {}
        }
    }
</style>