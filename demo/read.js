var read = require('node-readability');

read('http://www.drugood.com/2019/02/14/gilead-nash-new-drug-selonsertib-first-phase-iii-clinical-failure/', function(err, article, meta) {
  // Main Article
  console.log(article.content)
  // Title
//  console.log(article.title)

  // HTML Source Code
//  console.log(article.html)
  // DOM
//  console.log(article.document)

  // Response Object from Request Lib
//  console.log(meta)

  // Close article to clean up jsdom and prevent leaks
  article.close()
})