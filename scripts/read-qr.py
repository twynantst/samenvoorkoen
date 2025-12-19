
import cv2
# read the QRCODE image
img = cv2.imread("d:\\sandbox\\kvdh\\samen-voor-koen-tegen-kanker\\docs\\assets\\payments\\payconiq.png")

detector = cv2.QRCodeDetector()
data, bbox, straight_qrcode = detector.detectAndDecode(img)
if bbox is not None:
    print("QRCode data:")
    print(data)


# # URL voor QR-code
# url = "https://samenvoorkoen.be"

# # QR-code genereren
# qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)  # Hoge foutcorrectie
# qr.add_data(url)
# qr.make(fit=True)

# img_qr = qr.make_image(fill_color="black", back_color="white").convert('RGB')

# # Logo laden
# logo = Image.open("logo.png")

# # Logo schalen
# logo_size = 80
# logo = logo.resize((logo_size, logo_size))

# # Positie berekenen (midden)
# pos = ((img_qr.size[0] - logo_size) // 2, (img_qr.size[1] - logo_size) // 2)

# # Logo toevoegen
# img_qr.paste(logo, pos)

# # Opslaan
# img_qr.save("qr_website.png")
