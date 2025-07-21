import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Upload card background template
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file'); // name of the input field

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'Invalid file input' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await imagekit.upload({
      file: buffer,
      fileName: `card-background-${school._id}-${Date.now()}`,
      folder: `/card-backgrounds/${school._id}`,
    });
    console.log('Upload successful:', upload);
    school.idCard.url = upload.url;
    school.idCard.publicId = upload.fileId;
    await school.save();

    return NextResponse.json({
      message: 'Card background uploaded successfully',
      cardBackgroundUrl: upload.url,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
