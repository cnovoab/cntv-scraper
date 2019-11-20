const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const parseCategories = (document) => {
  try {
    const dom = JSDOM.fragment(document);
    const ul = dom.querySelector('.taxMenu');
    const items = Array.from(ul.querySelectorAll('.tab'));

    return items
      .map(category => {
        return {
          code: category.firstChild.href.replace('.', ''),
          name: category.textContent
        }
      })
      .filter(category => category.code.includes('area'));
  } catch(error) {
    console.error(error)
  }
}

module.exports = parseCategories;
