import os
import json
import time
import openai
import cv2
import requests
import dropbox
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from bs4 import BeautifulSoup
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)



# Load environment variables from .env file
load_dotenv()

# Configure OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

# Configure Dropbox API key
DROPBOX_ACCESS_TOKEN = os.getenv('DROPBOX_ACCESS_TOKEN')

# Initialize Dropbox client
dbx = dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)


# Function to extract images from a URL
def extract_images_from_url(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.content, "html.parser")
        img_tags = soup.find_all("img")

        image_urls = []
        for img in img_tags:
            src = img.get("src")
            if src and src.startswith("http"):
                image_urls.append(src)

        return image_urls
    except Exception as e:
        print(f"Error extracting images from URL: {e}")
        return []

# Function to download and save an image locally
def download_image(image_url, output_dir="downloads"):
    try:
        os.makedirs(output_dir, exist_ok=True)
        response = requests.get(image_url, stream=True, timeout=10)
        if response.status_code == 200:
            filename = os.path.join(output_dir, secure_filename(image_url.split("/")[-1]))
            with open(filename, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return filename
    except Exception as e:
        print(f"Error downloading image: {e}")
    return None

# Function to process an image (resize to Amazon's recommended dimensions)
def process_image(image_path, output_dir="processed"):
    try:
        os.makedirs(output_dir, exist_ok=True)
        image = cv2.imread(image_path)
        resized_image = cv2.resize(image, (1000, 1000))
        output_path = os.path.join(output_dir, os.path.basename(image_path))
        cv2.imwrite(output_path, resized_image)
        return output_path
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

# Function to upload a file to Dropbox
def upload_to_dropbox(file_path, dropbox_folder="/"):
    try:
        with open(file_path, "rb") as f:
            filename = os.path.basename(file_path)
            dropbox_path = os.path.join(dropbox_folder, filename)
            dbx.files_upload(f.read(), dropbox_path, mode=dropbox.files.WriteMode("overwrite"))
        return f"https://www.dropbox.com/home{dropbox_path}?preview={filename}"
    except Exception as e:
        print(f"Error uploading to Dropbox: {e}")
        return None

# Function for Amazon Listing Generation
def generate_amazon_listing(content, platform):
    try:
        platform_specific_prompt = ""

        if platform.lower() == "instagram":
            platform_specific_prompt = f"The content is an Instagram caption: {content}"
        elif platform.lower() == "facebook":
            platform_specific_prompt = f"The content is a Facebook post: {content}"
        elif platform.lower() == "twitter":
            platform_specific_prompt = f"The content is a Tweet: {content}"
        elif platform.lower() == "linkedin":
            platform_specific_prompt = f"The content is a LinkedIn post: {content}"
        else:
            platform_specific_prompt = f"The content is a generic social media post: {content}"

        prompt = f"""
        Generate an Amazon product listing based on this social media content: 
        {platform_specific_prompt}

        Include:
        - Compelling product title
        - Detailed product description
        - Estimated competitive pricing
        - 3-5 key product features

        Response must be valid JSON with keys: title, description, price, features
        """
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert e-commerce product copywriter."},
                {"role": "user", "content": prompt}
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Listing generation error: {e}")
        return {
            "title": "Sample Product",
            "description": "Generated product description",
            "price": "49.99",
            "features": ["Feature 1", "Feature 2"]
        }

# API Endpoint: Generate Listing and Extract Images
@app.route('/api/generate-listing', methods=['POST'])
def generate_listing_endpoint():
    data = request.json
    content = data.get('content')
    platform = data.get('platform')

    if not content or not platform:
        return jsonify({"error": "Missing content or platform"}), 400

    # Generate the Amazon listing
    listing = generate_amazon_listing(content, platform)

    # Extract images from the provided content URL
    image_urls = extract_images_from_url(content)
    uploaded_images = []

    for image_url in image_urls:
        downloaded_image = download_image(image_url)
        if downloaded_image:
            processed_path = process_image(downloaded_image)
            if processed_path:
                dropbox_url = upload_to_dropbox(processed_path)
                if dropbox_url:
                    uploaded_images.append(dropbox_url)

    listing["images"] = uploaded_images
    return jsonify(listing)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
