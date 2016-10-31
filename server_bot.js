// para que use el puerto asignado por HEROKU
// o en su defecto tome el 8080 local mi compu
   var _number_port = process.env.PORT || 8080;
// =================================================================
   var WebSocketServer = require('ws').Server
   var wss = new WebSocketServer({ port:_number_port });

   wss.on('connection', function connection(ws){
     ws.on('message',function incoming(message){
       console.log('received: %s', message);

       if(message=="get_followersList"){
         followersList();
         //setTimeout('return 0',1000);
         ws.send(JSON.stringify(_followersList_array));
         console.log(JSON.stringify(_followersList_array));
       }

     });
  });

_nombreDelServidor = '[moises-server-bot]';
//#TEST para la version final sacar el hardcodeo de screen_name
//esta para evitar la restriccion de peticiones GET

  console.log(_nombreDelServidor + ' running...');
  var node_date_utils = require('date-utils');
  var Twit = require('twit');
  var config = require('./config');
  var T = new Twit(config);

  //node_date_utils.languaje("es");
  //console.log(node_date_utils.today());

  // OJO: Lista de seguidores
  // Requests / 15-min window (user auth) 15
  // Requests / 15-min window (app auth) 30
  setInterval (followersList,1000*60*16);

  function followersList(){
      var params = {
          screen_name: 'taki_ok'
      }

      T.get('followers/list',params,CB_followersList);

      function CB_followersList(err,data, response){
        if(err){
            console.log('#followers/list [FAIL]');
        }else{
            var seguidores = data.users;
            for(var i = 0; i<seguidores.length; i++){
               _followersList_array.push(seguidores[i].screen_name);
               console.log(seguidores[i].screen_name);
            }
            console.log('#followers/list [OK]');
            console.log(_followersList_array);
        }
      }
  }

    //
    // busca lista de IDs de seguidores
    //  devuelve ids como arreglo y los cursores

    //#TEST  setInterval (followersIds,1000*10);

      function followersIds(){
          var params = {
              screen_name: 'taki_ok'
          }

          T.get('followers/ids',params,CB_followersIds);

          function CB_followersIds(err,data, response){
            if(err){
                console.log('#followers/ids [FAIL]');
            }else{
                console.log('#followers/ids [OK]');
                var seguidores = data.ids;
                console.log(seguidores);
                for(var i = 0; i<data.ids.length; i++){
                    /*_followersIds_array.push(seguidores[i].user_id);
                    console.log(seguidores[i].user_id);*/
                }
            }
          }
        }


      //
      // Busca un teewt
      //
      /*
      function CB_searchTweets(err, data, response) {
        var tweets = data.statuses;
        for(var i=0; i<tweets.length;i++){
          console.log(tweets[i].user.screen_name+'=================');
          console.log(tweets[i].text);
        }
        console.log(data)
      }
      */


//
// envia tweet al nuevo seguidor!
//
  var stream = T.stream('user');

  stream.on('follow',followed);

  function followed(eventMsg){
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
     //recordar: el "." es para que aparezca en el tweets(el main)) y no en tweets&replys
    tweetIt('.hola @' + screenName + ' #mensajeSaludo   http://moises.pe.hu');

    function tweetIt(txt){
      var tweet = {
          status: txt
      }

      T.post('statuses/update', tweet,tweeted);

      function tweeted(err,data, response){
          if (err){
              console.log("post statuses/update [FAIL]");
          }else{
              console.log("post statuses/update [OK]");
          }
      }
    }
  }


  //
  //  search twitter for all tweets containing the word 'banana' since July 11, 2011
  //
  function searchTweets(){
      var params = {
        q:'octubre casi noviembre',
        count:3
      }
      T.get('search/tweets', params, CB_searchTweets);

      function CB_searchTweets(err, data, response) {
        var tweets = data.statuses;
        for(var i=0; i<tweets.length;i++){
          console.log(tweets[i].user.screen_name+'=================');
          console.log(tweets[i].text);
        }
      //  console.log(data)
      }
}
