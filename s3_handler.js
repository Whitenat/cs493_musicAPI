const AWS = require('aws-sdk');

var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-east-2"});

// module.exports.hello = (event, context, callback) => {
//     const params = {
//   "Bucket": 'hw-bucket-name',
//     };
//     s3.listObjects(params, function(err, data){
//        if(err) {
//            callback(err, null);
//        } else {
//            let response = {
//         "statusCode": 200,
//         "headers": {
//             "my_header": "my_value",
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": true,
//         },
//         //"body": JSON.stringify(data.Contents,["Key"]),
//         "body": JSON.stringify(data.Contents),
//         "isBase64Encoded": false
//     };
//            callback(null, response);
//     }
//     });
    
// };

module.exports.hello = (event, context, callback) => {
   const params = {
        Bucket: 'hw-bucket-name'
    };
    s3.listObjectsV2(params, (err, data) => {
     console.log('S3 List', data);

     // Package signed URLs for each to send back to client
     let songs = []
     for (let item of data.Contents) {
      let url = s3.getSignedUrl('getObject', {
        Bucket: 'hw-bucket-name',
        Key: item.Key, 
      });
      var obj_thing = url;
      songs.push(JSON.stringify(obj_thing));
     }
     let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        //"body": JSON.stringify(data.Contents,["Key"]),
        "body": JSON.stringify(songs),
        "isBase64Encoded": false
      };
       callback(null, response);
    })
  // var params = {
  //   "Bucket": 'hw-bucket-name',
  //   "Key": "Awful - josh pan.mp3", 

  // };
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
  //    callback(null, response);
  // }, function(err) { callback(err, null); });
  // s3.getSignedUrl('getObjec', params, function (err, url) {
  //   console.log('The URL is', url);
  //   if(err) {
  //          callback(err, null);
  //      } else {
  //          let response = {
  //           "statusCode": 200,
  //           "headers": {
  //               "my_header": "my_value",
  //               "Access-Control-Allow-Origin": "*",
  //               "Access-Control-Allow-Credentials": true,
  //           },
  //           //"body": JSON.stringify(data.Contents,["Key"]),
  //           "body": JSON.stringify(url),
  //           "isBase64Encoded": false
  //         };
  //          callback(null, response);
  //     }
  // });
 
};