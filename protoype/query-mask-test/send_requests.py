import requests
import json
import time

# --- Configuration ---

# The endpoint you are sending requests to
ENDPOINT_URL = "http://localhost:3000/api/search"

# The name of the JSON file containing your queries
# INPUT_FILE = "queries.json"
INPUT_FILE = "queries-varied.json"

# This is the static, base part of your request body.
# The 'query' and 'history' fields will be added from the file.
BASE_PAYLOAD = {
    "chatModel": {
        "providerId": "c0f6c638-5021-4577-a2f2-d685d42beba2",
        "key": "Qwen/Qwen3-Next-80B-A3B-Instruct"
    },
    "embeddingModel": {
        "providerId": "282cdd59-f49b-4995-8e79-ec3372096a07",
        "key": "Qwen/Qwen3-Embedding-0.6B"
    },
    "optimizationMode": "speed",
    "focusMode": "webSearch",
    "systemInstructions": "provide the answer one line and bullite points",
    "stream": False
}

# ---------------------

def load_queries(filename):
    """Loads the list of query/history objects from the JSON file."""
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
            if not isinstance(data, list):
                print(f"Error: Expected '{filename}' to contain a JSON list [ ... ]")
                return None
            return data
    except FileNotFoundError:
        print(f"Error: Input file '{filename}' not found.")
        print("Please create this file in the same directory.")
        return None
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{filename}'.")
        print("Please check the file for syntax errors.")
        return None

def send_request(item):
    """Constructs the full payload and sends a single POST request."""
    
    # Check if the required keys are in the item
    if 'query' not in item or 'history' not in item:
        print(f"Skipping item, missing 'query' or 'history': {item}")
        return

    # 1. Create a fresh copy of the base payload
    payload = BASE_PAYLOAD.copy()
    
    # 2. Add the dynamic parts from the file
    payload['query'] = item['query']
    payload['history'] = item['history']

    print(f"Sending request for query: \"{payload['query']}\"...")

    try:
        # 3. Send the POST request
        response = requests.post(ENDPOINT_URL, json=payload)
        
        # 4. Print the server's response
        print(f"  Status Code: {response.status_code}")
        
        # Try to print JSON response, or text if it's not JSON
        try:
            print(f"  Response: {response.json()}")
        except requests.exceptions.JSONDecodeError:
            print(f"  Response (text): {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"Error: Connection refused. Is your server at {ENDPOINT_URL} running?")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    """Main function to load queries and send them one by one."""
    print(f"Loading queries from {INPUT_FILE}...")
    query_list = load_queries(INPUT_FILE)
    
    if query_list:
        print(f"Found {len(query_list)} queries to send.")
        print("---")
        
        for i, item in enumerate(query_list):
            print(f"Processing item {i + 1} of {len(query_list)}")
            send_request(item)
            print("---")
            # Optional: add a delay between requests
            # time.sleep(1) 
            
        print("All requests processed.")

if __name__ == "__main__":
    main()