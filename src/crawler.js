var sendRequest = function (method, url) {
  return new Promise((resolve, reject) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(method, url);
    httpRequest.responseType = 'document';
    httpRequest.onload = function () {
      if (
        httpRequest.readyState === XMLHttpRequest.DONE &&
        httpRequest.status === 200
      ) {
        resolve(this.responseXML);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    httpRequest.send();
  });
};

var crawler = async function (url, config) {
  var output = {};

  var config = config || {};
  var isBreadthFirst = config.isBreadthFirst || false;

  var absoluteURL = new URL(url);

  var stack = [url];
  var visited = new Set();
  visited.add(url);

  var res = [];

  while (stack.length > 0) {
    let currentUrl;
    if (!isBreadthFirst) {
      currentUrl = stack.pop();
    } else {
      currentUrl = stack.shift();
    }

    if (!(currentUrl in output)) {
      output[currentUrl] = {};
    }


    // Initialize the output properties
    output[currentUrl].externalLinks = [];
    output[currentUrl].numberOfScriptTags = 0;

    const resp = await sendRequest('GET', currentUrl);
    let links = [];

    // console.log(currentUrl, absoluteURL.origin, currentUrl.startsWith(absoluteURL.origin));
    res.push(currentUrl);

    // Update number of script tags
    // httpResponse will add a script tag to the document
    output[currentUrl].numberOfScriptTags += resp.querySelectorAll('script').length - 1;

    // Get content
    _(resp.querySelectorAll('a[href]')).forEach(function (element) {
      links.push(element.href);
    });
    _(links).forEach(function (link) {
      if (!visited.has(link)) {
        if (link.startsWith(absoluteURL.origin)) {
          visited.add(link);
          stack.push(link);
        } else {
          output[currentUrl].externalLinks.push(link);
        }
      }
    });
  }
  return output;
};