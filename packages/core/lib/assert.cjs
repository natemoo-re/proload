/**
 * @type import('./assert.cjs').Assertion
 */
class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
		this.details = opts.details || false;
		this.generated = !!opts.generated;
		this.operator = opts.operator;
		this.expects = opts.expects;
		this.actual = opts.actual;
	}
}

/**
 * @type import('./assert.cjs').assert
 */
function assert(bool, message) {
	if (bool) return;
	if (message instanceof Error) throw message;
	throw new Assertion(message);
}

module.exports.Assertion = Assertion;
module.exports.assert = assert;
