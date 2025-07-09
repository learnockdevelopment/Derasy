import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const label = formData.get('label') || '';
    const isProfile = formData.get('type') === 'profile';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'Invalid file' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const upload = await imagekit.upload({
      file: `data:${file.type};base64,${base64}`,
      fileName: file.name,
      folder: `/children/${params.id}`,
    });

    const child = await Child.findOne({ _id: params.id, parent: user.id });
    if (!child) return NextResponse.json({ message: 'Child not found' }, { status: 404 });

    if (isProfile) {
      child.profileImage = {
        url: upload.url,
        publicId: upload.fileId,
      };
    } else {
      child.documents.push({
        url: upload.url,
        publicId: upload.fileId,
        label,
      });
    }

    await child.save();
    return NextResponse.json({ message: 'Uploaded successfully', child });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Internal error', error: error.message }, { status: 500 });
  }
}
