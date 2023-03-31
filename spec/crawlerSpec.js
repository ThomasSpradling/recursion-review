// A page object will consist up of a url,
const prefix = 'http://127.0.0.1:8080/spec/crawlPageTest/test';
const numToLink = (num) => {
  return prefix + num.toString() + '.html';
};
// Let n = keys.length. Takes in array with shape (m, n) and converts to array
// of objects with relavent keys and values
const numsToObj = (array, ...keys) => {
  const n = keys.length;
  return _(array).map((tuple) => {
    const res = {};
    for (var i = 0; i < n; i++) {
      res[keys[i]] = keys[i] === 'url' ? numToLink(tuple[i]) : tuple[i];
    }
    return res;
  });
}
const grabResult = (array, ...keys) => {
  if (keys.length !== 0) {
    var res = [];
    for (var i = 0; i < array.length; i++) {
      var temp = {};
      temp.url = results[array[i]].url;
      _(keys).each((key) => {
        temp[key] = results[array[i]][key];
      });
      res.push(temp);
    }
    return res;
  } else {
    return _(array).map(e => results[e].url);
  }
};

describe('crawler', function() {

  describe('Basic Traversal', function() {
    it('should traverse a basic graph', async function () {
      const input = 2;
      const result = await crawler(results[input].url);
      expect(grabResult([2,3])).to.eql(result);
    });

    it('should traverse a graph while avoiding broken links', async function () {
      const input = 1;
      const result = await crawler(results[input].url);
      expect(grabResult([1,2,3])).to.eql(result);
    });

    it('should return empty array when given a broken link', async function () {
      const input = 10;
      const result = await crawler(numToLink(input));
      expect(grabResult([])).to.eql(result);
    });

  });

  describe('Depth First Search Traversal', function () {
    it('should navigate via DFS a graph with cycles', async function () {
      const input = 4;
      const result = await crawler(numToLink(input));
      expect(grabResult([4,5,6,7,8,2,3])).to.eql(result);
    });

    it('should limit depth when set in config', async function () {
      let input = 4;
      let result = await crawler(numToLink(input), {limit: 2});
      expect(grabResult([4,5,6,2])).to.eql(result);

      input = 5;
      result = await crawler(numToLink(input), {limit: 2});
      expect(grabResult([5,6,7,2,3])).to.eql(result);

      input = 4;
      result = await crawler(numToLink(input), {limit: 1000});
      expect(grabResult([4,5,6,7,8,2,3])).to.eql(result);
    });

  });

  describe('Breadth First Search Traversal', function () {
    it('should navigate via BFS a graph with cycles', async function () {
      const input = 4;
      const result = await crawler(numToLink(input), {isBreadthFirst: true});
      expect(grabResult([4,5,2,6,3,7,8])).to.eql(result);
    });

    it('should limit depth when set in config', async function () {
      let input = 4;
      let result = await crawler(numToLink(input), {isBreadthFirst: true, limit: 2});
      expect(grabResult([4,5,2,6])).to.eql(result);

      input = 5;
      result = await crawler(numToLink(input), {isBreadthFirst: true, limit: 2});
      expect(grabResult([5,2,6,3,7])).to.eql(result);

      input = 4;
      result = await crawler(numToLink(input), {isBreadthFirst: true, limit: 100});
      expect(grabResult([4,5,2,6,3,7,8])).to.eql(result);
    });

  });

  describe('Web Scraping', function () {
    it('should get number of script tags when set in config', async function () {
      const input = 4;
      let result = await crawler(numToLink(input), {countScriptTags: true});
      expect(grabResult([4,5,6,7,8,2,3],'numberOfScriptTags')).to.eql(result);

      result = await crawler(numToLink(input), {countScriptTags: true, isBreadthFirst: true});
      expect(grabResult([4,5,2,6,3,7,8],'numberOfScriptTags')).to.eql(result);
    });

    it('should get external links of each webpage', async function () {
      const input = 4;
      let result = await crawler(numToLink(input), {getExternalLinks: true});
      expect(grabResult([4,5,6,7,8,2,3],'externalLinks')).to.eql(result);

      result = await crawler(numToLink(input), {getExternalLinks: true, isBreadthFirst: true});
      expect(grabResult([4,5,2,6,3,7,8],'externalLinks')).to.eql(result);
    });

    it('should get all at the same time', async function () {
      const input = 4;
      let result = await crawler(
          numToLink(input),
          {getExternalLinks: true, countScriptTags: true}
        );
      expect(grabResult([4,5,6,7,8,2,3],'externalLinks','numberOfScriptTags')).to.eql(result);

      result = await crawler(
        numToLink(input),
        {getExternalLinks: true, countScriptTags: true, isBreadthFirst: true}
      );
      expect(grabResult([4,5,2,6,3,7,8],'externalLinks','numberOfScriptTags')).to.eql(result);
    });
  });

});