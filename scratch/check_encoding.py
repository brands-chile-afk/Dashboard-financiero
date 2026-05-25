print("Detecting encoding of Financial Dashboard_9.txt...")
with open('Financial Dashboard_9.txt', 'rb') as f:
    raw_data = f.read()

encodings = ['utf-8', 'cp1252', 'latin1', 'utf-16']
for enc in encodings:
    try:
        raw_data.decode(enc)
        print(f"Decodes fine with {enc}!")
    except UnicodeDecodeError as e:
        print(f"Failed to decode with {enc}! Error: {str(e)[:60]}...")
