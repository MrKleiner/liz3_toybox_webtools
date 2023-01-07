





class _lightstruct_file:
	def __init__(self, origin, ref, gl_offs=0, readonly=False):
		self.lstruct = origin
		self.gl_offs = gl_offs
		self.file = ref
		self.readonly = readonly

	# todo: raise exceptions when passed data doesn't match the rule itself

	def __getitem__(self, rname):
		# when reading stuff the cursor position is shifted from its original location
		# this is extremely invonvenient
		# therefore, it has to be restored to the original position once done reading the chunk
		original_pos = self.file.tell()


		self.move_cursor_to_rule(rname)

		# print(f'{original_pos=}')

		# get rule bytes from the file according to the rule length
		rule_bytes = self.file.read(self.lstruct.rlens[rname])

		# print('shifted pos', self.file.tell())

		# move the cursor back at its original position
		self.file.seek(original_pos, 0)

		# print('restored pos', self.file.tell())

		# decode the rule and return the result
		return self.lstruct.decode_chunk(rname, rule_bytes)


	def __setitem__(self, rname, val):
		# remember cursor pos
		original_pos = self.file.tell()

		self.lstruct.validate(rname, val)
		self.move_cursor_to_rule(rname)

		# evaluate value to bytes according to the rule
		# and write it to the file
		self.file.write(self.lstruct.encode_chunk(rname, val))

		# restore cursor pos
		self.file.seek(original_pos, 0)


	def move_cursor_to_rule(self, rname):
		# *swing the typewriter*
		# set cursor to the beginning of the file
		# add global offset
		# add relative rule offset
		self.file.seek(self.gl_offs + self.lstruct.offsets[rname], 0)

	# fork a new instance, but with new offset
	def with_offset(self, offst, readonly=None):
		return self.lstruct.apply(self.file, offst, readonly or self.readonly)

	# set global file offset
	def set_offset(self, gl_offs):
		self.gl_offs = gl_offs







class _lightstruct_ram:
	def __init__(self, origin, ref, gl_offs=0, readonly=False):
		self.lstruct = origin
		self.gl_offs = gl_offs
		self.file = bytearray(ref)
		self.readonly = readonly

		






class lightstruct:
	def __init__(self, **args):
		import sys, io
		from pathlib import Path
		self.Path = Path

		self.io = io

		self.sys = sys
		self.struct = args

		self.template = False

		self.int_sizes = {
			int: 4,
			'short': 2,
			'long': 8
		}

		self.bit_lengths = {
			int: 4,
			'short': 2,
			'long': 8,
			float: 4,
			str: 1
		}

		# fix some stuff just in case
		for arg in args:
			if len(args[arg]) < 2:
				self.struct[arg] = (args[arg][0], 1)
			else:
				self.struct[arg] = args[arg]

		#
		# calculate offsets and lengths
		#

		# each rule's offset
		self.offsets = {}
		# each rule's total byte length (2 ints = 8 bytes)
		self.rlens = {}

		total_offs = 0
		for rule_name in self.struct:
			# get the rule tuple
			rule = self.struct[rule_name]
			# eval rule length
			rule_length = self.bit_lengths[rule[0]] * rule[1]
			# write down the offset for the current rule
			self.offsets[rule_name] = total_offs
			# add the rule length to the total offset
			total_offs += rule_length
			# also, write down the rule length into the individual rule lengths dict
			self.rlens[rule_name] = rule_length

		# total length of the entire struct definition
		self.len = total_offs


	# validate whether passed data matches the rule itself
	def validate(self, rname, data):
		if len(data) != self.struct[rname][1]:
			raise Exception("""Passed data doesn't match the rule (the passed tuple is not of the defined rule length)""")

	def apply(self, ref, offs=0, onlyread=False):

		if isinstance(ref, self.io.BufferedIOBase):
			return _lightstruct_file(self, ref, offs, onlyread)

		if self.Path(str(ref)).is_file():
			return _lightstruct_file(self, open(str(ref), 'r+b'), offs, onlyread)

		if isinstance(ref, bytes):
			return _lightstruct_ram(self, ref, offs)


		if isinstance(ref, _lightstruct_ram):
			return _lightstruct_ram(self, ref.file, offs, onlyread)

		if isinstance(ref, _lightstruct_file):
			return _lightstruct_file(self, ref.file, offs, onlyread)

		raise Exception('Invalid reference type')

	# transform a tuple into bytes according to the rule
	# val has to be a tuple where each item is a single bit of the defined type
	def encode_chunk(self, rulename, val):
		import struct as float_enc

		rule = self.struct[rulename]

		buf = b''

		# todo: if it's not a list, but a simple string - simply encode it all at once
		if rule[0] == str:
			for bit in val:
				encoded = bit
				if not isinstance(bit, bytes):
					encoded = bit.encode()
				buf += encoded
			return buf


		if rule[0] in self.int_sizes:
			sys_byteorder = self.sys.byteorder
			for bit in val:
				buf += bit.to_bytes(self.int_sizes[rule[0]], sys_byteorder)
			return buf


		if rule[0] == float:
			for fl in val:
				buf += float_enc.pack('f', fl)
			return buf


	def rlen(self, rulename):
		rule = self.struct[rulename]
		return self.bit_lengths[rule[0]] * rule[1]

	# chunk has to be a raw sequence of bytes
	def decode_chunk(self, rulename, chunk):
		import struct as float_enc

		if not rulename in self.struct:
			raise Exception('Invalid rule name')

		rule = self.struct[rulename]
		result = []

		if rule[0] == str:
			# return chunk.decode()
			return chunk

		# bit offset is not needed for strings
		bit_offs = 0

		if rule[0] in self.int_sizes:
			sys_byteorder = self.sys.byteorder
			bit_len = self.int_sizes[rule[0]]
			for bit in range(rule[1]):
				result.append(int.from_bytes(chunk[bit_offs:bit_offs+bit_len], sys_byteorder))
				bit_offs += bit_len

		if rule[0] == float:
			bit_len = 4
			for bit in range(rule[1]):
				result.append(float_enc.unpack('f', chunk[bit_offs:bit_offs+bit_len])[0])
				bit_offs += bit_len

		# tuple was only returned to remind everyone that shit cannot be re-assigned right away
		# return tuple(result)
		return result













































if __name__ == '__main__':
	import os
	from pathlib import Path
	os.system('cls')
	
	lsd = lightstruct(letter1=(str,1), letter2=(str,2))

	applied = lsd.apply('lt.sex')

	print(applied['letter1'])
	print(applied['letter2'])

	applied['letter2'] = 'rt'

	print(applied['letter1'])

	applied.file.close()


	print('')
	print('')
	# print('')


	vtf = lightstruct(
		signature =            (str, 4),
		version =              (int, 2),
		headerSize =           (int, 1),
		width =                ('short', 1),
		height =               ('short', 1),
		flags =                (int, 1),
		frames =               ('short', 1),
		firstFrame =           ('short', 1),
		padding0 =             (str, 4),
		reflectivity =         (float, 3),
		padding1 =             (str, 4),
		bumpmapScale =         (float, 1),
		highResImageFormat =   (int, 1)
	)

	sex = vtf.apply(r"C:\Program Files (x86)\Steam\steamapps\common\GarrysMod\garrysmod\materials\cs_italy\ceiling01.vtf")

	print(sex['signature'])
	print(sex['version'])
	print(sex['headerSize'])
	print(sex['width'])
	print(sex['height'])
	print(sex['flags'])
	print(sex['frames'])
	print(sex['firstFrame'])
	print(sex['padding0'])
	print(sex['reflectivity'])
	print(sex['padding1'])
	print(sex['bumpmapScale'])
	print(sex['highResImageFormat'])

	# sex.file.close()

	print('')
	print('')

	bsp_lump = lightstruct(
		fileofs = (int, 1),
		filelen = (int, 1),
		version = (int, 1),
		ident =   (str, 4)
	)

	bsp_header_struct = lightstruct(
		ident =   (str, 4),
		version = (int, 1)
	)

	# bsp_header = bsp_header_struct.apply(r"E:\!webdesign\cbtool\proto\map\examples\lone_light_1.bsp")
	bsp_header = bsp_header_struct.apply(r"C:\Program Files (x86)\Steam\steamapps\common\Team Fortress 2\tf\maps\cp_altitude.bsp")

	bsp_file = bsp_header.file

	print(bsp_header['ident'])
	print(bsp_header['version'])
	print('hlen', bsp_header_struct.len)

	lumps = []

	total_offset = bsp_header_struct.len

	for lump in range(60):
		lumps.append(bsp_lump.apply(bsp_file, total_offset, True))
		total_offset += bsp_lump.len

	print(lumps[0]['fileofs'])
	print(lumps[0].gl_offs)

	# print('is it even the same?', sex.file == lumps[0].file)

	bsp_file.seek(lumps[0]['fileofs'][0], 0)
	print('tell before retreive', bsp_file.tell())
	print(lumps[0]['filelen'][0])
	print('tell after retreive', bsp_file.tell())
	import lzma
	# print(bsp_file.read(100))
	ent_comp = bsp_file.read(lumps[0]['filelen'][0])
	# print(ent_comp)
	# Path('lzshit.lzma').write_bytes(ent_comp)
	# decompr = lzma.LZMADecompressor(format=lzma.FORMAT_ALONE)
	# print(decompr.decompress(ent_comp))
	print(lzma.decompress(ent_comp, format=lzma.FORMAT_RAW, filters=filt))
	# print()
	# s

	bsp_file.seek(lumps[40]['fileofs'][0], 0)
	Path('pakl.zip').write_bytes(bsp_file.read(lumps[40]['filelen'][0]))