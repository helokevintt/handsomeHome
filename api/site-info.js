const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get('/api/site-info', async (req, res) => {
    try {
        const { url } = req.query;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const info = {
            icon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
            description: $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content')
        };
        
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 