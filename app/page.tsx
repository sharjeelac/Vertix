"use client";

import FileUpload from "@/app/components/FileUpload";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type VideoItem = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt?: string;
};

type UploadResult = {
  url?: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/video");
      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setVideoProgress(0);
    setThumbProgress(0);
  };

  const handleCreateVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      setError("Please provide title, description, video, and thumbnail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error ?? "Failed to create video");
      }

      await fetchVideos();
      resetForm();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create video");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-8 rounded-3xl border border-orange-200/70 bg-card/90 p-6 shadow-[0_20px_60px_-35px_rgba(106,57,27,0.45)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
              Vertix Dashboard
            </p>
            <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Upload and showcase your videos</h1>
            <p className="mt-2 text-sm text-muted sm:text-base">A warm, focused workspace for creators and teams.</p>
          </div>

          <div className="shrink-0">
        {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-stone-700">
                  {session.user?.email}
                </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
                  className="rounded-xl bg-stone-900 px-4 py-2 font-medium text-white transition hover:bg-stone-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
                <Link className="rounded-xl border border-orange-300 bg-white px-4 py-2 font-medium text-stone-800" href="/login">
              Login
            </Link>
                <Link className="rounded-xl bg-linear-to-r from-brand to-brand-2 px-4 py-2 font-medium text-white" href="/register">
              Register
            </Link>
          </div>
        )}
          </div>
        </div>
      </header>

      {status === "authenticated" && (
        <section className="mb-10 rounded-3xl border border-orange-200/70 bg-card p-5 shadow-[0_16px_45px_-36px_rgba(106,57,27,0.5)] sm:p-6">
          <h2 className="mb-1 text-2xl font-semibold text-stone-900">Upload New Video</h2>
          <p className="mb-5 text-sm text-muted">Complete both uploads first, then publish your video entry.</p>
          <form className="space-y-4" onSubmit={handleCreateVideo}>
            <input
              type="text"
              className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-ring/50"
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-ring/50"
              placeholder="Video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4">
                <p className="mb-2 text-sm font-semibold text-stone-800">Video File</p>
                <FileUpload
                  fileType="video"
                  onProgress={(p) => setVideoProgress(p)}
                  onSuccess={(result: UploadResult) => {
                    setVideoUrl(result.url ?? "");
                  }}
                />
                <p className="mt-2 inline-flex rounded-full border border-orange-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700">
                  Progress: {videoProgress}%
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4">
                <p className="mb-2 text-sm font-semibold text-stone-800">Thumbnail Image</p>
                <FileUpload
                  fileType="image"
                  onProgress={(p) => setThumbProgress(p)}
                  onSuccess={(result: UploadResult) => {
                    setThumbnailUrl(result.url ?? "");
                  }}
                />
                <p className="mt-2 inline-flex rounded-full border border-orange-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700">
                  Progress: {thumbProgress}%
                </p>
              </div>
            </div>

            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-linear-to-r from-brand to-brand-2 px-5 py-2.5 font-semibold text-white transition hover:brightness-105 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Create Video"}
            </button>
          </form>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-stone-900">Latest Videos</h2>
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-orange-200 bg-card p-6 text-sm text-muted">
            No videos yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article key={video._id} className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-orange-200 bg-card shadow-[0_18px_40px_-34px_rgba(106,57,27,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(106,57,27,0.55)]">
                <video
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  controls
                  className="aspect-9/16 w-full bg-black object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-stone-900">{video.title}</h3>
                  <p className="mt-2 text-sm text-muted">{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
