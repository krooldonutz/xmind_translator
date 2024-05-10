import json
import sys
import deepl
from xmindparser import xmind_to_dict

__author__ = "Malcolm Paltiraja"



def translate_to_source(text, lang):
    # Translate text to English
    result = translator.translate_text(text, target_lang = lang)
    return result.text

def translate_data(data, target_lang):
    if isinstance(data, dict):
        translated_data = {}
        for key, value in data.items():
            if key in ['title', 'topic', 'topics']:
                translated_value = translate_data(value, target_lang)
            else:
                translated_value = translate_to_source(value, target_lang)
            translated_data[key] = translated_value
        return translated_data
    elif isinstance(data, list):
        translated_list = []
        for item in data:
            translated_item = translate_data(item, target_lang)
            translated_list.append(translated_item)
        return translated_list
    elif isinstance(data, str):
        return translate_to_source(data, target_lang)
    else:
        return data

def main(xmind_file: str, target_lang: str):
    # Load XMind data
    xmind_file = xmind_file
    xmind_dict = xmind_to_dict(xmind_file)
    original_title = xmind_dict[0]['title']
    translated_data = translate_data(xmind_dict, target_lang)[0]

    # Output translated data to a JSON file
    output_file = "translated_data.json"
    with open(output_file, "w") as json_file:
        json.dump(translated_data, json_file, indent=2)

    print(f"Translation completed. Translated data saved to {output_file}")
    return original_title

if __name__ == "__main__":
    # auth_key =  json.loads(open("settings.json").read())["API_KEY"]
    auth_key = sys.argv[2]
    translator = deepl.Translator(auth_key)
    # sys.argv[1] will be the file path passed from Node.js
    main(sys.argv[1], sys.argv[3])

