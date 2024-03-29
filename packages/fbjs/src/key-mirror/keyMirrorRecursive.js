/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule keyMirrorRecursive
 * @flow strict
 * @typechecks
 */

'use strict';

var invariant = require('invariant');

export type KeyMirrorRecursive<O> = $ObjMapi<
  O,
  (<O: {...}>(mixed, O) => KeyMirrorRecursive<O>) & (<K>(K) => K),
>;

export type KeyMirrorRecursiveWithPrefix<O> = $ObjMapi<
  O,
  (<O: {...}>(mixed, O) => KeyMirrorRecursiveWithPrefix<O>) & (mixed => string),
>;

type keyMirrorRecursiveFn = (<O: {...}>(
  obj: O,
  _: void,
) => KeyMirrorRecursive<O>) &
  (<O: {...}>(obj: O, prefix: string) => KeyMirrorRecursiveWithPrefix<O>);

/**
 * Constructs an enumeration with keys equal to their value. If the value is an
 * object, the method is run recursively, including the parent key as a suffix.
 * An optional prefix can be provided that will be prepended to each value, but
 * note that if a prefix is provided, the types the values of the object are
 * just strings, not string literals.
 *
 * For example:
 *
 *   var ACTIONS = keyMirror({FOO: '', BAR: { BAZ: '', BOZ: '' }}});
 *   ACTIONS.BAR.BAZ = 'BAR.BAZ';
 *
 *   Input:  {key1: '', key2: { nested1: '', nested2: '' }}}
 *   Output: {key1: key1, key2: { nested1: nested1, nested2: nested2 }}}
 *
 *   var CONSTANTS = keyMirror({FOO: {BAR: ''}}, 'NameSpace');
 *   console.log(CONSTANTS.FOO.BAR); // NameSpace.FOO.BAR
 */
const keyMirrorRecursive: keyMirrorRecursiveFn = (obj: {...}, prefix) => {
  const ret: {[string]: KeyMirrorRecursiveWithPrefix<$FlowFixMe> | string} = {};
  invariant(
    isObject(obj),
    'keyMirrorRecursive(...): Argument must be an object.',
  );

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    var val = obj[key];
    var newPrefix = (prefix != null && Boolean(prefix)) ? prefix + '.' + key : key;
    if (isObject(val)) {
      val = keyMirrorRecursive(val, newPrefix);
    } else {
      val = newPrefix;
    }

    ret[key] = val;
  }

  return ret;
};

function isObject<T: {...}>(obj: T): boolean {
  return obj instanceof Object && !Array.isArray(obj);
}

module.exports = keyMirrorRecursive;
