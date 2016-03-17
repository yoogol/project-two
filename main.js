console.log("main is connected");

// job search variables
var $jobSearchLabel = $('<label>');
$jobSearchLabel.html("Your Job Search: ");
var $jobSearchInput = $('<input>');
$jobSearchInput.attr('type','text')
$jobSearchInput.attr('placeholder','Job Title');
$jobSearchLabel.append($jobSearchInput);
var $submitButton = $('<button>');
$submitButton.html("Let's Go!");




// launch
$(document).ready(function() {
  $('.searchBox').append($jobSearchLabel);
  $('.searchBox').append($submitButton);
  $submitButton.click(function(event) {
    // callIndeed($jobSearchInput.val());
    callGitHubJobs($jobSearchInput.val());
    $jobSearchInput.val("");
    $('.container').empty();
  })
}) // end of window onload


// get info from Indeed.com
// var callIndeed = function(searchTerm) {
//   console.log(searchTerm);
//   $.ajax({
//     dataType: 'jsonp',
//     type: 'GET',
//     timeout: 5000,
//     url: 'http://api.indeed.com/ads/apisearch?publisher=' + indeedAPI + '&format=json&q=' + searchTerm + '&l=&sort=&radius=&st=&jt=&start=&limit=25&fromage=30&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&v=2' // gives back 25 results
//   }).done(function(indeedResult){
//     // displayIndeedResult(indeedResult);
//   }).fail(function(indeedResult){
//     console.log(indeedResult);
//   });
// }

var callGitHubJobs = function(searchTerm) {
  $.ajax({
    url: 'https://jobs.github.com/positions.json?description=' + searchTerm, // page added because you can go further to next page https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
    dataType: 'jsonp'
  }).done(function(gitHubResult) {
    displayIndeedResult(gitHubResult);
  }).fail(function(gitHubResult){
    console.log(gitHubResult);
  });
}

var displayIndeedResult = function(gitHubResult) {
  // console.log(indeedResult);
  console.log(gitHubResult);
  var aggregateDescription = "";
  for (var i = 0; i < gitHubResult.length;i++) {
      aggregateDescription += (gitHubResult[i].description + " ");
  };
  // console.log(aggregateDescription);
  var separateWords = aggregateDescription.replace(/<strong>/igm, '');
  separateWords = separateWords.replace(/<\/strong>/igm, '');
  separateWords = separateWords.replace(/<li>/igm, '');
  separateWords = separateWords.replace(/<\/li>/igm, '');
  separateWords = separateWords.replace(/<p>/igm, '');
  separateWords = separateWords.replace(/<\/p>/igm, '');
  separateWords = separateWords.replace(/<ul>/igm, '');
  separateWords = separateWords.replace(/<\/ul>/igm, '');
  separateWords = separateWords.replace(/<em>/igm, '');
  separateWords = separateWords.replace(/<\/em>/igm, '');
  separateWords = separateWords.replace(/[0-9]/g, '');
  separateWords = separateWords.replace(/\W+/g, ' ');
  separateWords = separateWords.split(" ");
  console.log(separateWords);
  var wordCount = new Object();
  for (var i = 0; i < separateWords.length; i++) {
    var formatted = separateWords[i].toLowerCase();
    if (stopWords.indexOf(formatted) === -1 && formatted.length !== 1) {
      if (wordCount.hasOwnProperty(formatted)) {
        console.log("current word old: " + formatted);
        wordCount[formatted] += 1;
      } else {
        console.log("current word new: " + formatted);
        wordCount[formatted] = 1;
      }
    }
  }
  console.log(wordCount);

  // console.log(wordCount);
  // var filteredWords = wordCount.Filter(function() {
  //
  //   for (key in wordCount) {
  //     for (var i = 0; i < stopWords.length; i++) {
  //       if (key === stopWords[i]) {
  //         return false;
  //       };
  //     };
  //     return true
  //   }
  // });
  var sortable = [];
  for (var key in wordCount)
    sortable.push([key, wordCount[key]]);
    sortable.sort(function(a, b) {return b[1] - a[1]});
    //http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
    console.log(sortable);
    $ulist = $('<ul>');
    for (var i = 0; i < 50; i++) {
      var $listi = $('<li>');
      var order = parseInt([i]) + 1;
      $listi.html(order + ".  " + sortable[i][0] + ":    " + sortable[i][1]);
      console.log($listi);
      $ulist.append($listi);
      console.log($ulist);
    }
    $('.container').append($ulist);
} // end of displayIndeedResult
