import os
import re
import shutil
from datetime import date

backupPath = 'notion-backup/Blog 7e48afb2d0bc41f6b6410db61b13b82b'

customHeader = """
---
layout: post
title: My Notion Automation
categories: [Automation]
excerpt: Demo!
---
"""

def FindMarkdownFile():
    notionMarkDownFile=''
    os.chdir(backupPath)
    for f in os.listdir():
        if f.endswith('.md'):
            notionMarkDownFile = f
            break
    return notionMarkDownFile

def ModifiedMarkDownFile():
    #Read Notion Markdown
    notionMarkDownFile=FindMarkdownFile()

    fileName = notionMarkDownFile.split('[')[0][:-1]
    date = re.findall('\[.*?\]', notionMarkDownFile)[0]
    date = date.replace('[', '')[:-1]

    #New File Name
    newMarkdownFileName="{}-{}.md".format(date,fileName)

    #Add Header
    with open(newMarkdownFileName,'w') as f:
        f.write(customHeader)

    #Rename file
    os.rename(notionMarkDownFile, newMarkdownFileName)

    #Move Resouces
    shutil.move(newMarkdownFileName, '../../_posts/{}'.format(newMarkdownFileName))

    #Remove md file
    shutil.rmtree('../../notion-backup')

if __name__ == '__main__':
    ModifiedMarkDownFile()
