type BodyInit = Document | Blob | BufferSource | FormData | URLSearchParams | ReadableStream | string;

export class Ajax {

	readonly id: string;

	readonly xhr: XMLHttpRequest;

	readonly method: string;

	readonly url: string;

	readonly queryParams: Object;

	readonly noCache: boolean;

	readonly headers: Object;

	readonly body: BodyInit;

	readonly jsonBody: Object;

	readonly formBody: Object;

	readonly status: number;

	readonly succeeded: number;

	readonly error: Error;

	readonly errored: boolean;

	readonly timedOut: boolean;

	readonly aborted: boolean;

	readonly response: any;

	readonly jsonResponse: Object|Array<any>;

	readonly xmlResponse: Document;

	readonly textResponse: string;

	constructor(method: string, url: string);

	static encodeUrlParam(value: string, forBody?: boolean): string;

	static encodeUrl(obj: Object, forBody?: boolean): string;

	static create(method: string, url: string, xhr?: XMLHttpRequest): Ajax;

	static get(url: string): Ajax;

	static post(url: string): Ajax;

	static put(url: string): Ajax;

	static delete(url: string): Ajax;

	setId(id: string): Ajax;

	setQueryParams(params: Object): Ajax;

	setHeader(key: string, value: string): Ajax;

	setBody(body: BodyInit): Ajax;

	setJsonBody(body: Object): Ajax;

	setFormBody(body: Object): Ajax;

	setNoCache(onOff: boolean): Ajax;

	setOnSuccess(callback: (ajax: Ajax) => any): Ajax;

	setOnError(callback: (ajax: Ajax) => any): Ajax;

	setFinally(callback: (ajax: Ajax) => any): Ajax;

	configure(callback: (xhr: XMLHttpRequest) => any): Ajax;

	send(): Ajax;

	abort(): void;
	
}