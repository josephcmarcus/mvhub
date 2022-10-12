const axios = require('axios');

const mailchimp = {
  findMember: async function(email) {
    try {
      const response = await axios.get(`http://localhost:3001/findmember/lists/e10aaf22f0/members/${email}`)
      console.log(response);
    } catch(error) {
      console.log(error);
    }
  }, 

  addTag: async function(product, email) {
    if (product === 'Demolishing Demonic Assignments Backstage Pass') {
      const tagName = 'INT VIP Demolishing Demonic Assignments';
      try {
        const response = await axios.post(`http://localhost:3001/addtag/lists/e10aaf22f0/members/${email}/${tagName}/active`)
        console.log(response);
      } catch(error) {
        console.log(error);
      }
    };
  }
};

module.exports = { mailchimp };