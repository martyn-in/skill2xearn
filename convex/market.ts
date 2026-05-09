import { action } from "./_generated/server";

export const fetchRealtimeTrends = action({
  args: {},
  handler: async (ctx) => {
    try {
      // Fetch top stories from Hacker News
      const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const storyIds = await res.json();
      
      let aiMentions = 0;
      let financeMentions = 0;
      let techMentions = 0;
      const recentAiNews = [];
      
      // Analyze the top 50 stories to gauge real-time market interest
      const promises = storyIds.slice(0, 50).map(id => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
      );
      
      const stories = await Promise.all(promises);
      
      stories.forEach(story => {
        if (!story || !story.title) return;
        const title = story.title.toLowerCase();
        
        // Count AI trends
        if (title.match(/\b(ai|llm|gpt|openai|machine learning|claude|gemini)\b/)) {
            aiMentions++;
            recentAiNews.push({ title: story.title, url: story.url });
        }
        
        // Count Finance/Crypto trends
        if (title.match(/\b(finance|crypto|bitcoin|market|stock|trading|bank|economy)\b/)) {
            financeMentions++;
        }
        
        // Count general tech/software
        if (title.match(/\b(tech|software|dev|programming|app|web|cloud)\b/)) {
            techMentions++;
        }
      });
      
      // Calculate a dynamic market pulse score based on real-time discussion density
      const currentAIIndex = 140 + (aiMentions * 8); // Base 140 + dynamic score
      const financeImpact = 60 + (financeMentions * 5);
      const techImpact = 70 + (techMentions * 2);
      
      return {
        success: true,
        metrics: {
            aiMentions,
            financeMentions,
            techMentions,
            currentAIIndex,
            financeImpact,
            techImpact
        },
        recentAiNews: recentAiNews.slice(0, 3) // Top 3 AI news
      };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }
});
