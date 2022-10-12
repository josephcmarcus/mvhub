const dotenv = require('dotenv').config();
const axios = require('axios');

const mailchimp = {
  findMember: async function(email) {
    try {
      const response = await axios.get(`https://mv-hub-micro.azurewebsites.net/findmember/${process.env.MICRO_API_KEY}/lists/${process.env.SCHOOL_ID}/members/${email}`)
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  }, 

  addTag: async function(product, email) {
    if (product === 'Demolishing Demonic Assignments Backstage Pass') {
      const tagName = 'INT VIP Demolishing Demonic Assignments';
      try {
        const response = await axios.post(`https://mv-hub-micro.azurewebsites.net/addtag/${process.env.MICRO_API_KEY}/lists/${process.env.SCHOOL_ID}/members/${email}/${tagName}/active`)
        console.log(response);
      } catch(error) {
        console.log(error);
      }
    };
  }
};

module.exports = { mailchimp };