var streetAPIUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=';
var nytimesAPIUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?' +
    'sort=newest&api-key=8f7a087ee63877bc8fbd990b7cd2ecf0:4:75119495&q=';
var wikiAPIUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search' +
    '&srsearch=';
var wikiPageUrl = 'https://en.wikipedia.org/wiki/';
function loadData() {

    var $body = $('body');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $bgImg = $('#bgimg');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $('#street').val();
    var city = $('#city').val();
    var fullAddress = street + ', ' + city;
    $greeting.text('So you wanna live at ' + fullAddress + '?');
    $bgImg.attr('src', streetAPIUrl + fullAddress);

    // Perform Ajax request to NY Times Articles
    var nyUrl = nytimesAPIUrl + city;
    $.getJSON(nyUrl, function(data) {
        if(data.status != 'OK') {
            $nytHeaderElem.text('Couldn\'t load data from NY Times!');
            return;
        }

        $nytHeaderElem.text('New York Times Articles about ' + city);
        data.response.docs.forEach(function(doc) {
            var $article = $('<li class="article"></li>');
            $article.append('<a href="' + doc.web_url + '">' + doc.headline.main + '</a>');
            $article.append('<p>' + doc.snippet + '</p>');
            $nytElem.append($article);
        });
    }).error(function() {
        $nytHeaderElem.text('NY Times Articles could not be retreived');
        $nytElem.empty();
    });

    // Perform Ajax request to Media Wiki API
    var wikiUrl = wikiAPIUrl + encodeURI(city);
    $.ajax({
        type: 'GET',
        url: wikiUrl + '&callback=?',
        contentType: 'application/json; charset=utf-8',
        dataType: 'jsonp',
        success: function(data) {
            data.query.search.forEach(function(article) {
                var url = wikiPageUrl + article.title.replace(/\s+/g, '_');
                var $link = $('<li></li>');
                $link.append('<a href="' + url + '">' + article.title + '</a>');
                $wikiElem.append($link);
            })
        },
        error: function(e) {
            console.log(e);
            $wikiHeaderElem.text('Wikipedia Articles Could not be retreived');
            $wikiElem.empty();
        }
    });
    return false;
};

$('#form-container').submit(loadData);
