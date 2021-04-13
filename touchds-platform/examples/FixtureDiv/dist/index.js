(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={"name":"@itouchtv-data-components/fixture-div","version":"0.1.1-2","nameComponent":"空白div（例子）","isDataPageComponent":true}
},{}],2:[function(require,module,exports){
/* Created by tommyZZM.OSX on 2019/12/23. */
"use strict";

var _package = require("../package.json");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function onDefineComponent() {
  window.itouchtvDataPageDefineComponent(_package.name, {
    version: _package.version
  }, function (_ref) {
    var React = _ref.React,
        width = _ref.width,
        height = _ref.height,
        listenResize = _ref.listenResize;
    return (
      /*#__PURE__*/
      function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
          var _this;

          _classCallCheck(this, _class);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
          _this.state = {
            sizeWidth: width,
            sizeHeight: height
          };
          return _this;
        }

        _createClass(_class, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this2 = this;

            listenResize(function (rect) {
              _this2.setState({
                sizeWidth: rect.width,
                sizeHeight: rect.height
              });
            });
          }
        }, {
          key: "render",
          value: function render() {
            var _this$state = this.state,
                sizeWidth = _this$state.sizeWidth,
                sizeHeight = _this$state.sizeHeight;
            return React.createElement("div", {
              style: {
                color: '#fff',
                fontSize: 20
              }
            }, "<div/> from Verdaccio " + "".concat(sizeWidth.toFixed(0), " x ").concat(sizeHeight.toFixed(0)));
          }
        }]);

        return _class;
      }(React.Component)
    );
  });
}

if (typeof window.itouchtvDataPageDefineComponent === 'function') {
  onDefineComponent();
} else {
  window.addEventListener('itouchtv-data-page-ready', function (_) {
    return onDefineComponent();
  });
}

},{"../package.json":1}]},{},[2]);
