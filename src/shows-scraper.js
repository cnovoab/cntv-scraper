const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url = 'https://www.cntv.cl/videoteca';
const parseCategories = require('./categories-scraper.js');
const parseEpisodes = require('./episodes-scraper.js');
const fs = require('fs');
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

const parseShows = async () => {
  try {
    const response = await axios.get(url);
    const dom = JSDOM.fragment(response.data);
    const categoryList = parseCategories(response.data);
    const shows = Array.from(dom.querySelectorAll('.articulosFiltro'));

    return await Promise.all(
      shows.map(async (show) => {
        const categories = Array.from(show.classList)
          .map(code => categoryList.find(c => c.code === code))
          .filter(Boolean)
          .map(c => c.name);
        const path = show.querySelector('a').href;
        const img = show.querySelector('img').src;
        const title = show.querySelector('h2').textContent;
        const slug = path.substring(1, path.indexOf('/', 1)); 
        const code = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
        const episodes = await parseEpisodes(path); 

        return { code, title, categories, path, img, slug, episodes }
      })
    );
  } catch(error) {
    console.error(error)
  }
}

(async () => {
    try {
      const shows = await parseShows();
      await writeFile('videoteca.json', JSON.stringify(shows));
    } catch (e) {
      console.error('Something went wrong!', e.message);
    }
})();
