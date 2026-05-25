import subprocess

print("Running local babel to catch the syntax error...")
cmd = "npx babel scratch/temp_app.js --presets=@babel/preset-react --out-file=scratch/temp_out.js"

res = subprocess.run(cmd, shell=True, capture_output=True, text=True)

print("Return code:", res.returncode)
print("\n--- STDERR TOP ---")
stderr_lines = res.stderr.split('\n')
for line in stderr_lines[:30]:
    print(line)

print("\n--- STDOUT TOP ---")
stdout_lines = res.stdout.split('\n')
for line in stdout_lines[:20]:
    print(line)
