function getCreditsAndCycle(url) {
    var cache = CacheService.getScriptCache();
    var cached = cache.get(url);
    if (cached != null) {
      return JSON.parse(cached);
    }
    try {
      var result = UrlFetchApp.fetch(url);
      var content = result.getContentText();
      const $ = Cheerio.load(content);
      const credits = $('.specDefinition').eq(2).text();
      let cycle = $('.specDefinition').eq(3).text().trim().replace(/cycles?/gi, "");
      cycle = cycle.charAt(0).toUpperCase() + cycle.slice(1);
      cache.put(url, JSON.stringify([credits, cycle]), 1500);
      return [credits, cycle];
    } catch (e) {
      return [null, null];
    }
  }