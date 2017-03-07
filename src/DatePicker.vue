<template lang="html">
    <div v-bind:class="klass">
        <slot name="input">
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
                type="text"
                v-on:keydown="emitKeyDown"
                v-on:keypress="emitKeyPress"
                v-on:keyup="emitKeyUp"
                v-on:mouseenter="emitMouseEnter"
                v-on:mouseover="emitMouseOver"
                v-on:mousemove="emitMouseMove"
                v-on:mousedown="emitMouseDown"
                v-on:mouseup="emitMouseUp"
                v-on:click="emitClick"
                v-on:dblclick="emitDoubleClick"
                v-on:contextmenu="emitContextMenu"
                v-on:wheel="emitWheel"
                v-on:mouseleave="emitMouseLeave"
                v-on:mouseout="emitMouseOut"
                v-on:select="emitSelect"
                v-on:pointerlockchange="emitPointerLockChange"
                v-on:pointerlockerror="emitPointerLockError"
                v-on:focus="emitFocus"
                v-on:blur="emitBlur"
                ref="input"
                v-model="formattedDate" />
        </slot>
        <slot name="hidden-input">
            <input type="hidden" name="" v-bind:value="rawDate"
                v-bind:name="name" />
        </slot>
        <slot name="popup">
            <popup v-bind:date="date" v-bind:locale="locale" />
        </slot>
    </div>
</template>

<script>
import Input from './mixins/input'
import moment from 'moment'
import PopUp from './PopUp.vue'

const locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale)

export default {
    mixins: [Input],
    components: {
        popup: PopUp
    },
    props: {
        klass: {
            type: String,
            default: 'ui fluid input',
        },
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
            default: locale,
        },
    },
    created() {
        /* Reset the locale according to the parameter */
        this.date.locale(this.locale)
    },
    data() {
        return {
            date: moment(this.value, this.formatValue),
            timeout: null,
        }
    },
    computed: {
        formattedDate: {
            get() {
                return this.value ? this.date.format(this.format) : null;
            },
            set(value) {
                clearTimeout(this.timeout)

                var vm = this;

                this.timeout = setTimeout(function() {
                    /* http://stackoverflow.com/a/29641375/437459 */
                    // var formatL = moment.localeData().longDateFormat('L');

                    if (value != vm.formattedDate) {
                        vm.date = moment(value, vm.date.localeData().longDateFormat(vm.format));
                    }
                }, 1000);
            },
        },
        rawDate() {
            return this.value ? this.date.format('YYYY-MM-DD') : null;
        }
    },
    watch: {
        date(val, old) {
            if (val != old) {
                this.date.locale(this.locale)
            }
        }
    },
    methods: {
        // ref="input" v-bind:value="value" v-on:input="emitInput($event.target.value)"
        emitInput(value) {
            // If the value was not already normalized,
            // manually override it to conform
            if (value != this.value) {
                this.$refs.input.value = value
                this.date = moment(value, this.formatValue)
            }

            // Emit the number value through the input event
            this.$emit('input', value)
        }
    },
}
</script>
