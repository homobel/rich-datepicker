
# Rich date picker
by Archy Sharp

Date picker was written in 2011, but it still looks pretty :). However code written in old fashion style.

[http://homobel.org/examples/plugins/rich-datepicker/demo/index.htm](http://homobel.org/examples/plugins/rich-datepicker/demo/index.htm)

##Features

* Infoscroller for months & years
* Date autocomplete
* CSS editable
* Ready for l10n
* Ability to change first day of the week

##jQuery UI dependances

* Draggable
* Mouse
* Widget
* Core

## Usage

### Code for header

	<link rel="stylesheet" type="text/css" href="css/datapicker.css" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/jquery-ui.js"></script>
	<script type="text/javascript" src="js/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="js/rich-datepicker.js"></script>
	<script type="text/javascript">
		(function($) {
			$(function() {
				$('.rich-datepicker').richDatepicker();
			});
		})(jQuery);
	</script>

### Options

#### Position

There are 2 built in positions: bottom(default) and top. You can set your own properties via class and proper argument:

	// JS
	$('.rich-datepicker').richDatepicker({position: 'abc'});

	// CSS
	.position-abc .rich-datepicker {...}

#### First day of week

By default sunday is the first day of week. You can change this:

	$('.rich-datepicker').richDatepicker({monday: true});

#### l10n

Localization should be done with taking 'monday' property into account.

	$('.rich-datepicker').richDatepicker({
		monday: true,
		l10n: {
			days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
			months: [
				'Январь',
				'Февраль',
				'Март',
				'Апрель',
				'Май',
				'Июнь',
				'Июль',
				'Август',
				'Сентябрь',
				'Октябрь',
				'Ноябрь',
				'Декабрь'
			]
		}
	});

### Methods

Current date: 7 February 2012

	$('.rich-datepicker').data('date').val(); // [7, 2, 2012]
	$('.rich-datepicker').data('date').textVal(); // "7 February 2012"
	$('.rich-datepicker').data('date').val(1,1,2011); // $('.rich-datepicker').data('date').val(); -> [1, 1, 2011]

### Events

Datapicker input emits 'datachanged' event each time day, month or year changed.

### Cache

First call of init function generate html of date picker and cache it. This behavior assumes that you use one language per page. Set second argument to true to regenerate html.

	$('.rich-datepicker').richDatepicker({ ... }, true);
