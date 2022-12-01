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

  addTag: async function(tag, email) {
    try {
      const response = await axios.post(`https://mv-hub-micro.azurewebsites.net/addtag/${process.env.MICRO_API_KEY}/lists/${process.env.SCHOOL_ID}/members/${email}/${tag}/active`)
      console.log(response);
    } catch(error) {
      console.log(error);
    };

    // Was used to apply the intensive VIP tag to those who purchased from Thrivecart
    // if (tag === 'Demolishing Demonic Assignments Backstage Pass') {
    //   const tagName = 'INT VIP Demolishing Demonic Assignments';
    //   try {
    //     const response = await axios.post(`https://mv-hub-micro.azurewebsites.net/addtag/${process.env.MICRO_API_KEY}/lists/${process.env.SCHOOL_ID}/members/${email}/${tagName}/active`)
    //     console.log(response);
    //   } catch(error) {
    //     console.log(error);
    //   }
    // };
  }
};

module.exports = { mailchimp };