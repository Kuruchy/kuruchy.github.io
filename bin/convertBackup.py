import os
import re
import shutil
from datetime import date

backupPath = 'notion-backup/Blog 7e48afb2d0bc41f6b6410db61b13b82b'

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
    year, month, day = re.findall('\[.*?\]', notionMarkDownFile)[0].replace('[', '')[:-1].split('-')

    currentTimeStr=date(int(year), int(month), int(day)).isoformat()

    #Front Matter
    frontMatter='---\ntitle: "{}"\ndate: {} 00:00:00 +0900\n---\n'.format(fileName,currentTimeStr)

    #New File Name
    newMarkdownFileName="{}-{}.md".format(currentTimeStr,fileName)

    #Add Header
    with open(newMarkdownFileName,'w') as f:
        f.write(frontMatter)

    #Rename file
    os.rename(notionMarkDownFile, newMarkdownFileName)

    #Move Resouces
    shutil.move(newMarkdownFileName, '../../_posts/')

    #Remove md file
    shutil.rmtree('notion-backup')

if __name__ == '__main__':
    ModifiedMarkDownFile()
