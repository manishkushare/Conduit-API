const express = require('express');
const router = express.Router();
const Article = require('../models/ArticleV1');
router.get('/', async (req,res,next)=> {
    try {
        const tags = await Article.distinct('taglist');
        return res.json({tags});
    } catch (error) {
        next(error);
    }
})

module.exports = router;