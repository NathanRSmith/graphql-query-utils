'use strict';

const _ = require('lodash');

const renderQuery = module.exports.renderQuery = function(q) {
  q = pruneUndefined(q);
  let str = '{ ';
  // for each kvp, if v is bool true, scalar field, otherwise recurse
  str += _.chain(q)
    .map((v, k) => {
      if(k === '_') return;
      if(k === '@') return;

      if(v === true) return k;

      let str = '';

      if(!!v['@']) str += k+': '+v['@'];
      else str += k;

      // if args
      if(!!v._ && _.size(v._)) {
        const args = _.map(v._, (v, k) => {
          if(_.isString(v)) return `${k}: "${v}"`;
          return `${k}: ${v}`;
        }).join(', ');

        str += `(${args})`;
      }
      // if only args or alias, not obj
      if(_.chain(v).omit(['@', '_']).keys().value().length === 0) return str;
      return str + ' '+renderQuery(v);
    })
    .filter()
    .value()
    .join(' ');
  str += ' }';

  return str;
}

module.exports.fieldsToQuery = function(fields) {
  // expects array of strings or array of arrays of strings
  fields = _.map(fields, v => {
    if(_.isArray(v)) return v;
    if(_.isString(v)) return v.split('.');
    throw new Error('Invalid field format');
  });

  // recursively group by position
  function projectionGroups(fields) {
    return _.chain(fields)
      .groupBy('0')
      .mapValues(v => {
        // if length is 1 & no nesting, field proj
        if(v.length === 1 && v[0].length === 1) return true;

        // otherwise, slice off first part & recurse
        return projectionGroups(_.invokeMap(v, 'slice', 1));
      })
      .value();
  }

  return projectionGroups(fields);
}

const pruneUndefined = module.exports.pruneUndefined = function(obj) {
	_.forOwn(obj, (v, k) => {
		if(_.isUndefined(v)) delete obj[k];
		else if(_.isArray(v)) _.each(v, pruneUndefined);
		else if(_.isPlainObject(v)) pruneUndefined(v);
	});
	return obj;
}
