import {setup} from './setup.js'
import {runFloatLinearTest} from './test_float_linear.js'

const context = {};
setup(context);

const { gl, canvas } = context;

runFloatLinearTest(gl, canvas);