import os

longstring = ""

for filename in os.listdir('unprocessed'):
    longstring += "<img src=\"imgs/"+filename+"\">\n"

with open("demofile.txt", "a") as f:
  f.write(longstring)

print("done")
