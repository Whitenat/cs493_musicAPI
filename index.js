// index.js
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-east-2"});

const MUSIC_TABLE = process.env.MUSIC_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/genres', function (req, res) {
  const params = {
    TableName: 'music-table-dev',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'genre',
      ':sk': 'genre'
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      genres = [];
      data.Items.forEach(function(item) {
        genres.push(item.info.genre);
      });
      res.send({
        "Genres": genres
      });
    }
  });
})

app.get('/artist/by/genre/:genre', function (req, res) {
  const params = {
    TableName: 'music-table-dev',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'genre#' + req.params.genre,
      ':sk': 'artist'
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      artists = [];
      data.Items.forEach(function(item) {
        artists.push(item.info.artist);
      });
      res.send({
        "Artists": artists
      });
    }
  });
})

app.get('/albums/by/artist/:artist', function (req, res) {
  const params = {
    TableName: 'music-table-dev',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'artist#' + req.params.artist,
      ':sk': 'album'
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      albums = [];
      data.Items.forEach(function(item) {
        albums.push(item.info.albums);
      });
      res.send({
        "Albums": albums
      });
    }
  });
})

app.get('/songs/by/album/:album', function (req, res) {
  const params = {
    TableName: 'music-table-dev',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'album#' + req.params.album,
      ':sk': 'song'
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      songs = [];
      data.Items.forEach(function(item) {
        songs.push(item.info.song);
      });
      res.send({
        "songs": songs
      });
    }
  });
})

app.get('/song/:song', function (req, res) {
  const params = {
    TableName: 'music-table-dev',
    KeyConditionExpression: 'pk = :pk and sk = :sk',
    ExpressionAttributeValues: {
      ':pk': 'song',
      ':sk': 'song#' + req.params.song
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      // var params = {
      //   "Bucket": 'hw-bucket-name',
      //   "Key": data.Items[0].info.song, 

      // };
      var params = {Bucket: 'hw-bucket-name', Key: data.Items[0].info.song};
      var url = s3.getSignedUrl('getObject', params);
      console.log('The URL is', url);
      res.send({
        "song": url
      });
      // var promise = s3.getSignedUrlPromise('getObject', params);
      // promise.then(function(url) {
      //   console.log('The URL is', url);
      //   let response = {
      //     "statusCode": 200,
      //     "headers": {
      //         "my_header": "my_value",
      //         "Access-Control-Allow-Origin": "*",
      //         "Access-Control-Allow-Credentials": true,
      //     },
      //     //"body": JSON.stringify(data.Contents,["Key"]),
      //     "body": JSON.stringify(url),
      //     "isBase64Encoded": false
      //   };
      //    res.status(null).send(response);
      // }, function(err) { res.status(err).send(null); });
    }
  });
})
module.exports.handler = serverless(app);