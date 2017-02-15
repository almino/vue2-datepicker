<template lang="html">
    <div>
        <input
            v-bind:id="id"
            v-bind:accept="accept"
            v-bind:alt="alt"
            v-bind:autocomplete="autocomplete"
            v-bind:autofocus="autofocus"
            v-bind:checked="checked"
            v-bind:dirname="dirname"
            v-bind:disabled="disabled"
            v-bind:form="form"
            v-bind:formaction="formaction"
            v-bind:formenctype="formenctype"
            v-bind:formmethod="formmethod"
            v-bind:formnovalidate="formnovalidate"
            v-bind:formtarget="formtarget"
            v-bind:list="list"
            v-bind:max="max"
            v-bind:maxlength="maxlength"
            v-bind:min="min"
            v-bind:multiple="multiple"
            v-bind:pattern="pattern"
            v-bind:placeholder="placeholder"
            v-bind:readonly="readonly"
            v-bind:required="required"
            v-bind:src="src"
            v-bind:step="step"
            v-bind:type="type"
            v-on:keydown="emitKeyDown" v-on:keypress="emitKeyPress"
            v-on:keyup="emitKeyUp" v-on:mouseenter="emitMouseEnter"
            v-on:mouseover="emitMouseOver" v-on:mousemove="emitMouseMove"
            v-on:mousedown="emitMouseDown" v-on:mouseup="emitMouseUp"
            v-on:click="emitClick" v-on:dblclick="emitDoubleClick"
            v-on:contextmenu="emitContextMenu" v-on:wheel="emitWheel"
            v-on:mouseleave="emitMouseLeave" v-on:mouseout="emitMouseOut"
            v-on:select="emitSelect"
            v-on:pointerlockchange="emitPointerLockChange"
            v-on:pointerlockerror="emitPointerLockError"
            v-on:focus="emitFocus" v-on:blur="emitBlur"
            ref="input" v-bind:value="formattedDate" v-on:input="emitInput($event.target.value)" />
        <input type="text" name="" v-bind:value="rawDate"
            v-bind:name="name" />
        <calendar v-bind:date="date" v-bind:locale="locale" />
    </div>
</template>

<script>
import Input from './mixins/input'
import moment from 'moment'
import Calendar from './Calendar.vue'

export default {
    mixins: [Input],
    components: {
        calendar: Calendar
    },
    props: {
        formatValue: {
            type: String,
            default: 'YYYY-MM-DD',
        },
        format: {
            type: String,
            default: 'L',
        },
        locale: {
            type: String,
            default: window.navigator.userLanguage || window.navigator.language,
        },
        // value: {
        //     type: String,
        //     default: moment().format(this.formatValue),
        // },
    },
    created() {
        /* Reset the locale according to the parameter */
        this.date.locale(this.locale)
    },
    data() {
        return {
            date: moment(this.value, this.formatValue)
        }
    },
    computed: {
        formattedDate() {
            return this.value ? this.date.format(this.format) : null;
        },
        rawDate() {
            return this.value ? this.date.format('YYYY-MM-DD') : null;
        }
    }
}
</script>

<style lang="css">
</style>
