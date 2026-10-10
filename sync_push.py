import subprocess
import os

repo_dir = r"c:\Users\akash\OneDrive\Documents\HOSPITAL APPOINTMENT SYSTEM\CIVICPLUSE"
log_path = os.path.join(repo_dir, "git_push_log.txt")

env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

lines = []

def run_cmd(args):
    try:
        res = subprocess.run(args, cwd=repo_dir, capture_output=True, text=True, env=env, timeout=30)
        out = f"=== RUN: {' '.join(args)} ===\nSTDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}\nEXIT: {res.returncode}\n\n"
    except Exception as e:
        out = f"=== RUN EXCEPTION: {e} ===\n\n"
    lines.append(out)

import shutil

dist_src = os.path.join(repo_dir, "frontend", "dist")
dist_dst = os.path.join(repo_dir, "dist")
if os.path.exists(dist_src):
    shutil.copytree(dist_src, dist_dst, dirs_exist_ok=True)
    lines.append("Copied frontend/dist to dist successfully.\n\n")

run_cmd(["git", "status"])
run_cmd(["git", "add", "-A"])
run_cmd(["git", "commit", "-m", "Remove demo accounts and Google sign-in from authentication flow"])
run_cmd(["git", "push"])

with open(log_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("SYNC PUSH SCRIPT COMPLETE")
