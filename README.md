# Vue 2 Date Time Picker

Works great with [Semantic UI](https://semantic-ui.com/).

**Warning**: no time picker coded, yet!

## Semantic UI CSS

Import `src/calendar.less` to render a Calendar with a [Semantic UI](https://semantic-ui.com/) ish look.

With webpack, on a single file component, put `@import '~vue2-datetimepicker/src/calendar.less'` on your `style` tag.

## Components

List of components available

### DatePicker

An HTML Input with an pop-up containing Calendar

#### Attributes

Type |Attribute | Default | Description
-----|----------|---------|------------
`String` | `enter-active-class` | `animate transition scale in` | PopUp animating classes. See <https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes>
`String` | `format` | Localized format for `L` token (based on `locale` attribute) | Locale friendly date format
`String` | `format-value` | `YYYY-MM-DD` | Backend friendly format according to [HTML standard](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Value)
`String` | `leave-active-class` | `animate transition scale out` | PopUp animating classes. See <https://vuejs.org/v2/guide/transitions.html#Custom-Transition-Classes>
`String` | `locale` | User's current preferred language | A string representing the language version as defined in [BCP 47](http://www.ietf.org/rfc/bcp/bcp47.txt).
`moment`, `Date`, `String` | `max` | `undefined` | Maximum date allowed (inclusive)
`moment`, `Date`, `String` | `min` | `undefined` | Minimum date allowed (inclusive)
`moment`, `Date`, `String` | `popup-class` | `visible ui custom bottom right popup for datepicker` | Classes to apply to PopUp component
`moment`, `Date`, `String` | `v-model` | `undefined` | Vue's two-way binding
`moment`, `Date`, `String` | `value` | `undefined` | Default date

#### Events

* `blur` &ndash; HTML Input's event
* `change` &ndash; HTML Input's event
* `click` &ndash; HTML Input's event
* `contextmenu` &ndash; HTML Input's event
* `focus` &ndash; HTML Input's event
* `input` &ndash; HTML Input's event
* `invalid` &ndash; HTML Input's event
* `keydown` &ndash; HTML Input's event
* `keypress` &ndash; HTML Input's event
* `keyup` &ndash; HTML Input's event
* `mousedown` &ndash; HTML Input's event
* `mouseenter` &ndash; HTML Input's event
* `mouseleave` &ndash; HTML Input's event
* `mouseout` &ndash; HTML Input's event
* `mouseover` &ndash; HTML Input's event
* `mouseup` &ndash; HTML Input's event
* `pointerlockchange` &ndash; HTML Input's event
* `pointerlockerror` &ndash; HTML Input's event
* `reset` &ndash; HTML Input's event
* `search` &ndash; HTML Input's event
* `select` &ndash; HTML Input's event
* `select` &ndash; HTML Input's event
* `submit` &ndash; HTML Input's event
* `wheel` &ndash; HTML Input's event

#### Methods

* `emitFocus` &ndash; Called when input has received focus
* `hide` &ndash; Hides PopUp
* `hideBlurred` &ndash; Called when user clicks outside PopUp
* `setDate` &ndash; Emits `input` event preserving original type of the `value` attribute
* `show` &ndash; Shows PopUp
* `toggle` &ndash; Toggles PopUp visibility

#### Slots

* `hidden-input` &ndash; HTML Hidden Input with the date formatted based on the `format-value` attribute
* `input` &ndash; HTML Text Input with the date formatted based on the `format` attribute
* `popup` &ndash; PopUp to be shown when the input receives focus

### PopUp

A container for Calendar

#### Attributes

Type |Attribute | Default | Description
-----|----------|---------|------------
`String` | `locale` | User's current preferred language | A string representing the language version as defined in [BCP 47](http://www.ietf.org/rfc/bcp/bcp47.txt).
`moment`, `Date`, `String` | `max` | `undefined` | Maximum date allowed (inclusive)
`moment`, `Date`, `String` | `min` | `undefined` | Minimum date allowed (inclusive)
`moment`, `Date`, `String` | `v-model` | `undefined` | Vue's two-way binding
`moment`, `Date`, `String` | `value` | `undefined` | Default date

#### Methods

* `setDate` &ndash; Emits `input` event

#### Slots

No slots for this component

#### Events

* `input` &ndash; `value` has changed

### Calendar

A calendar view

#### Attributes

Type |Attribute | Default | Description
-----|----------|---------|------------
`String` | `locale` | User's current preferred language | A string representing the language version as defined in [BCP 47](http://www.ietf.org/rfc/bcp/bcp47.txt).
`moment`, `Date`, `String` | `max` | `undefined` | Maximum date allowed (inclusive)
`moment`, `Date`, `String` | `min` | `undefined` | Minimum date allowed (inclusive)
`Boolean` | `readonly` | Wether `v-model` or `value` is defined | The calendar is read only. No changes will affect `v-model` or `value`.
`moment`, `Date`, `String` | `v-model` | `undefined` | Vue's two-way binding
`moment`, `Date`, `String` | `value` | `undefined` | Default date

#### Events

* `input` &ndash; `value` has changed

#### Methods

* `addMonth` &ndash; Shows next month if date is before `max` attribute
* `isBetween(moment)` &ndash; Whether a `moment` instance is between `min` an `max` attributes, inclusive
* `isMax` &ndash; Is `max` attribute a valid `Date` or `moment` instance?
* `isMin` &ndash; Is `min` attribute a valid `Date` or `moment` instance?
* `isToday(moment)` &ndash; Whether a `moment` instance is today
* `rotate(WheelEvent)` &ndash; Called when mouse's wheel is used on month name
* `setDate` &ndash; Emits `input` event preserving original type of the `value` attribute. Checks if the selected date is between `min` an `max` attributes, inclusive.
* `setLocale(String)` &ndash; Changes locale of the calendar
* `subMonth` &ndash; Shows previous month if date is after `min` attribute

#### Slots

No slots for this component