import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function PUT(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'Invalid file input' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `avatar-${user.id}-${Date.now()}`,
      folder: `/avatars/${user.id}`,
    });

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { avatar: uploadResponse.url },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user: updatedUser, avatarUrl: uploadResponse.url });
  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
