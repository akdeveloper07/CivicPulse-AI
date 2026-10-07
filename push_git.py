import subprocess
import os

repo_dir = r"c:\Users\akash\OneDrive\Documents\HOSPITAL APPOINTMENT SYSTEM\CIVICPLUSE"

def run_git(cmd):
    result = subprocess.run(cmd, cwd=repo_dir, capture_output=True, text=True)
    return f"CMD: {' '.join(cmd)}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\nEXIT: {result.returncode}\n{'-'*50}\n"

log = ""
log += run_git(["git", "add", "."])
log += run_git(["git", "commit", "-m", "Add server.js in root, frontend, and src directories for Render deployment"])
log += run_git(["git", "push"])

with open(os.path.join(repo_dir, "git_result.txt"), "w", encoding="utf-8") as f:
    f.write(log)

print("GIT SCRIPT FINISHED")
