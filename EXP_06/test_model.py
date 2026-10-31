# Automated test - Jenkins runs this before building the Docker image
from model import train

def test_predictions():
    model = train()
    assert model.predict(["my payment failed"])[0] == "Billing"
    assert model.predict(["app crashes on login"])[0] == "Technical"
