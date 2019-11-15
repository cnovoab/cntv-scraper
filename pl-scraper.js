const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.cntv.cl/martin-el-hombre-y-la-leyenda/cntv/2018-05-08/082910.html';
const playerPrefix = 'https://www.cntv.cl/cntv/js-local/prontusPlayer/embed/index.html?&src=';
const videoPrefix = 'https://www.cntv.cl';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const episodes = $('#div_capitulos > ul > li > a');
    episodes.each((i, elem) => {
      const title = $(elem).data('titulo');
      const strIframe = $(elem).data('iframe');
      const htmlIframe = cheerio.load(strIframe);
      const url = htmlIframe('iframe').attr('src');
      const path = url.replace(playerPrefix, ''); 
      const videoUrl = `${videoPrefix}${path}`;
      console.log(title, videoUrl); 
    });
  })
  .catch(console.error); 
