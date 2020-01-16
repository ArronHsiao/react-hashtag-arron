import linkifyIt from 'linkify-it';
import tlds from 'tlds';

export const linkify = linkifyIt();
linkify.tlds(tlds);

// Gets all the links in the text, and returns them via the callback
export const linkStrategy = (text, callback) => {
  const links = linkify.match(text);
  if (typeof links !== 'undefined' && links !== null) {
    for (let i = 0; i < links.length; i += 1) {
      callback(links[i].index, links[i].lastIndex);
    }
  }
};
