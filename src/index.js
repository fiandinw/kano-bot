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
      action: {type: 'message',label: 'mana kah?',text:'!mnkh ini-itu'}
      },
      {
        type: 'action',
        action: {type: 'message',label: 'my anime list',text:'!mal sao'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'arknights cg',text:'!akcg blue poison 1'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'arknights op',text:'!akinfo blue poison'}
      },
      /*{
      type: 'action',
      action: {type: 'message',label: 'booru search',text:'!booru scenery blue_sky'}
      }*/
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
    eventText.includes('goblog')||
    eventText.includes('ngentot')){
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
      context.replyTemplate('MAL Search', {
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

    //ak info
    else if(eventText.search('!akinfo') === 0 ){
      const akrequest = eventText.substr(8).replace(' ','_');
      const uri = `https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=${akrequest}`;
      context.replyTemplate('Arknights Operator Info', {
        type: 'buttons',
        thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235734/android/sticker.png',
        title: 'Arknights Operator Info',
        text: 'Fitur ini masih dalam pengembangan',
        actions: [
          {
            type: 'uri',
            label: 'Operator Details',
            uri: uri,
          },
        ],
      });
    }

    //arknights cg
    else if(eventText.search('!akcg') === 0){
      let cgrequest = eventText.split(' ');
      let cgindex = 1;

      switch (cgrequest[cgrequest.length - 1]) {
        case '1':
          cgrequest.pop();break;
        case '2':
          cgindex = 2;cgrequest.pop();break;
        case '3':
          cgindex = 3;cgrequest.pop();break;
        case '4':
          cgindex = 6;cgrequest.pop();break;
        case '5':
          cgindex = 7;cgrequest.pop();break;
        case '6':
          cgindex = 8;cgrequest.pop();break;
        default:
          cgindex = 1;cgrequest.pop();break;
      }

      let opname = cgrequest.join('-').substr(6);

      request(`https://gamepress.gg/arknights/operator/${opname}`, (error, response, html) => {  
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const opimg = $(`#image-tab-${cgindex} > a > img`);
          let url = `https://gamepress.gg${opimg.attr('data-cfsrc')}`;
          opimg && context.replyImage({
            originalContentUrl: url,
            previewImageUrl: url,
          }
          );
        }
      }
      );
    }

    //booru pics
    /*else if(eventText.search('!booru') === 0){
      const srcreq = eventText.substr(7).split(' ').join('+');
      console.log(srcreq);
      request(`https://safebooru.donmai.us/posts.json?tags=${encodeURI(srcreq)}`,(error, response, html) => {
        if(!error && response.statusCode == 200){
          console.log(response.statusCode);
            const reqres = JSON.parse(html);
            const imgcarousel = reqres.map((content) => (
              content.large_file_url && {
              imageUrl: content.preview_file_url,
              action: {
                type: 'message',
                label: 'View',
                text: `!idbooru ${content.id}`,
              }
            }
            ))
            context.replyImageCarouselTemplate('Booru Search', imgcarousel.slice(0,9));
        }
      })
    }

    //id booru pics
    else if(eventText.search('!idbooru') === 0){
      const idbooru = eventText.substr(9);
      request(`https://safebooru.donmai.us/posts/${idbooru}.json`, (error, response, html) => {
        if(!error && response.statusCode == 200){
          const reqres = JSON.parse(html);
          context.replyImage({
            originalContentUrl: reqres.large_file_url,
            previewImageUrl: reqres.large_file_url
          })
          //console.log(reqres.large_file_url);
        }
      })
    }*/

  }
};