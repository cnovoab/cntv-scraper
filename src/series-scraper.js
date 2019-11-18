const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url = 'https://www.cntv.cl/videoteca';

const parseSeries = async () => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const series = dom.window.document.querySelectorAll('.info > a');
   
    for (serie of series) {
      console.log('666', serie.href);
    }
    return series;
  } catch(error) {
    console.error(error)
  }
}


(async () => {
    try {
      const series = await parseSeries(url);
      // console.log('series', series);
    } catch (e) {
      console.error('Something went wrong!');
    }
})();
