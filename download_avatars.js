var request = require('request');
var token = require('./secrets');
var fs = require('fs');



// console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token ' + token.GITHUB_TOKEN
        }
    };    

    request(options, function(err, result, body) {
        var contributors = JSON.parse(body);
        cb(err, contributors);
      
    });
}

function downloadImageByURL(url, filePath) {
    request.get(url)

            .on('error', function (err) {
            })
        
            .pipe(fs.createWriteStream(filePath))
  }

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")



getRepoContributors(process.argv[2], process.argv[3], function(err, result) {

    if (!process.argv[2] || !process.argv[3]) {
        console.log("Error: Please enter both owner name and repository name.");
        return;
    }

    if (err) {
        console.log("There is an error.");
        return;
    }

    for ( var i = 0; i < result.length; i++) {
        var login = result[i].login;
        downloadImageByURL(result[i].avatar_url, "./avatars/" + login + ".jpg");
    }
});