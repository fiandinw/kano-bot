const request = require('request');
const cheerio = require('cheerio');

module.exports = async function App(context) {

  //quickreply template
  const quickReplyContent = {quickReply:{
    items:[
      {
      type: 'action',
      action: {type: 'message',label: 'info',text:'!info'}
      },
      {
        type: 'action',
        action: {type: 'message',label: 'about',text:'!about'}
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
      action: {type: 'message',label: 'arknights cg',text:'!akcg blue poison 3'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'arknights op',text:'!akinfo blue poison'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'anime search',text:'!anime yuru camp'}
      },
      {
      type: 'action',
      action: {type: 'message',label: 'manga search',text:'!manga yuru camp'}
      },
      /*{
      type: 'action',
      action: {type: 'message',label: 'booru search',text:'!booru scenery blue_sky'}
      }*/
    ]
  }};

  //jikan template
  const jikanres = (srcreq, scrtype, context) => {
    request(`https://api.jikan.moe/v3/search/${scrtype}?q=${encodeURI(srcreq)}&limit=10`,(error, response, html) => {
        if(!error && response.statusCode == 200){
          const reqres = JSON.parse(html);
          const reqitems = reqres.results.map((item) => ({
              thumbnailImageUrl: item.image_url,
              title: item.title.substr(0,39),
              text: item.type,
              actions: [
                {
                  type: 'message',
                  label: 'Details',
                  text: `!id${scrtype} ${item.mal_id}`,
                },
              ],
          }))
          reqres.results[0] && context.replyCarouselTemplate('MAL Search Result', reqitems);
        }
    })
  }


  //maintenance mode
  context.getUserProfile().then(profile => {
    if (true/* profile.displayName === 'Alifiandi NW' */){
  
  if (context.event.isText) {
    //lowercase context.event.text variable
    //console.log('reply is text');
    const eventText = context.event.text.toLowerCase();
    //Bot ping test
    if(eventText === 'kanoping'){
      context.replyText(`pong`);
    }

    else if (eventText === '!info' || eventText === '!help'){
      context.replyText(`Kano Bot Beta\n\nList fitur\n!ykh <pertanyaan>\n!mnkh <pilihan 1>-<pilihan 2>-<dst...>\n!anime <judul>\n!manga <judul>\n!akinfo <nama operator>\n!akcg <nama operator> <indeks (1-6)>\n!luck\n!aniday <day (monday-sunday)>\n!chara <anime character>\n!seiyuu <voice actor name>`);
    }

    else if (eventText === '!about'){
      context.replyTemplate('Kano Bot About', {
        type: 'buttons',
        thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235752/android/sticker.png',
        title: 'Kano Bot',
        text: 'Made with love by fiandinw',
        actions: [
          {
            type: 'uri',
            label: 'Who is kano',
            uri: 'https://utaite.fandom.com/wiki/Kano',
          },
        ],
      });
    }

    else if (eventText === '!luck'){
      context.getUserProfile().then(profile => {
        context.replyText(`Keberuntungan ${profile.displayName} ${Math.floor(Math.random() * 101)}%`);
      });
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
        const swearreply = [`Gak boleh kasar ${profile.displayName} >:(`,`A S T A G H F I R U L L A H`, `${profile.displayName} bahasanya yang baik yah :)`];
        context.replyText(swearreply[Math.floor(Math.random() * swearreply.length)]);
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
        context.replyText(`${context.event.text.substr(5)}\n\n${ykhreply[Math.floor(Math.random() * ykhreply.length)]}`);
    }

    // mana kah feature
    else if(eventText.search('!mnkh') === 0){
      const choose = context.event.text.substr(6).split('-');
      context.replyText(`Aku pilih\n\n${choose[Math.floor(Math.random() * choose.length)]}`);
    }

    //ak info
    else if(eventText.search('!akinfo') === 0 ){
      const akrequest = eventText.substr(8).replace(' ','_');
      const uri = `https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=${akrequest}`;
      context.replyTemplate('Arknights Operator Info', {
        type: 'buttons',
        thumbnailImageUrl: 'https://webusstatic.yo-star.com/ark_us_web/pc/img/logo02.924e2f2a.png',
        title: 'Arknights Operator Info',
        text: 'Operator Info',
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

    //jikan api anime
    else if(eventText.search('!anime') === 0){
      jikanres(eventText.substr(7), 'anime', context);
    }

    //jikan api manga
    else if(eventText.search('!manga') === 0){
      jikanres(eventText.substr(7), 'manga', context);
    }

    //jikan api anime id
    else if(eventText.search('!idanime') === 0){
      request(`https://api.jikan.moe/v3/anime/${eventText.substr(9)}`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            context.replyText(`${reqres.title}\n${reqres.title_japanese}\n\n${reqres.episodes} eps (${reqres.status})\nType: ${reqres.type}\nSource: ${reqres.source}\nGenre: ${reqres.genres.map(i=>i.name)}\n\n${reqres.url}`);
        }
      })
    }

    //jikan api manga id
    else if(eventText.search('!idmanga') === 0){
      request(`https://api.jikan.moe/v3/manga/${eventText.substr(9)}`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            context.replyText(`${reqres.title}\n${reqres.title_japanese}\n\n${reqres.volumes} Volumes\n${reqres.chapters} Chapters\n(${reqres.status})\nType: ${reqres.type}\n\nGenre: ${reqres.genres.map(i=>i.name)}\n\n${reqres.url}`);
        }
      })
    }

    //anime schedule
    else if(eventText.search('!aniday') === 0){
      const day = eventText.substr(8);
      request(`https://api.jikan.moe/v3/schedule/${day}`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            const anilist = reqres[day].map((item) => item.title)
            reqres[day] && context.replyText(`${day} anime schedule\n\n${anilist.join('\n')}`);
        }
      })
    }

    //anime chara search
    else if(eventText.search('!chara') === 0){
      const str = eventText.substr(7);
      request(`https://api.jikan.moe/v3/search/character?q=${encodeURI(str)}&limit=3`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            const imgcarousel = reqres.results.map((item) => (
              item.image_url && {
              thumbnailImageUrl: item.image_url,
              title: item.name.substr(0,39),
              text: item.name,
                actions: [{
                  type: 'message',
                  label: 'Details',
                  text: `${item.url}`,
                },],
              }
            ))
            reqres.results[0] && context.replyCarouselTemplate('Character Search Result', imgcarousel);
        }
      })
    }
    
    //seiyuu search
    else if(eventText.search('!seiyuu') === 0){
      const str = eventText.substr(8);
      request(`https://api.jikan.moe/v3/search/person?q=${encodeURI(str)}&limit=3`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            const imgcarousel = reqres.results.map((item) => (
              item.image_url && {
              thumbnailImageUrl: item.image_url,
              title: item.name.substr(0,39),
              text: item.name,
                actions: [{
                  type: 'message',
                  label: 'Details',
                  text: `${item.url}`,
                },],
              }
            ))
            reqres.results[0] && context.replyCarouselTemplate('Seiyuu Search Result', imgcarousel);
        }
      })
    }

    //gabut
    else if(eventText === '!gabut'){
      request(`https://www.boredapi.com/api/activity`,(error, response, html) => {
        if(!error && response.statusCode == 200){
            const reqres = JSON.parse(html);
            context.replyText(`Something to do\n\n${reqres.activity}\n(${reqres.type})\n${reqres.participants} participants\n${reqres.link}`)
        }
      })
    }
  }
}})//maintenance mode
};