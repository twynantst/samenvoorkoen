
import qrcode
from PIL import Image

# URL voor QR-code
url = "https://samenvoorkoen.be"

# QR-code genereren
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)  # Hoge foutcorrectie
qr.add_data(url)
qr.make(fit=True)

img_qr = qr.make_image(fill_color="black", back_color="white").convert('RGB')

# Logo laden
logo = Image.open("logo.png")

# Logo schalen
logo_size = 80
logo = logo.resize((logo_size, logo_size))

# Positie berekenen (midden)
pos = ((img_qr.size[0] - logo_size) // 2, (img_qr.size[1] - logo_size) // 2)

# Logo toevoegen
img_qr.paste(logo, pos)

# Opslaan
img_qr.save("qr_website.png")
