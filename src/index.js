const request = require('request');
const cheerio = require('cheerio');

module.exports = async function App(context) {

  //quickreply template
  const quickReplyContent = {quickReply:{
    items:[
      {
      type: 'action',
      action: {type: 'message',label: 'ping me',text:'kanoping'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'ya kah?',text:'!ykh apakah'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'mana kah?',text:'!mnkh ini - itu'}
      },
      {
        type: 'action',
        action: {type: 'message',label: 'my anime list',text:'!mal sao'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'arknights cg',text:'!akcg Blue_Poison 1'}
      }
    ]
  }};

  if (context.event.isText) {
    //lowercase context.event.text variable
    //console.log('reply is text');
    const eventText = context.event.text.toLowerCase();

    //Bot ping test
    if(eventText === 'kanoping'){
      context.replyText(`pong`);
    }

    //Greet
    else if(eventText === 'kano'){
      context.getUserProfile().then(profile => {
        context.replyText(`Hello ${profile.displayName}!`, quickReplyContent);
      });
    }

    //anti swear
    else if(eventText.includes('kontol')||
    eventText.includes('memek')||
    eventText.includes('bangsat')||
    eventText.includes('pepek')||
    eventText.includes('goblok')||
    eventText.includes('goblog')){
      context.getUserProfile().then(profile => {
        context.replyText(`Gak boleh kasar ${profile.displayName} >:(`);
      });
    }

    //fun
    else if(eventText.includes('kano jelek')){
      context.getUserProfile().then(profile => {
        context.replyText(`Lo jelek ${profile.displayName} >:(`);
      });
    }

    //fun
    else if(eventText.includes('kano cantik')){
      const url = 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235730/android/sticker.png';
        context.replyImage({
          originalContentUrl: url,
          previewImageUrl: url
        })
    }

    //fun
    else if(eventText.includes('aku ganteng')){
      context.getUserProfile().then(profile => {
        if (profile.displayName === 'Alifiandi NW') {
          context.replyText(`Iya ${profile.displayName}, kamu keren <3`);
        } else {
          context.replyText(`Gak ${profile.displayName}, kamu jelek!\nhehe bercanda~`);
        }
      });
    }

    //ya kah feature
    else if(eventText.search('!ykh') === 0){
      const ykhreply = ['Ya', 'Gak'];
      context.getUserProfile().then(profile => {
        context.replyText(`${profile.displayName}: ${context.event.text.substr(5)}\n\n${ykhreply[Math.floor(Math.random() * ykhreply.length)]}`);
      });
    }

    // mana kah feature
    else if(eventText.search('!mnkh') === 0){
      const choose = context.event.text.substr(6).split('-');
      context.replyText(`Aku pilih\n\n${choose[Math.floor(Math.random() * choose.length)]}`);
    }

    //mal feature
    else if(eventText.search('!mal') === 0 ){
      const malrequest = eventText.substr(5).replace(' ','_');
      const uri = `https://myanimelist.net/search/all?q=${malrequest}&cat=all`;
      context.replyTemplate('this is a template', {
        type: 'buttons',
        thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235734/android/sticker.png',
        title: 'My Anime List',
        text: 'Fitur ini masih dalam pengembangan',
        actions: [
          {
            type: 'uri',
            label: 'Hasil Pencarian',
            uri: uri,
          },
        ],
      });
    }

    //arknights cg
    else if(eventText.search('!akcg') === 0){
      let cgrequest = context.event.text.split(' ');
      let cgindex = 0;

      if (cgrequest[cgrequest.length - 1] === '1') {
        cgindex = 1;
        cgrequest.pop();
      } else if (cgrequest[cgrequest.length - 1] === '2') {
        cgindex = 2;
        cgrequest.pop();
      } else if (cgrequest[cgrequest.length - 1] === '0') {
        cgrequest.pop();
      }

      let opname = cgrequest[1];

      request(`https://mrfz.fandom.com/wiki/${opname}`, (error, response, html) => {  
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const opimg = $(`#pi-tab-${cgindex} > figure > a > img`);
          let url = opimg.attr('src');
          url && context.replyImage({
            originalContentUrl: url,
            previewImageUrl: url,
          }
          );
        }
      }
      );
    }

  }
};