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
  }
};