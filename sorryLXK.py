# -*- coding: UTF-8 -*-
import os
import re

print("脚本开始")
fileDir = "./"
fileList = []
for root, dirs, files in os.walk(fileDir):
    for fileObj in files:
        if '.git' in root or 'icon' in root or 'docker' in root or 'Loon' in root or 'QuantumultX' in root or 'Surge' in root:
            continue
        fileList.append(os.path.join(root, fileObj))

pattern = r"JSON\.stringify\(process\.env\)\.indexOf\(['\"]GITHUB['\"]\)>-1"
for fileObj in fileList:
    if 'sorryLXK' in fileObj:
        continue
    f = open(fileObj, 'r', errors='ignore')
    lines = f.readlines()
    f.close()
    f = open(fileObj, 'w')
    for line in lines:
        line = re.sub(pattern, '0', line)
        f.write(line)
    f.close()
print("脚本结束")
