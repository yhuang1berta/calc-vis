import json
import random

return_arr = []
for inp in range(100):
    for out in range(100):
        return_arr.append({"source": "value"+str(random.randint(1,50)), "target": "value"+str(random.randint(1,50))})

with open("temp.json", "w") as f:
    json.dump(return_arr, f)