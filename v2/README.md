The idea is to give a user a career development tool / resource aggregator tailorable for a specific job/profession.

Step 1: Search for a job position/profession
API: Indeed.com OR jobs.github.com.
User can search for job positions based on a keyword. Ideally what they get back is not just a list of vacancies but some sort of data product, for example, a list of most frequent words that appear in the job description (hopefully these would be skills). I'm not sure if this would be doable because the snippets they provide in the object are pretty limited and this might not work.

Step 2. Search for relevant events/meetups
API: Meetup.com
If am able to get a list of skill keywords from #1, I would like to let users explore open meetups based on those words around them so they can start building their network. If not, I can use the same user search request as for jobs to display relevant meetups.

Step 3. (If I have time) Search for relevant online courses
API: Coursera.com
Same as with meetups, users can explore relevant free online classes to start building relevant skills.



Improvements:
[x] - display a message if there is nothing available
[x] meetup city/Location
[x] make title of meetup/course a link
[x] make labels clearly
[x] total positions/etc found...
[x] add ABOUT info
[x] format about info
[x] make background take fullscreen (650)

ALTERNATIVE DESIGN
[x] hyperlinks for search terms
[x] hide explanations
- make meetup show only first paragraph of description
- make mobile-friendly with @media
- time of meetups
- waiting message for ajax
- make a wordcloud (canvas?) http://wordcram.org/
- dropdown on number of terms to display

ADVANCED:
- connect more apis

- make sure words from the same position don't repeat
- have it display % of words, not numbers
- replace regular expressions with < * >
