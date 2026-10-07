import subprocess

res = subprocess.run(["git", "remote", "-v"], capture_output=True, text=True)
print("REMOTE:", res.stdout)

res2 = subprocess.run(["git", "status"], capture_output=True, text=True)
print("STATUS:", res2.stdout)
