from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import shutil

app = FastAPI()

# Allow frontend requests from http://localhost:5173
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Received file: {file.filename}")
        if not file.filename.endswith(".xlsx"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only .xlsx files are allowed.")

        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File saved to: {file_path}")

        # Read the Excel file
        df = pd.read_excel(file_path)

        # Print available columns for debugging
        print("Available columns:", df.columns.tolist())

        # Define expected column names
        expected_columns = ["Title", "Views", "Likes", "Comments", "Description"]

        # Handle missing columns
        processed_data = {}
        for col in expected_columns:
            if col in df.columns:
                processed_data[col.lower()] = df[col].fillna("N/A").tolist()
            else:
                print(f"Warning: Column '{col}' is missing, filling with default values.")
                default_value = "N/A" if col in ["Title", "Description"] else 0
                processed_data[col.lower()] = [default_value] * len(df)

        # Rename keys to match frontend expectations
        response_data = {
            "labels": processed_data["title"],       # Rename "title" to "labels"
            "views": processed_data["views"],
            "likes": processed_data["likes"],
            "comments": processed_data["comments"],
            "descriptions": processed_data["description"]  # Rename "description" to "descriptions"
        }

        return {"filename": file.filename, **response_data}

    except Exception as e:
        print(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)