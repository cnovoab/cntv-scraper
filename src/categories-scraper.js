const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url = 'https://www.cntv.cl/videoteca';

const parseSeries = async () => {
  try {
    const response = await axios.get(url);
    const dom = JSDOM.fragment(response.data);
    const items = Array.from(dom.querySelectorAll('.articulosFiltro'));
   
    const series = items.map((serie) => {
      const url = serie.querySelector('a').href;
      const img = serie.querySelector('img').src;
      const title = serie.querySelector('h2').textContent;

      return { url, img, title }
    });
    return series;
  } catch(error) {
    console.error(error)
  }
}


(async () => {
    try {
      const series = await parseSeries(url);
      console.log('series', series);
    } catch (e) {
      console.error('Something went wrong!');
    }
})();
