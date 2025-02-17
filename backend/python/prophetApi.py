from flask import Flask, request, jsonify
from prophet import Prophet
import pandas as pd

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    df = pd.DataFrame(data)
    df['ds'] = pd.to_datetime(df['ds'])
    df.rename(columns={'amount': 'y'}, inplace=True)

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    return jsonify(forecast[['ds', 'yhat']].tail(30).to_dict('records'))

if __name__ == "__main__":
    app.run(port=5000)
    