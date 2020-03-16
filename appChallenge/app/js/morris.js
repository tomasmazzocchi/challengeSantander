(function() {
  var $, Morris, minutesSpecHelper, secondsSpecHelper,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Morris = window.Morris = {};

  $ = jQuery;

  Morris.EventEmitter = (function() {
    function EventEmitter() {}

    EventEmitter.prototype.on = function(name, handler) {
      if (this.handlers == null) {
        this.handlers = {};
      }
      if (this.handlers[name] == null) {
        this.handlers[name] = [];
      }
      this.handlers[name].push(handler);
      return this;
    };

    EventEmitter.prototype.fire = function() {
      var args, handler, k, len, name, ref, results;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if ((this.handlers != null) && (this.handlers[name] != null)) {
        ref = this.handlers[name];
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          handler = ref[k];
          results.push(handler.apply(null, args));
        }
        return results;
      }
    };

    return EventEmitter;

  })();

  Morris.commas = function(num) {
    var absnum, intnum, ret, strabsnum;
    if (num != null) {
      ret = num < 0 ? "-" : "";
      absnum = Math.abs(num);
      intnum = Math.floor(absnum).toFixed(0);
      ret += intnum.replace(/(?=(?:\d{3})+$)(?!^)/g, '.');
      strabsnum = absnum.toString();
      if (strabsnum.length > intnum.length) {
        ret += strabsnum.slice(intnum.length);
      }
      return ret;
    } else {
      return '-';
    }
  };

  Morris.pad2 = function(number) {
    return (number < 10 ? '0' : '') + number;
  };

  Morris.Grid = (function(superClass) {
    extend(Grid, superClass);

    function Grid(options) {
      this.hasToShow = bind(this.hasToShow, this);
      this.resizeHandler = bind(this.resizeHandler, this);
      if (typeof options.element === 'string') {
        this.el = $(document.getElementById(options.element));
      } else {
        this.el = $(options.element);
      }
      if ((this.el == null) || this.el.length === 0) {
        throw new Error("Graph container element not found");
      }
      if (this.el.css('position') === 'static') {
        this.el.css('position', 'relative');
      }
      this.options = $.extend({}, this.gridDefaults, this.defaults || {}, options);
      if (typeof this.options.units === 'string') {
        this.options.postUnits = options.units;
      }
      this.raphael = new Raphael(this.el[0]);
      this.elementWidth = null;
      this.elementHeight = null;
      this.dirty = false;
      this.selectFrom = null;
      if (this.init) {
        this.init();
      }
      this.setData(this.options.data);
      this.el.bind('mousemove', (function(_this) {
        return function(evt) {
          var left, offset, right, width, x;
          offset = _this.el.offset();
          x = evt.pageX - offset.left;
          if (_this.selectFrom) {
            left = _this.data[_this.hitTest(Math.min(x, _this.selectFrom))]._x;
            right = _this.data[_this.hitTest(Math.max(x, _this.selectFrom))]._x;
            width = right - left;
            return _this.selectionRect.attr({
              x: left,
              width: width
            });
          } else {
            return _this.fire('hovermove', x, evt.pageY - offset.top);
          }
        };
      })(this));
      this.el.bind('mouseleave', (function(_this) {
        return function(evt) {
          if (_this.selectFrom) {
            _this.selectionRect.hide();
            _this.selectFrom = null;
          }
          return _this.fire('hoverout');
        };
      })(this));
      this.el.bind('touchstart touchmove touchend', (function(_this) {
        return function(evt) {
          var offset, touch;
          touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
          offset = _this.el.offset();
          return _this.fire('hovermove', touch.pageX - offset.left, touch.pageY - offset.top);
        };
      })(this));
      this.el.bind('click', (function(_this) {
        return function(evt) {
          var offset;
          offset = _this.el.offset();
          return _this.fire('gridclick', evt.pageX - offset.left, evt.pageY - offset.top);
        };
      })(this));
      if (this.options.rangeSelect) {
        this.selectionRect = this.raphael.rect(0, 0, 0, this.el.innerHeight()).attr({
          fill: this.options.rangeSelectColor,
          stroke: false
        }).toBack().hide();
        this.el.bind('mousedown', (function(_this) {
          return function(evt) {
            var offset;
            offset = _this.el.offset();
            return _this.startRange(evt.pageX - offset.left);
          };
        })(this));
        this.el.bind('mouseup', (function(_this) {
          return function(evt) {
            var offset;
            offset = _this.el.offset();
            _this.endRange(evt.pageX - offset.left);
            return _this.fire('hovermove', evt.pageX - offset.left, evt.pageY - offset.top);
          };
        })(this));
      }
      if (this.options.resize) {
        $(window).bind('resize', (function(_this) {
          return function(evt) {
            if (_this.timeoutId != null) {
              window.clearTimeout(_this.timeoutId);
            }
            return _this.timeoutId = window.setTimeout(_this.resizeHandler, 100);
          };
        })(this));
      }
      this.el.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
      if (this.postInit) {
        this.postInit();
      }
    }

    Grid.prototype.gridDefaults = {
      dateFormat: null,
      axes: true,
      freePosition: false,
      grid: true,
      gridLineColor: '#aaa',
      gridStrokeWidth: 0.5,
      gridTextColor: '#888',
      gridTextSize: 12,
      gridTextFamily: 'sans-serif',
      gridTextWeight: 'normal',
      hideHover: false,
      yLabelFormat: null,
      yLabelAlign: 'right',
      xLabelAngle: 0,
      numLines: 5,
      padding: 25,
      parseTime: true,
      postUnits: '',
      preUnits: '',
      ymax: 'auto',
      ymin: 'auto 0',
      goals: [],
      goalStrokeWidth: 1.0,
      goalLineColors: ['#666633', '#999966', '#cc6666', '#663333'],
      events: [],
      eventStrokeWidth: 1.0,
      eventLineColors: ['#005a04', '#ccffbb', '#3a5f0b', '#005502'],
      rangeSelect: null,
      rangeSelectColor: '#eef',
      resize: false,
      yAxisStart : null
    };

    Grid.prototype.setData = function(data, redraw) {        
      var e, flatEvents, from, idx, index, k, len, maxGoal, minGoal, ref, ref1, ret, row, step, to, total, y, ykey, ymax, ymin, yval;
      if (redraw == null) {
        redraw = true;
      }
      this.options.data = data;
      if ((data == null) || data.length === 0) {
        this.data = [];
        this.raphael.clear();
        if (this.hover != null) {
          this.hover.hide();
        }
        return;
      }
      ymax = this.cumulative ? 0 : null;
      ymin = this.cumulative ? 0 : null;
      if (this.options.goals.length > 0) {
        minGoal = Math.min.apply(Math, this.options.goals);
        maxGoal = Math.max.apply(Math, this.options.goals);
        ymin = ymin != null ? Math.min(ymin, minGoal) : minGoal;
        ymax = ymax != null ? Math.max(ymax, maxGoal) : maxGoal;
      }
      this.data = (function() {          
        var k, len, results;
        results = [];                
        for (index = k = 0, len = data.length; k < len; index = ++k) {            
          row = data[index];
          ret = {
            src: row
          };
          ret.label = row[this.options.xkey];
          if (this.options.parseTime) {
            ret.x = Morris.parseDate(ret.label);
            if (this.options.dateFormat) {
              ret.label = this.options.dateFormat(ret.x);
            } else if (typeof ret.label === 'number') {
              ret.label = new Date(ret.label).toString();
            }
          } else if (this.options.freePosition) {
            ret.x = parseFloat(row[this.options.xkey]);
            if (this.options.xLabelFormat) {
              ret.label = this.options.xLabelFormat(ret);
            }
          } else {
            ret.x = index;
            if (this.options.xLabelFormat) {
              ret.label = this.options.xLabelFormat(ret);
            }
          }
          total = 0;
          ret.y = (function() {
            var len1, ref, results1, u;
            ref = this.options.ykeys;
            results1 = [];
            for (idx = u = 0, len1 = ref.length; u < len1; idx = ++u) {
              ykey = ref[idx];
              yval = row[ykey];
              if (typeof yval === 'string') {
                yval = parseFloat(yval);
              }
              if ((yval != null) && typeof yval !== 'number') {
                yval = null;
              }
              if ((yval != null) && this.hasToShow(idx)) {
                if (this.cumulative) {
                  total += yval;
                } else {
                  if (ymax != null) {
                    ymax = Math.max(yval, ymax);
                    ymin = Math.min(yval, ymin);
                  } else {
                    ymax = ymin = yval;
                  }
                }
              }
              if (this.cumulative && (total != null)) {
                ymax = Math.max(total, ymax);
                ymin = Math.min(total, ymin);
              }
              results1.push(yval);
            }
            return results1;
          }).call(this); 
          ret.hover = row.hover;
          results.push(ret);
        }        
        return results;
      }).call(this);      
      if (this.options.parseTime || this.options.freePosition) {
        this.data = this.data.sort(function(a, b) {
          return (a.x > b.x) - (b.x > a.x);
        });
      }
      this.xmin = this.data[0].x;
      this.xmax = this.data[this.data.length - 1].x;
      this.events = [];
      if (this.options.events.length > 0) {
        if (this.options.parseTime) {
          ref = this.options.events;
          for (k = 0, len = ref.length; k < len; k++) {
            e = ref[k];
            if (e instanceof Array) {
              from = e[0], to = e[1];
              this.events.push([Morris.parseDate(from), Morris.parseDate(to)]);
            } else {
              this.events.push(Morris.parseDate(e));
            }
          }
        } else {
          this.events = this.options.events;
        }
        flatEvents = $.map(this.events, function(e) {
          return e;
        });
        this.xmax = Math.max(this.xmax, Math.max.apply(Math, flatEvents));
        this.xmin = Math.min(this.xmin, Math.min.apply(Math, flatEvents));
      }      
      if (this.xmin === this.xmax) {
        this.xmin -= 1;
        this.xmax += 1;
      }
      this.ymin = this.yboundary('min', ymin);
      this.ymax = this.yboundary('max', ymax);
      if (this.ymin === this.ymax) {
        if (ymin) {
          this.ymin -= 1;
        }
        this.ymax += 1;
      }
      if (((ref1 = this.options.axes) === true || ref1 === 'both' || ref1 === 'y') || this.options.grid === true) {
        if (this.options.ymax === this.gridDefaults.ymax && this.options.ymin === this.gridDefaults.ymin) {            
          this.grid = this.autoGridLines(this.ymin, this.ymax, this.options.numLines);
          this.ymin = Math.min(this.ymin, this.grid[0]);
          this.ymax = Math.max(this.ymax, this.grid[this.grid.length - 1]);
        } else {
          step = (this.ymax - this.ymin) / (this.options.numLines - 1);
          this.grid = (function() {
            var ref2, ref3, ref4, results, u;
            results = [];
            for (y = u = ref2 = this.ymin, ref3 = this.ymax, ref4 = step; ref4 > 0 ? u <= ref3 : u >= ref3; y = u += ref4) {
              results.push(y);
            }
            return results;
          }).call(this);
        }
      }
      this.dirty = true;
      if (redraw) {
        return this.redraw();
      }
    };

    Grid.prototype.yboundary = function(boundaryType, currentValue) {      
      var boundaryOption, suggestedValue;
      boundaryOption = this.options["y" + boundaryType];
      if (typeof boundaryOption === 'string') {
        if (boundaryOption.slice(0, 4) === 'auto') {
          if (boundaryOption.length > 5) {
            suggestedValue = parseInt(boundaryOption.slice(5), 10);
            if (currentValue == null) {
              return suggestedValue;
            }
            return Math[boundaryType](currentValue, suggestedValue);
          } else {
            if (currentValue != null) {
              return currentValue;
            } else {
              return 0;
            }
          }
        } else {
          return parseInt(boundaryOption, 10);
        }
      } else {
        return boundaryOption;
      }
    };

    Grid.prototype.autoGridLines = function(ymin, ymax, nlines) {
      var gmax, gmin, grid, smag, span, step, unit, y, ymag;
      span = ymax - ymin;
      ymag = Math.floor(Math.log(span) / Math.log(10));
      unit = Math.pow(10, ymag);
      gmin = Math.floor(ymin / unit) * unit;
      gmax = Math.ceil(ymax / unit) * unit;
      step = (gmax - gmin) / (nlines - 1);
      if (unit === 1 && step > 1 && Math.ceil(step) !== step) {
        step = Math.ceil(step);
        gmax = gmin + step * (nlines - 1);
      }
      if (gmin < 0 && gmax > 0) {
        gmin = Math.floor(ymin / step) * step;
        gmax = Math.ceil(ymax / step) * step;
      }
      if (step < 1) {
        smag = Math.floor(Math.log(step) / Math.log(10));
        grid = (function() {
          var k, ref, ref1, ref2, results;
          results = [];
          for (y = k = ref = gmin, ref1 = gmax, ref2 = step; ref2 > 0 ? k <= ref1 : k >= ref1; y = k += ref2) {
            results.push(parseFloat(y.toFixed(1 - smag)));
          }
          return results;
        })();
      } else {
        grid = (function() {
          var k, ref, ref1, ref2, results;
          results = [];
          for (y = k = ref = gmin, ref1 = gmax, ref2 = step; ref2 > 0 ? k <= ref1 : k >= ref1; y = k += ref2) {
            results.push(y);
          }
          return results;
        })();
      }
      return grid;
    };

    Grid.prototype._calc = function() {
      var angle, bottomOffsets, gridLine, h, i, ref, ref1, w, yLabelWidths;
      w = this.el.width();
      h = this.el.height();
      if (this.elementWidth !== w || this.elementHeight !== h || this.dirty) {
        this.elementWidth = w;
        this.elementHeight = h;
        this.dirty = false;
        this.left = this.options.padding;
        this.right = this.elementWidth - this.options.padding;
        this.top = this.options.padding;
        this.bottom = this.elementHeight - this.options.padding;
        if ((ref = this.options.axes) === true || ref === 'both' || ref === 'y') {
          yLabelWidths = (function() {
            var k, len, ref1, results;
            ref1 = this.grid;
            results = [];
            for (k = 0, len = ref1.length; k < len; k++) {
              gridLine = ref1[k];
              results.push(this.measureText(this.yAxisFormat(gridLine)).width);
            }
            return results;
          }).call(this);
          if (!this.options.horizontal) {
            this.left += Math.max.apply(Math, yLabelWidths);
          } else {
            this.bottom -= Math.max.apply(Math, yLabelWidths);
          }
        }
        if ((ref1 = this.options.axes) === true || ref1 === 'both' || ref1 === 'x') {
          if (!this.options.horizontal) {
            angle = -this.options.xLabelAngle;
          } else {
            angle = -90;
          }
          bottomOffsets = (function() {
            var k, ref2, results;
            results = [];
            for (i = k = 0, ref2 = this.data.length; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
              results.push(this.measureText(this.data[i].label, angle).height);
            }
            return results;
          }).call(this);
          if (!this.options.horizontal) {
            this.bottom -= Math.max.apply(Math, bottomOffsets);
          } else {
            this.left += Math.max.apply(Math, bottomOffsets);
          }
        }        
        this.width = Math.max(1, this.right - this.left)-10;
        this.height = Math.max(1, this.bottom - this.top);
        if (!this.options.horizontal) {
          this.dx = this.width / (this.xmax - this.xmin);
          this.dy = this.height / (this.ymax - this.ymin);
          this.yStart = this.bottom;
          this.yEnd = this.top;
          this.xStart = this.left;
          this.xEnd = this.right;
          this.xSize = this.width;
          this.ySize = this.height;
        } else {
          this.dx = this.height / (this.xmax - this.xmin);
          this.dy = this.width / (this.ymax - this.ymin);
          this.yStart = this.left;
          this.yEnd = this.right;
          this.xStart = this.top;
          this.xEnd = this.bottom;
          this.xSize = this.height;
          this.ySize = this.width;
        }
        if (this.calc) {
          return this.calc();
        }
      }
    };

    Grid.prototype.transY = function(y) {
      if (!this.options.horizontal) {
        return this.bottom - (y - this.ymin) * this.dy;
      } else {
        return this.left + (y - this.ymin) * this.dy;
      }
    };

    Grid.prototype.transX = function(x) {
      if (this.data.length === 1) {
        return (this.xStart + this.xEnd) / 2;
      } else {
        return this.xStart + (x - this.xmin) * this.dx;
      }
    };

    Grid.prototype.redraw = function() {
      this.raphael.clear();
      this._calc();
      this.drawGrid();
      this.drawGoals();
      this.drawEvents();      
      if (this.draw) {
        this.options.drawCallback();
        return this.draw();
      }            
    };

    Grid.prototype.measureText = function(text, angle) {        
      var ret, tt;
      if (angle == null) {
        angle = 0;
      }
      tt = this.raphael.text(100, 100, text).attr('font-size', this.options.gridTextSize).attr('font-family', this.options.gridTextFamily).attr('font-weight', this.options.gridTextWeight).rotate(angle);
      ret = tt.getBBox();
      tt.remove();
      return ret;
    };

    Grid.prototype.yAxisFormat = function(label) {
      return this.yLabelFormat(label, 0);
    };

    Grid.prototype.yLabelFormat = function(label, i) {
      if (typeof this.options.yLabelFormat === 'function') {
        return this.options.yLabelFormat(label, i);
      } else {
        return "" + this.options.preUnits + (Morris.commas(label)) + "  " +this.options.postUnits;
      }
    };

    Grid.prototype.getYAxisLabelX = function() {
      if (this.options.yLabelAlign === 'right') {
        return this.left - this.options.padding / 2;
      } else {
        return this.options.padding / 2;
      }
    };

    Grid.prototype.drawGrid = function() {
      var basePos, k, len, lineY, pos, ref, ref1, ref2, results;
      if (this.options.grid === false && ((ref = this.options.axes) !== true && ref !== 'both' && ref !== 'y')) {
        return;
      }
      if (!this.options.horizontal) {
        basePos = this.getYAxisLabelX();
      } else {
        basePos = this.getXAxisLabelY();
      }
      ref1 = this.grid;
      results = [];
      for (k = 0, len = ref1.length; k < len; k++) {
        lineY = ref1[k];
        pos = this.transY(lineY);        
        if ((ref2 = this.options.axes) === true || ref2 === 'both' || ref2 === 'y') {
          if (!this.options.horizontal) {
            this.drawYAxisLabel(basePos, pos, this.yAxisFormat(lineY));
          } else {
            this.drawXAxisLabel(pos, basePos, this.yAxisFormat(lineY));
          }
        }
        if (this.options.grid) {
          pos = Math.floor(pos) + 0.5;
          if (!this.options.horizontal) {
            results.push(this.drawGridLine("M" + this.xStart + "," + pos + "H" + this.xEnd, k === 0, true));
          } else {
            results.push(this.drawGridLine("M" + pos + "," + this.xStart + "V" + this.xEnd));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Grid.prototype.drawGoals = function() {
      var color, goal, i, k, len, ref, results;
      ref = this.options.goals;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        goal = ref[i];
        color = this.options.goalLineColors[i % this.options.goalLineColors.length];
        results.push(this.drawGoal(goal, color));
      }
      return results;
    };

    Grid.prototype.drawEvents = function() {
      var color, event, i, k, len, ref, results;
      ref = this.events;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        event = ref[i];
        color = this.options.eventLineColors[i % this.options.eventLineColors.length];
        results.push(this.drawEvent(event, color));
      }
      return results;
    };

    Grid.prototype.drawGoal = function(goal, color) {
      var path, y, point;            
      y = Math.floor(this.transY(goal)) + 0.5;
      if (!this.options.horizontal) {
        path = "M" + this.xStart + "," + y + "H" + this.xEnd;
      } else {
        path = "M" + y + "," + this.xStart + "V" + this.xEnd;
      }
      point = parseInt(path.split(",")[1].split(".")[0]) + 10;      
      if(point < this.yStart){
      this.raphael.text("90%", point , "Normal").attr({fill: color}).attr('font-size', 12).attr('font-weight', "bold"); 
      return this.raphael.path(path).attr("stroke-dasharray","--.").attr('stroke', color).attr('stroke-width', this.options.goalStrokeWidth);
      }else {
          return null;
      }
    };

    Grid.prototype.drawEvent = function(event, color) {
      var from, path, to, x;
      if (event instanceof Array) {
        from = event[0], to = event[1];
        from = Math.floor(this.transX(from)) + 0.5;
        to = Math.floor(this.transX(to)) + 0.5;
        if (!this.options.horizontal) {
          return this.raphael.rect(from, this.yEnd, to - from, this.yStart - this.yEnd).attr({
            fill: color,
            stroke: false
          }).toBack();
        } else {
          return this.raphael.rect(this.yStart, from, this.yEnd - this.yStart, to - from).attr({
            fill: color,
            stroke: false
          }).toBack();
        }
      } else {
        x = Math.floor(this.transX(event)) + 0.5;
        if (!this.options.horizontal) {
          path = "M" + x + "," + this.yStart + "V" + this.yEnd;
        } else {
          path = "M" + this.yStart + "," + x + "H" + this.yEnd;
        }
        return this.raphael.path(path).attr('stroke', color).attr('stroke-width', this.options.eventStrokeWidth);
      }
    };

    Grid.prototype.drawYAxisLabel = function(xPos, yPos, text) {
      var label;
      label = this.raphael.text(xPos, yPos, text).attr('font-size', this.options.gridTextSize).attr('font-family', this.options.gridTextFamily).attr('font-weight', this.options.gridTextWeight).attr('fill', this.options.gridTextColor);
      if (this.options.yLabelAlign === 'right') {
        return label.attr('text-anchor', 'end');
      } else {
        return label.attr('text-anchor', 'start');
      }
    };

    Grid.prototype.drawXAxisLabel = function(xPos, yPos, text) {
      return this.raphael.text(xPos, yPos, text).attr('font-size', this.options.gridTextSize).attr('font-family', this.options.gridTextFamily).attr('font-weight', this.options.gridTextWeight).attr('fill', this.options.gridTextColor);
    };
 
    Grid.prototype.drawGridLine = function(path, first, esEjeX) {             
      if(first){            
          if(esEjeX){
          this.options.yAxisStart = path.substr(0,path.indexOf(","));
      }else{
        this.raphael.path(this.options.yAxisStart + path.substr(path.indexOf(","), path.length)).attr('stroke', this.options.gridLineColor).attr('stroke-width', 5);
         }
          return this.raphael.path(path).attr('stroke', this.options.gridLineColor).attr('stroke-width', esEjeX ? 5 : this.options.gridStrokeWidth);
      }else{      
      return this.raphael.path(path).attr('stroke', this.options.gridLineColor).attr('stroke-width', this.options.gridStrokeWidth);
        }
    };

    Grid.prototype.startRange = function(x) {
      this.hover.hide();
      this.selectFrom = x;
      return this.selectionRect.attr({
        x: x,
        width: 0
      }).show();
    };

    Grid.prototype.endRange = function(x) {
      var end, start;
      if (this.selectFrom) {
        start = Math.min(this.selectFrom, x);
        end = Math.max(this.selectFrom, x);
        this.options.rangeSelect.call(this.el, {
          start: this.data[this.hitTest(start)].x,
          end: this.data[this.hitTest(end)].x
        });
        return this.selectFrom = null;
      }
    };

    Grid.prototype.resizeHandler = function() {
      this.timeoutId = null;
      this.raphael.setSize(this.el.width(), this.el.height());
      return this.redraw();
    };

    Grid.prototype.hasToShow = function(i) {
      return this.options.shown === true || this.options.shown[i] === true;
    };

    return Grid;

  })(Morris.EventEmitter);

  Morris.parseDate = function(date) {
    var isecs, m, msecs, n, o, offsetmins, p, q, r, ret, secs;
    if (typeof date === 'number') {
      return date;
    }
    m = date.match(/^(\d+) Q(\d)$/);
    n = date.match(/^(\d+)-(\d+)$/);
    o = date.match(/^(\d+)-(\d+)-(\d+)$/);
    p = date.match(/^(\d+) W(\d+)$/);
    q = date.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)(Z|([+-])(\d\d):?(\d\d))?$/);
    r = date.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+):(\d+(\.\d+)?)(Z|([+-])(\d\d):?(\d\d))?$/);
    if (m) {
      return new Date(parseInt(m[1], 10), parseInt(m[2], 10) * 3 - 1, 1).getTime();
    } else if (n) {
      return new Date(parseInt(n[1], 10), parseInt(n[2], 10) - 1, 1).getTime();
    } else if (o) {
      return new Date(parseInt(o[1], 10), parseInt(o[2], 10) - 1, parseInt(o[3], 10)).getTime();
    } else if (p) {
      ret = new Date(parseInt(p[1], 10), 0, 1);
      if (ret.getDay() !== 4) {
        ret.setMonth(0, 1 + ((4 - ret.getDay()) + 7) % 7);
      }
      return ret.getTime() + parseInt(p[2], 10) * 604800000;
    } else if (q) {
      if (!q[6]) {
        return new Date(parseInt(q[1], 10), parseInt(q[2], 10) - 1, parseInt(q[3], 10), parseInt(q[4], 10), parseInt(q[5], 10)).getTime();
      } else {
        offsetmins = 0;
        if (q[6] !== 'Z') {
          offsetmins = parseInt(q[8], 10) * 60 + parseInt(q[9], 10);
          if (q[7] === '+') {
            offsetmins = 0 - offsetmins;
          }
        }
        return Date.UTC(parseInt(q[1], 10), parseInt(q[2], 10) - 1, parseInt(q[3], 10), parseInt(q[4], 10), parseInt(q[5], 10) + offsetmins);
      }
    } else if (r) {
      secs = parseFloat(r[6]);
      isecs = Math.floor(secs);
      msecs = Math.round((secs - isecs) * 1000);
      if (!r[8]) {
        return new Date(parseInt(r[1], 10), parseInt(r[2], 10) - 1, parseInt(r[3], 10), parseInt(r[4], 10), parseInt(r[5], 10), isecs, msecs).getTime();
      } else {
        offsetmins = 0;
        if (r[8] !== 'Z') {
          offsetmins = parseInt(r[10], 10) * 60 + parseInt(r[11], 10);
          if (r[9] === '+') {
            offsetmins = 0 - offsetmins;
          }
        }
        return Date.UTC(parseInt(r[1], 10), parseInt(r[2], 10) - 1, parseInt(r[3], 10), parseInt(r[4], 10), parseInt(r[5], 10) + offsetmins, isecs, msecs);
      }
    } else {
      return new Date(parseInt(date, 10), 0, 1).getTime();
    }
  };

  Morris.Hover = (function() {
    Hover.defaults = {
      "class": 'morris-hover morris-default-style'
    };

    function Hover(options) {
      if (options == null) {
        options = {};
      }
      this.options = $.extend({}, Morris.Hover.defaults, options);
      this.el = $("<div class='" + this.options["class"] + "'></div>");
      this.el.hide();
      this.options.parent.append(this.el);
    }

    Hover.prototype.update = function(html, x, y, centre_y) {
      if (!html) {
        return this.hide();
      } else {
        this.html(html);
        this.show();
        return this.moveTo(x, y, centre_y);
      }
    };

    Hover.prototype.html = function(content) {
      return this.el.html(content);
    };

    Hover.prototype.moveTo = function(x, y, centre_y) {
      var hoverHeight, hoverWidth, left, parentHeight, parentWidth, top;
      parentWidth = this.options.parent.innerWidth();
      parentHeight = this.options.parent.innerHeight();
      hoverWidth = this.el.outerWidth();
      hoverHeight = this.el.outerHeight();
      left = Math.min(Math.max(0, x - hoverWidth / 2), parentWidth - hoverWidth);
      if (y != null) {
        if (centre_y === true) {
          top = y - hoverHeight / 2;
          if (top < 0) {
            top = 0;
          }
        } else {
          top = y - hoverHeight - 10;
          if (top < 0) {
            top = y + 10;
            if (top + hoverHeight > parentHeight) {
              top = parentHeight / 2 - hoverHeight / 2;
            }
          }
        }
      } else {
        top = parentHeight / 2 - hoverHeight / 2;
      }
      return this.el.css({
        left: left + "px",
        top: parseInt(top) + "px"
      });
    };

    Hover.prototype.show = function() {
      return this.el.show();
    };

    Hover.prototype.hide = function() {
      return this.el.hide();
    };

    return Hover;

  })();

  Morris.Line = (function(superClass) {
    extend(Line, superClass);

    function Line(options) {           
      this.hilight = bind(this.hilight, this);
      this.onHoverOut = bind(this.onHoverOut, this);
      this.onHoverMove = bind(this.onHoverMove, this);
      this.onGridClick = bind(this.onGridClick, this);
      if (!(this instanceof Morris.Line)) {
        return new Morris.Line(options);
      }
      Line.__super__.constructor.call(this, options);
    }

    Line.prototype.init = function() {
      if (this.options.hideHover !== 'always') {
        this.hover = new Morris.Hover({
          parent: this.el
        });
        this.on('hovermove', this.onHoverMove);
        this.on('hoverout', this.onHoverOut);
        return this.on('gridclick', this.onGridClick);
      }
    };

    Line.prototype.defaults = {
      lineWidth: 3,
      pointSize: 4,
      lineColors: ['#0b62a4', '#7A92A3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
      pointStrokeWidths: [1],
      pointStrokeColors: ['#ffffff'],
      pointFillColors: [],
      smooth: true,
      shown: true,
      xLabels: 'auto',
      xLabelFormat: null,
      xLabelMargin: 23,
      verticalGrid: false,
      verticalGridHeight: 'full',
      verticalGridStartOffset: 0,
      hideHover: false,
      trendLine: false,
      trendLineWidth: 2,
      trendLineWeight: false,
      trendLineColors: ['#689bc3', '#a2b3bf', '#64b764']
    };

    Line.prototype.calc = function() {       
      this.calcPoints();
      return this.generatePaths();
    };

    Line.prototype.calcPoints = function() {
      var i, k, len, ref, results, row, y;
      ref = this.data;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        row = ref[k];
        row._x = this.transX(row.x);
        row._y = (function() {
          var len1, ref1, results1, u;
          ref1 = row.y;
          results1 = [];
          for (u = 0, len1 = ref1.length; u < len1; u++) {
            y = ref1[u];
            if (y != null) {
              results1.push(this.transY(y));
            } else {
              results1.push(y);
            }
          }
          return results1;
        }).call(this);
        results.push(row._ymax = Math.min.apply(Math, [this.bottom].concat((function() {
          var len1, ref1, results1, u;
          ref1 = row._y;
          results1 = [];
          for (i = u = 0, len1 = ref1.length; u < len1; i = ++u) {
            y = ref1[i];
            if ((y != null) && this.hasToShow(i)) {
              results1.push(y);
            }
          }
          return results1;
        }).call(this))));
      }
      return results;
    };

    Line.prototype.hitTest = function(x) {        
      var index, k, len, r, ref;
      if (this.data.length === 0) {
        return null;
      }
      ref = this.data;//.slice(1);
      for (index = k = 0, len = ref.length; k < len; index = ++k) {                    
        r = ref[index];        
        if ((x < (r._x + this.data[index]._x) / 2) && this.data[index].hover) {                        
          return index;
        }
      }
      return null;
    };

    Line.prototype.onGridClick = function(x, y) {
      /*var index;
      index = this.hitTest(x);
      return this.fire('click', index, this.data[index].src, x, y);*/
    };

    Line.prototype.onHoverMove = function(x, y) {                
      var index;
      index = this.hitTest(x);
      return this.displayHoverForRow(index);
    };

    Line.prototype.onHoverOut = function() {
      if (this.options.hideHover !== false) {
        return this.displayHoverForRow(null);
      }
    };

    Line.prototype.displayHoverForRow = function(index) {
      var ref;
      if (index != null) {
        (ref = this.hover).update.apply(ref, this.hoverContentForRow(index));
        return this.hilight(index);
      } else {
        this.hover.hide();
        return this.hilight();
      }
    };

    Line.prototype.hoverContentForRow = function(index) {
      var content, j, k, len, ref, row, y;
      row = this.data[index];
      content = $("<div class='morris-hover-row-label'>").text(row.label);
      content = content.prop('outerHTML');
      ref = row.y;
      for (j = k = 0, len = ref.length; k < len; j = ++k) {
        y = ref[j];
        if (this.options.labels[j] === false) {
          continue;
        }
        content += "<div class='morris-hover-point' style='color: " + (this.colorFor(row, j, 'label')) + "'>\n  " + this.options.labels[j] + ":\n  " + (this.yLabelFormat(y, j)) + "\n</div>";
      }
      if (typeof this.options.hoverCallback === 'function') {
        content = this.options.hoverCallback(index, this.options, content, row.src);
      }
      return [content, row._x, row._ymax];
    };

    Line.prototype.generatePaths = function() {
      var coords, i, r, smooth;
      return this.paths = (function() {
        var k, ref, ref1, results;
        results = [];
        for (i = k = 0, ref = this.options.ykeys.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {            
          smooth = typeof this.options.smooth === "boolean" ? this.options.smooth : (ref1 = this.options.ykeys[i], indexOf.call(this.options.smooth, ref1) >= 0);
          coords = (function() {
            var len, ref2, results1, u;
            ref2 = this.data;
            results1 = [];
            for (u = 0, len = ref2.length; u < len; u++) {
              r = ref2[u];
              if (r._y[i] !== void 0) {
                results1.push({
                  x: r._x,
                  y: r._y[i]
                });
              }
            }
            return results1;
          }).call(this);          
          if (coords.length > 1) {
            results.push(Morris.Line.createPath(coords, smooth, this.bottom));
          } else {
            results.push(null);
          }
        }
        return results;
      }).call(this);
    };

    Line.prototype.draw = function() {
      var ref;
      if ((ref = this.options.axes) === true || ref === 'both' || ref === 'x') {
        this.drawXAxis();
      }
      this.drawSeries();
      if (this.options.hideHover === false) {
        return this.displayHoverForRow(this.data.length - 1);
      }
    };

    Line.prototype.drawXAxis = function() {          
      var drawLabel, k, l, labels, len, len1, lines, prevAngleMargin, prevLabelMargin, results, row, u, ypos;
      ypos = this.bottom + this.options.padding / 2;
      prevLabelMargin = null;
      prevAngleMargin = null;
      drawLabel = (function(_this) {
        return function(labelText, xpos, first) {                    
          var label, labelBox, margin, offset, textBox;
          label = _this.drawXAxisLabel(_this.transX(xpos), ypos, labelText);
          textBox = label.getBBox();
          label.transform("r" + (-_this.options.xLabelAngle));
          labelBox = label.getBBox();
          label.transform("t0," + (labelBox.height / 2) + "...");
          if (_this.options.xLabelAngle !== 0) {
            offset = -0.5 * textBox.width * Math.cos(_this.options.xLabelAngle * Math.PI / 180.0);
            label.transform("t" + offset + ",0...");
          }
          labelBox = label.getBBox();
          if (first || (((prevLabelMargin == null) || prevLabelMargin >= labelBox.x + labelBox.width || (prevAngleMargin != null) && prevAngleMargin >= labelBox.x) && labelBox.x >= 0 && (labelBox.x + labelBox.width) < _this.el.width())) {
            if (_this.options.xLabelAngle !== 0) {
              margin = 1.25 * _this.options.gridTextSize / Math.sin(_this.options.xLabelAngle * Math.PI / 180.0);
              prevAngleMargin = labelBox.x - margin;
            }
            prevLabelMargin = labelBox.x - _this.options.xLabelMargin;            
            if (_this.options.verticalGrid === true) {              
              return _this.drawVerticalGridLine(xpos, first);
            }
          } else {
            return label.remove();
          }      
        };
      })(this);
      if (this.options.parseTime) {         
        if (this.data.length === 1 && this.options.xLabels === 'auto') {
          labels = [[this.options.xLabelFormat(this.data[0].label), this.data[0].x]];
        } else {
          labels = Morris.labelSeries(this.xmin, this.xmax, this.width, this.options.xLabels, this.options.xLabelFormat);
        }
      } else if (this.options.customLabels) {          
        labels = (function() {
          var k, len, ref, results;
          ref = this.options.customLabels;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            row = ref[k];
            results.push([row.label, row.x]);
          }
          return results;
        }).call(this);
      } else {
        labels = (function() {
          var k, len, ref, results;
          ref = this.data;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            row = ref[k];
            results.push([(row.label).toFixed(2), row.x]);
          }
          return results;
        }).call(this);
      }
      labels.reverse();      
      for (k = 0, len = labels.length; k < len; k++) {
        l = labels[k];        
        drawLabel(l[0], l[1], l[0] === 0 || k === 0);
      }
      
      if (typeof this.options.verticalGrid === 'string') {
        lines = Morris.labelSeries(this.xmin, this.xmax, this.width, this.options.verticalGrid);
        results = [];
        for (u = 0, len1 = lines.length; u < len1; u++) {
          l = lines[u];
          results.push(this.drawVerticalGridLine(l[1]));
        }
        return results;
      }
    };

    Line.prototype.drawVerticalGridLine = function(xpos,first) {        
      var yEnd, yStart;
      xpos = Math.floor(this.transX(xpos)) + 0.5;
      yStart = this.yStart + this.options.verticalGridStartOffset;
      if (this.options.verticalGridHeight === 'full') {
        yEnd = this.yEnd;
      } else {
        yEnd = this.yStart - this.options.verticalGridHeight;
      }           
      return this.drawGridLine("M" + xpos + "," + yStart + "V" + yEnd, first);
    };

    Line.prototype.drawSeries = function() {        
      var i, k, ref, ref1, results, u;
      this.seriesPoints = [];
      for (i = k = ref = this.options.ykeys.length - 1; ref <= 0 ? k <= 0 : k >= 0; i = ref <= 0 ? ++k : --k) {
        if (this.hasToShow(i)) {
          if (this.options.trendLine !== false && this.options.trendLine === true || this.options.trendLine[i] === true) {
            this._drawTrendLine(i);
          }
          this._drawLineFor(i);
        }
      }
      results = [];
      for (i = u = ref1 = this.options.ykeys.length - 1; ref1 <= 0 ? u <= 0 : u >= 0; i = ref1 <= 0 ? ++u : --u) {
        if (this.hasToShow(i)) {
          results.push(this._drawPointFor(i));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Line.prototype._drawPointFor = function(index) {        
      var circle, k, len, ref, results, row;
      this.seriesPoints[index] = [];
      ref = this.data;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        row = ref[k];
        circle = null;
        if (row._y[index] != null) {
          circle = this.drawLinePoint(row._x, row._y[index], this.colorFor(row, index, 'point'), index);
        }
        results.push(this.seriesPoints[index].push(circle));
      }
      return results;
    };

    Line.prototype._drawLineFor = function(index) {        
      var path;
      path = this.paths[index];
      if (path !== null) {
        return this.drawLinePath(path, this.colorFor(null, index, 'line'), index);
      }
    };

    Line.prototype._drawTrendLine = function(index) {
      var a, b, data, datapoints, i, k, len, path, ref, sum_x, sum_xx, sum_xy, sum_y, val, weight, x, y;
      sum_x = 0;
      sum_y = 0;
      sum_xx = 0;
      sum_xy = 0;
      datapoints = 0;
      ref = this.data;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        val = ref[i];
        x = val.x;
        y = val.y[index];
        if (y === void 0) {
          continue;
        }
        if (this.options.trendLineWeight === false) {
          weight = 1;
        } else {
          weight = this.options.data[i][this.options.trendLineWeight];
        }
        datapoints += weight;
        sum_x += x * weight;
        sum_y += y * weight;
        sum_xx += x * x * weight;
        sum_xy += x * y * weight;
      }
      a = (datapoints * sum_xy - sum_x * sum_y) / (datapoints * sum_xx - sum_x * sum_x);
      b = (sum_y / datapoints) - ((a * sum_x) / datapoints);
      data = [{}, {}];
      data[0].x = this.transX(this.data[0].x);
      data[0].y = this.transY(this.data[0].x * a + b);
      data[1].x = this.transX(this.data[this.data.length - 1].x);
      data[1].y = this.transY(this.data[this.data.length - 1].x * a + b);
      path = Morris.Line.createPath(data, false, this.bottom);
      return path = this.raphael.path(path).attr('stroke', this.colorFor(null, index, 'trendLine')).attr('stroke-width', this.options.trendLineWidth);
    };

    Line.createPath = function(coords, smooth, bottom) {
      var coord, g, grads, i, ix, k, len, lg, path, prevCoord, x1, x2, y1, y2;
      path = "";
      if (smooth) {
        grads = Morris.Line.gradients(coords);
      }
      prevCoord = {
        y: null
      };
      for (i = k = 0, len = coords.length; k < len; i = ++k) {
        coord = coords[i];
        if (coord.y != null) {
          if (prevCoord.y != null) {
            if (smooth) {
              g = grads[i];
              lg = grads[i - 1];
              ix = (coord.x - prevCoord.x) / 4;
              x1 = prevCoord.x + ix;
              y1 = Math.min(bottom, prevCoord.y + ix * lg);
              x2 = coord.x - ix;
              y2 = Math.min(bottom, coord.y - ix * g);
              path += "C" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + coord.x + "," + coord.y;
            } else {
              path += "L" + coord.x + "," + coord.y;
            }
          } else {
            if (!smooth || (grads[i] != null)) {
              path += "M" + coord.x + "," + coord.y;
            }
          }
        }
        prevCoord = coord;
      }
      return path;
    };

    Line.gradients = function(coords) {
      var coord, grad, i, k, len, nextCoord, prevCoord, results;
      grad = function(a, b) {
        return (a.y - b.y) / (a.x - b.x);
      };
      results = [];
      for (i = k = 0, len = coords.length; k < len; i = ++k) {
        coord = coords[i];
        if (coord.y != null) {
          nextCoord = coords[i + 1] || {
            y: null
          };
          prevCoord = coords[i - 1] || {
            y: null
          };
          if ((prevCoord.y != null) && (nextCoord.y != null)) {
            results.push(grad(prevCoord, nextCoord));
          } else if (prevCoord.y != null) {
            results.push(grad(prevCoord, coord));
          } else if (nextCoord.y != null) {
            results.push(grad(coord, nextCoord));
          } else {
            results.push(null);
          }
        } else {
          results.push(null);
        }
      }
      return results;
    };

    Line.prototype.hilight = function(index) {        
      var i, k, ref, ref1, u;
      if (this.prevHilight !== null && this.prevHilight !== index) {
        for (i = k = 0, ref = this.seriesPoints.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          if (this.hasToShow(i) && this.seriesPoints[i][this.prevHilight]) {
            this.seriesPoints[i][this.prevHilight].animate(this.pointShrinkSeries(i));
          }
        }
      }
      if (index !== null && this.prevHilight !== index) {
        for (i = u = 0, ref1 = this.seriesPoints.length - 1; 0 <= ref1 ? u <= ref1 : u >= ref1; i = 0 <= ref1 ? ++u : --u) {
          if (this.hasToShow(i) && this.seriesPoints[i][index]) {
            this.seriesPoints[i][index].animate(this.pointGrowSeries(i));
          }
        }
      }
      return this.prevHilight = index;
    };

    Line.prototype.colorFor = function(row, sidx, type) {
      if (typeof this.options.lineColors === 'function') {
        return this.options.lineColors.call(this, row, sidx, type);
      } else if (type === 'point') {
        return this.options.pointFillColors[sidx % this.options.pointFillColors.length] || this.options.lineColors[sidx % this.options.lineColors.length];
      } else if (type === 'trendLine') {
        return this.options.trendLineColors[sidx % this.options.trendLineColors.length];
      } else {
        return this.options.lineColors[sidx % this.options.lineColors.length];
      }
    };

    Line.prototype.drawLinePath = function(path, lineColor, lineIndex) {
      return this.raphael.path(path).attr('stroke', lineColor).attr('stroke-width', this.lineWidthForSeries(lineIndex));
    };

    Line.prototype.drawLinePoint = function(xPos, yPos, pointColor, lineIndex) {
      return this.raphael.circle(xPos, yPos, this.pointSizeForSeries(lineIndex)).attr('fill', pointColor).attr('stroke-width', this.pointStrokeWidthForSeries(lineIndex)).attr('stroke', this.pointStrokeColorForSeries(lineIndex));
    };

    Line.prototype.pointStrokeWidthForSeries = function(index) {
      return this.options.pointStrokeWidths[index % this.options.pointStrokeWidths.length];
    };

    Line.prototype.pointStrokeColorForSeries = function(index) {
      return this.options.pointStrokeColors[index % this.options.pointStrokeColors.length];
    };

    Line.prototype.lineWidthForSeries = function(index) {                
      if (this.options.lineWidth instanceof Array) {
        return this.options.lineWidth[index % this.options.lineWidth.length];
      } else {
        return this.options.lineWidth;
      }
    };

    Line.prototype.pointSizeForSeries = function(index) {
      if (this.options.pointSize instanceof Array) {
        return this.options.pointSize[index % this.options.pointSize.length];
      } else {
        return this.options.pointSize;
      }
    };

    Line.prototype.pointGrowSeries = function(index) {
      if (this.pointSizeForSeries(index) === 0) {
        return;
      }
      return Raphael.animation({
        r: this.pointSizeForSeries(index) + 3
      }, 25, 'linear');
    };

    Line.prototype.pointShrinkSeries = function(index) {
      return Raphael.animation({
        r: this.pointSizeForSeries(index)
      }, 25, 'linear');
    };

    return Line;

  })(Morris.Grid);

  Morris.labelSeries = function(dmin, dmax, pxwidth, specName, xLabelFormat) {      
    var d, d0, ddensity, k, len, name, ref, ret, s, spec, t;
    ddensity = 200 * (dmax - dmin) / pxwidth;
    d0 = new Date(dmin);
    spec = Morris.LABEL_SPECS[specName];
    if (spec === void 0) {
      ref = Morris.AUTO_LABEL_ORDER;
      for (k = 0, len = ref.length; k < len; k++) {
        name = ref[k];
        s = Morris.LABEL_SPECS[name];
        if (ddensity >= s.span) {
          spec = s;
          break;
        }
      }
    }
    if (spec === void 0) {
      spec = Morris.LABEL_SPECS["second"];
    }
    if (xLabelFormat) {
      spec = $.extend({}, spec, {
        fmt: xLabelFormat
      });
    }
    d = spec.start(d0);
    ret = [];
    while ((t = d.getTime()) <= dmax) {
      if (t >= dmin) {
        ret.push([spec.fmt(d), t]);
      }
      spec.incr(d);
    }
    return ret;
  };

  minutesSpecHelper = function(interval) {
    return {
      span: interval * 60 * 1000,
      start: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
      },
      fmt: function(d) {
        return (Morris.pad2(d.getHours())) + ":" + (Morris.pad2(d.getMinutes()));
      },
      incr: function(d) {
        return d.setUTCMinutes(d.getUTCMinutes() + interval);
      }
    };
  };

  secondsSpecHelper = function(interval) {
    return {
      span: interval * 1000,
      start: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      },
      fmt: function(d) {
        return (Morris.pad2(d.getHours())) + ":" + (Morris.pad2(d.getMinutes())) + ":" + (Morris.pad2(d.getSeconds()));
      },
      incr: function(d) {
        return d.setUTCSeconds(d.getUTCSeconds() + interval);
      }
    };
  };

  Morris.LABEL_SPECS = {
    "decade": {
      span: 172800000000,
      start: function(d) {
        return new Date(d.getFullYear() - d.getFullYear() % 10, 0, 1);
      },
      fmt: function(d) {
        return "" + (d.getFullYear());
      },
      incr: function(d) {
        return d.setFullYear(d.getFullYear() + 10);
      }
    },
    "year": {
      span: 17280000000,
      start: function(d) {
        return new Date(d.getFullYear(), 0, 1);
      },
      fmt: function(d) {
        return "" + (d.getFullYear());
      },
      incr: function(d) {
        return d.setFullYear(d.getFullYear() + 1);
      }
    },
    "month": {
      span: 2419200000,
      start: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
      },
      fmt: function(d) {
        return (d.getFullYear()) + "-" + (Morris.pad2(d.getMonth() + 1));
      },
      incr: function(d) {
        return d.setMonth(d.getMonth() + 1);
      }
    },
    "week": {
      span: 604800000,
      start: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
      fmt: function(d) {
        return (d.getFullYear()) + "-" + (Morris.pad2(d.getMonth() + 1)) + "-" + (Morris.pad2(d.getDate()));
      },
      incr: function(d) {
        return d.setDate(d.getDate() + 7);
      }
    },
    "day": {
      span: 86400000,
      start: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      },
      fmt: function(d) {
        return (d.getFullYear()) + "-" + (Morris.pad2(d.getMonth() + 1)) + "-" + (Morris.pad2(d.getDate()));
      },
      incr: function(d) {
        return d.setDate(d.getDate() + 1);
      }
    },
    "hour": minutesSpecHelper(60),
    "30min": minutesSpecHelper(30),
    "15min": minutesSpecHelper(15),
    "10min": minutesSpecHelper(10),
    "5min": minutesSpecHelper(5),
    "minute": minutesSpecHelper(1),
    "30sec": secondsSpecHelper(30),
    "15sec": secondsSpecHelper(15),
    "10sec": secondsSpecHelper(10),
    "5sec": secondsSpecHelper(5),
    "second": secondsSpecHelper(1)
  };

  Morris.AUTO_LABEL_ORDER = ["decade", "year", "month", "week", "day", "hour", "30min", "15min", "10min", "5min", "minute", "30sec", "15sec", "10sec", "5sec", "second"];

  Morris.Area = (function(superClass) {
    var areaDefaults;

    extend(Area, superClass);

    areaDefaults = {
      fillOpacity: 'auto',
      behaveLikeLine: false
    };

    function Area(options) {
      var areaOptions;
      if (!(this instanceof Morris.Area)) {
        return new Morris.Area(options);
      }
      areaOptions = $.extend({}, areaDefaults, options);
      this.cumulative = !areaOptions.behaveLikeLine;
      if (areaOptions.fillOpacity === 'auto') {
        areaOptions.fillOpacity = areaOptions.behaveLikeLine ? .8 : 1;
      }
      Area.__super__.constructor.call(this, areaOptions);
    }

    Area.prototype.calcPoints = function() {
      var k, len, ref, results, row, total, y;
      ref = this.data;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        row = ref[k];
        row._x = this.transX(row.x);
        total = 0;
        row._y = (function() {
          var len1, ref1, results1, u;
          ref1 = row.y;
          results1 = [];
          for (u = 0, len1 = ref1.length; u < len1; u++) {
            y = ref1[u];
            if (this.options.behaveLikeLine) {
              results1.push(this.transY(y));
            } else {
              total += y || 0;
              results1.push(this.transY(total));
            }
          }
          return results1;
        }).call(this);
        results.push(row._ymax = Math.max.apply(Math, row._y));
      }
      return results;
    };

    Area.prototype.drawSeries = function() {
      var i, k, len, range, ref, ref1, results, results1, results2, u, v;
      this.seriesPoints = [];
      if (this.options.behaveLikeLine) {
        range = (function() {
          results = [];
          for (var k = 0, ref = this.options.ykeys.length - 1; 0 <= ref ? k <= ref : k >= ref; 0 <= ref ? k++ : k--){ results.push(k); }
          return results;
        }).apply(this);
      } else {
        range = (function() {
          results1 = [];
          for (var u = ref1 = this.options.ykeys.length - 1; ref1 <= 0 ? u <= 0 : u >= 0; ref1 <= 0 ? u++ : u--){ results1.push(u); }
          return results1;
        }).apply(this);
      }
      results2 = [];
      for (v = 0, len = range.length; v < len; v++) {
        i = range[v];
        this._drawFillFor(i);
        this._drawLineFor(i);
        results2.push(this._drawPointFor(i));
      }
      return results2;
    };

    Area.prototype._drawFillFor = function(index) {
      var path;
      path = this.paths[index];
      if (path !== null) {
        path = path + ("L" + (this.transX(this.xmax)) + "," + this.bottom + "L" + (this.transX(this.xmin)) + "," + this.bottom + "Z");
        return this.drawFilledPath(path, this.fillForSeries(index));
      }
    };

    Area.prototype.fillForSeries = function(i) {
      var color;
      color = Raphael.rgb2hsl(this.colorFor(this.data[i], i, 'line'));
      return Raphael.hsl(color.h, this.options.behaveLikeLine ? color.s * 0.9 : color.s * 0.75, Math.min(0.98, this.options.behaveLikeLine ? color.l * 1.2 : color.l * 1.25));
    };

    Area.prototype.drawFilledPath = function(path, fill) {
      return this.raphael.path(path).attr('fill', fill).attr('fill-opacity', this.options.fillOpacity).attr('stroke', 'none');
    };

    return Area;

  })(Morris.Line);

  Morris.Bar = (function(superClass) {
    extend(Bar, superClass);

    function Bar(options) {
      this.onHoverOut = bind(this.onHoverOut, this);
      this.onHoverMove = bind(this.onHoverMove, this);
      this.onGridClick = bind(this.onGridClick, this);
      if (!(this instanceof Morris.Bar)) {
        return new Morris.Bar(options);
      }
      Bar.__super__.constructor.call(this, $.extend({}, options, {
        parseTime: false
      }));
    }

    Bar.prototype.init = function() {
      this.cumulative = this.options.stacked;
      if (this.options.hideHover !== 'always') {
        this.hover = new Morris.Hover({
          parent: this.el
        });
        this.on('hovermove', this.onHoverMove);
        this.on('hoverout', this.onHoverOut);
        return this.on('gridclick', this.onGridClick);
      }
    };

    Bar.prototype.defaults = {
      barSizeRatio: 0.75,
      barGap: 3,
      barColors: ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
      barOpacity: 1.0,
      barHighlightOpacity: 1.0,
      highlightSpeed: 150,
      barRadius: [0, 0, 0, 0],
      xLabelMargin: 50,
      horizontal: false,
      shown: true,
      inBarValue: false,
      inBarValueTextColor: 'white',
      inBarValueMinTopMargin: 1,
      inBarValueRightMargin: 4
    };

    Bar.prototype.calc = function() {
      var ref;
      this.calcBars();
      if (this.options.hideHover === false) {
        return (ref = this.hover).update.apply(ref, this.hoverContentForRow(this.data.length - 1));
      }
    };

    Bar.prototype.calcBars = function() {
      var idx, k, len, ref, results, row, y;
      ref = this.data;
      results = [];
      for (idx = k = 0, len = ref.length; k < len; idx = ++k) {
        row = ref[idx];
        row._x = this.xStart + this.xSize * (idx + 0.5) / this.data.length;
        results.push(row._y = (function() {
          var len1, ref1, results1, u;
          ref1 = row.y;
          results1 = [];
          for (u = 0, len1 = ref1.length; u < len1; u++) {
            y = ref1[u];
            if (y != null) {
              results1.push(this.transY(y));
            } else {
              results1.push(null);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Bar.prototype.draw = function() {
      var ref;
      if ((ref = this.options.axes) === true || ref === 'both' || ref === 'x') {
        this.drawXAxis();
      }
      return this.drawSeries();
    };

    Bar.prototype.drawXAxis = function() {
      var angle, basePos, i, k, label, labelBox, margin, maxSize, offset, prevAngleMargin, prevLabelMargin, ref, results, row, size, startPos, textBox;
      if (!this.options.horizontal) {
        basePos = this.getXAxisLabelY();
      } else {
        basePos = this.getYAxisLabelX();
      }
      prevLabelMargin = null;
      prevAngleMargin = null;
      results = [];
      for (i = k = 0, ref = this.data.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        row = this.data[this.data.length - 1 - i];
        if (!this.options.horizontal) {
          label = this.drawXAxisLabel(row._x, basePos, row.label);
        } else {
          label = this.drawYAxisLabel(basePos, row._x - 0.5 * this.options.gridTextSize, row.label);
        }
        if (!this.options.horizontal) {
          angle = this.options.xLabelAngle;
        } else {
          angle = 0;
        }
        textBox = label.getBBox();
        label.transform("r" + (-angle));
        labelBox = label.getBBox();
        label.transform("t0," + (labelBox.height / 2) + "...");
        if (angle !== 0) {
          offset = -0.5 * textBox.width * Math.cos(angle * Math.PI / 180.0);
          label.transform("t" + offset + ",0...");
        }
        if (!this.options.horizontal) {
          startPos = labelBox.x;
          size = labelBox.width;
          maxSize = this.el.width();
        } else {
          startPos = labelBox.y;
          size = labelBox.height;
          maxSize = this.el.height();
        }
        if (((prevLabelMargin == null) || prevLabelMargin >= startPos + size || (prevAngleMargin != null) && prevAngleMargin >= startPos) && startPos >= 0 && (startPos + size) < maxSize) {
          if (angle !== 0) {
            margin = 1.25 * this.options.gridTextSize / Math.sin(angle * Math.PI / 180.0);
            prevAngleMargin = startPos - margin;
          }
          if (!this.options.horizontal) {
            results.push(prevLabelMargin = startPos - this.options.xLabelMargin);
          } else {
            results.push(prevLabelMargin = startPos);
          }
        } else {
          results.push(label.remove());
        }
      }
      return results;
    };

    Bar.prototype.getXAxisLabelY = function() {
      return this.bottom + (this.options.xAxisLabelTopPadding || this.options.padding / 2);
    };

    Bar.prototype.drawSeries = function() {
      var barMiddle, barWidth, bottom, groupWidth, i, idx, k, lastTop, left, leftPadding, numBars, ref, row, sidx, size, spaceLeft, top, ypos, zeroPos;
      this.seriesBars = [];
      groupWidth = this.xSize / this.options.data.length;
      if (this.options.stacked) {
        numBars = 1;
      } else {
        numBars = 0;
        for (i = k = 0, ref = this.options.ykeys.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          if (this.hasToShow(i)) {
            numBars += 1;
          }
        }
      }
      barWidth = (groupWidth * this.options.barSizeRatio - this.options.barGap * (numBars - 1)) / numBars;
      if (this.options.barSize) {
        barWidth = Math.min(barWidth, this.options.barSize);
      }
      spaceLeft = groupWidth - barWidth * numBars - this.options.barGap * (numBars - 1);
      leftPadding = spaceLeft / 2;
      zeroPos = this.ymin <= 0 && this.ymax >= 0 ? this.transY(0) : null;
      this.bars = (function() {
        var len, ref1, results, u;
        ref1 = this.data;
        results = [];
        for (idx = u = 0, len = ref1.length; u < len; idx = ++u) {
          row = ref1[idx];
          this.seriesBars[idx] = [];
          lastTop = 0;
          results.push((function() {
            var len1, ref2, results1, v;
            ref2 = row._y;
            results1 = [];
            for (sidx = v = 0, len1 = ref2.length; v < len1; sidx = ++v) {
              ypos = ref2[sidx];
              if (!this.hasToShow(sidx)) {
                continue;
              }
              if (ypos !== null) {
                if (zeroPos) {
                  top = Math.min(ypos, zeroPos);
                  bottom = Math.max(ypos, zeroPos);
                } else {
                  top = ypos;
                  bottom = this.bottom;
                }
                left = this.xStart + idx * groupWidth + leftPadding;
                if (!this.options.stacked) {
                  left += sidx * (barWidth + this.options.barGap);
                }
                size = bottom - top;
                if (this.options.verticalGridCondition && this.options.verticalGridCondition(row.x)) {
                  if (!this.options.horizontal) {
                    this.drawBar(this.xStart + idx * groupWidth, this.yEnd, groupWidth, this.ySize, this.options.verticalGridColor, this.options.verticalGridOpacity, this.options.barRadius);
                  } else {
                    this.drawBar(this.yStart, this.xStart + idx * groupWidth, this.ySize, groupWidth, this.options.verticalGridColor, this.options.verticalGridOpacity, this.options.barRadius);
                  }
                }
                if (this.options.stacked) {
                  top -= lastTop;
                }
                if (!this.options.horizontal) {
                  lastTop += size;
                  results1.push(this.seriesBars[idx][sidx] = this.drawBar(left, top, barWidth, size, this.colorFor(row, sidx, 'bar'), this.options.barOpacity, this.options.barRadius));
                } else {
                  lastTop -= size;
                  this.seriesBars[idx][sidx] = this.drawBar(top, left, size, barWidth, this.colorFor(row, sidx, 'bar'), this.options.barOpacity, this.options.barRadius);
                  if (this.options.inBarValue && barWidth > this.options.gridTextSize + 2 * this.options.inBarValueMinTopMargin) {
                    barMiddle = left + 0.5 * barWidth;
                    results1.push(this.raphael.text(bottom - this.options.inBarValueRightMargin, barMiddle, this.yLabelFormat(row.y[sidx], sidx)).attr('font-size', this.options.gridTextSize).attr('font-family', this.options.gridTextFamily).attr('font-weight', this.options.gridTextWeight).attr('fill', this.options.inBarValueTextColor).attr('text-anchor', 'end'));
                  } else {
                    results1.push(void 0);
                  }
                }
              } else {
                results1.push(null);
              }
            }
            return results1;
          }).call(this));
        }
        return results;
      }).call(this);
      this.flat_bars = $.map(this.bars, function(n) {
        return n;
      });
      this.flat_bars = $.grep(this.flat_bars, function(n) {
        return n != null;
      });
      return this.bar_els = $($.map(this.flat_bars, function(n) {
        return n[0];
      }));
    };

    Bar.prototype.hilight = function(index) {
      var i, k, len, len1, ref, ref1, u, y;
      if (this.seriesBars && this.seriesBars[this.prevHilight] && this.prevHilight !== null && this.prevHilight !== index) {
        ref = this.seriesBars[this.prevHilight];
        for (i = k = 0, len = ref.length; k < len; i = ++k) {
          y = ref[i];
          if (y) {
            y.animate({
              'fill-opacity': this.options.barOpacity
            }, this.options.highlightSpeed);
          }
        }
      }
      if (this.seriesBars && this.seriesBars[index] && index !== null && this.prevHilight !== index) {
        ref1 = this.seriesBars[index];
        for (i = u = 0, len1 = ref1.length; u < len1; i = ++u) {
          y = ref1[i];
          if (y) {
            y.animate({
              'fill-opacity': this.options.barHighlightOpacity
            }, this.options.highlightSpeed);
          }
        }
      }
      return this.prevHilight = index;
    };

    Bar.prototype.colorFor = function(row, sidx, type) {
      var r, s;
      if (typeof this.options.barColors === 'function') {
        r = {
          x: row.x,
          y: row.y[sidx],
          label: row.label,
          src: row.src
        };
        s = {
          index: sidx,
          key: this.options.ykeys[sidx],
          label: this.options.labels[sidx]
        };
        return this.options.barColors.call(this, r, s, type);
      } else {
        return this.options.barColors[sidx % this.options.barColors.length];
      }
    };

    Bar.prototype.hitTest = function(x, y) {
      var pos;
      if (this.data.length === 0) {
        return null;
      }
      if (!this.options.horizontal) {
        pos = x;
      } else {
        pos = y;
      }
      pos = Math.max(Math.min(pos, this.xEnd), this.xStart);
      return Math.min(this.data.length - 1, Math.floor((pos - this.xStart) / (this.xSize / this.data.length)));
    };

    Bar.prototype.onGridClick = function(x, y) {
      var bar_hit, index;
      index = this.hitTest(x, y);
      bar_hit = !!this.bar_els.filter(function() {
        return $(this).is(':hover');
      }).length;
      return this.fire('click', index, this.data[index].src, x, y, bar_hit);
    };

    Bar.prototype.onHoverMove = function(x, y) {
      var index, ref;
      index = this.hitTest(x, y);
      this.hilight(index);
      if (index != null) {
        return (ref = this.hover).update.apply(ref, this.hoverContentForRow(index));
      } else {
        return this.hover.hide();
      }
    };

    Bar.prototype.onHoverOut = function() {
      this.hilight(-1);
      if (this.options.hideHover !== false) {
        return this.hover.hide();
      }
    };

    Bar.prototype.hoverContentForRow = function(index) {
      var content, j, k, len, ref, row, x, y;
      row = this.data[index];
      content = $("<div class='morris-hover-row-label'>").text(row.label);
      content = content.prop('outerHTML');
      ref = row.y;
      for (j = k = 0, len = ref.length; k < len; j = ++k) {
        y = ref[j];
        if (this.options.labels[j] === false) {
          continue;
        }
        content += "<div class='morris-hover-point' style='color: " + (this.colorFor(row, j, 'label')) + "'>\n  " + this.options.labels[j] + ":\n  " + (this.yLabelFormat(y, j)) + "\n</div>";
      }
      if (typeof this.options.hoverCallback === 'function') {
        content = this.options.hoverCallback(index, this.options, content, row.src);
      }
      if (!this.options.horizontal) {
        x = this.left + (index + 0.5) * this.width / this.data.length;
        return [content, x];
      } else {
        x = this.left + 0.5 * this.width;
        y = this.top + (index + 0.5) * this.height / this.data.length;
        return [content, x, y, true];
      }
    };

    Bar.prototype.drawBar = function(xPos, yPos, width, height, barColor, opacity, radiusArray) {
      var maxRadius, path;
      maxRadius = Math.max.apply(Math, radiusArray);
      if (maxRadius === 0 || maxRadius > height) {
        path = this.raphael.rect(xPos, yPos, width, height);
      } else {
        path = this.raphael.path(this.roundedRect(xPos, yPos, width, height, radiusArray));
      }
      return path.attr('fill', barColor).attr('fill-opacity', opacity).attr('stroke', 'none');
    };

    Bar.prototype.roundedRect = function(x, y, w, h, r) {
      if (r == null) {
        r = [0, 0, 0, 0];
      }
      return ["M", x, r[0] + y, "Q", x, y, x + r[0], y, "L", x + w - r[1], y, "Q", x + w, y, x + w, y + r[1], "L", x + w, y + h - r[2], "Q", x + w, y + h, x + w - r[2], y + h, "L", x + r[3], y + h, "Q", x, y + h, x, y + h - r[3], "Z"];
    };

    return Bar;

  })(Morris.Grid);

  Morris.Donut = (function(superClass) {
    extend(Donut, superClass);

    Donut.prototype.defaults = {
      colors: ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135'],
      backgroundColor: '#FFFFFF',
      labelColor: '#000000',
      formatter: Morris.commas,
      resize: false
    };

    function Donut(options) {
      this.resizeHandler = bind(this.resizeHandler, this);
      this.select = bind(this.select, this);
      this.click = bind(this.click, this);
      if (!(this instanceof Morris.Donut)) {
        return new Morris.Donut(options);
      }
      this.options = $.extend({}, this.defaults, options);
      if (typeof options.element === 'string') {
        this.el = $(document.getElementById(options.element));
      } else {
        this.el = $(options.element);
      }
      if (this.el === null || this.el.length === 0) {
        throw new Error("Graph placeholder not found.");
      }
      if (options.data === void 0 || options.data.length === 0) {
        return;
      }
      this.raphael = new Raphael(this.el[0]);
      if (this.options.resize) {
        $(window).bind('resize', (function(_this) {
          return function(evt) {
            if (_this.timeoutId != null) {
              window.clearTimeout(_this.timeoutId);
            }
            return _this.timeoutId = window.setTimeout(_this.resizeHandler, 100);
          };
        })(this));
      }
      this.setData(options.data);
    }

    Donut.prototype.redraw = function() {
      var C, cx, cy, i, idx, k, last, len, len1, len2, max_value, min, next, ref, ref1, ref2, results, seg, total, u, v, value, w;
      this.raphael.clear();
      cx = this.el.width() / 2;
      cy = this.el.height() / 2;
      w = (Math.min(cx, cy) - 10) / 3;
      total = 0;
      ref = this.values;
      for (k = 0, len = ref.length; k < len; k++) {
        value = ref[k];
        total += value;
      }
      min = 5 / (2 * w);
      C = 1.9999 * Math.PI - min * this.data.length;
      last = 0;
      idx = 0;
      this.segments = [];
      ref1 = this.values;
      for (i = u = 0, len1 = ref1.length; u < len1; i = ++u) {
        value = ref1[i];
        next = last + min + C * (value / total);
        seg = new Morris.DonutSegment(cx, cy, w * 2, w, last, next, this.data[i].color || this.options.colors[idx % this.options.colors.length], this.options.backgroundColor, idx, this.raphael);
        seg.render();
        this.segments.push(seg);
        seg.on('hover', this.select);
        seg.on('click', this.click);
        last = next;
        idx += 1;
      }
      this.text1 = this.drawEmptyDonutLabel(cx, cy - 10, this.options.labelColor, 15, 800);
      this.text2 = this.drawEmptyDonutLabel(cx, cy + 10, this.options.labelColor, 14);
      max_value = Math.max.apply(Math, this.values);
      idx = 0;
      ref2 = this.values;
      results = [];
      for (v = 0, len2 = ref2.length; v < len2; v++) {
        value = ref2[v];
        if (value === max_value) {
          this.select(idx);
          break;
        }
        results.push(idx += 1);
      }
      return results;
    };

    Donut.prototype.setData = function(data) {
      var row;
      this.data = data;
      this.values = (function() {
        var k, len, ref, results;
        ref = this.data;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          row = ref[k];
          results.push(parseFloat(row.value));
        }
        return results;
      }).call(this);
      return this.redraw();
    };

    Donut.prototype.click = function(idx) {
      return this.fire('click', idx, this.data[idx]);
    };

    Donut.prototype.select = function(idx) {
      var k, len, ref, row, s, segment;
      ref = this.segments;
      for (k = 0, len = ref.length; k < len; k++) {
        s = ref[k];
        s.deselect();
      }
      segment = this.segments[idx];
      segment.select();
      row = this.data[idx];
      return this.setLabels(row.label, this.options.formatter(row.value, row));
    };

    Donut.prototype.setLabels = function(label1, label2) {
      var inner, maxHeightBottom, maxHeightTop, maxWidth, text1bbox, text1scale, text2bbox, text2scale;
      inner = (Math.min(this.el.width() / 2, this.el.height() / 2) - 10) * 2 / 3;
      maxWidth = 1.8 * inner;
      maxHeightTop = inner / 2;
      maxHeightBottom = inner / 3;
      this.text1.attr({
        text: label1,
        transform: ''
      });
      text1bbox = this.text1.getBBox();
      text1scale = Math.min(maxWidth / text1bbox.width, maxHeightTop / text1bbox.height);
      this.text1.attr({
        transform: "S" + text1scale + "," + text1scale + "," + (text1bbox.x + text1bbox.width / 2) + "," + (text1bbox.y + text1bbox.height)
      });
      this.text2.attr({
        text: label2,
        transform: ''
      });
      text2bbox = this.text2.getBBox();
      text2scale = Math.min(maxWidth / text2bbox.width, maxHeightBottom / text2bbox.height);
      return this.text2.attr({
        transform: "S" + text2scale + "," + text2scale + "," + (text2bbox.x + text2bbox.width / 2) + "," + text2bbox.y
      });
    };

    Donut.prototype.drawEmptyDonutLabel = function(xPos, yPos, color, fontSize, fontWeight) {
      var text;
      text = this.raphael.text(xPos, yPos, '').attr('font-size', fontSize).attr('fill', color);
      if (fontWeight != null) {
        text.attr('font-weight', fontWeight);
      }
      return text;
    };

    Donut.prototype.resizeHandler = function() {
      this.timeoutId = null;
      this.raphael.setSize(this.el.width(), this.el.height());
      return this.redraw();
    };

    return Donut;

  })(Morris.EventEmitter);

  Morris.DonutSegment = (function(superClass) {
    extend(DonutSegment, superClass);

    function DonutSegment(cx1, cy1, inner1, outer, p0, p1, color1, backgroundColor, index1, raphael) {
      this.cx = cx1;
      this.cy = cy1;
      this.inner = inner1;
      this.outer = outer;
      this.color = color1;
      this.backgroundColor = backgroundColor;
      this.index = index1;
      this.raphael = raphael;
      this.deselect = bind(this.deselect, this);
      this.select = bind(this.select, this);
      this.sin_p0 = Math.sin(p0);
      this.cos_p0 = Math.cos(p0);
      this.sin_p1 = Math.sin(p1);
      this.cos_p1 = Math.cos(p1);
      this.is_long = (p1 - p0) > Math.PI ? 1 : 0;
      this.path = this.calcSegment(this.inner + 3, this.inner + this.outer - 5);
      this.selectedPath = this.calcSegment(this.inner + 3, this.inner + this.outer);
      this.hilight = this.calcArc(this.inner);
    }

    DonutSegment.prototype.calcArcPoints = function(r) {
      return [this.cx + r * this.sin_p0, this.cy + r * this.cos_p0, this.cx + r * this.sin_p1, this.cy + r * this.cos_p1];
    };

    DonutSegment.prototype.calcSegment = function(r1, r2) {
      var ix0, ix1, iy0, iy1, ox0, ox1, oy0, oy1, ref, ref1;
      ref = this.calcArcPoints(r1), ix0 = ref[0], iy0 = ref[1], ix1 = ref[2], iy1 = ref[3];
      ref1 = this.calcArcPoints(r2), ox0 = ref1[0], oy0 = ref1[1], ox1 = ref1[2], oy1 = ref1[3];
      return ("M" + ix0 + "," + iy0) + ("A" + r1 + "," + r1 + ",0," + this.is_long + ",0," + ix1 + "," + iy1) + ("L" + ox1 + "," + oy1) + ("A" + r2 + "," + r2 + ",0," + this.is_long + ",1," + ox0 + "," + oy0) + "Z";
    };

    DonutSegment.prototype.calcArc = function(r) {
      var ix0, ix1, iy0, iy1, ref;
      ref = this.calcArcPoints(r), ix0 = ref[0], iy0 = ref[1], ix1 = ref[2], iy1 = ref[3];
      return ("M" + ix0 + "," + iy0) + ("A" + r + "," + r + ",0," + this.is_long + ",0," + ix1 + "," + iy1);
    };

    DonutSegment.prototype.render = function() {
      this.arc = this.drawDonutArc(this.hilight, this.color);
      return this.seg = this.drawDonutSegment(this.path, this.color, this.backgroundColor, (function(_this) {
        return function() {
          return _this.fire('hover', _this.index);
        };
      })(this), (function(_this) {
        return function() {
          return _this.fire('click', _this.index);
        };
      })(this));
    };

    DonutSegment.prototype.drawDonutArc = function(path, color) {
      return this.raphael.path(path).attr({
        stroke: color,
        'stroke-width': 2,
        opacity: 0
      });
    };

    DonutSegment.prototype.drawDonutSegment = function(path, fillColor, strokeColor, hoverFunction, clickFunction) {
      return this.raphael.path(path).attr({
        fill: fillColor,
        stroke: strokeColor,
        'stroke-width': 3
      }).hover(hoverFunction).click(clickFunction);
    };

    DonutSegment.prototype.select = function() {
      if (!this.selected) {
        this.seg.animate({
          path: this.selectedPath
        }, 150, '<>');
        this.arc.animate({
          opacity: 1
        }, 150, '<>');
        return this.selected = true;
      }
    };

    DonutSegment.prototype.deselect = function() {
      if (this.selected) {
        this.seg.animate({
          path: this.path
        }, 150, '<>');
        this.arc.animate({
          opacity: 0
        }, 150, '<>');
        return this.selected = false;
      }
    };

    return DonutSegment;

  })(Morris.EventEmitter);

}).call(this);
