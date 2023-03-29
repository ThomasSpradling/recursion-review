// A page object will consist up of a url,

describe('crawler', function() {

  it('should return only one link on a page without links', async function () {
    var baseURL = 'http://127.0.0.1:8080/spec/crawlPageTest/test1.html';
    var expected = ['http://127.0.0.1:8080/spec/crawlPageTest/test1.html'];

    var result = await crawler(baseURL);

    expect(result).to.eql(expected);
  });

  it('should return links that are deep', async function () {

    var baseURL = 'http://127.0.0.1:8080/spec/crawlPageTest/test9.html';
    var expected = [
      'http://127.0.0.1:8080/spec/crawlPageTest/test9.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test2.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test5.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test4.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test3.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test1.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test8.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test6.html'
    ];


    var result = await crawler(baseURL);

    console.log('BFS', result);
    console.log(expected);

    expect(result).to.eql(expected);

  });

  it('should handle case where there is a link to itself', async function () {
    var baseURL = 'http://127.0.0.1:8080/spec/crawlPageTest/test6.html';
    var expected = [
      'http://127.0.0.1:8080/spec/crawlPageTest/test6.html'
    ];

    var result = await crawler(baseURL);

    expect(result).to.eql(expected);
  });


  it('should not click on external links', async function () {

    var baseURL = 'http://127.0.0.1:8080/spec/crawlPageTest/test7.html';
    var expected = [
      'http://127.0.0.1:8080/spec/crawlPageTest/test7.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test6.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test5.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test4.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test3.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test2.html',
      'http://127.0.0.1:8080/spec/crawlPageTest/test1.html'
    ];

    var result = await crawler(baseURL);

    expect(result).to.eql(expected);
  });

  // Config cases
  it('should correctly count number of script tags, distrinct attributes, and external links', function() {
    var result = crawler('./spec/crawlPageTest/test7.html', {countScriptTags: true, getDistinctAttributes: true, getExternalLinks: true});
    var expected = [
      {url: 'test7.html', scriptTags: 1,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name'], externalLinks: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ']},

      {url: 'test1.html', scriptTags: 3,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name', 'data'], externalLinks: []},

      {url: 'test2.html', scriptTags: 0,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name'], externalLinks: []},

      {url: 'test3.html', scriptTags: 0,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name'], externalLinks: []},

      {url: 'test5.html', scriptTags: 0,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name'], externalLinks: []},

      {url: 'test4.html', scriptTags: 2,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name'], externalLinks: []},

      {url: 'test6.html', scriptTags: 0,
        distinctAttribues: ['lang', 'charset', 'http-equiv', 'content', 'name', 'data'], externalLinks: []}
    ];
    expect(result).to.eql(expected);
  });

  it('should correctly count number of script tags in isolation', function() {
    var result = crawler('./spec/crawlPageTest/test7.html', {countScriptTags: true, getDistinctAttributes: true, getExternalLinks: true});
    var expected = [
      {url: 'test7.html', scriptTags: 1},

      {url: 'test1.html', scriptTags: 3},

      {url: 'test2.html', scriptTags: 0},

      {url: 'test3.html', scriptTags: 0},

      {url: 'test5.html', scriptTags: 0},

      {url: 'test4.html', scriptTags: 2},

      {url: 'test6.html', scriptTags: 0}
    ];
    expect(result).to.eql(expected);
  });

  it('should crawl breadth-first when told to', function() {
    var result = crawler('./spec/crawlPageTest/test7.html', {crawlBreadthFirst: true});
    var expected = ['test7.html', 'test1.html', 'test2.html', 'test3.html', 'test4.html', 'test5.html', 'test6.html', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'];
    expect(result).to.eql(expected);
  });

});