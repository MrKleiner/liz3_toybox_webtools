# idk if this is needed lol but let it be lol
import array
from re import search

# old method
"""
with open('this_is_a_bucket.txt', "r") as f:
    linez = f.readlines()
    # print(f.read())
    thefile = f.read()
    # print(f)
    print(thefile)
    
    print(linez)
    uscriptend_index = linez.index("this is line6\n")
    print(uscriptend_index)
    
    # insert pootis after the artificial line 6
    linez.insert(uscriptend_index + 1, 'pootis' + '\n')
"""

file = open("this_is_a_bucket.txt")

# create an array of lines out of the text file
linez = file.readlines()

# make the content of the file available as string because why not. wtf is wrong with python. wtf is this pornography
thefile = open("this_is_a_bucket.txt").read()
print(thefile)

# find the index we need
# but first, let me take a selfie (check if what we check for exists lol)
if search('this is line6', thefile):
    print('line6 is there')
    uscriptend_index = linez.index("this is line6\n")
else:
    print('line6 is not prsented')


# insert pootis after the artificial line 6
linez.insert(uscriptend_index + 1, 'pootisded2' + '\n')






with open("output.txt", "w") as txt_file:
    for line in linez:
        txt_file.write("".join(line))