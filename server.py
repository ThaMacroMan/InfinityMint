from flask import Flask, request, jsonify
from openai import OpenAI
import logging
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "http://localhost:3000, /api/, https://oaidalleapiprodscus.blob.core.windows.net"}})


openai_api_key = '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'

# OpenAI client initialization
client = OpenAI(api_key=openai_api_key)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.route('/dalle3_api', methods=['POST', 'GET'])  # Allow both POST and GET requests
def dalle3():
    image_urls = []  # Create a list to store image URLs

    if request.method == 'POST':
        prompt = request.form.get('prompt')
        size = request.form.get('size')
        quality = request.form.get('quality')
        n = request.form.get('n')
        model = request.form.get('model')

        # Log the received parameters
        logger.info(f"Received parameters: prompt='{prompt}', size='{size}', quality='{quality}', n='{n}', model='{model}'")

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
                    model=model_name,
                    prompt=prompt,
                    size=size,
                    quality=quality,
                    n=n,
                )
                # Summarize the given prompt
                summarized_prompt = summarize_prompt(prompt)
                # Extract and store all image URLs in the list
                image_urls = [image_data.url for image_data in response.data]

                # Log successful image generation
                logger.info(f"Images generated with URLs: {', '.join(image_urls)}")

                # Return the image URLs as JSON
                return jsonify({'image_urls': image_urls, 'summarized_prompt': summarized_prompt})
            except Exception as e:
                # Log any exceptions
                logger.error(f'Failed to generate image: {str(e)}', exc_info=True)
                return jsonify({'error': f'Failed to generate image: {str(e)}'}), 500

    elif request.method == 'GET':
        # Handle GET requests separately, if needed
        # For example, you can return a message or data for GET requests
        return jsonify({'message': 'This is a GET request response'})

    return jsonify({'error': 'Invalid request'}), 400
# WORKING HERE. CANNOT FIGURE OUT HOW TO RETURN BOTH IMAGE AND PROMPT FROM SECOND FUNCTION BELOW
# I THINK I JUST GOTTA INTEGRATE BELOW INTO ABOVE AND RETURN
def summarize_prompt(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            max_tokens= 50,
            temperature=0.5,
            messages=[
                {"role": "system", "content": "Summarize the given prompt into a short epic name."},
                {"role": "system", "content": "Only include the name itself in the output. Ensure no text or quotes in the image. Max 50 tokens"},
                {"role": "system", "content": "Example Name: Crystal World: Orbiting Alien Planet"},
                {"role": "user", "content": prompt}
            ]
        )

        summarized_prompt = response.choices[0].message.content
        print(summarized_prompt)
        return summarized_prompt

    except Exception as e:
        logger.error(f'Failed to summarize prompt: {str(e)}', exc_info=True)
        return "Failed to summarize prompt."

@app.route('/generate-random-prompt', methods=['GET', 'POST'])
def generate_random_prompt():
    try:
        # Call GPT-3.5 to generate a random prompt
        response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        max_tokens= 70,
        temperature=.5,
        messages=[
            {"role": "system", "content": "You make random Dalle prompts that create incredible outputs and utilize dalle to its limits"},
            {"role": "system", "content": "Only include the prompt itself in the output. Ensure no text or quotes in the image. Max 70 tokens"},
            {"role": "system", "content": "Example prompt: a surreal cyberpunk cityscape with neon lights, flying cars, and towering skyscrapers reflecting a digital sunset"},
            {"role": "user", "content": "Make me a dalle prompt that is random and futuristic."}
        ]
        )
        # Extract the generated prompt
        random_prompt = response.choices[0].message.content
        print(random_prompt)
        return random_prompt

    except Exception as e:
        # Log any exceptions
        logging.error(f'Failed to generate random prompt: {str(e)}', exc_info=True)
        return "Failed to generate random prompt."


if __name__ == "__main__":
    # Run the Flask app on port 5001
    app.run(port=5001)
