from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet

app = Flask(__name__)

# Function to load CSV file and train the model
def train_model():
    try:
        # Load dataset (ensure 'dataset.csv' exists in the same directory)
        df = pd.read_csv("dataset.csv")
        
        # Ensure correct column names
        df.columns = ['ds', 'y']  # 'ds' = date, 'y' = value (e.g., expenses)
        
        # Convert 'ds' to datetime format
        df['ds'] = pd.to_datetime(df['ds'], dayfirst=True)
        
        # Initialize and train Prophet model
        model = Prophet()
        model.fit(df)
        return model
    except Exception as e:
        print(f"Error training model: {e}")
        return None

# Train the model when the server starts
model = train_model()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model was successfully trained
        if model is None:
            return jsonify({"error": "Model training failed. Check dataset."}), 500
        
        # Get the number of months from user input
        data = request.get_json()
        num_months = data.get("num_months", 1)  # Default to 1 month if not provided
        
        if not isinstance(num_months, int) or num_months <= 0:
            return jsonify({"error": "Invalid input. 'num_months' must be a positive integer."}), 400
        
        # Make future predictions
        future = model.make_future_dataframe(periods=num_months * 30)  # Convert months to days
        forecast = model.predict(future)
        
        # Convert 'ds' column to datetime format
        forecast['ds'] = pd.to_datetime(forecast['ds'])
        
        # Group by month and format output
        grouped_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(num_months * 30).groupby(forecast['ds'].dt.strftime('%B %Y'))

        monthly_summary = []
        
        for month, group in grouped_data:
            month_data = {
                "month": month,  # Example: "February 2025"
                "total_expenses": round(group['yhat'].sum(), 2),
                "max_expenses": round(group['yhat'].max(), 2),
                "min_expenses": round(group['yhat'].min(), 2),
                "daily_predictions": group[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
            }
            monthly_summary.append(month_data)
        
        return jsonify(monthly_summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)




# from flask import Flask, request, jsonify

# app = Flask(__name__)

# @app.route('/predict', methods=['GET'])
# def predict():
#     # Example: Simulating a prediction response
#     response = {"message": "Prediction successful!", "result": 42}
#     return jsonify(response)

# if __name__ == '__main__':
#     app.run(debug=True)