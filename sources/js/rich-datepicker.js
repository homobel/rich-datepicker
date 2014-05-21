// By Archy Sharp
// License MIT

(function($) {

	var	months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],

		days = [
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
			'Su'
		],

		now = new Date(),
		currentYear = now.getFullYear(),
		currentMonth = now.getMonth(),
		currentDate = now.getDate(),

		years = (function() {
			var y = [];
			for(var i = currentYear-5, j = 0; j<12; j++, i++) {
				y.push(i);
			}
			return y;
		})(),

		dayLength = 24*60*60*1000,
		currentYearsPosition = $.inArray(currentYear, years),

		yearReg = /\b\d{4}\b/,
		monthReg = /[a-zа-я]+/i,
		dateReg = /\b\d{1,2}\b/;


	// Datepicker prototype

	var myDatepickerPrototype = new function() {

		// html builder

		this.datepickerHTML = function() {

			var calendarHTML = '',
				cmonths = this.options.i18n.months,
				cdays = this.options.i18n.days;

			function getCalendar(year) {
		
				var	calendar = '<div class="year-wrap">',
					date = new Date(year, 0, 1),
					monthCounter = -1;
		
				while(date.getFullYear() == year) {
		
					var	month = date.getMonth(),
						day = date.getDay(),
						dayOfMonth = date.getDate();

					day = (day)?day:7;
		
					if(monthCounter != month) {
						if(month > 0) {
							calendar += '</ul></div>';
						}
		
						calendar += '<div class="month-wrap"><strong>'+cmonths[month]+'</strong><ul>';
		
						if(day > 1) {
							calendar += '<li class="size-'+day+'"></li>';
						}
						++monthCounter;
					}
		
					var restDay = (day == 6 || day == 7)?' rest-day':'';
					calendar += '<li class="day'+restDay+'">'+dayOfMonth+'</li>';
		
					date.setMilliseconds(date.getMilliseconds()+dayLength);
				}
		
				calendar += '</ul></div></div>';
		
				return calendar;
			}

			$.each(years, function(i, c) {calendarHTML += getCalendar(c);});

			var	monthList = '<ul>',
				yearsList = '<ul>';

			for(var i = 0; i < 12; i++) {
				monthList += '<li>' + cmonths[i] + '</li>';
				yearsList += '<li>' + years[i] + '</li>';
			}

			monthList += '</ul>';
			yearsList += '</ul>';
		
			return	'<div class="tooltip"></div>' +
					'<div class="rich-datepicker">' +
						'<ul class="days">' +
							'<li>' + cdays[0] + '</li>' +
							'<li>' + cdays[1] + '</li>' +
							'<li>' + cdays[2] + '</li>' +
							'<li>' + cdays[3] + '</li>' +
							'<li>' + cdays[4] + '</li>' +
							'<li class="rest-day">' + cdays[5] + '</li>' +
							'<li class="rest-day">' + cdays[6] + '</li>' +
						'</ul>' +
						'<div class="calendar">'+calendarHTML+'</div>' +
						'<div class="month-picker"><div class="draggable-area"></div><div class="bg-area gradient1"></div>'+monthList+'</div>' +
						'<div class="year-picker"><div class="draggable-area"></div><div class="bg-area gradient1"></div>'+yearsList+'</div>' +
					'</div>';
		};

		// value methods

		this.textVal = function() {
			return this.date + ' ' + this.options.i18n.months[this.month] + ' ' + this.year;
		};

		this.val = function(d, m, y, dontup) {
			var flag = false;
			if((y && this.year !== y) || (m && this.month !== m) || (d && this.date !== d)) {
				flag = true;
			}

			if(!d && !m && !y) {
				return [this.date, this.month+1, this.year];
			}
			else {
				if(y !== undefined) {
					if(y > 1000) {
						this.setYear($.inArray(y, years));
					}
					else {
						this.setYear(y);
					}
				}
				if(m !== undefined) {
					if(typeof m == 'string') {
						var position = $.inArray(m, this.options.i18n.months);
						if(~position) {this.setMonth(position);}
					}
					else {
						this.setMonth(m);
					}
				}
				if(d !== undefined) {
					this.setDate(d);
				}
				if(!dontup) {
					this.updateInputFromCurrent();
				}
			}
			if(flag) this.input.trigger('datachanged');
		};

	// Common helpers

		this.showDatepicker = function() {
			this.wrap.addClass('showed-datepicker');
			this.richDatepicker.fadeIn('fast');
		};

		this.hideDatepicker = function() {
			this.richDatepicker.fadeOut('fast');
			this.input.blur();
			this.updateInputFromCurrent();
			this.wrap.removeClass('showed-datepicker');
		};

	// initiation

		this.ini = function() {

			var _this = this;

			this.monthsElem.each(function(m) {

				var dayInMonth = _this.monthsElem.eq(m).data('month', m).find('.day');

				_this.monthsElem.eq(m).data('days', dayInMonth.each(function(d) {
					dayInMonth.eq(d).mousedown(function() {
						_this.month = m-_this.yearN*12;
						_this.val(d+1,'','', true);
						_this.hideDatepicker();
					});
				}));
			});

			this.richDatepicker.css('left', 0).hide();
			this.input.val(this.textVal());
			this.input.focus(function() {
				_this.showDatepicker.call(_this);
			});
			this.input.mousedown(function(e) {e.stopPropagation();});
			this.richDatepicker.mousedown(function prevent(e) {e.preventDefault(); e.stopPropagation();});
			$(document).mousedown(function() {
				_this.hideDatepicker.call(_this);
			});
			this.val(currentDate, currentMonth, currentYear, true);

			this.input.bind('keydown', function() {
				parseInput.call(_this);
			});

		// Year behavior

			function _refreshYear() {
				_this.refreshYear.call(_this);
			}
	
			this.yearPicker.draggable({
				'axis': 'y',
				'grid': [0, _this.yearPickerShift],
				'drag': _refreshYear,
				'stop': _refreshYear,
				'containment': 'parent'
			});
	
			this.yearPickerWrap.mousewheel(function(e, delta) {
				e.preventDefault();

				var	delta = -((delta>0)?Math.ceil(delta):Math.floor(delta)),
					pickerPosition = parseInt(_this.yearPicker.css('top'))+delta*_this.yearPickerShift;
	
				if(pickerPosition < 0) {pickerPosition = 0;}
				else if(pickerPosition > _this.yearMaxPosition) {pickerPosition = _this.yearMaxPosition;}
	
				_this.yearPickerGroup.css('top', pickerPosition);
				_this.refreshYear();
			});
	
			this.yearPoints.each(function(i) {
				_this.yearPoints.eq(i).mousedown(function() {
					_this.setYear(i);
					_this.updateInputFromCurrent();
				});
			});
	
		// Month behavior

			function _refreshMonthPicker() {
				_this.refreshMonthPicker.call(_this);
			}
	
			this.monthPicker.draggable({
				'axis': 'y',
				'drag': _refreshMonthPicker,
				'stop': _refreshMonthPicker,
				'containment': 'parent'
			});
	
			this.monthScrollerGroup.mousewheel(function(e, delta) {
				e.preventDefault();
				var	delta = -((delta>0)?Math.ceil(delta):Math.floor(delta)),
					pickerPosition = parseInt(_this.monthPicker.css('top'))+delta*8;
	
				if(pickerPosition < 0) {pickerPosition = 0;}
				else if(pickerPosition > _this.monthPickerDelta) {pickerPosition = _this.monthPickerDelta;}
	
				_this.monthPickerGroup.css('top', pickerPosition);
				_this.refreshMonthPicker();
			});
	
			this.monthPickerWrap.mousedown(function(e) {
				var y = e.pageY - $(this).offset().top;
				_this.setMonthPickerPosition(y);
			});

		};


	// Year helper methods

		this.calculateYear = function() {
			return parseInt(parseInt(this.yearPicker.css('top'))/this.yearPickerShift);
		};

		this.setYear = function(y) {
			if(y in years) {
				this.yearPickerGroup.css('top', y*this.yearPickerShift+'px');
				this.yearsElem.hide().eq(y).show();
				this.yearN = y;
				this.year = years[y];
			}
		};

		this.refreshYear = function() {

			this.yearPickerBg.css('top', this.yearPicker.css('top'));
			var y = this.calculateYear();

			this.yearsElem.hide().eq(y).show();

			this.yearN = y;
			this.year = years[y];
			this.updateInputFromCurrent();
		};

	// Month helper mothods

		this.setMonthPickerPosition = function(y, fromTop) {
			var top;
			if(y < this.monthPickerDelta) {
				if(y < this.monthPickerHalfHeight) {
					top = 0;
					
				}
				else {
					fromTop = (fromTop)?0:this.monthPickerHalfHeight;
					top = y-fromTop;
				}
			}
			else {
				top = this.monthPickerDelta;
			}
			this.monthPickerGroup.css('top', top+'px');

			this.refreshMonthPicker();
		};

		this.scrollToMonth = function(m) {
			var shift = m*this.monthHeight, monthShift = parseInt(Math.abs(shift)/this.yearsDelta*this.monthPickerDelta);

			this.setMonthPickerPosition(monthShift, true);
		};

		this.refreshMonthPicker = function() {
			var _this = this;
			this.monthPickerBg.css('top', this.monthPicker.css('top'));
			this.yearsElem.each(function(i) {
				_this.yearsElem.eq(i).css('top', '-' + parseInt(parseInt(_this.monthPicker.css('top'))/_this.monthPickerDelta*_this.yearsDelta) + 'px');
			});
		};

		this.setMonth = function(m) {
			if(m !== undefined && m > -1 && m < 12) {
				this.scrollToMonth(m);
				this.month = m;
			}
		};

	// Date helper methods

		this.setDate = function(d) {
			var daysInCurrentMonth = this.monthsElem.eq(this.yearN*12+this.month).data('days');
			if(d > 0 && d <= daysInCurrentMonth.length) {
				this.date = d;
				this.daysElem.removeClass('current');
				daysInCurrentMonth.eq(d-1).addClass('current');
			}
		};

	// Tooltip methods

		function parseInput() {
			var _this = this;
			setTimeout(function() {
				var	val = _this.input.val().replace(/\s{2,}/, ' '),
	
					y = val.match(yearReg),
					m = val.match(monthReg),
					d = val.match(dateReg),
					M;

				if(val == ' ') {val = '';}
	
				_this.input.val(val);
	
				y = (y)?+y[0]:y;
				m = (m)?m[0]:m;
				d = (d)?+d[0]:d;
	
				for(var i = 0; i < _this.options.i18n.months.length; i++) {
					if(~_this.options.i18n.months[i].search(new RegExp('^'+m, 'i')) && _this.options.i18n.months[_this.month] != m) {
						M = i;
						//m = undefined;
						break;
					}
				}
				_this.val(d, M, y, true);

				var text = [val];
				if(!d) {text.push(_this.date);}
				if(!m) {text.push(_this.options.i18n.months[_this.month]);}
				if(!y) {text.push(_this.year);}
				_this.tooltip.html(text.join(' '));

			}, 1);
		}

		this.updateInputFromCurrent = function() {
			this.tooltip.html('');
			this.input.val(this.textVal());
		}

	}



	// Datepicker constructor

	function richDatepicker(input, options) {

		this.options = options || {};

		this.options.i18n = this.options.i18n || {};
		this.options.i18n.months = this.options.i18n.months || months;
		this.options.i18n.days = this.options.i18n.days || days;

		var position = this.options.position ? 'position-'+this.options.position : 'position-bottom';

		this.input = input;

		this.year = currentYear;
		this.month = currentMonth;
		this.date = currentDate;

		this.wrap = this.input.wrap('<div class="rich-datepicker-wrap '+position+'" />').parent().append(this.datepickerHTML());
		this.tooltip = this.wrap.find('.tooltip');
		this.richDatepicker = this.wrap.find('.rich-datepicker');

	// calendar

		this.calendar = this.wrap.find('.calendar');
		this.calendarHeight = this.calendar.height();

	// year

		this.yearN = 0;

		this.yearPickerWrap = this.wrap.find('.year-picker');

		this.yearPicker = this.yearPickerWrap.find('.draggable-area');
		this.yearPickerBg = this.yearPickerWrap.find('.bg-area');
		this.yearPickerGroup = $.merge(this.yearPicker, this.yearPickerBg);

		this.yearPoints = this.yearPickerWrap.find('li');

		this.yearPickerShift = this.yearPoints.height();
		this.yearMaxPosition = this.yearPickerShift*(years.length-1);

		this.yearsElem = this.wrap.find('.year-wrap');
		this.yearHeight = this.yearsElem.height();
		this.yearsDelta = this.yearHeight-this.calendarHeight;

	// month

		this.monthPickerWrap = this.wrap.find('.month-picker');

		this.monthPicker = this.monthPickerWrap.find('.draggable-area');
		this.monthPickerBg = this.monthPickerWrap.find('.bg-area');
		this.monthPickerGroup = $.merge(this.monthPicker, this.monthPickerBg);

		this.monthPoints = this.monthPickerWrap.find('li');

		this.monthPickerWayLength = this.monthPoints.height()*12;
		this.monthPickerHeight = this.monthPicker.height();
		this.monthPickerHalfHeight = parseInt(this.monthPickerHeight/2);
		this.monthPickerDelta = this.monthPickerWayLength-this.monthPickerHeight;

		this.monthScrollerGroup = $.merge(this.calendar, this.monthPickerWrap); // scrolling area

		this.monthsElem = this.yearsElem.find('.month-wrap');

		this.monthHeight = this.monthsElem.height();

	//days

		this.daysElem = this.wrap.find('.day');



		this.ini();

	}

	richDatepicker.prototype = myDatepickerPrototype;


	// module ini

	$.fn.richDatepicker = function(options) {

		options = options || {};

		return this.each(function() {

			var	$this = $(this),
				datepicker = new richDatepicker($(this), options);

			$this.data('date', datepicker);

		});

	};

})(jQuery);
