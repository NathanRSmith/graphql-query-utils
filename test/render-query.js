'use strict';

const assert = require('assert');
const {renderQuery} = require('..');

module.exports = {
  'renderQuery': {
    'should support field projection': function() {
      const q = {
        a: true,
        b: {
          c: true,
          d: true,
          e: {
            f: true,
            g: {
              h: true
            }
          }
        }
      };

      const out = '{ a b { c d e { f g { h } } } }';
      assert.equal(renderQuery(q), out);
    },

    'should support args': function() {
      const q = {
        a: true,
        b: {
          _: {
            arg1: 'blah',
            arg2: 'deblah',
            arg3: 123
          },
          c: {_: { lkj: 'fds' }},
          d: true,
          e: {
            f: true,
            g: {
              h: true
            }
          }
        }
      };

      const out = '{ a b(arg1: "blah", arg2: "deblah", arg3: 123) { c(lkj: "fds") d e { f g { h } } } }';
      assert.equal(renderQuery(q), out);
    },

    'should support aliases': function() {
      const q = {
        A: {'@': 'a'},
        B: {
          '@': 'b',
          _: {
            arg1: 'blah',
            arg2: 'deblah',
            arg3: 123
          },
          c: {_: { lkj: 'fds' }},
          d: true,
          E: {
            '@': 'e',
            f: true,
            g: {
              h: true
            }
          }
        }
      };

      const out = '{ A: a B: b(arg1: "blah", arg2: "deblah", arg3: 123) { c(lkj: "fds") d E: e { f g { h } } } }';
      assert.equal(renderQuery(q), out);
    }
  }
}
