var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('🔥 Route "/" được gọi'); // in ra console khi truy cập
  res.send('Hello from index!');
});

module.exports = router;
