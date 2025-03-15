import torch
import torch.nn as nn
import torch.optim as optim
import pickle
from torch.utils.data import DataLoader
from dataset.dataset import ResumeDataset
from model import NeuralNet
from sklearn.feature_extraction.text import TfidfVectorizer


dataset = ResumeDataset("data/resume_data.json")

resume_texts = [text for text, _ in dataset]
labels = [label for _, label in dataset]


vectorizer = TfidfVectorizer()
X_train_tfidf = vectorizer.fit_transform(resume_texts).toarray()


with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)


X_train = torch.tensor(X_train_tfidf, dtype=torch.float32)
y_train = torch.tensor(labels, dtype=torch.long)


train_data = list(zip(X_train, y_train))
train_loader = DataLoader(train_data, batch_size=16, shuffle=True)


input_size = X_train.shape[1]
hidden_size = 32
output_size = len(dataset.categories)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


model = NeuralNet(input_size, hidden_size, output_size).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=1e-5)


num_epochs = 500
for epoch in range(num_epochs):
    for words, labels in train_loader:
        words, labels = words.to(device), labels.to(device)
        
        outputs = model(words)
        loss = criterion(outputs, labels)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    if (epoch + 1) % 100 == 0:
        print(f"Epoch {epoch+1}/{num_epochs}, Loss: {loss.item():.4f}")


torch.save(model.state_dict(), "resume_model.pth")
print("Model training complete. Saved as resume_model.pth")
