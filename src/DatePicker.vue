<template lang="html">
    <div>
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
                v-bind:name="name"
                v-bind:pattern="pattern"
                v-bind:placeholder="placeholder"
                v-bind:readonly="readonly"
                v-bind:required="required"
                v-bind:src="src"
                v-bind:step="step"
                type="text"
                v-bind:value="value"
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
                v-on:wheel="emitWheel"
                v-on:mouseleave="emitMouseLeave"
                v-on:mouseout="emitMouseOut"
                v-on:pointerlockchange="emitPointerLockChange"
                v-on:pointerlockerror="emitPointerLockError"
                v-on:blur="emitBlur"
                v-on:change="emitChange($event.target.value)"
                v-on:contextmenu="emitContextMenu"
                v-on:focus="emitFocus"
                v-on:input="emitInput($event.target.value)"
                v-on:invalid="emitInvalid"
                v-on:reset="emitReset"
                v-on:search="emitSearch"
                v-on:select="emitSelect"
                v-on:submit="emitSubmit"
                ref="input"
                v-model="formattedDate" />
        </slot>
        <slot name="hidden-input">
            <input type="hidden" name="" v-bind:value="rawDate" v-bind:name="name" />
        </slot>
        <slot name="popup">
            <transition
                v-bind:enter-active-class="enterActiveClass"
                v-bind:leave-active-class="leaveActiveClass">
                <popup
                    visible
                    v-model="date"
                    v-bind:min="minimum"
                    v-bind:max="maximum"
                    v-bind:class="popupClass"
                    v-bind:locale="locale"
                    v-on:input="setDate"
                    v-on:click="clicked = true"
                    v-show="popup"
                    v-click-outside="hideBlurred" />
            </transition>
        </slot>
    </div>
</template>

<script>
    import Input from './mixins/input'
    import PopUp from './PopUp.vue'
    import moment from 'moment'
    
    /* Get locale of the browser */
    const locale = window.navigator.userLanguage || window.navigator.language;

    /* Set locale globally for Moment.js */
    moment.locale(locale)

    export default {
        /* Events for input */
        mixins: [Input],
        components: {
            popup: PopUp
        },
        props: {
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
                type: [moment, Date, Object, Array, Number, String],
            },
            min: {
                type: [moment, Date, Object, Array, Number, String],
            },
            max: {
                type: [moment, Date, Object, Array, Number, String],
            },
            popupClass: {
                default: 'visible ui custom bottom right popup for datepicker',
            },
            enterActiveClass: {
                type: String,
                default: 'animate transition scale in',
            },
            leaveActiveClass: {
                type: String,
                default: 'animate transition scale out',
            },
        },
        created() {
            /* Reset the locale according to the parameter */
            this.date.locale(this.locale);
        },
        data() {
            return {
                date: moment(this.value, this.formatValue),
                minimum: this.min ? moment(this.min, this.formatValue) : null,
                maximum: this.max ? moment(this.max, this.formatValue) : null,
                timeout: null,
                popup: false,
                clicked: false,
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
                            console.log('changed');
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
                if (moment.isMoment(newValue) && newValue.isValid()) {
                    this.date = newValue;
                }

                if (moment.isDate(newValue)) {
                    this.date = moment(newValue);
                }
            }
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

                this.hide();

                /* Inform to v-model that the value has changed  */
                this.$emit('input', value);
            },
            show() {
                this.popup = true
            },
            hide() {
                this.popup = false
            },
            toggle() {
                this.popup = !this.popup
            },
            hideBlurred() {
                var input = this.$refs.input;
                /* If input lost focus */
                if (input != document.activeElement) {
                    /* Hide popup */
                    this.hide();

                    /* Stop timeout to set the date */
                    // clearTimeout(this.timeout);
                    
                    /* Check if the value has changed */
                    if (input.value && input.value != this.formattedDate) {
                        /* Set the new value */
                        this.setDate(moment(input.value, this.format));

                        /* Notify a change */
                        this.$emit('change');
                    }

                    /* Stop timeout to set the date */
                    // clearTimeout(this.timeout);
                }
            },
            emitFocus() {
                this.show();
                this.$emit('focus');
            },
        },
        directives: {
            /*
             * http://stackoverflow.com/questions/43693665/vuejs-editable-close-when-click-outside-in-vuejs
             * https://jsfiddle.net/Linusborg/Lx49LaL8/
             */
            'click-outside': {
                bind: function (el, binding, vNode) {
                    // Provided expression must evaluate to a function.
                    if (typeof binding.value !== 'function') {
                        const compName = vNode.context.name
                        let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
                        if (compName) {
                            warn += ` Found in component '${compName}'`
                        }

                        console.warn(warn)
                    }
                    // Define Handler and cache it on the element
                    const bubble = binding.modifiers.bubble
                    const handler = (e) => {
                        if (bubble || (!el.contains(e.target) && el !== e.target)) {
                            binding.value(e)
                        }
                    }
                    el.__vueClickOutside__ = handler

                    // add Event Listeners
                    document.addEventListener('click', handler)
                },

                unbind: function (el, binding) {
                    // Remove Event Listeners
                    document.removeEventListener('click', el.__vueClickOutside__)
                    el.__vueClickOutside__ = null

                }
            }
        },
    }
</script>