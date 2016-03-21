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



// var $inputLoc = $('<input>');
// $inputLoc.attr('placeholder','search by location');
// $inputLoc.attr('id',"geosearchInput");
// // var $buttonLoc = $('<button>');
// // $buttonLoc.html("Get My Location");
// var $newDiv = $('<div>');
// $newDiv.attr('id','geosearch');
// $newDiv.append($inputLoc);
// $newDiv.append($('<p>').html(" OR "));
// $newDiv.append($buttonLoc);
// $('#container-meetup').append($newDiv);
// $('.geosearchInput').keypress(function(event){
//   if(e.keyCode == 13){
//     console.log('Enter was pressed');
// }
// });

// $.ajax ({
//   url: "https://www.udacity.com/public-api/v0/courses",
//   dataType: "jsonp"
// }).done(function(data){
//   console.log(data);
//   var courseraResult = data.courses.filter(function(obj) {
//     // console.log("filtering");
//     // console.log(obj);
//     // console.log(obj.syllabus);
//     if (obj.summary.toLowerCase().split(" ").indexOf(searchTerm) > -1) {
//       return true
//     } else {
//       return false
//     };
//     console.log("returning courseraResult " + courseraResult);
//     console.log(courseraResult);
//     displayCourseraResult(courseraResult);
//   })
// }).fail(function(data) {
//   console.log(data);
// })
