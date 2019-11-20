const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const playerPrefix = 'https://www.cntv.cl/cntv/js-local/prontusPlayer/embed/index.html?&src=';
const baseUrl = 'https://www.cntv.cl';

const parseEpisodes = async (showPath) => {
  try {
    const response = await axios.get(`${baseUrl}${showPath}`);
    const dom = JSDOM.fragment(response.data);
    const div = dom.querySelector('div#div_capitulos > ul');
    if (!div) return [];
    const episodes = Array.from(div.children);


    return episodes.map((episode, index) => {
      const data = episode.querySelector('a').dataset;
      const parsedIframe = JSDOM.fragment(data.iframe).firstElementChild;
      const path = parsedIframe.src.replace(playerPrefix, ''); 

      return {
        number: index + 1,
        title: data.titulo,
        description: data.bajada,
        path
      }
    });
  } catch(error) {
    console.error(error)
  }
}

module.exports = parseEpisodes;
