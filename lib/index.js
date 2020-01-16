import { hashtagRegex } from './hash-regex'
import { linkStrategy, linkify } from './linkStrategy'

// import createLinkPlugin from 'draft-js-linkify-plugin'
// const rule = /([#|＃][^\s]+)/g;

const rule_hash = hashtagRegex
// const linkPlugin = createLinkPlugin()

export const parse = ({ value, renderer, action, linkRenderer, linkAction }) => {

  let linkPositions = []
  let linkSplit = []

  linkStrategy(value, (a,b) => { linkPositions.push([a,b]) })
  //# 可以先 split url, 再將非 url 的 split hashtag, 再分 @mention, 依序推演

  if (linkPositions.length !== 0){

    linkPositions.forEach((v,i) => {

      let piece

      //# 塞 match 之前的 text
      if ( i === 0 ) {
        piece = value.slice(0, v[0])
        linkSplit.push(piece)
      } else {
        piece = value.slice( linkPositions[i-1][1],v[0])
        linkSplit.push(piece)
      }

      //# 塞目前的 text

      piece = value.slice(v[0],v[1])
      linkSplit.push(piece)

      //# 如果是最後一個項目, 塞後面的東西
      if ( i === (linkPositions.length - 1)){
        piece = value.slice( v[1] )
        linkSplit.push(piece)
      }

    })

  } else linkSplit.push(value)

  return linkSplit.map((chunk) => {
     const links = linkify.match(chunk);

     if (typeof links !== 'undefined' && links !== null) {
       // return renderer(chunk, action);
       return <a href={chunk} target="_blank" >{chunk}</a>
     } else {
       return parseHash(chunk, renderer, action)
     }
  })
  // return parseHash(value, renderer, action)
};


export const parseHash = (value, renderer, action) => {
  return value.split(rule_hash).map((chunk) => {
      if (chunk.match(rule_hash)) {
          return renderer(chunk, action);
      }

      return chunk;
  });
}
