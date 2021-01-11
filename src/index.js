const request = require('request');
const cheerio = require('cheerio');

module.exports = async function App(context) {
  if (context.event.isText) {
    //await context.sendText(`${context.event.text}`);
    if(context.event.text.toLowerCase() === 'kanoping'){//tesbot
      context.replyText(`pong`);
    }
    else if(context.event.text.toLowerCase() === 'kano'){//pangil balik
      context.getUserProfile().then(profile => {
      context.replyText(`Hello ${profile.displayName} <3`,{quickReply:{
        items:[
          {
          type: 'action',
          action: {type: 'message',label: 'ping me',text:'kanoping'}
          }
        ]
      }});
      });
    }
    else if(context.event.text.toLowerCase() === 'aktest'){
      let opname = 'Blue_Poison';
      request(`https://mrfz.fandom.com/wiki/${opname}`, (error, response, html) => {  
      if (!error && response.statusCode == 200) {
              const $ = cheerio.load(html);
              const opimg = $('#pi-tab-0 > figure > a > img');
              let url = opimg.attr('src');
              context.replyImage({
                originalContentUrl: url,
                previewImageUrl: url,
              });
          }
      });
    }
  }
};