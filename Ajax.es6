import { Tools as $ } from '@kinkajou/tools/Tools';

const METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

export class Ajax {

	get status() {
		return this.xhr.status;
	}

	get succeeded() {
		
		if (this.errored || this.aborted || this.timedOut) {
			return false;
		}

		const status = this.status || 0;

		// Note: if we are using the file:// protocol, the status code will be 0
		// for all outcomes (successful or otherwise).
		return status === 0 || (status >= 200 && status < 300);
	}

	get response() {
		return this.xhr.response;
	}

	get xmlResponse() {
		return this.xhr.responseXML;
	}

	get textResponse() {
		return this.xhr.responseText;
	}

	constructor(method, url, extXhr) {

		const props = {};
		const xhr = extXhr || new XMLHttpRequest();

		Object.defineProperty(this, 'xhr', {
			value: xhr,
			enumerable: true,
		});

		Object.defineProperty(this, 'method', {
			value: METHODS[$.toString(method, METHODS.GET)] || METHODS.GET,
			enumerable: true,
		});

		Object.defineProperty(this, 'url', {
			value: $.toString(url),
			enumerable: true,
		});

		Object.defineProperty(this, 'queryParams', {
			get() {
				return $.getAsObject('queryParams', props, {});
			},
			enumerable: true,
		});

		this.setQueryParams = params => {
			$.assertIsObject(params, 'queryParams');
			$.set('queryParams', params, props);
			return this;
		};

		Object.defineProperty(this, 'noCache', {
			get() {
				return $.getAsBoolean('noCache', props);
			},
			enumerable: true,
		});

		this.setNoCache = onOff => {
			$.set('noCache', onOff === true, props);
			return this;
		};

		Object.defineProperty(this, 'id', {
			get() {
				return $.getAsString('id', props);
			},
			enumerable: true,
		});

		this.setId = id => {
			$.assertIsString(id, 'id');
			$.set('id', id, props);
			return this;
		};

		Object.defineProperty(this, 'headers', {
			get() {
				return $.getAsObject('headers', props, {});
			},
			enumerable: true,
		});

		this.setHeader = (key, value) => {
			$.assertIsString(key, 'key');
			$.assertIsString(value, 'value');
			$.set(['headers', key], value, props);
			return this;
		};

		Object.defineProperty(this, 'body', {
			get() {
				return props.body;
			},
			enumerable: true,
		});

		this.setBody = body => {
			$.assert(
				$.isString(body)
					|| (body instanceof Document)
					|| (body instanceof Blob)
					|| (body instanceof BufferSource)
					|| (body instanceof FormData)
					|| (body instanceof URLSearchParams)
					|| (body instanceof ReadableStream),
				'body can be a String, Document, Blob, BufferSource, FormData, URLSearchParams, ReadableStream'
			);
			props.body = body;
			return this;
		};

		Object.defineProperty(this, 'jsonBody', {
			get() {
				return $.getAsObject('jsonBody', props);
			},
			enumerable: true,
		});

		this.setJsonBody = jsonBody => {
			$.assertIsObject(jsonBody, 'jsonBody');
			props.jsonBody = jsonBody;
			return this;
		};

		Object.defineProperty(this, 'formBody', {
			get() {
				return $.getAsObject('formBody', props);
			},
			enumerable: true,
		});

		this.setFormBody = formBody => {
			$.assertIsObject(formBody, 'formBody');
			props.formBody = formBody;
			return this;
		};

		Object.defineProperty(this, 'onSuccess', {
			get() {
				return props.onSuccess;
			},
			enumerable: true,
		});

		this.setOnSuccess = callback => {
			$.assertIsFunction(callback, 'callback');
			props.onSuccess = callback;
			return this;
		};

		Object.defineProperty(this, 'onError', {
			get() {
				return props.onError;
			},
			enumerable: true,
		});

		this.setOnError = callback => {
			$.assertIsFunction(callback, 'callback');
			props.onError = callback;
			return this;
		};

		Object.defineProperty(this, 'andFinally', {
			get() {
				return props.andFinally;
			},
			enumerable: true,
		});

		this.setFinally = callback => {
			$.assertIsFunction(callback, 'callback');
			props.andFinally = callback;
			return this;
		};

		Object.defineProperty(this, 'jsonResponse', {
			get() {
				if (!props.jsonResponse) {
					try {
						props.jsonResponse = JSON.parse(this.xhr.responseText);
					} catch (e) {
						props.jsonResponse = null;
					}
				}
				return props.jsonResponse;
			},
			enumerable: true,
		});

		Object.defineProperty(this, 'errored', {
			get() {
				return $.getAsBoolean('errored', props);
			},
			enumerable: true,
		});

		Object.defineProperty(this, 'error', {
			get() {
				return $.getAsInstanceOf('error', props, Error);
			},
			enumerable: true,
		});

		Object.defineProperty(this, 'aborted', {
			get() {
				return $.getAsBoolean('aborted', props);
			},
			enumerable: true,
		});

		Object.defineProperty(this, 'timedOut', {
			get() {
				return $.getAsBoolean('timedOut', props);
			},
			enumerable: true,
		});

		const onError = error => props.errored = true && (props.error = error);
		xhr.addEventListener('error', onError, false);

		const onTimeOut = () => props.timedOut = true;
		xhr.addEventListener('timeout', onTimeOut, false);

		const onAbort = () => props.aborted = true;
		xhr.addEventListener('abort', onAbort, false);

		const onLoadEnd = function() {
			let callback;
			try {
				if (this.succeeded) {
					callback = this.onSuccess;
					if (callback) {
						callback(this);
					}
				} else {
					throw new Error(`${url} responded with status code ${xhr.status}`);
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
				} catch (e1) {
					// ignored...
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

	static encodeUrlParam(value, forBody) {

		value = $.toString(value);

		// Spec says to normalize newlines to \r\n and replace %20 spaces with +.
		// jQuery does this as well, so this is likely to be widely compatible.
		forBody = $.toBoolean(forBody);

		value = forBody ? value.replace(/\r?\n/g, '\r\n') : value;
		value = encodeURIComponent(value);
		value = forBody ? value.replace(/%20/g, '+') : value;

		return value;
	}

	static encodeUrl(obj, forBody) {

		obj = $.toObject(obj, {});

		let qry = '', sep = '';

		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const param = Ajax.encodeUrlParam(key, forBody);
				const value = obj[key];
				if ($.isArray(value)) {
					for (let i = 0; i < value.length; i++) {
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

	static create(method, url, xhr) {
		return new Ajax(method, url, xhr);
	}

	static get(url) {
		return Ajax.create(METHODS.GET, url);
	}

	static post(url) {
		return Ajax.create(METHODS.POST, url);
	}

	static put(url) {
		return Ajax.create(METHODS.PUT, url);
	}

	static delete(url) {
		return Ajax.create(METHODS.PUT, url);
	}

	configure(callback) {
		$.assertIsFunction(callback, 'callback');
		callback(this.xhr);
	}

	abort() {
		this.xhr.abort();
	}

	send() {
		
		/** @type {XMLHttpRequest} */ const xhr = this.xhr;

		// Headers
		const headers = this.headers;
		for (const key in headers) {
			if (headers.hasOwnProperty(key)) {
				const value = headers[key];
				xhr.setRequestHeader(key.toLowerCase(), value);
			}
		}

		// Method
		const method = this.method;

		// URL
		let url = this.url;

		// Query params
		const queryParams = this.queryParams;
		if (this.noCache) {
			queryParams['' + (new Date()).getTime()] = '';
		}
		const urlParams = Ajax.encodeUrl(queryParams);
		if (urlParams) {
			url += url.indexOf('?') === -1 ? '?' : '&';
			url += urlParams;
		}

		// Open
		xhr.open(method, url);

		const jsonBody = this.jsonBody;
		const formBody = this.formBody;
		const body = this.body;
		if (jsonBody) {
			xhr.send(JSON.stringify(jsonBody));
		} else if (formBody) {
			xhr.send(Ajax.encodeUrl(formBody, true));
		} else {
			xhr.send(body);
		}

		return this;
	}

}