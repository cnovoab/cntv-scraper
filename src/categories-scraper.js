const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url = 'https://www.cntv.cl/videoteca';

const parseCategories = async () => {
  try {
    const response = await axios.get(url);
    const dom = JSDOM.fragment(response.data);
    const ul = dom.querySelector('.taxMenu');
    const items = Array.from(ul.querySelectorAll('.tab'));

    const categories = items.map((category) => {
      return category.textContent;
    });
    return categories;
  } catch(error) {
    console.error(error)
  }
}


(async () => {
    try {
      const categories = await parseCategories();
      console.log('Categories', categories);
    } catch (e) {
      console.error('Something went wrong!');
    }
})();
