#!/bin/sh
# Cuts the hero loop from CSC's own YouTube film "Behind the Scenes: Maverick in Action" (fC7vms9BlLA, 1080p),
# downloaded to _scrape/ with: yt-dlp -f "bv*[height<=1080][ext=mp4]" -o "_scrape/film-%(id)s.%(ext)s" fC7vms9BlLA
# The first half carries burned-in captions, so only caption-free pour shots after 2:29 are used: five 4s cuts,
# no audio, 1600x900. The poster is the first frame of the loop.
set -e
SRC=_scrape/film-fC7vms9BlLA.mp4
OUT=public/media
f=""; i=0
for s in 149 174 190 200 210; do
  f="$f[0:v]trim=start=$s:duration=4,setpts=PTS-STARTPTS,scale=1600:900,setsar=1[v$i];"; i=$((i+1))
done
ffmpeg -loglevel error -y -i "$SRC" -filter_complex "${f}[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0,fps=25[out]" \
  -map "[out]" -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "$OUT/pour.mp4"
ffmpeg -loglevel error -y -ss 0.2 -i "$OUT/pour.mp4" -frames:v 1 -q:v 3 "$OUT/pour-poster.jpg"
ls -la "$OUT/pour.mp4" "$OUT/pour-poster.jpg"
