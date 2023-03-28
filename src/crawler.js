/*(function () {
  let httpRequest;

  $(document).ready(makeRequest);

  function makeRequest() {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert("Giving up :( Cannot create an XMLHTTP instance");
      return false;
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open("GET", './spec/crawlPageTest/test2.html');
    httpRequest.send();
  }

  function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var document = httpRequest.responseXML;
        _(document.querySelectorAll('a[href]')).map(function (element) {
          links.push(element.attributes.href.nodeValue);
        });
        console.log(document);
      }
    }
  }
})();*/
/*
var links = [];

(() => {
  let httpRequest;

  function makeRequest() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert("Giving up :( Cannot create an XMLHTTP instance");
      return false;
    }
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          var document = httpRequest.responseXML;
          //console.log(document.querySelectorAll('a[href]'));
          _(document.querySelectorAll('a[href]')).forEach(function (element) {
            links.push(element.attributes.href.nodeValue);
          });
          //console.log(document);
        }
      }
    };

    httpRequest.open("GET", './spec/crawlPageTest/test2.html');
    httpRequest.responseType = 'document';
    httpRequest.send();
  }

  makeRequest();
})();*/


var crawler = async function(url) {
  var res = [];

  //var isBreadthFirst = false;

  var stack = [url];
  var visited = new Set();
  visited.add(url);

  while (stack.length > 0) {
    var current = stack.pop();
    console.log('pop stack', stack);

    res.push(current);
    console.log('res', res);

    // Get content
    (() => {
      let httpRequest;

      var links = [];

      function makeRequest() {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
          alert("Giving up :( Cannot create an XMLHTTP instance");
          return false;
        }
        httpRequest.onreadystatechange = function() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              var document = httpRequest.responseXML;
              //console.log(document.querySelectorAll('a[href]'));
              _(document.querySelectorAll('a[href]')).forEach(function (element) {
                links.push(element.attributes.href.nodeValue);
                console.log(links);
              });
              //console.log(document);

              // console.log('case', links);

              links.forEach(function (e) {
                var currentLink = './spec/crawlPageTest/' + e;
                console.log(e);
                if (!visited.has(currentLink)) {
                  stack.push(currentLink);
                  visited.add(currentLink);
                  console.log('stack', stack);
                }
              });

            }
          }
        };

        httpRequest.open("GET", './spec/crawlPageTest/test2.html');
        httpRequest.responseType = 'document';
        httpRequest.send();
      }

      makeRequest();
      // console.log(links);

    })();
    /*for (var i = 0; i < links.length; i++) {
      console.log('a');
      var currentLink = './spec/crawlPageTest/' + links[x];
      if (!visited.has(currentLink)) {
        stack.push(currentLink);
        visited.add(currentLink);
      }
    }*/
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('res', res);
  return res;
};