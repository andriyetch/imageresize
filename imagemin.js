import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozJpeg from 'imagemin-mozjpeg';

import Path from 'path';
import FS from 'fs';

let Files  = [];
let extensions = ['.png', '.jpg', '.jpeg']

var imageDirectory = "D:\\testtttttttttttt" //paste your img directory here, 
								//resized images will go into another folder called "resized"
								//in the same parent directory as the original

const files = async (filepath, adjustedPath) => {
	try {
		await imagemin([filepath], {
			destination: adjustedPath,
			plugins: [
				imageminMozJpeg(),
				imageminPngquant({
					quality: [0.6, 0.8] //change quality settings here
				})
			]
		});
	} catch (error) {
		throw error
	}
}

async function ThroughDirectory(Directory) {
    FS.readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return Files.push(Absolute);
    });
}

ThroughDirectory(imageDirectory).then(async () => {
	var counter = 0
	var errorFiles = []

	for (let i = 0; i < Files.length; i++) {
		
		const adjustedPath = Path.join(imageDirectory, "..", "resized");

		if (extensions.includes(Path.extname(Files[i]).toLowerCase())) {
			await files(Files[i], adjustedPath).then(() => {
				console.log()
				console.log(Files[i])
				console.log(`End ${i}`)
			}).catch((error) => {
				console.log('error')
				console.log(error)
				counter++
				errorFiles.push(Files[i])
				console.log(`Error on file ${Files[i]}`);
				console.log(`adjustedPath: ${adjustedPath}`);
			})
		}
	}
	console.log(errorFiles)
	console.log(`Had an error with the above ${counter} files`)
});
