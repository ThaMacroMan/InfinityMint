from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
from openai import OpenAI
import logging

app = Flask(__name__)

openai_api_key = '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'


# Configuration for image uploads
UPLOAD_FOLDER = 'uploads/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# OpenAI client initialization
client = OpenAI(
    api_key=openai_api_key
)

@app.route('/dalle3', methods=['GET', 'POST'])
def dalle3():
    image_urls = []  # Create a list to store image URLs

    if request.method == 'POST':
        prompt = request.form.get('prompt')
        size = request.form.get('size')
        quality = request.form.get('quality')
        n = request.form.get('n')
        model = request.form.get('model')  # Added model selection input

        # Log the received parameters
        logging.info(f"Received parameters: prompt='{prompt}', size='{size}', quality='{quality}', n='{n}', model='{model}'")

        if prompt and model:
            try:
                if n is None:
                    # Set n to 1 by default
                    n = 1
                else:
                    n = int(n)
                
                if model == 'dall-e-2':
                    model_name = 'dall-e-2'
                elif model == 'dall-e-3':
                    model_name = 'dall-e-3'
                else:
                    return 'Invalid model selection', 400

                response = client.images.generate(
                    model=model_name,  # Use the selected model
                    prompt=prompt,
                    size=size,
                    quality=quality,
                    n=n,  # Use the selected value of n
                )

                # Extract and store all image URLs in the list
                image_urls = [image_data.url for image_data in response.data]

                # Log successful image generation
                logging.info(f"Images generated with URLs: {', '.join(image_urls)}")
            except Exception as e:
                # Log any exceptions
                logging.error(f'Failed to generate image: {str(e)}', exc_info=True)

                return f'Failed to generate image: {str(e)}', 500

    return render_template('dalle3.html', image_urls=image_urls)  # Pass the list of image URLs to the template

# Function to call GPT-3.5 and generate a random prompt
@app.route('/generate-random-prompt', methods=['GET'])
def generate_random_prompt_route():
    # Call the generate_random_prompt function to get a random prompt
    random_prompt_string = generate_random_prompt()
    return random_prompt_string

def generate_random_prompt():
    try:
        # Call GPT-3.5 to generate a random prompt
        response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        max_tokens= 64,
        temperature=1.5,
        streaming=True,
        messages=[
            {"role": "system", "content": "Max 64 tokens. Only return the prompt itself without mentioning it is a prompt. Maximize Dalle Performance and showcase incredible AI Art"},
            {"role": "user", "content": "Create a prompt that is random and creates nature-esque images. "}
        ]
        )

        # Extract the generated prompt
        random_prompt = response.choices[0].message.content
        print(random_prompt)
        # Log the generated random prompt
        random_prompt_string = str(random_prompt)
        return random_prompt_string


    except Exception as e:
        # Log any exceptions
        logging.error(f'Failed to generate random prompt: {str(e)}', exc_info=True)
        return "Failed to generate random prompt."


if __name__ == "__main__":
    # run app in debug mode on port 5000
    app.run(port=5001)
