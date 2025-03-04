/* eslint-disable no-console */
import util from 'util';

const staticReturnOptions = [
  'dict',
  'inspect',
  Symbol.toStringTag,
  util.inspect.custom,
  Symbol.for('nodejs.util.inspect.custom'),
];

const strictGet = (target, name) => {
  if (name === Symbol.toStringTag) {
    return target;
  }
  if (name === 'length') {
    return target.length;
  }
  if (staticReturnOptions.indexOf(name) >= 0) {
    return target;
  }
  if (name === Symbol.iterator) {
    return { ...target };
  }

  if (name in target || name === '_reactFragment') {
    return target[name];
  }

  console.log(name.toString());
  console.error({ target, name });
  const e = Error(`invalid property "${name.toString()}"`);
  console.error(e.stack);
  return undefined;
};

const StrictDict = (dict) => new Proxy(dict, { get: strictGet });

export default StrictDict;
