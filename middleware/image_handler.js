import multer from 'multer';

const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname +
				'-' +
				Date.now() +
				'.' +
				file.mimetype.split('/')[1],
		);
	},
});

const upload = multer({
	storage: imageStorage,
	fileFilter: function (req, file, callback) {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg'
		) {
			callback(null, true);
		} else {
			console.log('only jpg & png file supported');
			callback(null, false);
		}
	},
}).single('image');

export default upload;
