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
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa'
		],
		weekends = [0, 6],

		cache,

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

		this.getCalendarHTML = function(year) {
	
			var	html = '<div class="year-wrap">',
				date = new Date(year, 0, 1),

				months = this.options.l10n.months,
				monday = this.options.monday,
				shift = monday ? 1 : 0,

				monthCounter = -1;

			while(date.getFullYear() == year) {
	
				var	month = date.getMonth(),
					day = date.getDay(),
					dayOfMonth = date.getDate();

				if(monthCounter != month) {
					// close days
					if(month > 0) {
						html += '</ul></div>';
					}
					// month title
					html += '<div class="month-wrap"><strong>' + months[month] + '</strong><ul>';
					// space tag
					if(day) {
						html += '<li class="size-' + (day - shift) + '"></li>';
					}
					else if (monday) {
						html += '<li class="size-6"></li>';
					}
					++monthCounter;
				}
	
				var restDay = ~weekends.indexOf(day) ? ' rest-day' : '';
				html += '<li class="day' + restDay + '">' + dayOfMonth + '</li>';

				date.setMilliseconds(date.getMilliseconds()+dayLength);
			}
	
			html += '</ul></div></div>';
	
			return html;
		};

		this.getDaysHTML = function(days) {

			var html = '',
				weekends = this.options.weekends;

			$.each(days, function(i, c) {
				if (~weekends.indexOf(i)) {
					html += '<li class="rest-day">' + days[i] + '</li>';
				}
				else {
					html += '<li>' + days[i] + '</li>';
				}
			});

			return html;

		};

		this.datepickerHTML = function() {

			var calendarHTML = '',
				months = this.options.l10n.months,
				days = this.options.l10n.days,
				that = this;

			$.each(years, function(i, c) {
				calendarHTML += that.getCalendarHTML(c);
			});

			var	monthList = '<ul>',
				yearsList = '<ul>';

			for(var i = 0; i < 12; i++) {
				monthList += '<li>' + months[i] + '</li>';
				yearsList += '<li>' + years[i] + '</li>';
			}

			monthList += '</ul>';
			yearsList += '</ul>';
		
			return	'<div class="tooltip"></div>' +
					'<div class="rich-datepicker-body">' +
						'<ul class="days">' + this.getDaysHTML(days) + '</ul>' +
						'<div class="calendar">' + calendarHTML + '</div>' +
						'<div class="month-picker"><div class="draggable-area"></div><div class="bg-area gradient1"></div>' + monthList + '</div>' +
						'<div class="year-picker"><div class="draggable-area"></div><div class="bg-area gradient1"></div>' + yearsList + '</div>' +
					'</div>';
		};

		// value methods

		this.textVal = function() {
			return this.date + ' ' + this.options.l10n.months[this.month] + ' ' + this.year;
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
						var position = $.inArray(m, this.options.l10n.months);
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
	
				for(var i = 0; i < _this.options.l10n.months.length; i++) {
					if(~_this.options.l10n.months[i].search(new RegExp('^'+m, 'i')) && _this.options.l10n.months[_this.month] != m) {
						M = i;
						//m = undefined;
						break;
					}
				}
				_this.val(d, M, y, true);

				var text = [val];
				if(!d) {text.push(_this.date);}
				if(!m) {text.push(_this.options.l10n.months[_this.month]);}
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

	function richDatepicker(input, options, cacheFlag) {

		var cdays = days;

		this.options = options || {};
		this.options.l10n = this.options.l10n || {};
		this.options.l10n.months = this.options.l10n.months || months;

		if (this.options.monday) {
			cdays = days.slice(0);
			cdays.push(cdays.shift(0))
		}

		this.options.l10n.days = this.options.l10n.days || cdays;
		this.options.weekends = this.options.monday ? [5, 6] : [0, 6];

		var position = this.options.position ? 'position-'+this.options.position : 'position-bottom';

		this.input = input;

		this.year = currentYear;
		this.month = currentMonth;
		this.date = currentDate;

		if (cacheFlag || !cache) {
			cache = this.datepickerHTML();
		}

		this.wrap = this.input.wrap('<div class="rich-datepicker-wrap '+position+'" />').parent().append(cache);
		this.tooltip = this.wrap.find('.tooltip');
		this.richDatepicker = this.wrap.find('.rich-datepicker-body');

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

	$.fn.richDatepicker = function(options, cache) {

		options = options || {};

		return this.each(function() {

			var	$this = $(this),
				datepicker = new richDatepicker($(this), options, cache);

			$this.data('date', datepicker);

		});

	};

})(jQuery);
