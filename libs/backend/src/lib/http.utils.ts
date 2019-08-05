import {
  isArray,
  forEach,
  isObject,
  isDate,
  isFunction,
  isUndefined,
  isNumber,
} from 'lodash';

function toJsonReplacer(key, value) {
  let val = value;

  if (
    typeof key === 'string' &&
    key.charAt(0) === '$' &&
    key.charAt(1) === '$'
  ) {
    val = undefined;
  }

  return val;
}

function toJson(obj, pretty = undefined) {
  if (isUndefined(obj)) return undefined;
  if (!isNumber(pretty)) {
    pretty = pretty ? 2 : null; // tslint:disable-line no-parameter-reassignment
  }
  return JSON.stringify(obj, toJsonReplacer, pretty);
}

function serializeValue(v) {
  if (isObject(v)) {
    return isDate(v) ? v.toISOString() : toJson(v);
  }
  return v;
}

function forEachSorted(obj, iterator, context = null) {
  const keys = Object.keys(obj).sort();
  for (let i = 0; i < keys.length; i += 1) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces = undefined) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
}

export function jQueryLikeParamSerializer(params) {
  if (!params) return '';
  const parts = [];
  serialize(params, '', true);
  return parts.join('&');

  function serialize(toSerialize, prefix, topLevel = false) {
    if (isArray(toSerialize)) {
      forEach(toSerialize, (value, index) => {
        serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
      });
    } else if (isObject(toSerialize) && !isDate(toSerialize)) {
      forEachSorted(toSerialize, (value, key) => {
        serialize(
          value,
          prefix + (topLevel ? '' : '[') + key + (topLevel ? '' : ']'),
        );
      });
    } else {
      if (isFunction(toSerialize)) {
        toSerialize = toSerialize(); // tslint:disable-line no-parameter-reassignment
      }
      parts.push(
        prefix + '=' + (toSerialize == null ? '' : serializeValue(toSerialize)),
      );
    }
  }
}
