var async = require('async');

var ImapConnection = require('imap').ImapConnection, util = require('util'),
imap = new ImapConnection({
  username: '<your email address>@gmail.com',
  password: '<your password>',
  host: 'imap.gmail.com',
  port: 993,
  secure: true
});

console.log("Beginning calls");

async.series({
  connect : function(cb) { console.log("Connecting to Gmail..."); imap.connect(cb); },
  open : function(cb) { console.log("Opening Inbox..."); imap.openBox('INBOX', false,cb); },
  search : function(cb) { console.log("Searching Inbox..."); imap.search([ 'SEEN', ['SINCE', 'June 20, 2012'] ],cb); },},
  function(err,results){
    console.log("Parsing Results...");
    
    var inbox = results.search;

    var fetch = imap.fetch(inbox, { request: { headers: ['from', 'to', 'subject', 'date'] } });
    fetch.on('message', function(msg) {
      console.log('Got message: ' + util.inspect(msg, false, 5));
      msg.on('data', function(chunk) {
        console.log('Got message chunk of size ' + chunk.length);
      });
      msg.on('end', function() {
        console.log('Finished message: ' + util.inspect(msg, false, 5));
      });
    });
    fetch.on('end', function() {
      console.log('Done fetching all messages!');
      imap.logout();
    });
  });
