import subprocess
res = subprocess.run(["git", "status"], capture_output=True, text=True)
print(res.stdout)
