

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
    $('#jumbotron').css("background-position", "0% 70%");
    $('#jumbotron-text').addClass("clicked");
    callGitHubJobs(searchTerm);
    // meetUpLocation(searchTerm);
    // callCoursera(searchTerm);
    $jobSearchInput.val("");
  })
  $('#clickmeabout').click(function(event) {
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
  // adding info clickability on labels
  $('#courses .clickinfo').click(function(event){
    var $newDiv = $('<div>');
    $newDiv.attr("class", "explain")
    $newDiv.html("Top keywords mentioned in job blurbs on <a href='https://jobs.github.com/'>GitHub Jobs</a> you can use in your resume to make it more relevant. Click on words to see corresponding meetups and courses. <br><br> [<u>Close</u>]");
    $("body").append($newDiv.hide().fadeIn(500));
    $newDiv.click(function(event) {
      if($newDiv.length) {
        $newDiv.remove();
      }
    })
  })
  $('#meetups .clickinfo').click(function(event){
    var $newDiv = $('<div>');
    $newDiv.attr("class", "explain")
    $newDiv.html("Upcoming Related Meetings from <a href='http://www.meetup.com/' target='_blank'>MeetUp.com</a> to attend to grow your network. <br><br> [<u>Close</u>]");
    $("body").append($newDiv.hide().fadeIn(3000));
    $newDiv.click(function(event) {
      if($newDiv.length) {
        $newDiv.remove();
      }
    })
  })
  $('#jobs .clickinfo').click(function(event){
    var $newDiv = $('<div>');
    $newDiv.attr("class", "explain")
    $newDiv.html("Top keywords mentioned in job blurbs on <a href='https://jobs.github.com/'>GitHub Jobs</a> you can use in your resume to make it more relevant. <br> Click on words to see corresponding meetups and courses. <br><br> [<u>Close</u>]");
    $("body").append($newDiv.hide().fadeIn(3000));
    $newDiv.click(function(event) {
      if($newDiv.length) {
        $newDiv.remove();
      }
    })
  })
}) // end of window onload


//****************************************************//
//Calling APIs
//****************************************************//

//***** call GITHUBJOBS for data ***********//
var callGitHubJobs = function(searchTerm) {
  // $('#container-jobs').empty();
  $('#container-jobs').html("<strong style='text-align:center; font-family:monospace'>Loading data...</strong>");
  var page = 0;
  var gitHubResult = [];
  var myIntervalID = window.setInterval(function() {
    $.ajax({
      url: 'https://jobs.github.com/positions.json?description=' + searchTerm + '&page=' + page, // page added because you can go further to next page https://jobs.github.com/positions.json?description=python&location=sf&full_time=true
      dataType: 'jsonp'
    }).done(function(gitHubResultPage) {
      console.log(gitHubResultPage);
      gitHubResult.push(gitHubResultPage);
      console.log(gitHubResult);
    }).fail(function(gitHubResultPage){
      console.log("error");
      console.log(gitHubResultPage);
    });
    page += 1;
    console.log(page);
    console.log(myIntervalID);
    if (page === 10) {
      clearInterval(myIntervalID);
      displayIndeedResult(gitHubResult, searchTerm);
    }
  }, 4000);


} // end of callGitHubJobs


//***** call MEETUP for data **************//
var meetUpLocation = function(searchTerm) {
  $('#container-meetup').html("<strong style='text-align:center; font-family:monospace'>Loading data...</strong>");
  navigator.geolocation.getCurrentPosition(function(pos) {
    var myLat = pos.coords.latitude;
    var myLon = pos.coords.longitude;
    callMeetUpCoord(myLat, myLon, searchTerm);
  },
  function(error) {
    var zipcode = prompt("Please specify your zipcode for Meetup search");
    callMeetUpZip(zipcode, searchTerm);
  });

}

var callMeetUpCoord = function(myLat, myLon, searchTerm) {
  $.ajax({
    url: 'https://api.meetup.com/2/open_events.json?text=' + searchTerm + '&lat=' + myLat + '&lon=' + myLon + '&time=,1w&category=34&key=' + meetUpAPI,
    dataType: 'jsonp'
  }).done(function(meetUpResult) {
    displayMeetUpResult(meetUpResult.results, searchTerm);
  }).fail(function(gitHubResult){
    console.log(meetUpResult);
  });
}

var callMeetUpZip = function(zip, searchTerm) {
  $.ajax({
    url: 'https://api.meetup.com/2/open_events.json?text=' + searchTerm + '&zip=' + zip + '&time=,1w&limited_events=true&category=34&key=' + meetUpAPI,
    dataType: 'jsonp'
  }).done(function(meetUpResult) {
    displayMeetUpResult(meetUpResult.results, searchTerm);
  }).fail(function(gitHubResult){
    console.log(meetUpResult);
  });
}

//***** call COURSERA for data **************//
var callCoursera = function(searchTerm) {
  $('#container-meetup').html("<strong style='text-align:center; font-family:monospace'>Loading data...</strong>");
  $.getJSON("https://www.udacity.com/public-api/v0/courses", function(data) {
    var courseraResult = data.courses.filter(function(obj) {
      if (obj.syllabus.toLowerCase().split(" ").indexOf(searchTerm) > -1) {
        return true
      } else {
        return false
      };
    });
    displayCourseraResult(courseraResult, searchTerm);
});
}


//****************************************************//
//*****Displaying results
//****************************************************//

//*********Indeed.com Results***************//
var displayIndeedResult = function(gitHubResult, searchTerm) {

  $('#container-jobs').empty();
  console.log("gitHubResult");
  console.log(gitHubResult);
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
    var cutOffArray = [];
    for (var i = 0; i < sortable.length; i++) {
      if (sortable[i][1] > 9) {
        cutOffArray.push(sortable[i]);
      }
    }
    $ulist_word = $('<div>');
    $ulist_word.attr("class", "wordcloud")
    $ulist_word.css("text-align","center")
    var biggestFont = cutOffArray[0][1];
    var topFont = 76;

    if (cutOffArray.length > 50) {
      var cutOff = 50;
    } else {
      var cutOff = cutOffArray.length;
    };
    for (var i = 0; i < cutOff; i++) {
      // var percent = parseInt(sortable[i][1]) / parseInt(totalWordsFound) * 100;
      var fontSize = (cutOffArray[i][1] / biggestFont) * topFont;
      // if ()
      var $listi_word = $('<span>');
      $listi_word.css("font-size", fontSize);
      $listi_word.attr('id', cutOffArray[i][0]);
      $listi_word.html(cutOffArray[i][0] + " ");
      $listi_word.click(function(event) {
        meetUpLocation(this.id);
        callCoursera(this.id);
      })
      // var random = Math.random();
      // if (random > 0.5) {
        $ulist_word.append($listi_word);
      // } else {
      //   $ulist_word.prepend($listi_word);
      // }

      // var $listi_count = $('<li>');
      // $listi_count.html();
      // $ulist_count.append($listi_count);
    }
    var $newDiv = $('<div>');
    $newDiv.attr("class","description");
    $('#container-jobs').append($newDiv.html("<p>These are the most frequent words that appear in job descriptions that mention \"<strong>" + searchTerm + "</strong>\" and that a <a href='http://lifehacker.com/5866630/how-can-i-make-sure-my-resume-gets-past-resume-robots-and-into-a-humans-hand' target='_blank'><u>resume screening software</u></a> may be likely to use to select candidates for further review. Make sure to include these in your resume and cover letter.</p> <p>Now <strong>explore how to acquire or improve any of these qualifications </strong> by attending relevant events or taking online classes. Clicking on any of the words or simply search for your main term:</p> <p style='text-align: center'><span style='font-family:monotype' class='clickable' id=" + searchTerm +"><strong> -- " + searchTerm.toUpperCase() + " -- </strong></span></p>" ));
    $(".clickable").click(function(event) {
      meetUpLocation(this.id);
      callCoursera(this.id);
      $('html, body').animate({
            scrollTop: $("#meetups").offset().top
        }, 2000);
    });
    $('#container-jobs').append($ulist_word);

  } else {
    $('#container-jobs').append($('<div>').html("Ooops. No jobs found for your search. Try something else!"));
  }
} // end of displayIndeedResult

//*************MeetUp.com Results**************//
var displayMeetUpResult = function(meetUpResult, searchTerm) {
  $('.meetupsANDcourses').css("display", "flex");
  // $('html, body').animate({
  //       scrollTop: $("#meetups").offset().top
  //   }, 2000);
  // var myId = document.getElementById('meetups');
  // myId.scrollIntoView();
  $('#container-meetup').empty();
  // stupid workaround to get rid of a misidentified startup for japanese language in js meetups
  meetUpResult = meetUpResult.filter(function(obj){
    if (obj.name.split(' ').indexOf("Japanese") > -1) {
      return false;
    } else {
      return true;
    }
  })

  var $newDiv = $('<div>');
  $newDiv.attr("class","total");
  $('#container-meetup').append($newDiv.html("Total MeetUps Found About " + searchTerm.toUpperCase() + ": " + meetUpResult.length));
  console.log("meetUpResult");
  console.log(meetUpResult);
  // showing only top ten results
  // meetUpResult.splice(10,1000000);
  //solution to display limited description

  if (meetUpResult.length > 0) {
    // meetUpGeolocation();
      for (var i = 0; i < meetUpResult.length; i++) {
        if (meetUpResult[i].hasOwnProperty('description')) {
          var reducedDescription = meetUpResult[i].description.replace(/<strong>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/strong>/igm, '');
          reducedDescription = reducedDescription.replace(/<i>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/i>/igm, '');
          reducedDescription = reducedDescription.replace(/<b>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/b>/igm, '');
          reducedDescription = reducedDescription.replace(/<li>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/li>/igm, '');
          reducedDescription = reducedDescription.replace(/<p>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/p>/igm, '');
          reducedDescription = reducedDescription.replace(/<ul>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/ul>/igm, '');
          reducedDescription = reducedDescription.replace(/<em>/igm, '');
          reducedDescription = reducedDescription.replace(/<\/em>/igm, '');
        reducedDescription = reducedDescription.slice(0,300);
        reducedDescription += "...";
        meetUpResult[i].description = reducedDescription;
        }
        var dateAndTime = new Date(meetUpResult[i].time);
        meetUpResult[i].time = dateAndTime;
    }

    var templateEl = $('#widget-meetup').html();
    var template = Handlebars.compile(templateEl);
    var html = template(meetUpResult);
    $('#container-meetup').append($('<div>').html(html));
  } else {
    $('#container-meetup').append($('<div>').html("Uh-oh. No MeetUps found for your search. Maybe you should <a href='https://secure.meetup.com/create/' target='_blank'>organize one</a>!"));
  } //end of checking whether there's anything returned
} // end of display meetup

//*************Coursera.org Results**************//
var displayCourseraResult = function(courseraResult, searchTerm) {
  $('.meetupsANDcourses').css("display", "flex");
  // var myId = document.getElementById('courses');
  // myId.scrollIntoView();
  $('html, body').animate({
        scrollTop: $("#courses").offset().top
    }, 2000);
  $('#container-courses').empty();
  console.log("courseraResult");
  console.log(courseraResult);
  // courseraResult.splice(10,1000000);
  if (courseraResult.length > 0) {
    var $newDiv = $('<div>');
    $newDiv.attr("class","total");
    $('#container-courses').append($newDiv.html("Total Udacity Courses Found About " + searchTerm.toUpperCase() + ": " + courseraResult.length));
    var templateEl = $('#widget-courses').html();
    var template = Handlebars.compile(templateEl);
    var html = template(courseraResult);
    $('#container-courses').append($('<div>').html(html));
  } else {
    $('#container-courses').append($('<div>').html("Unfortunately there are no courses found for your search on Udacity. Check back later or try another search!"));
  }
} // end of displayCourseraResult
