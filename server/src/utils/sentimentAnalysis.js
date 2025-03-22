import vader from "vader-sentiment";

function analyzeSentiment(text) {
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);

  let sentiment = "neutral";
  if (intensity.compound >= 0.05) {
    sentiment = "positive";
  } else if (intensity.compound <= -0.05) {
    sentiment = "negative";
  }

  return {
    score: intensity.compound,
    sentiment,
  };
}

export default analyzeSentiment;
