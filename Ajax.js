define(["exports", "@kinkajou/tools/Tools"], function (_exports, _Tools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Ajax = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  var Ajax =
  /*#__PURE__*/
  function () {
    _createClass(Ajax, [{
      key: "status",
      get: function get() {
        return this.xhr.status;
      }
    }, {
      key: "succeeded",
      get: function get() {
        if (this.errored || this.aborted || this.timedOut) {
          return false;
        }

        var status = this.status || 0; // Note: if we are using the file:// protocol, the status code will be 0
        // for all outcomes (successful or otherwise).

        return status === 0 || status >= 200 && status < 300;
      }
    }, {
      key: "response",
      get: function get() {
        return this.xhr.response;
      }
    }, {
      key: "xmlResponse",
      get: function get() {
        return this.xhr.responseXML;
      }
    }, {
      key: "textResponse",
      get: function get() {
        return this.xhr.responseText;
      }
    }]);

    function Ajax(method, url, extXhr) {
      var _this = this;

      _classCallCheck(this, Ajax);

      var props = {};
      var xhr = extXhr || new XMLHttpRequest();
      Object.defineProperty(this, 'xhr', {
        value: xhr,
        enumerable: true
      });
      Object.defineProperty(this, 'method', {
        value: METHODS[_Tools.Tools.toString(method, METHODS.GET)] || METHODS.GET,
        enumerable: true
      });
      Object.defineProperty(this, 'url', {
        value: _Tools.Tools.toString(url),
        enumerable: true
      });
      Object.defineProperty(this, 'queryParams', {
        get: function get() {
          return _Tools.Tools.getAsObject('queryParams', props, {});
        },
        enumerable: true
      });

      this.setQueryParams = function (params) {
        _Tools.Tools.assertIsObject(params, 'queryParams');

        _Tools.Tools.set('queryParams', params, props);

        return _this;
      };

      Object.defineProperty(this, 'noCache', {
        get: function get() {
          return _Tools.Tools.getAsBoolean('noCache', props);
        },
        enumerable: true
      });

      this.setNoCache = function (onOff) {
        _Tools.Tools.set('noCache', onOff === true, props);

        return _this;
      };

      Object.defineProperty(this, 'id', {
        get: function get() {
          return _Tools.Tools.getAsString('id', props);
        },
        enumerable: true
      });

      this.setId = function (id) {
        _Tools.Tools.assertIsString(id, 'id');

        _Tools.Tools.set('id', id, props);

        return _this;
      };

      Object.defineProperty(this, 'headers', {
        get: function get() {
          return _Tools.Tools.getAsObject('headers', props, {});
        },
        enumerable: true
      });

      this.setHeader = function (key, value) {
        _Tools.Tools.assertIsString(key, 'key');

        _Tools.Tools.assertIsString(value, 'value');

        _Tools.Tools.set(['headers', key], value, props);

        return _this;
      };

      Object.defineProperty(this, 'body', {
        get: function get() {
          return props.body;
        },
        enumerable: true
      });

      this.setBody = function (body) {
        _Tools.Tools.assert(_Tools.Tools.isString(body) || body instanceof Document || body instanceof Blob || body instanceof BufferSource || body instanceof FormData || body instanceof URLSearchParams || body instanceof ReadableStream, 'body can be a String, Document, Blob, BufferSource, FormData, URLSearchParams, ReadableStream');

        props.body = body;
        return _this;
      };

      Object.defineProperty(this, 'jsonBody', {
        get: function get() {
          return _Tools.Tools.getAsObject('jsonBody', props);
        },
        enumerable: true
      });

      this.setJsonBody = function (jsonBody) {
        _Tools.Tools.assertIsObject(jsonBody, 'jsonBody');

        props.jsonBody = jsonBody;
        return _this;
      };

      Object.defineProperty(this, 'formBody', {
        get: function get() {
          return _Tools.Tools.getAsObject('formBody', props);
        },
        enumerable: true
      });

      this.setFormBody = function (formBody) {
        _Tools.Tools.assertIsObject(formBody, 'formBody');

        props.formBody = formBody;
        return _this;
      };

      Object.defineProperty(this, 'onSuccess', {
        get: function get() {
          return props.onSuccess;
        },
        enumerable: true
      });

      this.setOnSuccess = function (callback) {
        _Tools.Tools.assertIsFunction(callback, 'callback');

        props.onSuccess = callback;
        return _this;
      };

      Object.defineProperty(this, 'onError', {
        get: function get() {
          return props.onError;
        },
        enumerable: true
      });

      this.setOnError = function (callback) {
        _Tools.Tools.assertIsFunction(callback, 'callback');

        props.onError = callback;
        return _this;
      };

      Object.defineProperty(this, 'andFinally', {
        get: function get() {
          return props.andFinally;
        },
        enumerable: true
      });

      this.setFinally = function (callback) {
        _Tools.Tools.assertIsFunction(callback, 'callback');

        props.andFinally = callback;
        return _this;
      };

      Object.defineProperty(this, 'jsonResponse', {
        get: function get() {
          if (!props.jsonResponse) {
            try {
              props.jsonResponse = JSON.parse(this.xhr.responseText);
            } catch (e) {
              props.jsonResponse = null;
            }
          }

          return props.jsonResponse;
        },
        enumerable: true
      });
      Object.defineProperty(this, 'errored', {
        get: function get() {
          return _Tools.Tools.getAsBoolean('errored', props);
        },
        enumerable: true
      });
      Object.defineProperty(this, 'error', {
        get: function get() {
          return _Tools.Tools.getAsInstanceOf('error', props, Error);
        },
        enumerable: true
      });
      Object.defineProperty(this, 'aborted', {
        get: function get() {
          return _Tools.Tools.getAsBoolean('aborted', props);
        },
        enumerable: true
      });
      Object.defineProperty(this, 'timedOut', {
        get: function get() {
          return _Tools.Tools.getAsBoolean('timedOut', props);
        },
        enumerable: true
      });

      var onError = function onError(error) {
        return props.errored = true && (props.error = error);
      };

      xhr.addEventListener('error', onError, false);

      var onTimeOut = function onTimeOut() {
        return props.timedOut = true;
      };

      xhr.addEventListener('timeout', onTimeOut, false);

      var onAbort = function onAbort() {
        return props.aborted = true;
      };

      xhr.addEventListener('abort', onAbort, false);

      var onLoadEnd = function () {
        var callback;

        try {
          if (this.succeeded) {
            callback = this.onSuccess;

            if (callback) {
              callback(this);
            }
          } else {
            throw new Error("".concat(url, " responded with status code ").concat(xhr.status));
          }
        } catch (error) {
          props.errored = true;
          props.error = error;
        } finally {
          try {
            if (props.errored) {
              callback = this.onError;

              if (callback) {
                callback(this);
              }
            }
          } catch (e1) {// ignored...
          } finally {
            try {
              callback = this.andFinally;

              if (callback) {
                callback(this);
              }
            } catch (e2) {
              xhr.removeEventListener('error', onError, false);
              xhr.removeEventListener('timeout', onTimeOut, false);
              xhr.removeEventListener('abort', onAbort, false);
              xhr.removeEventListener('loadend', onLoadEnd, false);
            }
          }
        }
      }.bind(this);

      xhr.addEventListener('loadend', onLoadEnd, false);
    }

    _createClass(Ajax, [{
      key: "configure",
      value: function configure(callback) {
        _Tools.Tools.assertIsFunction(callback, 'callback');

        callback(this.xhr);
      }
    }, {
      key: "abort",
      value: function abort() {
        this.xhr.abort();
      }
    }, {
      key: "send",
      value: function send() {
        /** @type {XMLHttpRequest} */
        var xhr = this.xhr; // Headers

        var headers = this.headers;

        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            var value = headers[key];
            xhr.setRequestHeader(key.toLowerCase(), value);
          }
        } // Method


        var method = this.method; // URL

        var url = this.url; // Query params

        var queryParams = this.queryParams;

        if (this.noCache) {
          queryParams['' + new Date().getTime()] = '';
        }

        var urlParams = Ajax.encodeUrl(queryParams);

        if (urlParams) {
          url += url.indexOf('?') === -1 ? '?' : '&';
          url += urlParams;
        } // Open


        xhr.open(method, url);
        var jsonBody = this.jsonBody;
        var formBody = this.formBody;
        var body = this.body;

        if (jsonBody) {
          xhr.send(JSON.stringify(jsonBody));
        } else if (formBody) {
          xhr.send(Ajax.encodeUrl(formBody, true));
        } else {
          xhr.send(body);
        }

        return this;
      }
    }], [{
      key: "encodeUrlParam",
      value: function encodeUrlParam(value, forBody) {
        value = _Tools.Tools.toString(value); // Spec says to normalize newlines to \r\n and replace %20 spaces with +.
        // jQuery does this as well, so this is likely to be widely compatible.

        forBody = _Tools.Tools.toBoolean(forBody);
        value = forBody ? value.replace(/\r?\n/g, '\r\n') : value;
        value = encodeURIComponent(value);
        value = forBody ? value.replace(/%20/g, '+') : value;
        return value;
      }
    }, {
      key: "encodeUrl",
      value: function encodeUrl(obj, forBody) {
        obj = _Tools.Tools.toObject(obj, {});
        var qry = '',
            sep = '';

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            var param = Ajax.encodeUrlParam(key, forBody);
            var value = obj[key];

            if (_Tools.Tools.isArray(value)) {
              for (var i = 0; i < value.length; i++) {
                qry += sep + param + '=' + Ajax.encodeUrlParam(value[i], forBody);
                sep = '&';
              }
            } else if (value !== null) {
              qry += sep + param + '=' + Ajax.encodeUrlParam(value, forBody);
              sep = '&';
            } else {
              qry += sep + param;
              sep = '&';
            }
          }
        }

        return qry;
      }
    }, {
      key: "create",
      value: function create(method, url, xhr) {
        return new Ajax(method, url, xhr);
      }
    }, {
      key: "get",
      value: function get(url) {
        return Ajax.create(METHODS.GET, url);
      }
    }, {
      key: "post",
      value: function post(url) {
        return Ajax.create(METHODS.POST, url);
      }
    }, {
      key: "put",
      value: function put(url) {
        return Ajax.create(METHODS.PUT, url);
      }
    }, {
      key: "delete",
      value: function _delete(url) {
        return Ajax.create(METHODS.PUT, url);
      }
    }]);

    return Ajax;
  }();

  _exports.Ajax = Ajax;
});
//# sourceMappingURL=Ajax.js.map