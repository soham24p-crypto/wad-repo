# Trains a small text classifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

texts = ["payment failed", "refund not received", "card charged twice", "invoice wrong",
         "cannot login", "wifi not working", "app crashes", "password reset error",
         "need a new feature", "how do I use export", "where is the user guide", "question about plans"]
labels = ["Billing"] * 4 + ["Technical"] * 4 + ["General"] * 4

def train():
    return make_pipeline(TfidfVectorizer(), LogisticRegression()).fit(texts, labels)
