# Monitor model performance, detect drift, alert and retrain
import numpy as np, pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from scipy.stats import ks_2samp
np.random.seed(42)

def metrics(m, X, y):
    p = m.predict(X)
    return {"Accuracy": accuracy_score(y, p), "Precision": precision_score(y, p),
            "Recall": recall_score(y, p), "F1": f1_score(y, p)}

# 1. Baseline data and model
X, y = make_classification(n_samples=5000, n_features=6, n_informative=4, class_sep=1.5, random_state=42)
X = pd.DataFrame(X, columns=[f"Feature_{i}" for i in range(1, 7)]); y = pd.Series(y)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(random_state=42).fit(X_train, y_train)
baseline = metrics(model, X_test, y_test)

# 2. Simulate production data with drift (shift 3 features, flip 15% of labels)
X_now = X_test.copy()
X_now[["Feature_1", "Feature_2", "Feature_3"]] = X_now[["Feature_1", "Feature_2", "Feature_3"]] * 1.5 + 1
y_now = y_test.copy()
flip = np.random.choice(len(y_now), int(0.15 * len(y_now)), replace=False)
y_now.iloc[flip] = 1 - y_now.iloc[flip]
current = metrics(model, X_now, y_now)

# 3. Compare performance and run KS test
print(pd.DataFrame({"Baseline": baseline, "Current": current}).round(4))
perf_drift = any(baseline[k] - current[k] > 0.05 for k in baseline)
drifted = [f for f in X.columns if ks_2samp(X_test[f], X_now[f])[1] < 0.05]
print("Features with drift (KS test):", drifted)

# 4. Alert and retrain
if perf_drift or drifted:
    print("ALERT: MODEL DRIFT DETECTED - retraining...")
    model = RandomForestClassifier(random_state=42).fit(pd.concat([X_train, X_now]), pd.concat([y_train, y_now]))
    print("Retrained:", {k: round(v, 4) for k, v in metrics(model, X_now, y_now).items()})
else:
    print("MODEL STATUS: STABLE")
