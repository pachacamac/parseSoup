import htmlparser from 'htmlparser'
import { select } from 'soupselect-update'

export function parseSoup(html) {
  return new Promise(async (resolve, reject) => {
    const makeSoup = function(dom){
      const soup = select.bind(null, dom)
      const text = elem => elem.type === 'text' ? elem.data : (elem.children || []).map(e => text(e)).join('')
      const findAll = sel => soup(sel).map(e => ({ ...makeSoup(e), ...{ text: () => text(e) } }))
      const find = sel => findAll(sel).shift()
      return { findAll, find, ...dom }
    }
    new htmlparser.Parser(new htmlparser.DefaultHandler(
      async(err, dom) => err ? reject(err) : resolve(makeSoup(dom))
    )).parseComplete(html.trim())
  })
}

/* Usage:
const url = "https://example.com"
const headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',}
const res = await fetch(url, {method: "GET", headers})
const soup = await parseSoup(await res.text())
const paragraphs = soup.findAll('p').map(e=>e.text())
*/
