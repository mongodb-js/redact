# mongodb-redact [![][npm_img]][npm_url] [![][travis_img]][travis_url] [![slack][slack_img]][slack_url]

> Remove potentially sensitive information from objects without changing the shape.

Inspired by [fruitsalad][fruitsalad] and [mongo-redact][mongo-redact].

## Installation

```bash
npm install --save mongodb-redact
```

## API

```javascript
var redact = require('mongodb-redact')
```
#### redact(object)

## License

Apache 2.0

[travis_img]: https://secure.travis-ci.org/mongodb-js/mongodb-redact.svg?branch=master
[travis_url]: https://travis-ci.org/mongodb-js/mongodb-redact
[npm_img]: https://img.shields.io/npm/v/mongodb-redact.svg
[npm_url]: https://www.npmjs.org/package/mongodb-redact
[LogEntry]: #logentry
[mongodb-ns]: https://github.com/mongodb-js/ns
[slack_url]: https://slack.mongodb.parts/
[slack_img]: https://slack.mongodb.parts/badge.svg
[fruitsalad]: https://github.com/rueckstiess/fruitsalad
[mongo-redact]: https://github.com/jonrangel/mongo-redact
