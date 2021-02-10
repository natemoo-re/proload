export type Message = string | Error;

export class Assertion extends Error {
	name: 'Assertion';
	code: 'ERR_ASSERTION';
	message: string;
	constructor(options?: {
		message: string;
	});
}

export function assert(condition: boolean, message: Message): asserts condition;
