import os
import re
import shutil
from datetime import date

backupPath = 'notion-backup/Blog 7e48afb2d0bc41f6b6410db61b13b82b'

customHeader = """
---
layout: post
title: {}
categories: {}
excerpt: {}
---
"""

def ModifiedMarkDownFile():

    #Loop each file
    os.chdir(backupPath)
    for file in os.listdir():
        if file.endswith('.md'):
            notionMarkDownFile = file

            #Read Front
            lines = []
            with open(notionMarkDownFile, 'r') as f:
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
            imagesOrigen = notionMarkDownFile.replace('.md','')
            notionMarkDownFolder = imagesOrigen.replace(' ', '%20')
            newHeader = customHeader.format(title, categories, excerpt)
            with open(notionMarkDownFile, 'w') as f:
                f.write(newHeader)
                for number, line in enumerate(lines[5:]):
                    if line.startswith('!['):
                        line = line.replace(notionMarkDownFolder, 'images')
                    f.write(line)

            #Rename file
            os.rename(notionMarkDownFile, newMarkdownFileName)

            #Move Resouces
            shutil.move(newMarkdownFileName, '../../_posts/{}'.format(newMarkdownFileName))
            allImages = os.listdir(imagesOrigen)

            for image in allImages:
                shutil.move(imagesOrigen + '/' + image, '../../images/' + image)

    #Remove md file
    shutil.rmtree('../../notion-backup')

if __name__ == '__main__':
    ModifiedMarkDownFile()
