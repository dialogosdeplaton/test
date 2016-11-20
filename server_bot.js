var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port',process.env.PORT||80);

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

var _serverName = "[moisesServerBot] ";
var _moises_screen_name= 'taki_ok';

io.on("connection",function(socket){

  socket.on("USER_CONNECT",function(){
    console.log(_serverName+"User connected");
    socket.emit("USER_CONNECTED");
  });
 

  // OJO: Lista de seguidores
  // Requests / 15-min window (user auth) 15
  // Requests / 15-min window (app auth) 30
  socket.on('getFollowersList',getFollowersList);

  setInterval (getFollowersList,1000*60*16);

  function getFollowersList(){
    var params = {
      screen_name: _moises_screen_name
    }
    var _followersList = {
        screen_names_list:[ ],
        profile_images_list:[ ]
    }

    T.get('followers/list',params,CB_getFollowersList);

    function CB_getFollowersList(err,data,response){
      if(err){
        console.log(_serverName+'#followers/list [FAIL]');
      }else{

        var followers_json = data.users;
        for(var i = 0;i<followers_json.length; i++){
          _followersList.screen_names_list.push(followers_json[i].screen_name);
          console.log(_serverName+_followersList.screen_names_list);
          _followersList.profile_images_list.push(followers_json[i].profile_image_url_https);
          console.log(_serverName+_followersList.profile_images_list);
        }
        console.log(_serverName+'#followers/list [OK]');
        socket.emit("getFollowersList",_followersList);
      }
    }
  }

  //
  // envia tweet al nuevo seguidor!
  //
  var stream = T.stream('user');

  stream.on('follow',followed);

  function followed(eventMsg){
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    //recordar: el "." es para que aparezca en el tweets(el main)) y no en tweets&replys
    tweetIt('.HOLA @' + screenName + ' #MENSAJE #SALUDO #LINK   http://moises.pe.hu');

    function tweetIt(txt){
      var tweet = {
        status: txt
      }

      T.post('statuses/update', tweet,tweeted);

      function tweeted(err,data, response){
        if (err){
          console.log(_serverName+"post statuses/update [FAIL]");
        }else{
          console.log(_serverName+"post statuses/update [OK]");
        }
      }
    }
  }
});

server.listen(app.get('port'),function(){
  console.log(_serverName + "running...");
});