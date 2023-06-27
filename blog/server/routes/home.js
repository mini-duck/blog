const express = require('express');
const router = express.Router();

router.get('/home/get', (req, res) => {
    res.send('api接口')
})

module.exports = router;