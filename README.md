Hello, welcome to the README file of a career development site created as part of a study project at General Assemby's WDI course.

# This app
is designed to give a user who is interested in starting or developing a career in tech a resume-building tool. It aggregates information from three APIs to provide a variety of resources:
- top job keywords
Based on response from jobs.github.com API, this app calculates the most frequent keywords encountered in relevant job descriptions (based on user's search input) and provides a word-cloud to the user. Each word in the word-cloud is clickable and is used to explore related meetups and online courses.
- relevant meetups in the area
Based on response from meetup.com's public events API, the app provides a list of relevant meetups in the user's area. The user's location is either determined automatically via the browser or, if location is not shared, manual input of zipcode is requested from the user.
- relevant courses on Udacity.com
Based on response from udacity.com's API, the site provides a list of relevant onlined courses.

Other specs of the app:
- the app uses two sets of Handlebars templates to display meetup and udacity events
- the uses a form to get search input from the user

# Completed app improvements:
- [x] display a message if no information is available
- [x] request user location for meetups from the user or from the browser
- [x] make title of meetup/course a link
- [x] add expandable info on each of the API's
- [x] add calculated total number of meetups and courses found
- [x] add and format ABOUT info
- [x] design improvements
- [x] make each term in wordcloud clickable to send a new API request
- [x] make meetup show only first paragraph of description and remove native html formatting
- [x] add and convert time of meetups
- [x] add message to show while API call is being process so that the user knows something is happening


# Further planned improvements:
- add pages to meetup results. Currently loads all results at once.
  - for udacity there are no additional pages as it calls the full list of Courses
  - for meetups there are multiple pages that can be displayed by using page= and offset= properties
- add more jobsearch data from GitHub of other sites
  - for gitHub potentially need to accumulate data from several requests to different pages before analyzing. The default request returns only 50 Jobs
  - maybe add other sites (unfortunately indeed.com API delivers abbreviated description info not suitable for analysis)
- add other online course sites (e.g., Coursera, edX.com, teamtreehouse, etc.)
- make mobile-friendly with @media
- make a wordcloud (on Canvas?) (http://wordcram.org/)
- make sure words from the same job description don't repeat
- work to reduce regular expressions code
