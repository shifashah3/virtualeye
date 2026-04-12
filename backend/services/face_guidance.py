from __future__ import annotations
from typing import Dict, Any, List, Optional, Tuple
import math

RECENT_STATE = {
    "angle": None,
    "bbox_center": None,
    "stable_count": 0,
}

REQUIRED_ANGLES = ["front", "left", "right", "up", "down"]


def _center_of_bbox(bbox: List[int]) -> Tuple[float, float]:
    x1, y1, x2, y2 = bbox
    return ((x1 + x2) / 2.0, (y1 + y2) / 2.0)


def _bbox_size_ratio(bbox: List[int], frame_w: int, frame_h: int) -> float:
    x1, y1, x2, y2 = bbox
    face_area = max(1, (x2 - x1) * (y2 - y1))
    frame_area = max(1, frame_w * frame_h)
    return face_area / frame_area


def _estimate_position(bbox: List[int], frame_w: int, frame_h: int) -> str:
    cx, cy = _center_of_bbox(bbox)

    x_ratio = cx / max(1, frame_w)
    y_ratio = cy / max(1, frame_h)

    if x_ratio < 0.38:
        return "move_left"
    if x_ratio > 0.62:
        return "move_right"
    if y_ratio < 0.36:
        return "move_up"
    if y_ratio > 0.64:
        return "move_down"

    return "centered"


def _estimate_distance(bbox: List[int], frame_w: int, frame_h: int) -> str:
    ratio = _bbox_size_ratio(bbox, frame_w, frame_h)

    if ratio < 0.09:
        return "too_far"
    if ratio > 0.34:
        return "too_close"
    return "good"


# def _estimate_angle(landmarks: Optional[Dict[str, List[float]]]) -> str:
#     if not landmarks:
#         return "unknown"

#     left_eye = landmarks["left_eye"]
#     right_eye = landmarks["right_eye"]
#     nose = landmarks["nose"]
#     mouth_left = landmarks["mouth_left"]
#     mouth_right = landmarks["mouth_right"]

#     eye_mid_x = (left_eye[0] + right_eye[0]) / 2.0
#     eye_mid_y = (left_eye[1] + right_eye[1]) / 2.0
#     mouth_mid_x = (mouth_left[0] + mouth_right[0]) / 2.0
#     mouth_mid_y = (mouth_left[1] + mouth_right[1]) / 2.0

#     eye_dist = max(1.0, abs(right_eye[0] - left_eye[0]))
#     nose_dx = (nose[0] - eye_mid_x) / eye_dist
#     vertical_ratio = (nose[1] - eye_mid_y) / max(1.0, (mouth_mid_y - eye_mid_y))

#     if nose_dx < -0.12:
#         return "left"
#     if nose_dx > 0.12:
#         return "right"
#     if vertical_ratio < 0.42:
#         return "up"
#     if vertical_ratio > 0.62:
#         return "down"
#     return "front"

def _estimate_angle(landmarks):
    if not landmarks:
        return "front"

    left_eye = landmarks.get("left_eye")
    right_eye = landmarks.get("right_eye")
    nose = landmarks.get("nose")
    mouth_left = landmarks.get("mouth_left")
    mouth_right = landmarks.get("mouth_right")

    if not all([left_eye, right_eye, nose, mouth_left, mouth_right]):
        return "front"

    eye_mid_x = (left_eye[0] + right_eye[0]) / 2.0
    eye_mid_y = (left_eye[1] + right_eye[1]) / 2.0
    mouth_mid_y = (mouth_left[1] + mouth_right[1]) / 2.0

    eye_dist = max(1.0, abs(right_eye[0] - left_eye[0]))
    nose_dx = (nose[0] - eye_mid_x) / eye_dist
    vertical_ratio = (nose[1] - eye_mid_y) / max(1.0, (mouth_mid_y - eye_mid_y))

    if nose_dx < -0.10:
        return "left"
    if nose_dx > 0.10:
        return "right"
    if vertical_ratio < 0.38:
        return "up"
    if vertical_ratio > 0.68:
        return "down"
    return "front"
def _is_stable(angle: str, bbox: List[int]) -> bool:
    global RECENT_STATE

    cx, cy = _center_of_bbox(bbox)
    prev_angle = RECENT_STATE["angle"]
    prev_center = RECENT_STATE["bbox_center"]

    if prev_angle != angle or prev_center is None:
        RECENT_STATE["angle"] = angle
        RECENT_STATE["bbox_center"] = (cx, cy)
        RECENT_STATE["stable_count"] = 1
        return False

    dx = abs(cx - prev_center[0])
    dy = abs(cy - prev_center[1])

    if dx < 16 and dy < 16:
        RECENT_STATE["stable_count"] += 1
    else:
        RECENT_STATE["stable_count"] = 1

    RECENT_STATE["angle"] = angle
    RECENT_STATE["bbox_center"] = (cx, cy)

    return RECENT_STATE["stable_count"] >= 2


def build_guidance_response(
    frame_shape: Tuple[int, int],
    face: Optional[Dict[str, Any]],
    required_angle: Optional[str],
    captured_angles: List[str],
) -> Dict[str, Any]:
    frame_h, frame_w = frame_shape

    if face is None:
        return {
            "ok": True,
            "faceDetected": False,
            "shouldCapture": False,
            "stable": False,
            "distance": "good",
            "position": "centered",
            "angle": "unknown",
            "duplicateAngle": False,
            "nextRequiredAngle": required_angle,
            "message": "No face detected. Hold the phone in front of your face.",
        }

    bbox = face["bbox"]
    landmarks = face.get("landmarks")

    distance = _estimate_distance(bbox, frame_w, frame_h)
    position = _estimate_position(bbox, frame_w, frame_h)
    angle = _estimate_angle(landmarks)

    duplicate_angle = angle in captured_angles
    stable = False
    should_capture = False
    message = None

    if distance != "good":
        message = "Move the phone a little away." if distance == "too_close" else "Bring the phone a little closer."
    elif position != "centered":
        pos_msg = {
            "move_left": "Move the phone slightly left.",
            "move_right": "Move the phone slightly right.",
            "move_up": "Move the phone slightly up.",
            "move_down": "Move the phone slightly down.",
        }
        message = pos_msg[position]
    elif angle == "unknown":
        message = "Adjust your face."
    elif duplicate_angle:
        duplicate_msgs = {
            "front": "Front angle already captured. Turn slightly left.",
            "left": "Left angle already captured. Turn slightly right.",
            "right": "Right angle already captured. Lift your chin slightly.",
            "up": "Up angle already captured. Lower your chin slightly.",
            "down": "Down angle already captured. Face front again.",
        }
        message = duplicate_msgs.get(angle, "Adjust your face.")
    elif required_angle and angle != required_angle:
        next_msgs = {
            "front": "Look straight ahead.",
            "left": "Slowly turn a little left.",
            "right": "Slowly turn a little right.",
            "up": "Lift your chin slightly.",
            "down": "Lower your chin slightly.",
        }
        message = next_msgs.get(required_angle, "Adjust your face.")
    else:
        stable = _is_stable(angle, bbox)
        if stable:
            should_capture = True
            message = "Capturing image."
        else:
            message = "Hold still."

    return {
        "ok": True,
        "faceDetected": True,
        "shouldCapture": should_capture,
        "stable": stable,
        "distance": distance,
        "position": position,
        "angle": angle,
        "duplicateAngle": duplicate_angle,
        "nextRequiredAngle": required_angle,
        "message": message,
    }