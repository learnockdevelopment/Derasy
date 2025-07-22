import { authenticate } from "@/middlewares/auth";
import { dbConnect } from "@/lib/dbConnect";
import School from "@/models/School";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q")?.trim();

    let filter = {};
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { name: regex },
        { address: regex },
        { code: regex }
      ];
    }

    const schools = await School.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ schools }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching schools:", error);
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Optional: Ensure body is not empty
    if (!body || Object.keys(body).length === 0) {
      return Response.json({ message: "Request body is empty" }, { status: 400 });
    }

    body.approved = true;
    const school = new School(body);
    await school.save();

    return Response.json({ message: "School created", school }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating school:", error);
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
