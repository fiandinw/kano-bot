const request = require('request');
const cheerio = require('cheerio');

module.exports = async function App(context) {

  //quickreply template
  const quickReplyContent = {
    quickReply: {
      items: [{
          type: 'action',
          action: {
            type: 'message',
            label: 'info',
            text: '!info'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'about',
            text: '!about'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'tanya',
            text: '!ykh apakah'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'pilih',
            text: '!mnk ini-itu'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'arknights cg',
            text: '!akcg blue poison 3'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'arknights op',
            text: '!akinfo blue poison'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'anime search',
            text: '!anime yuru camp'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'manga search',
            text: '!manga yuru camp'
          }
        },
        /*{
        type: 'action',
        action: {type: 'message',label: 'booru search',text:'!booru scenery blue_sky'}
        }*/
      ]
    }
  };

  //jikan template
  const jikanres = (srcreq, scrtype, context) => {
    request(`https://api.jikan.moe/v3/search/${scrtype}?q=${encodeURI(srcreq)}&limit=10`, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const reqres = JSON.parse(html);
        const reqitems = reqres.results.map((item) => ({
          thumbnailImageUrl: item.image_url,
          title: item.title.substr(0, 39),
          text: item.type,
          actions: [{
            type: 'message',
            label: 'Details',
            text: `!id${scrtype} ${item.mal_id}`,
          }, ],
        }))
        reqres.results[0] && context.replyCarouselTemplate('MAL Search Result', reqitems);
      }
    })
  }


  //maintenance mode
  context.getUserProfile().then(profile => {
    if (true /* profile.displayName === 'Alifiandi NW' */ ) {

      if (context.event.isText) {
        //lowercase context.event.text variable
        //console.log('reply is text');
        const eventText = context.event.text.toLowerCase().trim();
        //Bot ping test
        if (eventText === 'kanoping') {
          context.replyText(`pong`);
        } else if (eventText === '!info' || eventText === '!help') {
          context.replyText(`Kano Bot Beta\n\nList fitur\n!ykh <pertanyaan>\n!mnk <pilihan 1>-<pilihan 2>-<dst...>\n!anime <judul>\n!manga <judul>\n!akinfo <nama operator>\n!akcg <nama operator> <indeks (1-6)>\n!luck\n!aniday <day (monday-sunday)>\n!chara <anime character>\n!seiyuu <voice actor name>\n!todo\n!qotd\n!lovecalc <nama 1> - <nama 2>`);
        } else if (eventText === '!about') {
          context.replyTemplate('Kano Bot About', {
            type: 'buttons',
            thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235752/android/sticker.png',
            title: 'Kano Bot',
            text: 'Made with love by fiandinw',
            actions: [{
                type: 'uri',
                label: 'Who is kano',
                uri: 'https://utaite.fandom.com/wiki/Kano',
              },
              {
                type: 'uri',
                label: 'Contribute',
                uri: 'https://github.com/fiandinw/kano-bot/issues',
              },
              {
                type: 'uri',
                label: 'Blog',
                uri: 'https://fiandinw.github.io/blog/',
              },
            ],
          });
        } else if (eventText === '!luck') {
          context.getUserProfile().then(profile => {
            context.replyText(`Keberuntungan ${profile.displayName} ${Math.floor(Math.random() * 101)}%`);
          });
        }

        //Greet
        else if (eventText === 'kano') {
          context.getUserProfile().then(profile => {
            context.replyText(`Hello ${profile.displayName}!`, quickReplyContent);
          });
        }

        //anti swear
        else if (eventText.includes('kontol') ||
          eventText.includes('memek') ||
          eventText.includes('bangsat') ||
          eventText.includes('pepek') ||
          eventText.includes('goblok') ||
          eventText.includes('goblog') ||
          eventText.includes('ngentot')) {
          context.getUserProfile().then(profile => {
            const swearreply = [`Gak boleh kasar ${profile.displayName} >:(`, `A S T A G H F I R U L L A H`, `${profile.displayName} bahasanya yang baik yah :)`];
            context.replyText(swearreply[Math.floor(Math.random() * swearreply.length)]);
          });
        }

        //fun
        else if (eventText.includes('kano jelek')) {
          context.getUserProfile().then(profile => {
            context.replyText(`Lo jelek ${profile.displayName} >:(`);
          });
        }

        //fun
        else if (eventText.includes('kano cantik')) {
          const url = 'https://stickershop.line-scdn.net/stickershop/v1/sticker/11235730/android/sticker.png';
          context.replyImage({
            originalContentUrl: url,
            previewImageUrl: url
          })
        }

        //fun
        else if (eventText.includes('aku ganteng')) {
          context.getUserProfile().then(profile => {
            if (profile.displayName === 'Alifiandi NW') {
              context.replyText(`Iya ${profile.displayName}, kamu keren <3`);
            } else {
              context.replyText(`Gak ${profile.displayName}, kamu jelek!\nhehe bercanda~`);
            }
          });
        }

        //ya kah feature
        else if (eventText.search('!ykh') === 0 || eventText.search('!ynm') === 0) {
          const ykhreply = ['Ya', 'Gak'];
          context.replyText(`${context.event.text.substr(5)}\n\n${ykhreply[Math.floor(Math.random() * ykhreply.length)]}`);
        }

        // mana kah feature
        else if (eventText.search('!mnk') === 0 || eventText.search('!chs') === 0) {
          const choose = context.event.text.substr(5).split('-');
          context.replyText(`Aku pilih\n\n${choose[Math.floor(Math.random() * choose.length)].trim()}`);
        }

        //ak info
        else if (eventText.search('!akinfo') === 0) {
          const akrequest = eventText.substr(8);
          request(`https://gamewith.net/arknights/article/show/15179`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const $ = cheerio.load(html);
              let links = undefined;
              $('#article-body > div.ark_charalist > table > tbody').find('a').each((index, element) => {
                if ($(element).text().toLocaleLowerCase().includes(akrequest)) {
                  links = $(element).attr('href')
                  request(links, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                      const $ = cheerio.load(html);
                      const title = $('body > div.page-wrap > div > div.main-wrap > div.main-col-wrap > div.c-box.w-for-tips-custom-style > div.article-wrap > div.article-hero.is-plain > h1 > span').text();
                      const rarity = $('#article-body > div.ark_data > table > tbody > tr:nth-child(2) > td:nth-child(1)').text();
                      const role = $('#article-body > div.ark_data > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                      links && context.replyText(`${title}\n${role} (${rarity})`);
                    }
                  })
                }
              })
            }
          });
        }

        //arknights cg
        else if (eventText.search('!akcg') === 0) {
          let cgrequest = eventText.split(' ');
          let cgindex = 1;

          switch (cgrequest[cgrequest.length - 1]) {
            case '1':
              cgrequest.pop();
              break;
            case '2':
              cgindex = 2;
              cgrequest.pop();
              break;
            case '3':
              cgindex = 3;
              cgrequest.pop();
              break;
            case '4':
              cgindex = 6;
              cgrequest.pop();
              break;
            case '5':
              cgindex = 7;
              cgrequest.pop();
              break;
            case '6':
              cgindex = 8;
              cgrequest.pop();
              break;
            default:
              cgindex = 1;
              cgrequest.pop();
              break;
          }

          let opname = cgrequest.join('-').substr(6);

          request(`https://gamepress.gg/arknights/operator/${opname}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const $ = cheerio.load(html);
              const opimg = $(`#image-tab-${cgindex} > a > img`);
              let url = `https://gamepress.gg${opimg.attr('data-cfsrc')}`;
              opimg.attr('data-cfsrc') && context.replyImage({
                originalContentUrl: url,
                previewImageUrl: url,
              });
            }
          });
        }

        //jikan api anime
        else if (eventText.search('!anime') === 0) {
          jikanres(eventText.substr(7), 'anime', context);
        }

        //jikan api manga
        else if (eventText.search('!manga') === 0) {
          jikanres(eventText.substr(7), 'manga', context);
        }

        //jikan api anime id
        else if (eventText.search('!idanime') === 0) {
          request(`https://api.jikan.moe/v3/anime/${eventText.substr(9)}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              context.replyText(`${reqres.title}\n${reqres.title_japanese}\n\n${reqres.episodes} eps (${reqres.status})\nType: ${reqres.type}\nSource: ${reqres.source}\nGenre: ${reqres.genres.map(i=>i.name)}\n\n${reqres.url}`);
            }
          })
        }

        //jikan api manga id
        else if (eventText.search('!idmanga') === 0) {
          request(`https://api.jikan.moe/v3/manga/${eventText.substr(9)}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              context.replyText(`${reqres.title}\n${reqres.title_japanese}\n\n${reqres.volumes} Volumes\n${reqres.chapters} Chapters\n(${reqres.status})\nType: ${reqres.type}\n\nGenre: ${reqres.genres.map(i=>i.name)}\n\n${reqres.url}`);
            }
          })
        }

        //anime schedule
        else if (eventText.search('!aniday') === 0) {
          let day = eventText.substr(8).trim();
          switch (day) {
            case '1':
            case 'senin':
              day = 'monday';
              break;
            case '2':
            case 'selasa':
              day = 'tuesday';
              break;
            case '3':
            case 'rabu':
              day = 'wednesday';
              break;
            case '4':
            case 'kamis':
              day = 'thursday';
              break;
            case '5':
            case 'jumat':
            case 'jum\'at':
              day = 'friday';
              break;
            case '6':
            case 'sabtu':
              day = 'saturday';
              break;
            case '7':
            case 'minggu':
              day = 'sunday';
              break;
            default:
              break;
          }
          request(`https://api.jikan.moe/v3/schedule/${day}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              const anilist = reqres[day].map((item) => item.title)
              reqres[day] && context.replyText(`${day} anime schedule\n\n${anilist.join('\n')}`);
            }
          })
        }

        //anime chara search
        else if (eventText.search('!chara') === 0) {
          const str = eventText.substr(7);
          request(`https://api.jikan.moe/v3/search/character?q=${encodeURI(str)}&limit=5`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              const imgcarousel = reqres.results.map((item) => (
                item.image_url && {
                  thumbnailImageUrl: item.image_url,
                  title: item.name.substr(0, 39),
                  text: item.name,
                  actions: [{
                    type: 'message',
                    label: 'Details',
                    text: `${item.url}`,
                  }, ],
                }
              ))
              reqres.results[0] && context.replyCarouselTemplate('Character Search Result', imgcarousel);
            }
          })
        }

        //seiyuu search
        else if (eventText.search('!seiyuu') === 0) {
          const str = eventText.substr(8);
          request(`https://seiyuu.moe:9000/api/seiyuu/?Name=${encodeURI(str)}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              const imgcarousel = reqres.results.map((item) => (
                item.imageUrl && {
                  thumbnailImageUrl: item.imageUrl,
                  title: item.name.substr(0, 39),
                  text: item.name,
                  actions: [{
                    type: 'message',
                    label: 'Details',
                    text: `https://myanimelist.net/people/${item.malId}`,
                  }, ],
                }
              ))
              reqres.results[0] && context.replyCarouselTemplate('Seiyuu Search Result', imgcarousel.slice(0, 4));
            }
          })
        }

        //gabut
        else if (eventText === '!todo') {
          request(`https://www.boredapi.com/api/activity`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              context.replyText(`Something to do\n\n${reqres.activity}\n(${reqres.type})\n${reqres.participants} participants\n${reqres.link}`)
            }
          })
        }

        //quote of the day
        else if (eventText === '!qotd') {
          request(`https://api.quotable.io/random`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
              const reqres = JSON.parse(html);
              context.replyText(`${reqres.content}\n-${reqres.author}`)
            }
          })
        }

        //lovecalc
        else if (eventText.search('!lovecalc') === 0) {
          const choose = context.event.text.substr(10).split('-');
          const options = {
            method: 'GET',
            url: 'https://love-calculator.p.rapidapi.com/getPercentage',
            qs: {
              fname: choose[0],
              sname: choose[1]
            },
            headers: {
              'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
              'x-rapidapi-host': 'love-calculator.p.rapidapi.com',
              useQueryString: true
            }
          };

          request(options, function (error, response, body) {
            if(!error && response.statusCode == 200){
              context.replyText(`${body.fname}\n< ${body.percentage}% 3\n${body.sname}\n\n${body.result}`)
            }
          });
        }
      }
    }
  }) //maintenance mode
};