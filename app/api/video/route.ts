import { authOptions } from "@/lib/auth.options";
import { connectDB } from "@/lib/mongodb";
import Video, { IVideo } from '@/models/video.model'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";


export async function GET() {
    try {
        await connectDB();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        if(!videos || videos.length === 0){
            return NextResponse.json([], {status : 200})
        }
        
        return NextResponse.json(videos);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error : "Unauthorized"},
                {status  : 401}
            )
        }

        await connectDB()

        const body: IVideo = await request.json();

        if(
            !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl
        ) {
            return NextResponse.json(
                {error : "Missing value"},
                {status : 400}
            )
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation : {
                height : 1920,
                width : 1080,
                quality:  100
            }
        }

        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo, { status: 201 })
    } catch (error) {
        console.error("Failed to create video", error)
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
    }
}