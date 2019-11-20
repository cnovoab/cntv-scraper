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
    const categories = parseCategories(response.data);
    const shows = Array.from(dom.querySelectorAll('.articulosFiltro'));

    return await Promise.all(
      shows.map(async (show) => {
        const categoryCodes = Array.from(show.classList)
          .map(code => categories.find(c => c.code === code))
          .filter(Boolean)
          .map(c => c.name);
        const showPath = show.querySelector('a').href;
        const img = show.querySelector('img').src;
        const title = show.querySelector('h2').textContent;
        const episodes = await parseEpisodes(showPath); 

        return { categoryCodes, showPath, img, title, episodes }
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
