import numpy as np, subprocess, math
from PIL import Image, ImageDraw, ImageFilter

# ============================================================
# 1) 영상 기본 설정
# ============================================================
W, H = 1920, 1080        # 가로형 (세로형으로 돌리려면 1080, 1350 등)
FPS, SEC = 30, 8         # 프레임 수, 길이(초)
OUTPUT = "out.mp4"

# ============================================================
# 2) 색상 (RGB)
# ============================================================
MINT = (233, 244, 239)   # 전체 바탕색
LAYERS = [               # (색, 크기 비율) — 바깥 → 안쪽 순서
    ((204, 239, 245), 1.00),   # 시안
    ((220, 214, 240), 0.86),   # 라벤더
    ((251, 241, 230), 0.74),   # 크림
]
CENTER = (172, 212, 251)       # 가운데 하늘색 타원

# ============================================================
# 3) 모양과 움직임
#    크기는 화면 대비 비율 (기본값 ± 흔들림 폭)
# ============================================================
BOX_W  = (0.46, 0.06)    # 사각형 가로 폭: 기본 46%, ±6%
BOX_H  = (0.62, 0.10)    # 사각형 세로 높이: 기본 62%, ±10%
RADIUS = (0.18, 0.10)    # 모서리 둥글기 (짧은 변 대비)
CENTER_SIZE = (0.62, 0.45)  # 가운데 타원 (가로, 세로) — 사각형 대비
BLUR = 42                # 흐림 정도. 클수록 더 몽환적 (화면 크기에 비례해 조절)

# ============================================================
# 4) 렌더링 (보통은 수정할 필요 없음)
# ============================================================
p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                      '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-pix_fmt', 'yuv420p', '-crf', '18', OUTPUT], stdin=subprocess.PIPE)
N = FPS * SEC
for i in range(N):
    t = i / N
    ph = 2 * math.pi * t

    # 모든 움직임이 sin(ph × 정수)라서 마지막 프레임 다음이 첫 프레임과 똑같아짐 → 끊김 없는 루프
    # (ph에 곱하는 숫자는 반드시 정수로 유지하세요)
    # 가로·세로를 서로 다른 주기로 움직여서 '숨 쉬는' 느낌
    bw  = W * (BOX_W[0] + BOX_W[1] * math.sin(ph * 2 + 1))
    bh  = H * (BOX_H[0] + BOX_H[1] * math.sin(ph))
    rad = RADIUS[0] + RADIUS[1] * (0.5 + 0.5 * math.sin(ph + 2))

    im = Image.new('RGB', (W, H), MINT)
    d = ImageDraw.Draw(im)
    for col, s in LAYERS:
        w, h = bw * s, bh * s
        r = min(w, h) * rad
        d.rounded_rectangle([W/2 - w/2, H/2 - h/2, W/2 + w/2, H/2 + h/2], radius=r, fill=col)
    ew, eh = bw * CENTER_SIZE[0], bh * CENTER_SIZE[1]
    d.ellipse([W/2 - ew/2, H/2 - eh/2, W/2 + ew/2, H/2 + eh/2], fill=CENTER)

    im = im.filter(ImageFilter.GaussianBlur(BLUR))
    p.stdin.write(im.tobytes())
p.stdin.close(); p.wait()
print("done:", OUTPUT)

# Google Colab에서 실행하면 자동으로 다운로드
try:
    from google.colab import files
    files.download(OUTPUT)
except ImportError:
    pass
