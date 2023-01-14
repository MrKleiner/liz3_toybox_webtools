


class _lstruct_ram_file_obj:
	def __init__(self, ref):
		if type(ref) == bytearray:
			self.bytes = ref
		else:
			self.bytes = bytearray(ref)

	def __getitem__(self, val):
		return self.bytes[val.start:val.stop]

	def __setitem__(self, skey, val):
		self.bytes[skey.start:skey.stop] = val

	def __add__(self, val):
		# self.bytes += val
		self.bytes.extend(val)
		return self



#
# todo: there are a few shared methods
#

class _lightstruct_file:
	def __init__(self, origin, ref, gl_offs=0, readonly=False):
		self.lstruct = origin
		self.gl_offs = gl_offs
		self.file = ref
		self.readonly = readonly

		self.lists = {}
		self.lstruct.apply_list(self)

	# todo: raise exceptions when passed data doesn't match the rule itself

	def __getitem__(self, rname):
		# lists are completely different
		if self.lstruct.struct[rname][0] == list:
			return self.lists[rname]


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
	def set_offset(self, gl_offs=None):
		if type(gl_offs) != int:
			raise Exception(f"""Set offset only takes integers as an input, but {type(gl_offs)} was passed""")

		self.gl_offs = gl_offs

	# dump all values to a dict
	def dump_dict(self):
		result = {}
		for entry in self.lstruct.struct:
			result[entry] = self[entry]

		return result

	# dump all values to a dict
	def dump_bytes(self):
		original_pos = self.file.tell()

		result = b''

		# go to the beginning of all the rules
		self.file.seek(self.gl_offs, 0)
		# read the length of all rules
		result = self.file.read(self.lstruct.len)

		self.file.seek(original_pos, 0)

		return result

	# update many values at once
	def update(self, upd_dict={}):
		if type(upd_dict) != dict:
			raise Exception('Can only update with a dict')

		for upd_key in upd_dict:
			self[upd_key] = upd_dict[upd_key]









class _lightstruct_ram:
	def __init__(self, origin, ref, gl_offs=0, readonly=False):
		self.lstruct = origin
		self.gl_offs = gl_offs
		self.file = ref
		self.readonly = readonly

		# apply lists
		self.lists = {}
		self.lstruct.apply_list(self)

	def __getitem__(self, rname):
		# lists are completely different
		if self.lstruct.struct[rname][0] == list:
			return self.lists[rname]

		rule_offs = self.get_rule_offs(rname)
		rule_bytes = self.file[rule_offs:(rule_offs+self.lstruct.rlens[rname])]

		# decode the rule and return the result
		return self.lstruct.decode_chunk(rname, rule_bytes)


	def __setitem__(self, rname, val):
		self.lstruct.validate(rname, val)
		rule_offs = self.get_rule_offs(rname)

		self.file[rule_offs:(rule_offs+self.lstruct.rlens[rname])] = self.lstruct.encode_chunk(rname, val)

	def get_rule_offs(self, rname):
		return (self.gl_offs + self.lstruct.offsets[rname])

	# fork a new instance, but with new offset
	def with_offset(self, offst, readonly=None):
		return self.lstruct.apply(self, offst, readonly or self.readonly)






	#
	# This is the SAME as in the file type
	#

	# dump all values to a dict
	# (same as in the file)
	def dump_dict(self):
		result = {}
		for entry in self.lstruct.struct:
			result[entry] = self[entry]

		return result

	# update many values at once
	def update(self, upd_dict={}):
		if type(upd_dict) != dict:
			raise Exception('Can only update with a dict')

		for upd_key in upd_dict:
			self[upd_key] = upd_dict[upd_key]




	#
	# and THIS is NOT the same as in the file type
	#

	# dump all values to a dict
	def dump_bytes(self):
		return self.file[self.gl_offs:(self.gl_offs+self.lstruct.len)]












class lightstruct:
	"""
	lightstruct v0.37
	Easily get/set file headers, like in C.
	Except this is all lies compared to C
	"""
	def __init__(self, **args):
		import sys, io
		from pathlib import Path

		self.Path = Path
		self.io = io
		self.sys = sys

		# store struct defintion dict here
		self.struct = args

		# obsolete
		self.template = False

		# store byteorder like this, because it could be changed manually
		self.sys_byteorder = sys.byteorder

		# return single values without a tuple
		# and accept single values without a tuple
		self.smart = False
		self.allowed_smart = (list, tuple, str, bytes, bytearray)


		# how many bytes does each int type take
		# this dict also identifies which rules have to be treaten as an int
		self.int_sizes = {
			int: 4,
			'short': 2,
			'long': 8
		}

		# byte size of every possible rule type
		self.bit_lengths = {
			int: 4,
			'short': 2,
			'long': 8,
			float: 4,
			str: 1
		}

		# fix some stuff in arguments just in case
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
		# indexed by rule name (like a dict)
		self.rlens = {}

		# offset counter
		total_offs = 0

		for rule_name in self.struct:
			# get the rule tuple
			rule = self.struct[rule_name]
			# eval rule length
			if rule[0] == list:
				rule_length = rule[2].len * rule[1]
			else:
				rule_length = self.bit_lengths[rule[0]] * rule[1]
			# write down the offset for the current rule
			self.offsets[rule_name] = total_offs
			# add the rule length to the total offset
			total_offs += rule_length
			# also, write down the rule length into the individual rule lengths dict
			self.rlens[rule_name] = rule_length

		# total byte length of the entire struct definition
		self.len = total_offs


	# validate whether passed data matches the rule itself
	# todo: also validate structure
	# BUT do so efficiently without looping 100 times
	def validate(self, rname, data):
		if self.smart == True and not type(data) in self.allowed_smart:
			data = (data,)
		if len(data) != self.struct[rname][1]:
			raise Exception(f"""Passed data doesn't match the rule (the passed tuple is not of the defined rule length), {data}:{len(data)}, {self.struct[rname][1]}""")

	def apply(self, ref, offs=0, onlyread=False):

		#
		# As existing file
		#
		if isinstance(ref, self.io.BufferedIOBase):
			return (_lightstruct_file(self, ref, offs, onlyread), ref)

		if self.Path(str(ref)).is_file():
			file_obj = open(str(ref), 'r+b')
			return (_lightstruct_file(self, file_obj, offs, onlyread), file_obj)

		if isinstance(ref, _lightstruct_file):
			return (_lightstruct_file(self, ref.file, offs, onlyread), ref.file)


		#
		# As RAM
		#
		if isinstance(ref, bytes):
			if len(ref) < self.len:
				raise Exception('Passed bytes object length does not match the declared structure length')

			bt_storage = _lstruct_ram_file_obj(ref)
			return (_lightstruct_ram(self, bt_storage, offs), bt_storage)

		if isinstance(ref, _lightstruct_ram):
			return (_lightstruct_ram(self, ref.file, offs, onlyread), ref.file)

		if isinstance(ref, _lstruct_ram_file_obj):
			return (_lightstruct_ram(self, ref, offs, onlyread), ref)

		# creates new empty object with only bytes reserved for the structure
		if ref == None:
			bt_storage = _lstruct_ram_file_obj(bytes(self.len))
			return (_lightstruct_ram(self, bt_storage, offs, onlyread), bt_storage)



		raise Exception('Invalid reference type')

	# transform a tuple into bytes according to the rule
	# val has to be a tuple where each item is a single bit of the defined type
	def encode_chunk(self, rulename, val):
		import struct as float_enc

		# get rule info
		rule = self.struct[rulename]

		# store buffer here
		buf = b''

		# if smart mode is enabled - transform singular values into tuples automatically
		if self.smart == True and not type(val) in self.allowed_smart:
			val = (val,)

		# todo: if it's not a list, but a simple string - simply encode it all at once
		if rule[0] == str:
			valtype = type(val)

			# if it's a byte object then don't do anything
			if valtype in (bytes, bytearray):
				return val

			if valtype == str:
				return val.encode()

			# else - try stuff
			for bit in val:
				encoded = bit
				# todo: this makes little to no sense
				# only strings can be encoded
				# if not type(bit) in (bytes, bytearray) and not valtype in (bytes, bytearray):
				if type(bit) == str:
					encoded = bit.encode()
				else:
					buf += encoded

			return buf


		if rule[0] in self.int_sizes:
			# sys_byteorder = self.sys.byteorder
			for bit in val:
				buf += bit.to_bytes(self.int_sizes[rule[0]], self.sys_byteorder)
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

		# this is like a dict and accessing non-existent key should throw an error
		if not rulename in self.struct:
			raise Exception('Invalid rule name')

		# get rule info dict
		rule = self.struct[rulename]
		result = []

		# strings are iterable (but do not support item assignment)
		# todo: return a list? decode?
		if rule[0] == str:
			# return chunk.decode()
			return chunk

		# bit offset is not needed for strings
		bit_offs = 0

		# if rule type is in the int sizes dict, then it means that it should be treated as an int, Wattson
		if rule[0] in self.int_sizes:
			# sys_byteorder = self.sys.byteorder
			bit_len = self.int_sizes[rule[0]]
			for bit in range(rule[1]):
				result.append(int.from_bytes(chunk[bit_offs:bit_offs+bit_len], self.sys_byteorder))
				bit_offs += bit_len


		if rule[0] == float:
			bit_len = self.bit_lengths[float]
			for bit in range(rule[1]):
				result.append(float_enc.unpack('f', chunk[bit_offs:bit_offs+bit_len])[0])
				bit_offs += bit_len


		# Tuple was only returned to remind everyone that shit cannot be re-assigned right away
		# Returning a list is way more convenient, 
		# because this allows changing the value and then simply converting it to a tuple
		
		# return tuple(result)

		# also smart stuff
		if self.smart == True and len(result) == 1:
			return result[0]
		else:
			return result

	# set endian to whatever
	def set_endian(self, endian=None):
		allowed = [
			'little',
			'big',
			'middle',
			'mixed'
		]
		if endian.lower() in allowed:
			self.sys_byteorder = endian.lower()

	# reset back to sys.byteorder
	def reset_endian(self):
		self.sys_byteorder = self.sys.byteorder


	# def smart(self, ena=False):
	# 	if ena in (True, False):
	# 		self.smart = ena


	def apply_list(self, struct_ref):

		this = struct_ref

		# apply lists, if any
		struct = this.lstruct.struct
		# self.lstruct.offsets[rule]
		for rule in struct:
			if struct[rule][0] == list:
				applied_structs = []
				list_offs = 0
				for list_struct in range(struct[rule][1]):
					this_offs = this.gl_offs + this.lstruct.offsets[rule] + list_offs
					applied_structs.append(struct[rule][2].apply(this.file, this_offs, this.readonly)[0])
					list_offs += struct[rule][2].len

				if len(struct[rule]) == 4:
					this.lists[rule] = dict(zip(struct[rule][3], applied_structs))
				else:
					this.lists[rule] = applied_structs
































if __name__ == '__main__':
	import os
	from pathlib import Path
	os.system('cls')
	
	lsd = lightstruct(letter1=(str,1), letter2=(str,2))

	applied, fref = lsd.apply('lt.sex')

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

	sex, sex_fref = vtf.apply(r"C:\Program Files (x86)\Steam\steamapps\common\GarrysMod\garrysmod\materials\cs_italy\ceiling01.vtf")

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
	bsp_header, bsref = bsp_header_struct.apply(r"C:\Program Files (x86)\Steam\steamapps\common\Team Fortress 2\tf\maps\cp_altitude.bsp")

	bsp_file = bsp_header.file

	print(bsp_header['ident'])
	print(bsp_header['version'])
	print('hlen', bsp_header_struct.len)

	lumps = []

	total_offset = bsp_header_struct.len

	for lump in range(60):
		lumps.append(bsp_lump.apply(bsp_file, total_offset, True)[0])
		total_offset += bsp_lump.len

	print(lumps[0]['fileofs'])
	print(lumps[0].gl_offs)

	# print('is it even the same?', sex.file == lumps[0].file)

	bsp_file.seek(lumps[0]['fileofs'][0], 0)
	print('tell before retreive', bsp_file.tell())
	print(lumps[0]['filelen'][0])
	print('tell after retreive', bsp_file.tell())
	# import lzma
	# print(bsp_file.read(100))
	# ent_comp = bsp_file.read(lumps[0]['filelen'][0])
	# print(ent_comp)
	# Path('lzshit.lzma').write_bytes(ent_comp)
	# decompr = lzma.LZMADecompressor(format=lzma.FORMAT_ALONE)
	# print(decompr.decompress(ent_comp))
	# print(lzma.decompress(ent_comp, format=lzma.FORMAT_RAW, filters=filt))
	# print()
	# s

	# bsp_file.seek(lumps[40]['fileofs'][0], 0)
	# Path('pakl.zip').write_bytes(bsp_file.read(lumps[40]['filelen'][0]))

	print(lumps[0].dump_bytes())
	print(lumps[0].dump_dict())




	#
	# RAM OPS
	#

	vtf_bytes = Path(r"C:\Program Files (x86)\Steam\steamapps\common\GarrysMod\garrysmod\materials\cs_italy\pwood1_normal.vtf").read_bytes()

	vtfc, vtfb_ref = vtf.apply(vtf_bytes)

	# print(vtfb_ref)
	# print(vtfc)
	print(vtfc['signature'])
	print(vtfc['version'])
	print(vtfc['headerSize'])
	print(vtfc['width'])
	print(vtfc['height'])
	print(vtfc['flags'])
	print(vtfc['frames'])
	print(vtfc['firstFrame'])
	print(vtfc['padding0'])
	print(vtfc['reflectivity'])
	print(vtfc['padding1'])
	print(vtfc['bumpmapScale'])
	print(vtfc['highResImageFormat'])

	print(vtfc.dump_bytes())
	print(vtfc.dump_dict())


	#
	# CREATE EMPTY SHIT
	#
	vtf_empty,_ = vtf.apply(None)
	vtf.smart = True

	print(vtf_empty)
	print(vtf_empty['signature'])
	print(vtf_empty['version'])
	print(vtf_empty['headerSize'])
	print(vtf_empty['width'])
	print(vtf_empty['height'])
	print(vtf_empty['flags'])
	print(vtf_empty['frames'])
	print(vtf_empty['firstFrame'])
	print(vtf_empty['padding0'])
	print(vtf_empty['reflectivity'])
	print(vtf_empty['padding1'])
	print(vtf_empty['bumpmapScale'])
	print(vtf_empty['highResImageFormat'])

	vtf_empty.update({
		'signature':            'VTF\0',
		'version':              (7, 1),
		'headerSize':           64,
		'width':                256,
		'height':               512,
		'flags':                2048,
		'frames':               64,
		'firstFrame':           0,
		'padding0':             bytes(4),
		'reflectivity':         (0.4, 0.3, 0.1),
		'padding1':             bytes(4),
		'bumpmapScale':         0.738,
		'highResImageFormat':   32
	})

	print(vtf_empty['signature'])
	print(vtf_empty['version'])
	print(vtf_empty['headerSize'])
	print(vtf_empty['width'])
	print(vtf_empty['height'])
	print(vtf_empty['flags'])
	print(vtf_empty['frames'])
	print(vtf_empty['firstFrame'])
	print(vtf_empty['padding0'])
	print(vtf_empty['reflectivity'])
	print(vtf_empty['padding1'])
	print(vtf_empty['bumpmapScale'])
	print(vtf_empty['highResImageFormat'])

