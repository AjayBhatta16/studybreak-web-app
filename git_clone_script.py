import os
import subprocess

BASE_URI = "https://github.com/AjayBhatta16"
repo_list = [
    ("sudoku-solver", "sodoku"),
    ("connect4", "connect4"),
    ("simon", "simon"),
    ("minesweeper", "minesweeper"),
    ("tictactoe", "tictactoe"),
]

for repo in repo_list:
    # remove existing folder
    if os.path.isdir(repo[1]):
        subprocess.run(f"rm -rf {repo[1]}", shell=True)

    # clone repo
    subprocess.run(f"git clone {BASE_URI}/{repo[0]}", shell=True)

    # rename repo to web app folder name
    if repo[0] != repo[1]:
        os.rename(repo[0], repo[1])

    # remove .git from child repo
    subprocess.run(f"rm -rf ./{repo[1]}/.git", shell=True)