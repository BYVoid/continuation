"use strict";
    
var SortingAnimations = function (canvas) {
  
  var ctx = canvas.getContext ? canvas.getContext("2d") : null;
      
  var lineWidth = 9;
  var updateCost = 50;
  var compareCost = 30;
      
  var randomArray = function () {
    var array = [];
    var length = Math.floor(canvas.width / (lineWidth + 1));
        
    for (var i = 1; i <= length; i++) {
      array.push(i);
    }

    array.sort(function() { return (Math.round(Math.random()) - 0.5); });
    return array;
  }
      
  var paint = function (array, updating) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = lineWidth;

    for (var i = 0; i < array.length; i++)
    {
      var x = (lineWidth + 1) * i + lineWidth / 2;
      var height = array[i] * (lineWidth + 1) * canvas.height / canvas.width;
          
      ctx.beginPath();
          
      if (updating && updating.indexOf(i) >= 0) {
        ctx.strokeStyle = "red";
      } else {
        ctx.strokeStyle = "black";
      }
          
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x, canvas.height - height);
        
      ctx.stroke();
    }
  }
      
  var compareAsync = function (x, y, callback) {
    setTimeout(cont(), compareCost);
    callback(x - y);
  };

  var swapAsync = function (array, i, j, callback) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;

    paint(array, [i, j]);
    setTimeout(cont(), updateCost);
    callback();
  };
      
  var assignAsync = function (array, i, value, updating, callback) {
    array[i] = value;
    paint(array, updating);
    setTimeout(cont(), updateCost);
    callback();
  };
      
  var sortOperations = {
      
    Bubble: function (array, callback) {
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length - i - 1; j++) {
          compareAsync(array[j], array[j + 1], cont(r));
          if (r > 0) swapAsync(array, j, j + 1, cont());
        }
      }
      callback();
    },
        
    Quick: function (array, callback) {
      
      var partitionAsync = function (begin, end, callback) {
        var i = begin;
        var j = end;
        var pivot = array[Math.floor((begin + end) / 2)];

        while (i <= j) {
          while (true) {
            compareAsync(array[i], pivot, cont(r));
            if (r < 0) { i++; } else { break; }
          }

          while (true) {
            compareAsync(array[j], pivot, cont(r));
            if (r > 0) { j--; } else { break; }
          }

          if (i <= j) {
            swapAsync(array, i, j, cont());
            i++;
            j--;
          }
        }
            
        callback(i);
      };
          
      var sortAsync = function (begin, end, callback) {
        partitionAsync(begin, end, cont(index));

        if (begin < index - 1) 
          sortAsync(begin, index - 1, cont());

        if (index < end) 
          sortAsync(index, end, cont());
        callback();
      };
        
      sortAsync(0, array.length - 1, cont());
      callback();
    },
        
    Selection: function (array, callback) {
      for(var j = 0; j < array.length - 1; j++) {
        var mi = j;
        for (var i = j + 1; i < array.length; i++) {
          compareAsync(array[i], array[mi], cont(r));
          if (r < 0) { mi = i; }
        }

        swapAsync(array, mi, j, cont());
      }
      callback();
    },
        
    Shell: function (array, callback) {
      var gaps = [701, 301, 132, 57, 23, 10, 4, 1];
 
      for (var gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (var i = gap; i < array.length; i++) {
          var temp = array[i];
              
          var j;
          for (j = i; j >= gap; j -= gap) {
            compareAsync(temp, array[j - gap], cont(r));
            
            if (r < 0) {
              assignAsync(array, j, array[j - gap], null, cont());
            } else {
              break;
            }
          }
              
          assignAsync(array, j, temp, [j], cont());
        }
      }
      callback();
    }
  };

  this.supported = !!ctx;
  this.randomArray = randomArray;
  this.paint = paint;
      
  this.names = [];
  
  var self = this;
  Object.keys(sortOperations).forEach(function (m) {
    self.names.push(m);
  });
      
  this.sortAsync = function (name, array, callback) {
    paint(array);
    sortOperations[name](array, cont());
    paint(array);
    callback();
  };
};