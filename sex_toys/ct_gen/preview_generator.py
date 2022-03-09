"""
===================================================================
===================================================================

                Colour Theme Preview Generator

===================================================================
===================================================================

If you have a bunch of colour themes and want to easily preview them - use this python script

It creates a fully standalone .html file with easy-to-view previews for every colour in every colour scheme




==================================
------------- Usage --------------
==================================
Files are taken from the subfolder "raw" and should have a .hex extension

Every file represents a separate palette, filename is the title

Every line should represent a hex code of the colour. (line break amount does not matter)
To separate colours into groups - use $ symbol.
To comment a line - use //
The separation point could also have some text. Type any text next to $, like "$other" for it to have text.


-------- Example:


dfeef4
a8cfe5

$ 
a6a9b0
8c8b8f
// 85878f

$ 
bbbfbc
a2aba6

$Other
bff2f9
97e0f1


$ 
819ba7
577895


"""




































import re
from shutil import copyfile
import os
import json
from re import search
import math
import random
import os.path, time
from pathlib import Path
import sys
import shutil
import subprocess
import datetime
import pathlib
import colorsys
from PIL import ImageColor
import base64



ht_icon = """
data:image/png;base64,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
""".replace('\n', '')

weread = open(__file__, 'r').read()

predef_start = """<!doctype html>
<html lang="en">
<head>
<link rel="shortcut icon" href=\"""" + ht_icon + """\" type="image/x-icon">
<meta charset="UTF-8">
	<title>prezervativ</title>
	<style>
		body
		{
			display: flex;
			flex-direction: column;
			background: #332f35;
			width: 470px;
			margin-left: 200px;
		}
		.shitbox
		{
			display: flex;
			flex-direction: column;
			background: #27232a;
			amax-width: 464px;
			margin-top: 50px;
			padding: 10px;
		}
		.shitbox_content
		{
			display: flex;
			flex-wrap: wrap;
			margin-top: 15px;
			flex-direction: column;
		}
		.shitbox_entry
		{
			display: flex;
			height: 40px;
			align-items: center;
			justify-content: flex-start;
			padding-left: 15px;
			font-family: "Open Sans","Segoe UI",Tahoma,sans-serif;
			
		}
		.shitbox_title
		{
			color: white;
			font-size: 40px;
			font-family: "Open Sans","Segoe UI",Tahoma,sans-serif;
		}
        .entry_separator
        {
            color: white;
            font-family: "Open Sans","Segoe UI",Tahoma,sans-serif;
            padding: 5px 0px 5px 0px;
            margin: 4px 0px 4px 0px;
            /* background: rgba(0, 0, 0, 0.2) */
        }
	</style>
</head>
<body>
""" + """<div descrpt="this is base64 of the python source code" style="display: none">""" + base64.b64encode(weread.encode('utf-8')).decode('utf-8') + """</div>\n"""
predef_end = """
</body>
</html>
"""

"""
<div class="shitbox">
    <div class="shitbox_title">Title</div>
    <div class="shitbox_content">
        <div class="shitbox_entry">hexnum1</div>
        <div class="shitbox_entry">hexnum2</div>
    </div>
</div>
"""

constructed = []

# print(os.getcwd())

# print(os.scandir(os.getcwd()))

getpath = os.getcwd() + '\\raw'

for ass in os.listdir(getpath):
    # print(ass)
    if '.hex' in ass:
        this_box = []
        this_box.append('\t<div class="shitbox">\n\t\t<div class="shitbox_title">' + ass.replace('-', ' ').replace('.hex', '') + '</div>\n\t\t<div class="shitbox_content">\n')
        dick = open(os.path.join(getpath, ass), 'r')
        balls = dick.readlines()
        for line in balls:
            print('LINE IS: ' + line)
            if not '//' in line and line != '\n' and line != ' ' and not '$' in line:
                print(line)
                h = '#' + line.replace('\n', '')
                print(h)
                # print('RGB =', tuple(int(h[i:i+2], 16) for i in (0, 2, 4)))
                # tits = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
                tits = ImageColor.getcolor(h, 'HSV')
                oral = colorsys.rgb_to_hsv(tits[0], tits[1], tits[2])
                print('FUUUUUUUUUUUU')
                print(oral)
                if oral[2] > 200:
                    col = 'color: black;'
                else:
                    col = 'color: white;'
                
                this_box.append('\t\t\t\t<div class="shitbox_entry" style="' + col + 'background: #' + line.replace('\n', '') + ';">' + line.replace('\n', '') + '</div>\n')
            if '$' in line and len(line) > 1:
                this_box.append('\t\t\t\t<div class="entry_separator">' + line.split('$')[-1].replace('\n', '') + '</div>\n')
        this_box.append('\t\t</div>\n\t</div>\n')
        
        print(ass)
        
        constructed.append(''.join(this_box))

bitch = ''.join(constructed)
pussy = open('palettes.html', 'w')
pussy.write(str(predef_start) + str(bitch) + str(predef_end))
