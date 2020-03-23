console.log('Hello Webpack Project.');
const _ = require('lodash');

import 'bootstrap';
import './scss/style.scss';

let test = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });