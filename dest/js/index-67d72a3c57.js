/**
 * Created by tengfeisu on 2016/2/3.
 */
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var arr = [4, 3, 1, 6, 2, 4, 2, 66, 12, 43, 12];
[].concat(_toConsumableArray(new Set(arr)));