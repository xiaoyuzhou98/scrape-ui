import snscrape.modules.twitter as sntwitter
import sys

# Creating list to append tweet data to
tweets = []

# Using TwitterSearchScraper to scrape data and append tweets to list
for i,tweet in enumerate(sntwitter.TwitterSearchScraper('from:'+sys.argv[1]+' -filter:replies').get_items()):
    if i >= int(sys.argv[2]):
        break
#     attributes_container.append([tweet.user.username, tweet.date, tweet.likeCount, tweet.sourceLabel, tweet.content])
#     print(tweet.url)
    tweets.append(tweet.url)
# Creating a dataframe to load the list
# tweets_df = pd.DataFrame(attributes_container, columns=["User", "Date Created", "Number of Likes", "Source of Tweet", "Tweet"])
print(tweets)