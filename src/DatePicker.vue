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
                v-bind:list="list" v-bind:max="max"
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
                v-on:input="$emit('input', $event.target.value)"
                ref="input"
                v-model="formattedDate" />
        </slot>
        <slot name="hidden-input">
            <input type="hidden" name="" v-bind:value="rawDate" v-bind:name="name" />
        </slot>
        <slot name="popup">
            <popup v-model="date" v-bind:locale="locale" v-on:input="setDate" />
        </slot>
    </div>
</template>

<script>
    import Input from './mixins/input'
    import moment from 'moment'
    import PopUp from './PopUp.vue'

    /* Get current locale */
    const locale = window.navigator.userLanguage || window.navigator.language;
    /* Set locale globally */
    moment.locale(locale)

    export default {
        /* Events for input */
        mixins: [Input],
        components: {
            popup: PopUp
        },
        props: {
            /* Container class attibute */
            klass: {
                type: String,
                default: 'ui fluid input',
            },
            /* Format to send to server  */
            formatValue: {
                type: String,
                default: 'YYYY-MM-DD',
            },
            /* Format visible for the user */
            format: {
                type: String,
                /* http://stackoverflow.com/a/29641375/437459 */
                default: moment.localeData(this.locale).longDateFormat('L'),
            },
            /* Multiple Locale Support http://momentjs.com/#multiple-locale-support  */
            locale: {
                type: String,
                default: locale,
            },
            /* The default value */
            value: {
                type: [moment, Date, Object, String]
            }
        },
        created() {
            /* Reset the locale according to the parameter */
            this.date.locale(this.locale);
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
                    if (moment.isMoment(this.date) && this.date.isValid()) {
                        return this.date.format(this.format);
                    }

                    return this.value;
                },
                set(value) {
                    clearTimeout(this.timeout)

                    var vm = this;

                    this.timeout = setTimeout(function () {
                        var date = moment(value, vm.format);

                        if (!date.isSame(vm.date, 'day')) {
                            vm.date = date;
                        }
                    }, 1000);
                },
            },
            rawDate() {
                /* Method format is available for moment instances, only */
                if (moment.isMoment(this.date)) {
                    return this.value ? this.date.format(this.formatValue) : null;
                }

                return this.value;
            }
        },
        watch: {
            value(newValue) {
                console.group('watch value');

                if (moment.isMoment(newValue) && newValue.isValid()) {
                    console.log('is a moment')
                    this.date = newValue;
                }

                if (moment.isDate(newValue)) {
                    console.log('is a date')
                    this.date = moment(this.date);
                }

                console.log(this.date.format('L'));
                console.groupEnd();
            },
        },
        methods: {
            setDate(value) {
                this.date = value;

                if (moment.isDate(this.value)) {
                    /* Return as a native Date object */
                    value = value.toDate();
                } else if (typeof this.value == "string" || this.value instanceof String) {
                    /* Return a string */
                    value = value.format(this.formatValue);
                }

                /* Inform to v-model that the value has changed  */
                this.$emit('input', value);
            }
        },
    }
</script>