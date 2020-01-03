# GraphQL-Query-Utils

This is a small collection of utilities for generating GraphQL queries:

*  `renderQuery`: Renders a GraphQL query from a structured query object
*  `fieldsToQuery`: Converts a list of dot-syntax nested fields or a list of lists of nested fields to a structured query projection
*  `pruneUndefined`: Recursively removes any keys that have a value `undefined`

# Render-Query

Generates a GraphQL query from a structured JSON object. Support field projection, arguments & aliases.

```
> obj = {a: true, b: true};
> graphqlUtils.renderQuery(obj);
'{ a b }'
```

### Leaf fields

Use a value of `true`.

```
> obj = {
  a: true,
  b: true,
  c: true
}
> graphqlUtils.renderQuery(obj)
'{ a b c }'
```

### Nested fields

Use a value of a nested object.

```
> obj = {
  a: {
    b: {
      c: true,
      d: true
    },
    e: true
  }
}
> graphqlUtils.renderQuery(obj)
'{ a { b { c d } e } }'
```

### Leaf fields with arguments or alias

Specify field arguments via `_` as kvp. Specify an alias name as the key and `@` as the field to alias. In this case field `a` is aliased to `myfield` with the specified args. If there are no other keys in the obj, it will be treated as a leaf field.

```
> obj = {
  myfield: {
    _: {arg1: 'foo', arg2: 'bar'},
    '@': 'a'
  }
}
> graphqlUtils.renderQuery(obj)
'{ myfield: a(arg1: "foo", arg2: "bar") }'
```

### Nested fields with arguments or alias

Combine all of the above to have arbitrarily nested projections, arguments and aliases

```
> obj = {
  myfield: {
    _: {arg1: 'foo', arg2: 'bar'},
    '@': 'a',
    b: true,
    c: {
      _: {arg: 'baz'},
      d: true
    }
  }
}
> graphqlUtils.renderQuery(obj)
'{ myfield: a(arg1: "foo", arg2: "bar") { b c(arg: "baz") { d } } }'
```


# Fields-To-Query

Converts a list of fields to a structured query object. Fields can use dot-syntax for nesting or be an array of nested field names. Nested fields are grouped hierarchically.

### Simple fields

Convert a list of fields to a projection.

```
> graphqlUtils.fieldsToQuery(['a','b','c'])
{ a: true, b: true, c: true }
```

### Dot-Syntax Nesting

Convert a list of nested fields to a projection using the dot-syntax.

```
> graphqlUtils.fieldsToQuery(['a.b.c', 'a.b.d', 'a.e'])
{ a: { b: { c: true, d: true }, e: true } }
```

### Array-Syntax Nesting

Convert a list of nested fields to a projection using the array-syntax.

```
> graphqlUtils.fieldsToQuery([['a','b','c'], ['a','b','d'], ['a','e']])
{ a: { b: { c: true, d: true }, e: true } }
```

The two syntaxes can be mixed as well.

```
> graphqlUtils.fieldsToQuery(['a.b.c', ['a','b','d'], 'a.e'])
{ a: { b: { c: true, d: true }, e: true } }
```


# Tips

It is useful to combine `renderQuery` and `fieldsToQuery` in the following manner to build arbitrarily complex queries.

```
> const fields = ['b.c', 'b.d', 'e'];
> const obj = {
  a: _.extend(
    {_: {arg1: 'foo', arg2: 'bar'}},
    graphqlUtils.fieldsToQuery(fields)
  )
}
> graphqlUtils.renderQuery(obj)
'{ a(arg1: "foo", arg2: "bar") { b { c d } e } }'
```


# Development

```
docker build -t graphql-query-utils .
docker run --rm -it -v `pwd`:/opt/graphq-query-utils -v /opt/graphq-query-utils/node_modules graphql-query-utils
npm run test

npm version x.y.z -m 'release notes'
npm publish
```
