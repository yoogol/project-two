

//****************************************************//
//*******Global Variables
//****************************************************//

//******** job search variables
var $jobSearchLabel = $('<label>');
$jobSearchLabel.html("Your Next Career Move: ");
var $jobSearchInput = $('<input>');
$jobSearchInput.attr('type','text')
$jobSearchInput.attr('placeholder','type job title or skill');
$jobSearchLabel.append($jobSearchInput);
var $submitButton = $('<button>');
$submitButton.html("Let's Go!");

//****************************************************//
//Interface
//****************************************************//
$(document).ready(function() {
  $('#jumbotron').append($jobSearchInput);
  $('#jumbotron').append($submitButton);
  $submitButton.click(function(event) {
    var searchTerm = $jobSearchInput.val().toLowerCase();
    // callIndeed($jobSearchInput.val());
    $('#wrapper').removeClass("hidden");
    $('#jumbotron').css("height", "250px");
    $('#jumbotron').css("background-position", "0% 55%");
    $('#jumbotron-text').addClass("clicked");
    callGitHubJobs(searchTerm);
    meetUpLocation(searchTerm);
    callCoursera(searchTerm);
    $jobSearchInput.val("");



  })
  $('#clickmeabout').click(function(event) {
    console.log("clickmeabout clicked");
    if ($('#about').hasClass("hidden")) {
      $('#about').removeClass("hidden");
    } else {
      $('#about').addClass("hidden");
    }
  });
  $('#closeabout').click(function(event) {
    if ($('#about').hasClass("hidden")) {
      $('#about').removeClass("hidden");
    } else {
      $('#about').addClass("hidden");
    }
  })
}) // end of window onload


//****************************************************//
//Calling APIs
//****************************************************//

//***** call GITHUBJOBS for data ***********//
var callGitHubJobs = function(searchTerm) {
  $('#container-jobs').empty();
  $.ajax({
    url: 'https://jobs.github.com/positions.json?description=' + searchTerm, // page added because you can go further to next page https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
    dataType: 'jsonp'
  }).done(function(gitHubResult) {
    displayIndeedResult(gitHubResult);
  }).fail(function(gitHubResult){
    console.log(gitHubResult);
  });
} // end of callGitHubJobs


//***** call MEETUP for data **************//
var meetUpLocation = function(searchTerm) {
  $('#container-meetup').empty();
  navigator.geolocation.getCurrentPosition(function(pos) {
    console.log(pos);
    var myLat = pos.coords.latitude;
    var myLon = pos.coords.longitude;
    console.log(myLat, myLon);
    callMeetUpCoord(myLat, myLon, searchTerm);
  },
  function(error) {
    var zipcode = prompt("Please specify your zipcode for Meetup search");
    console.log(zipcode);
    callMeetUpZip(zipcode, searchTerm);
  });

}

var callMeetUpCoord = function(myLat, myLon, searchTerm) {
  $.ajax({
    url: 'https://api.meetup.com/2/open_events.json?text=' + searchTerm + '&lat=' + myLat + '&lon=' + myLon + '&time=,1w&limited_events=true&category=34&key=' + meetUpAPI,
    dataType: 'jsonp'
  }).done(function(meetUpResult) {
    // console.log("returning meetUpResult " + meetUpResult);
    // console.log(meetUpResult.results);
    displayMeetUpResult(meetUpResult.results);
  }).fail(function(gitHubResult){
    console.log(meetUpResult);
  });
}

var callMeetUpZip = function(zip, searchTerm) {
  $.ajax({
    url: 'https://api.meetup.com/2/open_events.json?text=' + searchTerm + '&zip=' + zip + '&time=,1w&limited_events=true&category=34&key=' + meetUpAPI,
    dataType: 'jsonp'
  }).done(function(meetUpResult) {
    // console.log("returning meetUpResult " + meetUpResult);
    // console.log(meetUpResult.results);
    displayMeetUpResult(meetUpResult.results);
  }).fail(function(gitHubResult){
    console.log(meetUpResult);
  });
}

//***** call COURSERA for data **************//
var callCoursera = function(searchTerm) {
  console.log("callCoursera serach term: " + searchTerm);
  $('#container-courses').empty();
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
    displayCourseraResult(courseraResult);
});
}


//****************************************************//
//*****Displaying results
//****************************************************//

//*********Indeed.com Results***************//
var displayIndeedResult = function(gitHubResult) {
  console.log("gitHubResult");
  console.log(gitHubResult.length);
  if (gitHubResult.length > 0) {
    var aggregateDescription = "";
    for (var i = 0; i < gitHubResult.length;i++) {
        aggregateDescription += (gitHubResult[i].description + " ");
    };
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
    var wordCount = new Object();

    for (var i = 0; i < separateWords.length; i++) {
      var formatted = separateWords[i].toLowerCase();
      // making sure these are not stopwords and not sincle-letter words (need to fix: C++ etc.)
      if (stopWords.indexOf(formatted) === -1 && formatted.length !== 1) {
        if (wordCount.hasOwnProperty(formatted)) {
          wordCount[formatted] += 1;
        } else {
          // console.log("current word new: " + formatted);
          wordCount[formatted] = 1;
        } // end of if statement
      } // end of if statement
    } // end of for loop
    // sorting by frequency
    var sortable = [];
    for (var key in wordCount) {
      sortable.push([key, wordCount[key]]);
    }
    sortable.sort(function(a, b) {return b[1] - a[1]});
    //http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
    // publishing as a list
    $ulist_word = $('<ul>');
    for (var i = 0; i < 50; i++) {
      console.log(parseInt(sortable[i][1]));
      // var percent = parseInt(sortable[i][1]) / parseInt(totalWordsFound) * 100;
      var $listi_word = $('<li>');
      $listi_word.attr('id', sortable[i][0]);
      $listi_word.html(sortable[i][0] + " (" + sortable[i][1] + ")");
      $listi_word.click(function(event) {
        meetUpLocation(sortable[i][0]);
        callCoursera(sortable[i][0]);
      })
      $ulist_word.append($listi_word);
      // var $listi_count = $('<li>');
      // $listi_count.html();
      // $ulist_count.append($listi_count);
    }
    $('#container-jobs').append($ulist_word);

  } else {
    $('#container-jobs').append($('<div>').html("Ooops. No jobs found for your search. Try something else!"));
  }
} // end of displayIndeedResult

//*************MeetUp.com Results**************//
var displayMeetUpResult = function(meetUpResult) {
  // stupid workaround to get rid of a misidentified startup for japanese language
  meetUpResult = meetUpResult.filter(function(obj){
    if (obj.name.split(' ').indexOf("Japanese") > -1) {
      return false;
    } else {
      return true;
    }
  })
  $('#container-meetup').append($('<div>').html("Total MeetUps found: " + meetUpResult.length));
  console.log("meetUpResult");
  console.log(meetUpResult.length);
  console.log(meetUpResult);
  meetUpResult.splice(10,1000000);
  console.log(meetUpResult.length);
  if (meetUpResult.length > 0) {
    // meetUpGeolocation();
    var templateEl = $('#widget-meetup').html();
    var template = Handlebars.compile(templateEl);
    var html = template(meetUpResult);
    $('#container-meetup').append($('<div>').html(html));
  } else {
    $('#container-meetup').append($('<div>').html("Uh-oh. No MeetUps found for your search. Maybe you should <a href='https://secure.meetup.com/create/' target='_blank'>organize one</a>!"));
  } //end of checking whether there's anything returned
} // end of display meetup

//*************Coursera.org Results**************//
var displayCourseraResult = function(courseraResult) {
  console.log("courseraResult");
  console.log(courseraResult.length);
  courseraResult.splice(10,1000000);
  console.log(courseraResult.length);
  if (courseraResult.length > 0) {
    $('#container-courses').append($('<div>').html("Total Udacity courses found: " + courseraResult.length));
    var templateEl = $('#widget-courses').html();
    var template = Handlebars.compile(templateEl);
    var html = template(courseraResult);
    $('#container-courses').append($('<div>').html(html));
  } else {
    $('#container-courses').append($('<div>').html("Unfortunately there are no courses found for your search on Udacity. Check back later or try another search!"));
  }
} // end of displayCourseraResult
