import os
import re
import shutil
from datetime import date

customHeader = """
---
layout: post
title: {}
categories: {}
excerpt: {}
---
"""

def ProcessPostHeader(file, imagesOrigen):
    #Read Front
    lines = []
    with open(file, 'r') as f:
        lines = f.readlines()

    data = lines[4].split('|')
    data = data[1:-1]

    title = data[0]
    title = title[1:-1]

    categories = data[1]
    categories = categories[1:-1]

    excerpt = data[2]
    excerpt = excerpt[1:-1]

    date = data[3]
    date = date[1:-1]

    #New File Name
    fileName = title.replace(' ', '_').lower()
    newMarkdownFileName="{}-{}.md".format(date, fileName)

    #Clean Header
    notionMarkDownFolder = imagesOrigen.replace(' ', '%20')
    newHeader = customHeader.format(title, categories, excerpt)
    with open(file, 'w') as f:
        f.write(newHeader)
        for number, line in enumerate(lines[5:]):
            if line.startswith('!['):
                line = line.replace(notionMarkDownFolder, 'images')
            f.write(line)

    return newMarkdownFileName

def DeleteFirstLineOfFile(file):
    rows = []
    with open(file, "r") as f:
        rows = f.readlines()[1:]
    with open(file, 'w') as f:
        for row in rows:
            f.write(row)
    return file

def RenameFile(oldname, newName):
    os.rename(oldname, newName)

def MoveResources(fileName, imagesOrigen):
    shutil.move(fileName, '../../_posts/{}'.format(fileName))
    if os.path.isdir(imagesOrigen):
        allImages = os.listdir(imagesOrigen)
        for image in allImages:
            shutil.move(imagesOrigen + '/' + image, '../../images/' + image)

def RemoveBackUpFiles():
    shutil.rmtree('../../notion-backup')
    os.mkdir('../../notion-backup')

def ModifiedMarkDownFile():
    #Loop each file
    blog = [filename for filename in os.listdir('notion-backup') if filename.startswith("Blog") and filename.endswith(".md")][0]
    os.chdir('notion-backup/{}'.format(blog.replace('.md','')))
    for file in os.listdir():
        if not(file.endswith('.md')): continue
        imagesOrigen = file.replace('.md','')
        notionMarkDownFile = file
        newMarkdownFileName = ProcessPostHeader(notionMarkDownFile, imagesOrigen)
        DeleteFirstLineOfFile(notionMarkDownFile)
        RenameFile(notionMarkDownFile, newMarkdownFileName)
        MoveResources(newMarkdownFileName, imagesOrigen)

    RemoveBackUpFiles()

if __name__ == '__main__':
    ModifiedMarkDownFile()
