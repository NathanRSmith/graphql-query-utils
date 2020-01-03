'use strict';

const assert = require('assert');
const {pruneUndefined} = require('..');

module.exports = {
	'prune-undefined util': {
		'should recursively prune out undefined from objects': function() {
			const obj = {
				'a':'A',
				'b':undefined,
				'd': {
					'e':'E',
					'f':undefined,
					'g': {
						'h': 'H',
						'i': undefined
					}
				},
				'j':[{
					'k':'K',
					'l': undefined
				}]
			};

			assert(obj.hasOwnProperty('b'));
			assert(obj.d.hasOwnProperty('f'));
			assert(obj.d.g.hasOwnProperty('i'));
			assert(obj.j[0].hasOwnProperty('l'));

			pruneUndefined(obj);

			assert(!obj.hasOwnProperty('b'));
			assert(!obj.d.hasOwnProperty('f'));
			assert(!obj.d.g.hasOwnProperty('i'));
			assert(!obj.j[0].hasOwnProperty('l'));
		}
	}
}
