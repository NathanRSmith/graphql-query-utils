'use strict';

const assert = require('assert');
const {fieldsToQuery} = require('..');

module.exports = {
  'fieldsToQuery util': {
    'should convert a list of dot-syntax fields to query object': function() {
      var fields = ['a','b.c','b.d','b.e.f','b.e.g.h'];

      var out = {
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

      assert.deepEqual(fieldsToQuery(fields), out);
    },

    'should convert a list of array fields to query object': function() {
      var fields = [['a'],['b','c'],['b','d'],['b','e','f'],['b','e','g','h']];

      var out = {
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

      assert.deepEqual(fieldsToQuery(fields), out);
    },

    'should convert a mix of fields to query object': function() {
      var fields = ['a',['b','c'],'b.d',['b','e','f'],'b.e.g.h'];

      var out = {
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

      assert.deepEqual(fieldsToQuery(fields), out);
    }
  }
}
