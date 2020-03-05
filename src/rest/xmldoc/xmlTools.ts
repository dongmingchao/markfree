import * as _ from 'lodash/fp';

export type supportTag = '<red>' | '<em>';

const entry = _.curry(function(regex: RegExp, xml: string):Capture {
  let rest: string[];
  const ire = new RegExp(regex, 'i');
  const cap:CaptureNode[] = [];
  rest = xml
    .replace(regex, val => {
      const capMatch = ire.exec(val);
      if (!capMatch) return val;
      const [ ,tag, text ] = capMatch;
      cap.push({
        tag: tag as supportTag,
        content: parse(text),
      });
      return '|';
    })
    .split('|');
  return { rest, cap };
});

export interface Capture {
  rest: string[];
  cap: CaptureNode[];
}

export interface CaptureNode {
  tag?: supportTag;
  content: Capture;
}

const trans = _.curry(function(
  rest: string[],
  cap: CaptureNode[],
  regex: RegExp
) {
  const n_cap = cap.slice();
  let beAdded = 0;
  const n_rest = _.flattenDeep(
    rest.map((str, index) => {
      const t = entry(regex, str);
      if (t.cap.length) {
        n_cap.splice(index + beAdded, 0, ...t.cap);
        beAdded++;
      }
      return t.rest;
    })
  );
  return {
    rest: n_rest,
    cap: n_cap
  };
});

const font_red = /(<red>)(.+?)<\/red>/g;
const em = /(<em>)(.+?)<\/em>/g;

const allFunSet = [font_red, em];

function parse(xml: string): Capture {
  const ret = allFunSet.reduce(
    (prev: Capture, curr, index) => {
      return trans(prev.rest, prev.cap, curr);
    },
    { rest: [xml], cap: [] }
  );
  return ret;
}

export default { parse };
