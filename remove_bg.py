from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=240):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        # If it's very close to white, make it transparent
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_white_bg('/Users/mansijain/.gemini/antigravity-ide/brain/28a411f2-cbd2-4eee-95c8-41e8e9626e5b/rakhi_siblings_1_1785310909098.png', '/Users/mansijain/Drive/Workspace/rakhi-gift/public/images/siblings.png')
print("Done!")
