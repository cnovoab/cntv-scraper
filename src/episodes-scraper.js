const axios = require('axios');
const cheerio = require('cheerio');

const playerPrefix = 'https://www.cntv.cl/cntv/js-local/prontusPlayer/embed/index.html?&src=';
const baseUrl = 'https://www.cntv.cl';

const parseEpisodes = async (path) => {
  try {
    const response = await axios.get(`${baseUrl}${path}`);
    const $ = cheerio.load(response.data);
    const episodes = $('#div_capitulos > ul > li > a');
    // console.error('episodes', episodes);
    const parsedEpisodes = [];
    episodes.each((i, elem) => {
      const title = $(elem).data('titulo');
      const strIframe = $(elem).data('iframe');
      const htmlIframe = cheerio.load(strIframe);
      const url = htmlIframe('iframe').attr('src');
      const path = url.replace(playerPrefix, ''); 
      const videoUrl = `${baseUrl}${path}`;
      parsedEpisodes.push(videoUrl);
    });
    return parsedEpisodes;
  } catch(error) {
    console.error(error)
  }
}

module.exports = parseEpisodes;
