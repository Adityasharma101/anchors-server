
const axios = require("axios");

const api = async(req,res)=>{
    try {
        // Extract the video URL from the request body
        const videoUrl = req.body.videoUrl;
    
        // Extract the video ID from the URL
        const videoId = getVideoIdFromUrl(videoUrl);
    
        if (!videoId) {
          return res.status(400).json({ error: "Invalid YouTube video URL" });
        }
        const apiKey = "AIzaSyCJDYmlIj_h8ptrnmkAOlNZz0LU67xU9_w";
    
        const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
        const videoResponse = await axios.get(videoApiUrl);
        const videoData = videoResponse.data.items[0];
    
        if (!videoData) {
          return res.status(404).json({ error: "Video not found" });
        }
    
        // Extract channel ID from video data
        const channelId = videoData.snippet.channelId;
    
        // Fetch data from the YouTube Data API for the channel to get subscriber count
        const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        const channelResponse = await axios.get(channelApiUrl);
        const channelData = channelResponse.data.items[0];
    
        if (!channelData) {
          return res.status(404).json({ error: "Channel not found" });
        }
    
        // Extract engagement metrics
        const subscriberCount = channelData.statistics.subscriberCount;
        const likes = videoData.statistics.likeCount;
        const comments = videoData.statistics.commentCount;
        const views = videoData.statistics.viewCount;
        
        const uploadedDate = new Date(videoData.snippet.publishedAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = uploadedDate.toLocaleDateString('en-US', options);
    
         // Access the video's thumbnails
         const thumbnails = videoData.snippet.thumbnails;
         const thumbnailUrl = thumbnails.default.url;
        
        // Get the video title from the snippet
        const videoTitle = videoData.snippet.title;
    
        // Earnings from the video
        const earnings = calculateEarnings(
          subscriberCount,
          likes,
          comments,
          views
        ).toLocaleString();
    
        // Return the engagement metrics and earning data as JSON
        res.json({
          earnings,
          subscriberCount,
          likes,
          comments,
          views,
          date,
          videoTitle,
          thumbnailUrl
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
}

// Helper function to extract video ID from a YouTube URL
function getVideoIdFromUrl(url) {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  }
  
  // Helper function to calculate earnings (replace with your formula)
  function calculateEarnings(subscriberCount, likes, comments, views) {
    return Math.min(subscriberCount, views) + 10 * comments + 5 * likes;
  }

module.exports = api;