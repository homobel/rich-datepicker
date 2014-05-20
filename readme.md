
# Rich date picker
by Archy Sharp

My 2011 year work may be helpful for somebody, cause it's still looks pretty :)
However code written in old fashion style.

[http://homobel.org/examples/plugins/rich-datepicker/demo/index.htm](http://homobel.org/examples/plugins/rich-datepicker/demo/index.htm)

##Features

* Infoscroller for months & years
* Date autocomplete
* CSS editable
* Ready for i18n

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
	<script type="text/javascript" src="js/jquery.mousewheel.min.js"></script>
	<script type="text/javascript" src="js/rich-datepicker.js"></script>
	<script type="text/javascript">
		(function($) {
			(function($) {
				$(function() {

					// simple
					$('.rich-datepicker-input').first().richDatepicker();

					// custom
					$('.rich-datepicker-input').last().richDatepicker({
						position: 'top',
						i18n: {
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

				});
			})(jQuery);
		})(jQuery);
	</script>

### Position

There are 2 built in positions: bottom(default) and top. You can set your own properties via class and proper argument like this:

	// JS
	$('.rich-datepicker-input').first().richDatepicker({position: 'abc'});

	// CSS
	.position-abc .rich-datepicker {...}
					

### Methods

Date: 7 February 2012

	$('input').data('date').val(); // [7, 2, 2012]
	$('input').data('date').textVal(); // "7 February 2012"
	$('input').data('date').val(1,1,2011); // $('input').data('date').val(); -> [1, 1, 2011]

### Events

Datapicker input emits 'datachanged' event each time day, month or year changed.