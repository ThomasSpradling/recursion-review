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
  var output = [];

  var config = config || {};
  const isBreadthFirst = config.isBreadthFirst || false;
  const countScriptTags = config.countScriptTags || false;
  const getExternalLinks = config.getExternalLinks || false;
  const limit = config.limit || 1000;

  var absoluteURL = new URL(url);

  var stack = [[url, 0]];
  var visited = new Set();
  visited.add(url);

  // Store an array so we can properly get order
  var res = [];

  while (stack.length > 0) {
    let a = isBreadthFirst ? stack.shift() : stack.pop();
    let currentUrl = a[0];
    let level = a[1];

    if (!(currentUrl in output)) {
      output[currentUrl] = {};
    }

    let resp;
    try {
      resp = await sendRequest('GET', currentUrl);
    } catch {
      continue;
    }
    let links = [];

    res.push(currentUrl);

    // Update number of script tags
    // httpResponse will add a script tag to the document
    if (countScriptTags) {
      output[currentUrl].numberOfScriptTags = resp.querySelectorAll('script').length - 1;
    }

    // Initialize the output properties
    if (getExternalLinks) {
      output[currentUrl].externalLinks = [];
    }

    // Get content
    _(resp.querySelectorAll('a[href]')).forEach(function (element) {
      links.push(element.href);
    });

    if (level >= limit) {
      continue;
    }

    // Loop to add the next links to the stack
    _(links).forEach(function (link) {
      if (!visited.has(link)) {
        if (link.startsWith(absoluteURL.origin)) {
          visited.add(link);
          stack.push([link, level + 1]);
        } else {
          if (getExternalLinks) {
            output[currentUrl].externalLinks.push(link);
          }
        }
      }
    });
  }

  if (!(getExternalLinks || countScriptTags)) {
    return res;
  }

  var total = [];

  _(res).each(function(current) {
    var obj = output[current];
    obj.url = current;
    total.push(obj);
  });

  return total;
};