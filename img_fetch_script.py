import os
import subprocess

BASE_URI = "https://cooljavascriptthings.firebaseapp.com"
img_list = [
    "_screenshots/tictactoe.png",
    "_screenshots/snake.png",
    "_screenshots/simon.png",
    "_screenshots/minesweeper.png",
    "_screenshots/connect4.png",
    "_screenshots/sudoku.png",
]

if not os.path.isdir("_screenshots"):
    os.mkdir("_screenshots")

for img_url in img_list:
    img_name = img_url.split("/")[1]
    subprocess.run(f"curl {BASE_URI}/{img_url} > ./_screenshots/{img_name}", shell=True)