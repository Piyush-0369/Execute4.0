import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

#nltk.download('punkt')
#nltk.download('wordnet')
#nltk.download('stopwords')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def tokenize(sentence):
   
    return word_tokenize(sentence)

def lemmatize(word):
   
    return lemmatizer.lemmatize(word.lower())

def preprocess_text(sentence):
    
    tokenized = tokenize(sentence)
    return [lemmatize(word) for word in tokenized if word.isalnum() and word.lower() not in stop_words]

def bag_of_words(tokenized_sentence, words):
    sentence_words = set(preprocess_text(" ".join(tokenized_sentence)))
    return np.array([1 if w in sentence_words else 0 for w in words], dtype=np.float32)
