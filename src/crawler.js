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

/*
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
    for (var i = 0; i < links.length; i++) {
      console.log('a');
      var currentLink = './spec/crawlPageTest/' + links[x];
      if (!visited.has(currentLink)) {
        stack.push(currentLink);
        visited.add(currentLink);
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('res', res);
  return res;
};*/

/*
async function crawlPage(currentURL) {
  console.log('actively crawling: ' + currentURL);

  const resp = await fetch(currentURL);

  const pages = await resp.text();
}

var result = crawlPage('./spec/crawlPageTest/test2.html');
console.log(result);*/

function extractLinks(html, currentURL) {
  const links = [];
  const url = new URL(currentURL);

  // Find all anchor tags and extract their href attribute
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    const absoluteURL = new URL(href, currentURL).href;

    // Only add the link if it's on the same domain and hasn't been seen before
    if (absoluteURL.startsWith(url.origin) && !links.includes(absoluteURL)) {
      links.push(absoluteURL);
    }
  }

  return links;
}


async function crawlPage(baseURL) {
  const stack = [baseURL];
  const visited = new Set();

  const res = [];
  visited.add(baseURL);

  while (stack.length > 0) {
    var currentURL = stack.pop();

    res.push(currentURL);

    const resp = await fetch(currentURL);
    const htmlBody = await resp.text();
    const nextURLs = extractLinks(htmlBody, currentURL);


    for (const nextURL of nextURLs) {
      if (!visited.has(nextURL)) {
        stack.push(nextURL);
        visited.add(nextURL);
      }
    }
  }
  return res;
}

async function crawler(baseURL) {
  const pages = await crawlPage(baseURL);

  return pages;
}

/*

  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  if (pages[currentURL] > 0) {
    pages[currentURL]++;
    return pages;
  }

  pages[currentURL] = 1;
  console.log('actively crawling: ' + currentURL);

  const resp = await fetch(currentURL);

  const htmlBody = await resp.text();

  const nextURLs = extractLinks(htmlBody, baseURL);

  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;*/

/*

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  if (pages[currentURL] > 0) {
    pages[currentURL]++;
    return pages;
  }

  pages[currentURL] = 1;
  console.log('actively crawling: ' + currentURL);

  const resp = await fetch(currentURL);

  const htmlBody = await resp.text();

  const nextURLs = extractLinks(htmlBody, baseURL);

  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;
}

*/