console.log("main is connected");

//****************************************************//
//*******Global Variables
//****************************************************//

//******** job search variables
var $jobSearchLabel = $('<label>');
$jobSearchLabel.html("Your Next Career Move: ");
var $jobSearchInput = $('<input>');
$jobSearchInput.attr('type','text')
$jobSearchInput.attr('placeholder','Job Title');
$jobSearchLabel.append($jobSearchInput);
var $submitButton = $('<button>');
$submitButton.html("Let's Go!");

//****************************************************//
//Interface
//****************************************************//
$(document).ready(function() {
  $('.searchBox').append($jobSearchLabel);
  $('.searchBox').append($submitButton);
  $submitButton.click(function(event) {
    var searchTerm = $jobSearchInput.val().toLowerCase();
    // callIndeed($jobSearchInput.val());
    callGitHubJobs(searchTerm);
    callMeetUp(searchTerm);
    callCoursera(searchTerm);
    $jobSearchInput.val("");
    $('#container-jobs').empty();
  })
}) // end of window onload


//****************************************************//
//Calling APIs
//****************************************************//

//***** call GITHUBJOBS for data ***********//
var callGitHubJobs = function(searchTerm) {
  $.ajax({
    url: 'https://jobs.github.com/positions.json?description=' + searchTerm, // page added because you can go further to next page https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
    dataType: 'jsonp'
  }).done(function(gitHubResult) {
    console.log("returning gitHubResult " + gitHubResult);
    console.log(gitHubResult);
    displayIndeedResult(gitHubResult);
  }).fail(function(gitHubResult){
    console.log(gitHubResult);
  });
} // end of callGitHubJobs


//***** call MEETUP for data **************//
var callMeetUp = function(searchTerm) {
  $.ajax({
    url: 'https://api.meetup.com/2/open_events.json?topic=' + searchTerm + '&&country=US&time=,1w&limited_events=true&category=34&key=' + meetUpAPI,
    dataType: 'jsonp'
  }).done(function(meetUpResult) {
    console.log("returning meetUpResult " + meetUpResult);
    console.log(meetUpResult.results);
    displayMeetUpResult(meetUpResult.results);
  }).fail(function(gitHubResult){
    console.log(meetUpResult);
  });
}

//***** call COURSERA for data **************//
var callCoursera = function(searchTerm) {
  $.getJSON("https://www.udacity.com/public-api/v0/courses", function(data) {
    // console.log(data.courses);
    var courseraResult = data.courses.filter(function(obj) {
      // console.log("filtering");
      // console.log(obj);
      // console.log(obj.syllabus);
      if (obj.summary.toLowerCase().split(" ").indexOf(searchTerm) > -1) {
        return true
      } else {
        return false
      };
    });
    console.log("returning courseraResult " + courseraResult);
    console.log(courseraResult);
    displayCourseraResult(courseraResult);
});
}


//****************************************************//
//*****Displaying results
//****************************************************//

//*********Indeed.com Results***************//
var displayIndeedResult = function(gitHubResult) {
  // console.log(indeedResult);
  // console.log("working on wordcloud");
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
  // console.log(separateWords);
  var wordCount = new Object();
  for (var i = 0; i < separateWords.length; i++) {
    var formatted = separateWords[i].toLowerCase();
    // making sure these are not stopwords and not sincle-letter words (need to fix: C++ etc.)
    if (stopWords.indexOf(formatted) === -1 && formatted.length !== 1) {
      if (wordCount.hasOwnProperty(formatted)) {
        // console.log("current word old: " + formatted);
        wordCount[formatted] += 1;
      } else {
        // console.log("current word new: " + formatted);
        wordCount[formatted] = 1;
      }
    }
  } // end of for loop
  // console.log(wordCount);

  // sorting by frequency
  var sortable = [];
  for (var key in wordCount)
    sortable.push([key, wordCount[key]]);
    sortable.sort(function(a, b) {return b[1] - a[1]});
    //http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
    // console.log(sortable);
    // publishing as a list
    $ulist = $('<ul>');
    for (var i = 0; i < 50; i++) {
      var $listi = $('<li>');
      $listi.html(sortable[i][0] + ":    " + sortable[i][1]);
      // console.log($listi);
      $ulist.append($listi);
      // console.log($ulist);
    }
    $('#container-jobs').append($ulist);
} // end of displayIndeedResult

//*************MeetUp.com Results**************//
var displayMeetUpResult = function(meetUpResult) {
  // stupid workaround to get rid of a misidentified startup for japanese language
  // meetUpResult = meetUpResult.filter(function(obj){
  //   if (obj.description.split(' ').indexOf("Japanese") > -1) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // })
  var templateEl = $('#widget-meetup').html();
  var template = Handlebars.compile(templateEl);
  var html = template(meetUpResult);
  $('#container-meetup').html(html);
}

//*************Coursera.org Results**************//
var displayCourseraResult = function(courseraResult) {
  // console.log(courseraResult);
  var templateEl = $('#widget-courses').html();
  var template = Handlebars.compile(templateEl);
  var html = template(courseraResult);
  $('#container-courses').html(html);
}
