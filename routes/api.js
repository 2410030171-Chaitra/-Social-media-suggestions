const express = require('express');
const router = express.Router();
const axios = require('axios');
const { default: axios } = require('axios');
require('dotenv').config();

// TikTok API (RapidAPI)
const TIKTOK_API_KEY = process.env.RAPIDAPI_KEY;
const TIKTOK_API_HOST = 'tiktok-video-no-watermark2.p.rapidapi.com';

// YouTube Data API
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Instagram Basic Display API
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// Twitter API v2
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Get all users from JSONPlaceholder
router.get('/users', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get weather by city
router.get('/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// Get news articles
router.get('/news', async (req, res) => {
    try {
        const { q = 'technology', pageSize = 5 } = req.query;
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${q}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

// Get random images from Unsplash
router.get('/images', async (req, res) => {
    try {
        const { query = 'nature', per_page = 10 } = req.query;
        const response = await axios.get(
            `https://api.unsplash.com/photos/random?query=${query}&count=${per_page}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});

// Get trending TikTok videos
router.get('/tiktok/trending', async (req, res) => {
    try {
        const { count = 5 } = req.query;
        const response = await axios.get(
            'https://tiktok-video-no-watermark2.p.rapidapi.com/feed/search',
            {
                params: { keywords: 'trending', count },
                headers: {
                    'X-RapidAPI-Key': TIKTOK_API_KEY,
                    'X-RapidAPI-Host': TIKTOK_API_HOST
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching TikTok videos:', error);
        res.status(500).json({ message: 'Error fetching TikTok videos' });
    }
});

// Search YouTube videos
router.get('/youtube/search', async (req, res) => {
    try {
        const { q = 'trending', maxResults = 5 } = req.query;
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    q,
                    maxResults,
                    type: 'video',
                    key: YOUTUBE_API_KEY
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        res.status(500).json({ message: 'Error searching YouTube' });
    }
});

// Get Instagram user media
router.get('/instagram/media', async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const response = await axios.get(
            `https://graph.instagram.com/me/media`,
            {
                params: {
                    fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
                    access_token: INSTAGRAM_ACCESS_TOKEN,
                    limit
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        res.status(500).json({ message: 'Error fetching Instagram media' });
    }
});

// Get Twitter timeline
router.get('/twitter/timeline', async (req, res) => {
    try {
        const { query = 'trending', max_results = 5 } = req.query;
        const response = await axios.get(
            'https://api.twitter.com/2/tweets/search/recent',
            {
                params: {
                    query,
                    max_results,
                    'tweet.fields': 'created_at,author_id,public_metrics',
                    'user.fields': 'name,username,profile_image_url'
                },
                headers: {
                    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Twitter timeline:', error);
        res.status(500).json({ message: 'Error fetching Twitter timeline' });
    }
});

module.exports = router;
