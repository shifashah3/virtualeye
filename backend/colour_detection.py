# # # from PIL import Image
# # # import numpy as np
# # # import io
# # # from sklearn.cluster import KMeans
# # # import webcolors

# # # class ColorDetector:
# # #     def __init__(self):
# # #         """Initialize color detector"""
# # #         self.color_names = self._get_extended_color_names()
        
# # #     def _get_extended_color_names(self):
# # #         """Get a comprehensive list of color names"""
# # #         return {
# # #             # Basic colors
# # #             (0, 0, 0): 'black',
# # #             (255, 255, 255): 'white',
# # #             (128, 128, 128): 'gray',
# # #             (192, 192, 192): 'silver',
            
# # #             # Red family
# # #             (255, 0, 0): 'red',
# # #             (220, 20, 60): 'crimson',
# # #             (139, 0, 0): 'dark red',
# # #             (255, 192, 203): 'pink',
# # #             (255, 20, 147): 'deep pink',
# # #             (255, 105, 180): 'hot pink',
# # #             (255, 182, 193): 'light pink',
            
# # #             # Orange family
# # #             (255, 165, 0): 'orange',
# # #             (255, 140, 0): 'dark orange',
# # #             (255, 69, 0): 'red orange',
# # #             (255, 127, 80): 'coral',
# # #             (255, 99, 71): 'tomato',
            
# # #             # Yellow family
# # #             (255, 255, 0): 'yellow',
# # #             (255, 215, 0): 'gold',
# # #             (255, 255, 224): 'light yellow',
# # #             (189, 183, 107): 'dark khaki',
# # #             (240, 230, 140): 'khaki',
            
# # #             # Green family
# # #             (0, 128, 0): 'green',
# # #             (0, 255, 0): 'lime',
# # #             (34, 139, 34): 'forest green',
# # #             (0, 100, 0): 'dark green',
# # #             (144, 238, 144): 'light green',
# # #             (152, 251, 152): 'pale green',
# # #             (143, 188, 143): 'dark sea green',
# # #             (0, 255, 127): 'spring green',
# # #             (46, 139, 87): 'sea green',
# # #             (107, 142, 35): 'olive',
# # #             (128, 128, 0): 'olive drab',
            
# # #             # Blue family
# # #             (0, 0, 255): 'blue',
# # #             (0, 0, 139): 'dark blue',
# # #             (0, 0, 205): 'medium blue',
# # #             (173, 216, 230): 'light blue',
# # #             (135, 206, 235): 'sky blue',
# # #             (0, 191, 255): 'deep sky blue',
# # #             (70, 130, 180): 'steel blue',
# # #             (100, 149, 237): 'cornflower blue',
# # #             (30, 144, 255): 'dodger blue',
# # #             (176, 224, 230): 'powder blue',
            
# # #             # Purple/Violet family
# # #             (128, 0, 128): 'purple',
# # #             (138, 43, 226): 'blue violet',
# # #             (148, 0, 211): 'dark violet',
# # #             (153, 50, 204): 'dark orchid',
# # #             (186, 85, 211): 'medium orchid',
# # #             (221, 160, 221): 'plum',
# # #             (238, 130, 238): 'violet',
# # #             (147, 112, 219): 'medium purple',
# # #             (216, 191, 216): 'thistle',
# # #             (75, 0, 130): 'indigo',
            
# # #             # Brown family
# # #             (165, 42, 42): 'brown',
# # #             (139, 69, 19): 'saddle brown',
# # #             (160, 82, 45): 'sienna',
# # #             (205, 133, 63): 'peru',
# # #             (210, 105, 30): 'chocolate',
# # #             (244, 164, 96): 'sandy brown',
# # #             (222, 184, 135): 'burlywood',
# # #             (210, 180, 140): 'tan',
# # #             (245, 245, 220): 'beige',
# # #             (245, 222, 179): 'wheat',
            
# # #             # Cyan family
# # #             (0, 255, 255): 'cyan',
# # #             (0, 139, 139): 'dark cyan',
# # #             (0, 206, 209): 'dark turquoise',
# # #             (64, 224, 208): 'turquoise',
# # #             (72, 209, 204): 'medium turquoise',
# # #             (175, 238, 238): 'pale turquoise',
# # #             (127, 255, 212): 'aquamarine',
            
# # #             # Magenta family
# # #             (255, 0, 255): 'magenta',
# # #             (139, 0, 139): 'dark magenta',
# # #         }
    
# # #     def _closest_color_name(self, rgb):
# # #         """Find the closest color name for an RGB value"""
# # #         min_colors = {}
        
# # #         for color_rgb, name in self.color_names.items():
# # #             rd = (rgb[0] - color_rgb[0]) ** 2
# # #             gd = (rgb[1] - color_rgb[1]) ** 2
# # #             bd = (rgb[2] - color_rgb[2]) ** 2
# # #             min_colors[(rd + gd + bd)] = name
            
# # #         return min_colors[min(min_colors.keys())]
    
# # #     def _get_color_category(self, rgb):
# # #         """Categorize color into broad categories"""
# # #         r, g, b = rgb
        
# # #         # Calculate brightness
# # #         brightness = (r + g + b) / 3
        
# # #         # Black and white
# # #         if brightness < 30:
# # #             return "black"
# # #         if brightness > 225 and max(r, g, b) - min(r, g, b) < 30:
# # #             return "white"
        
# # #         # Gray
# # #         if max(r, g, b) - min(r, g, b) < 30:
# # #             if brightness < 100:
# # #                 return "dark gray"
# # #             elif brightness < 180:
# # #                 return "gray"
# # #             else:
# # #                 return "light gray"
        
# # #         # Determine dominant channel
# # #         max_channel = max(r, g, b)
        
# # #         # Red dominant
# # #         if r == max_channel and r > g + 30 and r > b + 30:
# # #             return "red"
        
# # #         # Green dominant
# # #         if g == max_channel and g > r + 30 and g > b + 30:
# # #             return "green"
        
# # #         # Blue dominant
# # #         if b == max_channel and b > r + 30 and b > g + 30:
# # #             return "blue"
        
# # #         # Mixed colors
# # #         if r > 200 and g > 100 and g < 200 and b < 100:
# # #             return "orange"
        
# # #         if r > 200 and g > 200 and b < 100:
# # #             return "yellow"
        
# # #         if r > 150 and b > 150 and g < 150:
# # #             return "purple"
        
# # #         if g > 150 and b > 150 and r < 150:
# # #             return "cyan"
        
# # #         if r > 100 and g < 100 and b < 100:
# # #             return "brown"
        
# # #         return "mixed color"
    
    
# # #     def detect_color(self, image_bytes, n_colors=3):
# # #         """
# # #         Detect dominant colors in an image
        
# # #         Args:
# # #             image_bytes: Image as bytes
# # #             n_colors: Number of dominant colors to extract
            
# # #         Returns:
# # #             dict: Color detection results with dominant colors and names
# # #         """
# # #         # Convert bytes to PIL Image
# # #         image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
# # #         # Resize for faster processing
# # #         image.thumbnail((300, 300))
        
# # #         # Convert to numpy array
# # #         image_np = np.array(image)
        
# # #         # Reshape image to be a list of pixels
# # #         pixels = image_np.reshape(-1, 3)
        
# # #         # Use KMeans to find dominant colors
# # #         kmeans = KMeans(n_clusters=min(n_colors, len(pixels)), random_state=42, n_init=10)
# # #         kmeans.fit(pixels)
        
# # #         # Get the colors
# # #         colors = kmeans.cluster_centers_.astype(int)
        
# # #         # Get the count of pixels for each cluster
# # #         labels = kmeans.labels_
# # #         counts = np.bincount(labels)
        
# # #         # Sort colors by frequency
# # #         indices = np.argsort(-counts)
# # #         sorted_colors = colors[indices]
# # #         sorted_counts = counts[indices]
        
# # #         # Calculate percentages
# # #         total_pixels = len(pixels)
# # #         percentages = (sorted_counts / total_pixels * 100).tolist()
        
# # #         # Create results
# # #         dominant_colors = []
# # #         for i, (color, percentage) in enumerate(zip(sorted_colors, percentages)):
# # #             # Convert numpy integers to Python integers for JSON serialization
# # #             rgb = tuple(int(x) for x in color)
# # #             hex_color = '#{:02x}{:02x}{:02x}'.format(*rgb)
            
# # #             # Get color name
# # #             # color_name = self._closest_color_name(rgb)
# # #             # category = self._get_color_category(rgb)
# # #             raw_name = self._closest_color_name(rgb)
# # #             category = self._get_color_category(rgb)

# # #             if category in ["black", "white", "dark gray", "gray", "light gray"]:
# # #                 color_name = category
# # #             elif raw_name in ["sea green", "dark sea green", "light green", "pale green", "spring green"]:
# # #                 color_name = "green"
# # #             elif raw_name == "silver":
# # #                 color_name = "off white" if sum(rgb)/3 > 185 else "gray"
# # #             else:
# # #                 color_name = raw_name
            
# # #             dominant_colors.append({
# # #                 'rank': i + 1,
# # #                 'rgb': rgb,
# # #                 'hex': hex_color,
# # #                 'name': color_name,
# # #                 'category': category,
# # #                 'percentage': round(percentage, 2),
# # #                 'is_primary': i == 0
# # #             })
        
# # #         # Primary color for announcement
# # #         primary_color = dominant_colors[0] if dominant_colors else None
        
# # #         return {
# # #             'dominant_colors': dominant_colors,
# # #             'primary_color': primary_color,
# # #             'color_count': len(dominant_colors),
# # #             'image_size': {
# # #                 'width': image.width,
# # #                 'height': image.height
# # #             }
# # #         }
    
# # #     # def detect_color_simple(self, image_bytes):
# # #     #     """
# # #     #     Detect single dominant color - optimized for real-time feedback
        
# # #     #     Args:
# # #     #         image_bytes: Image as bytes
            
# # #     #     Returns:
# # #     #         dict: Single dominant color information
# # #     #     """
# # #     #     # Convert bytes to PIL Image
# # #     #     image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
# # #     #     # Resize to very small for fast processing
# # #     #     image.thumbnail((100, 100))
        
# # #     #     # Convert to numpy array
# # #     #     image_np = np.array(image)
        
# # #     #     # Get center region (middle 50% of image) for more accurate color
# # #     #     h, w = image_np.shape[:2]
# # #     #     center_h_start, center_h_end = h // 4, 3 * h // 4
# # #     #     center_w_start, center_w_end = w // 4, 3 * w // 4
# # #     #     center_region = image_np[center_h_start:center_h_end, center_w_start:center_w_end]
        
# # #     #     # Calculate average color of center region
# # #     #     avg_color = center_region.reshape(-1, 3).mean(axis=0).astype(int)
# # #     #     # Convert numpy integers to Python integers for JSON serialization
# # #     #     rgb = tuple(int(x) for x in avg_color)
        
# # #     #     hex_color = '#{:02x}{:02x}{:02x}'.format(*rgb)
# # #     #     color_name = self._closest_color_name(rgb)
# # #     #     category = self._get_color_category(rgb)
        
# # #     #     return {
# # #     #         'rgb': rgb,
# # #     #         'hex': hex_color,
# # #     #         'name': color_name,
# # #     #         'category': category,
# # #     #         'description': f"The dominant color is {color_name}"
# # #     #     }
    
# # #     # def detect_color_simple(self, image_bytes):
# # #     #     """
# # #     #     Detect a stable clothing color for real-time feedback
# # #     #     """
# # #     #     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
# # #     #     image.thumbnail((100, 100))

# # #     #     image_np = np.array(image)

# # #     #     h, w = image_np.shape[:2]
# # #     #     center_h_start, center_h_end = h // 4, 3 * h // 4
# # #     #     center_w_start, center_w_end = w // 4, 3 * w // 4
# # #     #     center_region = image_np[center_h_start:center_h_end, center_w_start:center_w_end]

# # #     #     pixels = center_region.reshape(-1, 3)

# # #     #     # Ignore very bright highlights and very dark shadow extremes when possible
# # #     #     brightness = pixels.mean(axis=1)
# # #     #     filtered = pixels[(brightness > 15) & (brightness < 245)]
# # #     #     if len(filtered) < 50:
# # #     #         filtered = pixels

# # #     #     avg_color = filtered.mean(axis=0).astype(int)
# # #     #     rgb = tuple(int(x) for x in avg_color)
# # #     #     hex_color = '#{:02x}{:02x}{:02x}'.format(*rgb)

# # #     #     spoken_color = self._get_clothing_color_name(rgb)

# # #     #     return {
# # #     #         "rgb": rgb,
# # #     #         "hex": hex_color,
# # #     #         "name": spoken_color,
# # #     #         "category": spoken_color,
# # #     #         "description": f"The dominant color is {spoken_color}"
# # #     #     }
# # #     def detect_color_simple(self, image_bytes):
# # #         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
# # #         image.thumbnail((100, 100))

# # #         image_np = np.array(image)

# # #         h, w = image_np.shape[:2]
# # #         center_h_start, center_h_end = h // 4, 3 * h // 4
# # #         center_w_start, center_w_end = w // 4, 3 * w // 4
# # #         center_region = image_np[center_h_start:center_h_end, center_w_start:center_w_end]

# # #         pixels = center_region.reshape(-1, 3)

# # #         brightness = pixels.mean(axis=1)

# # #         # remove very dark shadow pixels and very bright highlights
# # #         filtered = pixels[(brightness > 50) & (brightness < 245)]
# # #         if len(filtered) < 50:
# # #             filtered = pixels

# # #         avg_color = filtered.mean(axis=0).astype(int)
# # #         rgb = tuple(int(x) for x in avg_color)
# # #         hex_color = '#{:02x}{:02x}{:02x}'.format(*rgb)

# # #         spoken_color = self._get_clothing_color_name(rgb)

# # #         return {
# # #             "rgb": rgb,
# # #             "hex": hex_color,
# # #             "name": spoken_color,
# # #             "category": spoken_color,
# # #             "description": f"The dominant color is {spoken_color}"
# # #         }
# # #     # def _get_clothing_color_name(self, rgb):
# # #     #     r, g, b = rgb
# # #     #     brightness = (r + g + b) / 3
# # #     #     spread = max(r, g, b) - min(r, g, b)

# # #     #     # neutrals first
# # #     #     if brightness < 55:
# # #     #         return "black"

# # #     #     if spread < 10:
# # #     #         if brightness > 235:
# # #     #             return "white"
# # #     #         elif brightness > 200:
# # #     #             return "off white"
# # #     #         elif brightness > 140:
# # #     #             return "gray"
# # #     #         else:
# # #     #             return "dark gray"

# # #     #     # brown / beige family
# # #     #     if r > 150 and g > 130 and b < 130:
# # #     #         if brightness > 190:
# # #     #             return "beige"
# # #     #         return "brown"

# # #     #     # main colors
# # #     #     if r > g + 25 and r > b + 25:
# # #     #         return "red"

# # #     #     if g > r + 25 and g > b + 25:
# # #     #         return "green"

# # #     #     if b > r + 25 and b > g + 25:
# # #     #         return "blue"

# # #     #     if r > 180 and g > 180 and b < 140:
# # #     #         return "yellow"

# # #     #     if r > 170 and g > 100 and b < 120:
# # #     #         return "orange"

# # #     #     if r > 120 and b > 120 and g < 120:
# # #     #         return "purple"

# # #     #     if g > 140 and b > 140 and r < 120:
# # #     #         return "cyan"

# # #     #     if brightness > 200:
# # #     #         return "off white"

# # #     #     return "gray"
# # #     # def _get_clothing_color_name(self, rgb):
# # #     #     r, g, b = rgb
# # #     #     brightness = (r + g + b) / 3
# # #     #     spread = max(r, g, b) - min(r, g, b)

# # #     #     # neutrals first
# # #     #     if brightness < 55:
# # #     #         return "black"

# # #     #     if spread < 12:
# # #     #         if brightness > 235:
# # #     #             return "white"
# # #     #         elif brightness > 205:
# # #     #             return "off white"
# # #     #         elif brightness > 170:
# # #     #             return "light gray"
# # #     #         elif brightness > 110:
# # #     #             return "gray"
# # #     #         else:
# # #     #             return "dark gray"

# # #     #     # beige / brown
# # #     #     if r > 170 and g > 155 and b < 150:
# # #     #         if brightness > 190:
# # #     #             return "beige"
# # #     #         return "brown"

# # #     #     # pink family
# # #     #     if r > 170 and b > 150 and g > 120:
# # #     #         if brightness > 190:
# # #     #             return "pastel pink"
# # #     #         return "pink"

# # #     #     # purple family
# # #     #     if r > 120 and b > 120 and g < 140:
# # #     #         return "purple"

# # #     #     # blue family
# # #     #     if b > r + 15 and b > g + 15:
# # #     #         if brightness > 180:
# # #     #             return "light blue"
# # #     #         elif brightness < 90:
# # #     #             return "dark blue"
# # #     #         return "blue"

# # #     #     # green family
# # #     #     if g > r + 15 and g > b + 15:
# # #     #         if brightness > 170:
# # #     #             return "light green"
# # #     #         elif brightness < 100:
# # #     #             return "dark green"
# # #     #         return "green"

# # #     #     # red family
# # #     #     if r > g + 20 and r > b + 20:
# # #     #         return "red"

# # #     #     # yellow
# # #     #     if r > 180 and g > 180 and b < 140:
# # #     #         return "yellow"

# # #     #     return "gray"
# # #     def _get_clothing_color_name(self, rgb):
# # #         r, g, b = rgb
# # #         brightness = (r + g + b) / 3
# # #         spread = max(r, g, b) - min(r, g, b)

# # #         # 1. very dark -> black
# # #         if brightness < 55:
# # #             return "black"

# # #         # 2. off white / beige first
# # #         # handles cases like off white shalwar
# # #         if r > 180 and g > 170 and b < 170:
# # #             if brightness > 205:
# # #                 return "off white"
# # #             return "beige"

# # #         # 3. green family
# # #         if g > r + 12 and g > b + 12:
# # #             if brightness > 170:
# # #                 return "light green"
# # #             elif brightness < 95:
# # #                 return "dark green"
# # #             return "green"

# # #         # 4. blue family
# # #         if b > r + 12 and b > g + 12:
# # #             if brightness > 180:
# # #                 return "light blue"
# # #             elif brightness < 95:
# # #                 return "dark blue"
# # #             return "blue"

# # #         # 5. purple family
# # #         if r > 115 and b > 115 and g < min(r, b) - 10:
# # #             return "purple"

# # #         # 6. pink family
# # #         # pink needs red dominance, not just all channels being high
# # #         if r > g + 10 and r > b + 10:
# # #             if brightness > 190 and spread < 60:
# # #                 return "pastel pink"
# # #             return "pink"

# # #         # 7. red family
# # #         if r > g + 20 and r > b + 20:
# # #             return "red"

# # #         # 8. yellow
# # #         if r > 185 and g > 185 and b < 145:
# # #             return "yellow"

# # #         # 9. true neutral colors only
# # #         if spread < 8:
# # #             if brightness > 235:
# # #                 return "white"
# # #             elif brightness > 210:
# # #                 return "off white"
# # #             elif brightness > 170:
# # #                 return "light gray"
# # #             elif brightness > 120:
# # #                 return "gray"
# # #             else:
# # #                 return "dark gray"

# # #         # 10. brown-ish fallback
# # #         if r > 120 and g > 90 and b < 100:
# # #             return "brown"

# # #         # 11. final fallback
# # #         if brightness > 200:
# # #             return "off white"
# # #         if brightness < 85:
# # #             return "dark gray"
# # #         return "gray"

# # from PIL import Image
# # import numpy as np
# # import io
# # import cv2
# # from sklearn.cluster import KMeans
# # from collections import defaultdict, deque, Counter


# # # =========================================================
# # # CONFIG
# # # =========================================================

# # CLASS_NAMES = {
# #     0: "shirt",
# #     1: "kameez",
# #     2: "dupatta",
# #     3: "shalwar",
# #     4: "trouser",
# #     5: "scarf"
# # }

# # CONF_THRESHOLD = 0.70
# # MIN_BOX_AREA_RATIO = 0.08
# # STABLE_FRAMES_REQUIRED = 4
# # FINAL_ANSWER_REQUIRED_HITS = 3
# # IOU_THRESHOLD = 0.45
# # BLUR_THRESHOLD = 80.0

# # # if your model outputs normalized xyxy:
# # TFLITE_OUTPUT_FORMAT = "xyxy"
# # # if needed later, change to:
# # # TFLITE_OUTPUT_FORMAT = "xywh"


# # # =========================================================
# # # HELPERS
# # # =========================================================

# # def compute_iou(box_a, box_b):
# #     if box_a is None or box_b is None:
# #         return 0.0

# #     ax1, ay1, ax2, ay2 = box_a
# #     bx1, by1, bx2, by2 = box_b

# #     inter_x1 = max(ax1, bx1)
# #     inter_y1 = max(ay1, by1)
# #     inter_x2 = min(ax2, bx2)
# #     inter_y2 = min(ay2, by2)

# #     inter_w = max(0, inter_x2 - inter_x1)
# #     inter_h = max(0, inter_y2 - inter_y1)
# #     inter_area = inter_w * inter_h

# #     area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
# #     area_b = max(0, bx2 - bx1) * max(0, by2 - by1)
# #     union = area_a + area_b - inter_area

# #     if union <= 0:
# #         return 0.0

# #     return inter_area / union


# # def is_frame_blurry(image_np, threshold=BLUR_THRESHOLD):
# #     gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
# #     score = cv2.Laplacian(gray, cv2.CV_64F).var()
# #     return score < threshold, float(score)


# # def clip_box(box, width, height):
# #     x1, y1, x2, y2 = box

# #     x1 = max(0, min(int(x1), width - 1))
# #     y1 = max(0, min(int(y1), height - 1))
# #     x2 = max(0, min(int(x2), width))
# #     y2 = max(0, min(int(y2), height))

# #     if x2 <= x1 or y2 <= y1:
# #         return None

# #     return (x1, y1, x2, y2)


# # def non_max_suppression(detections, iou_threshold=0.5):
# #     """
# #     Basic NMS on detections:
# #     detections = [
# #         {"bbox": (x1, y1, x2, y2), "confidence": 0.9, "class_name": "shirt"}
# #     ]
# #     """
# #     if not detections:
# #         return []

# #     detections = sorted(detections, key=lambda d: d["confidence"], reverse=True)
# #     kept = []

# #     while detections:
# #         best = detections.pop(0)
# #         kept.append(best)

# #         remaining = []
# #         for det in detections:
# #             # suppress only if same class and overlapping a lot
# #             same_class = det["class_name"] == best["class_name"]
# #             overlap = compute_iou(det["bbox"], best["bbox"])

# #             if same_class and overlap > iou_threshold:
# #                 continue

# #             remaining.append(det)

# #         detections = remaining

# #     return kept


# # # =========================================================
# # # TFLITE PARSING
# # # =========================================================

# # def parse_tflite_output_xyxy(output_array, image_width, image_height, class_names):
# #     """
# #     Expected row format:
# #     [x1, y1, x2, y2, score, class_id]
# #     where coordinates are normalized in [0,1]
# #     """
# #     detections = []

# #     rows = np.array(output_array)
# #     if rows.ndim == 3:
# #         rows = rows[0]

# #     for row in rows:
# #         if len(row) < 6:
# #             continue

# #         x1, y1, x2, y2, score, class_id = row[:6]

# #         score = float(score)
# #         class_id = int(class_id)

# #         if class_id not in class_names:
# #             continue

# #         x1 = int(x1 * image_width)
# #         y1 = int(y1 * image_height)
# #         x2 = int(x2 * image_width)
# #         y2 = int(y2 * image_height)

# #         box = clip_box((x1, y1, x2, y2), image_width, image_height)
# #         if box is None:
# #             continue

# #         detections.append({
# #             "bbox": box,
# #             "confidence": score,
# #             "class_name": class_names[class_id]
# #         })

# #     return detections


# # def parse_tflite_output_xywh(output_array, image_width, image_height, class_names):
# #     """
# #     Expected row format:
# #     [x_center, y_center, width, height, score, class_id]
# #     where coordinates are normalized in [0,1]
# #     """
# #     detections = []

# #     rows = np.array(output_array)
# #     if rows.ndim == 3:
# #         rows = rows[0]

# #     for row in rows:
# #         if len(row) < 6:
# #             continue

# #         xc, yc, bw, bh, score, class_id = row[:6]

# #         score = float(score)
# #         class_id = int(class_id)

# #         if class_id not in class_names:
# #             continue

# #         x1 = int((xc - bw / 2) * image_width)
# #         y1 = int((yc - bh / 2) * image_height)
# #         x2 = int((xc + bw / 2) * image_width)
# #         y2 = int((yc + bh / 2) * image_height)

# #         box = clip_box((x1, y1, x2, y2), image_width, image_height)
# #         if box is None:
# #             continue

# #         detections.append({
# #             "bbox": box,
# #             "confidence": score,
# #             "class_name": class_names[class_id]
# #         })

# #     return detections


# # def parse_tflite_output(output_array, image_width, image_height, class_names, output_format="xyxy"):
# #     if output_format == "xywh":
# #         return parse_tflite_output_xywh(output_array, image_width, image_height, class_names)

# #     return parse_tflite_output_xyxy(output_array, image_width, image_height, class_names)


# # # =========================================================
# # # STABILIZERS
# # # =========================================================

# # class StableAnswerTracker:
# #     def __init__(self, maxlen=5, required_hits=3):
# #         self.history = deque(maxlen=maxlen)
# #         self.required_hits = required_hits

# #     def reset(self):
# #         self.history.clear()

# #     def update(self, value):
# #         self.history.append(value)
# #         counts = Counter(self.history)
# #         best_value, best_count = counts.most_common(1)[0]
# #         is_stable = best_count >= self.required_hits
# #         return is_stable, best_value, dict(counts)


# # class ClothingDetectionStabilizer:
# #     def __init__(self, required_hits=4, iou_threshold=0.45):
# #         self.required_hits = required_hits
# #         self.iou_threshold = iou_threshold
# #         self.last_box = None
# #         self.last_class = None
# #         self.hits = 0

# #     def reset(self):
# #         self.last_box = None
# #         self.last_class = None
# #         self.hits = 0

# #     def update(self, class_name, box):
# #         same_class = class_name == self.last_class
# #         similar_box = compute_iou(box, self.last_box) >= self.iou_threshold

# #         if same_class and similar_box:
# #             self.hits += 1
# #         else:
# #             self.hits = 1

# #         self.last_class = class_name
# #         self.last_box = box

# #         return self.hits >= self.required_hits


# # # =========================================================
# # # COLOR DETECTOR
# # # =========================================================

# # class ColorDetector:
# #     """
# #     BBox-based clothing color detector.
# #     Only returns a simple spoken color.
# #     """

# #     def __init__(self):
# #         self.color_history = defaultdict(lambda: deque(maxlen=5))

# #     def clear_history(self, history_key=None):
# #         if history_key is None:
# #             self.color_history.clear()
# #         else:
# #             self.color_history.pop(history_key, None)

# #     def _rgb_to_hex(self, rgb):
# #         return '#{:02x}{:02x}{:02x}'.format(*rgb)

# #     def _crop_to_box(self, image_np, box):
# #         h, w = image_np.shape[:2]
# #         box = clip_box(box, w, h)
# #         if box is None:
# #             return None

# #         x1, y1, x2, y2 = box
# #         crop = image_np[y1:y2, x1:x2]
# #         if crop.size == 0:
# #             return None

# #         return crop

# #     def _extract_inner_region(self, crop_np, shrink_ratio=0.22):
# #         """
# #         Shrink inward to reduce background leakage from box borders.
# #         """
# #         h, w = crop_np.shape[:2]
# #         if h < 12 or w < 12:
# #             return crop_np

# #         dx = int(w * shrink_ratio)
# #         dy = int(h * shrink_ratio)

# #         x1 = dx
# #         y1 = dy
# #         x2 = max(x1 + 1, w - dx)
# #         y2 = max(y1 + 1, h - dy)

# #         inner = crop_np[y1:y2, x1:x2]
# #         if inner.size == 0:
# #             return crop_np

# #         return inner

# #     def _extract_reliable_pixels(self, region_np):
# #         if region_np is None or region_np.size == 0:
# #             return np.empty((0, 3), dtype=np.uint8)

# #         pixels = region_np.reshape(-1, 3)
# #         if len(pixels) == 0:
# #             return np.empty((0, 3), dtype=np.uint8)

# #         brightness = pixels.mean(axis=1)
# #         max_rgb = pixels.max(axis=1)
# #         min_rgb = pixels.min(axis=1)
# #         saturation = max_rgb - min_rgb

# #         # try to remove harsh highlights/shadows and washed-out junk
# #         filtered = pixels[
# #             (brightness > 30) &
# #             (brightness < 245) &
# #             (saturation > 8)
# #         ]

# #         if len(filtered) < 60:
# #             filtered = pixels[
# #                 (brightness > 20) &
# #                 (brightness < 250)
# #             ]

# #         if len(filtered) < 25:
# #             filtered = pixels

# #         return filtered

# #     def _get_dominant_rgb(self, pixels, max_clusters=3):
# #         if len(pixels) == 0:
# #             return (128, 128, 128)

# #         n_clusters = min(max_clusters, len(pixels))
# #         if n_clusters <= 1:
# #             avg = pixels.mean(axis=0).astype(int)
# #             return tuple(int(x) for x in avg)

# #         kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
# #         kmeans.fit(pixels)

# #         labels = kmeans.labels_
# #         centers = kmeans.cluster_centers_
# #         counts = np.bincount(labels)

# #         dominant_idx = np.argmax(counts)
# #         dominant_rgb = centers[dominant_idx].astype(int)

# #         return tuple(int(x) for x in dominant_rgb)

# #     def _force_light_neutral_if_applicable(self, rgb):
# #         r, g, b = rgb
# #         brightness = (r + g + b) / 3
# #         spread = max(r, g, b) - min(r, g, b)

# #         if brightness > 225 and spread < 35:
# #             return "white"
# #         if brightness > 185 and spread < 35:
# #             return "off white"

# #         return None

# #     def _get_simple_color_name(self, rgb):
# #         neutral = self._force_light_neutral_if_applicable(rgb)
# #         if neutral is not None:
# #             return neutral

# #         r, g, b = rgb
# #         brightness = (r + g + b) / 3
# #         spread = max(r, g, b) - min(r, g, b)

# #         if brightness < 40:
# #             return "black"

# #         if spread < 15:
# #             if brightness > 235:
# #                 return "white"
# #             elif brightness > 195:
# #                 return "off white"
# #             else:
# #                 return "gray"

# #         if r > 170 and g > 160 and b < 130:
# #             return "yellow"

# #         if r > 110 and g > 75 and b < 100:
# #             if brightness > 180:
# #                 return "off white"
# #             return "brown"

# #         if g > r + 15 and g > b + 15:
# #             return "green"

# #         if b > r + 15 and b > g + 15:
# #             return "blue"

# #         if r > 100 and b > 100 and g < min(r, b) - 10:
# #             return "purple"

# #         if r > 165 and b > 130 and g > 95:
# #             return "pink"

# #         if r > g + 20 and r > b + 20:
# #             return "red"

# #         if brightness > 190:
# #             return "off white"

# #         return "gray"

# #     def detect_color_simple(self, image_bytes, bbox, history_key="default"):
# #         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
# #         image.thumbnail((640, 640))
# #         image_np = np.array(image)

# #         crop = self._crop_to_box(image_np, bbox)
# #         if crop is None:
# #             return None

# #         inner = self._extract_inner_region(crop, shrink_ratio=0.22)
# #         filtered_pixels = self._extract_reliable_pixels(inner)
# #         rgb = self._get_dominant_rgb(filtered_pixels, max_clusters=3)

# #         raw_color = self._get_simple_color_name(rgb)

# #         history = self.color_history[history_key]
# #         history.append(raw_color)
# #         stable_color = Counter(history).most_common(1)[0][0]

# #         return {
# #             "rgb": rgb,
# #             "hex": self._rgb_to_hex(rgb),
# #             "name": stable_color,
# #             "raw_name": raw_color,
# #             "used_bbox": True
# #         }


# # # =========================================================
# # # FULL PIPELINE
# # # =========================================================

# # class ClothingColorPipeline:
# #     def __init__(
# #         self,
# #         confidence_threshold=CONF_THRESHOLD,
# #         min_box_area_ratio=MIN_BOX_AREA_RATIO,
# #         stable_frames_required=STABLE_FRAMES_REQUIRED,
# #         final_answer_required_hits=FINAL_ANSWER_REQUIRED_HITS,
# #         iou_threshold=IOU_THRESHOLD,
# #         blur_threshold=BLUR_THRESHOLD
# #     ):
# #         self.confidence_threshold = confidence_threshold
# #         self.min_box_area_ratio = min_box_area_ratio
# #         self.blur_threshold = blur_threshold

# #         self.color_detector = ColorDetector()
# #         self.detection_stabilizer = ClothingDetectionStabilizer(
# #             required_hits=stable_frames_required,
# #             iou_threshold=iou_threshold
# #         )
# #         self.final_answer_tracker = StableAnswerTracker(
# #             maxlen=5,
# #             required_hits=final_answer_required_hits
# #         )

# #     def reset(self):
# #         self.color_detector.clear_history()
# #         self.detection_stabilizer.reset()
# #         self.final_answer_tracker.reset()

# #     def is_valid_clothing_detection(self, box, conf, class_name, image_shape):
# #         h, w = image_shape[:2]
# #         x1, y1, x2, y2 = [int(v) for v in box]

# #         bw = max(0, x2 - x1)
# #         bh = max(0, y2 - y1)
# #         area = bw * bh
# #         image_area = w * h

# #         if bw <= 0 or bh <= 0:
# #             return False

# #         if conf < self.confidence_threshold:
# #             return False

# #         if area < image_area * self.min_box_area_ratio:
# #             return False

# #         edge_margin_x = int(0.03 * w)
# #         edge_margin_y = int(0.03 * h)

# #         touches_left = x1 <= edge_margin_x
# #         touches_right = x2 >= w - edge_margin_x
# #         touches_top = y1 <= edge_margin_y
# #         touches_bottom = y2 >= h - edge_margin_y

# #         edge_touches = sum([touches_left, touches_right, touches_top, touches_bottom])
# #         if edge_touches >= 2:
# #             return False

# #         aspect_ratio = bw / max(bh, 1)

# #         cname = class_name.lower()
# #         if cname in ["dupatta", "scarf", "shawl"]:
# #             if aspect_ratio < 0.12 or aspect_ratio > 5.0:
# #                 return False
# #         else:
# #             if aspect_ratio < 0.20 or aspect_ratio > 2.5:
# #                 return False

# #         return True

# #     def select_best_clothing_detection(self, detections, image_shape):
# #         valid = []

# #         for det in detections:
# #             box = det["bbox"]
# #             conf = float(det["confidence"])
# #             class_name = str(det["class_name"])

# #             if self.is_valid_clothing_detection(box, conf, class_name, image_shape):
# #                 x1, y1, x2, y2 = box
# #                 area = max(0, x2 - x1) * max(0, y2 - y1)

# #                 valid.append({
# #                     "bbox": tuple(int(v) for v in box),
# #                     "confidence": conf,
# #                     "class_name": class_name,
# #                     "area": area
# #                 })

# #         if not valid:
# #             return None

# #         # first suppress duplicates
# #         valid = non_max_suppression(valid, iou_threshold=0.5)

# #         if not valid:
# #             return None

# #         valid.sort(key=lambda d: (d["confidence"], d["area"]), reverse=True)
# #         return valid[0]

# #     def process_frame(self, image_bytes, raw_tflite_output, class_names=CLASS_NAMES, output_format=TFLITE_OUTPUT_FORMAT):
# #         """
# #         Main entry point.
# #         raw_tflite_output is the raw output tensor from the TFLite model.
# #         """
# #         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
# #         image.thumbnail((640, 640))
# #         image_np = np.array(image)
# #         h, w = image_np.shape[:2]

# #         blurry, blur_score = is_frame_blurry(image_np, threshold=self.blur_threshold)
# #         if blurry:
# #             self.detection_stabilizer.reset()
# #             self.final_answer_tracker.reset()
# #             return {
# #                 "detected": False,
# #                 "speak": None,
# #                 "color": None,
# #                 "bbox": None,
# #                 "class_name": None,
# #                 "status": "frame_too_blurry",
# #                 "blur_score": blur_score
# #             }

# #         detections = parse_tflite_output(
# #             output_array=raw_tflite_output,
# #             image_width=w,
# #             image_height=h,
# #             class_names=class_names,
# #             output_format=output_format
# #         )

# #         best = self.select_best_clothing_detection(detections, image_np.shape)
# #         if best is None:
# #             self.detection_stabilizer.reset()
# #             self.final_answer_tracker.reset()
# #             return {
# #                 "detected": False,
# #                 "speak": None,
# #                 "color": None,
# #                 "bbox": None,
# #                 "class_name": None,
# #                 "status": "no_valid_clothing_detected",
# #                 "blur_score": blur_score
# #             }

# #         is_detection_stable = self.detection_stabilizer.update(
# #             best["class_name"],
# #             best["bbox"]
# #         )

# #         if not is_detection_stable:
# #             self.final_answer_tracker.reset()
# #             return {
# #                 "detected": False,
# #                 "speak": None,
# #                 "color": None,
# #                 "bbox": best["bbox"],
# #                 "class_name": best["class_name"],
# #                 "status": "waiting_for_stable_detection",
# #                 "blur_score": blur_score,
# #                 "confidence": best["confidence"]
# #             }

# #         history_key = best["class_name"]
# #         color_result = self.color_detector.detect_color_simple(
# #             image_bytes=image_bytes,
# #             bbox=best["bbox"],
# #             history_key=history_key
# #         )

# #         if color_result is None:
# #             self.final_answer_tracker.reset()
# #             return {
# #                 "detected": False,
# #                 "speak": None,
# #                 "color": None,
# #                 "bbox": best["bbox"],
# #                 "class_name": best["class_name"],
# #                 "status": "color_detection_failed",
# #                 "blur_score": blur_score,
# #                 "confidence": best["confidence"]
# #             }

# #         proposed_color = color_result["name"]
# #         is_answer_stable, stable_color, counts = self.final_answer_tracker.update(proposed_color)

# #         if not is_answer_stable:
# #             return {
# #                 "detected": False,
# #                 "speak": None,
# #                 "color": None,
# #                 "bbox": best["bbox"],
# #                 "class_name": best["class_name"],
# #                 "status": "waiting_for_stable_color",
# #                 "blur_score": blur_score,
# #                 "confidence": best["confidence"],
# #                 "proposed_color": proposed_color,
# #                 "hex": color_result["hex"],
# #                 "rgb": color_result["rgb"],
# #                 "color_counts": counts
# #             }

# #         return {
# #             "detected": True,
# #             "speak": stable_color,   # speak ONLY color
# #             "color": stable_color,
# #             "bbox": best["bbox"],
# #             "class_name": best["class_name"],
# #             "status": "stable_color_ready",
# #             "blur_score": blur_score,
# #             "confidence": best["confidence"],
# #             "hex": color_result["hex"],
# #             "rgb": color_result["rgb"],
# #             "color_counts": counts
# #         }


# # # =========================================================
# # # EXAMPLE USAGE
# # # =========================================================

# # def run_pipeline_on_tflite_output(image_bytes, raw_tflite_output):
# #     pipeline = ClothingColorPipeline(
# #         confidence_threshold=0.70,
# #         min_box_area_ratio=0.08,
# #         stable_frames_required=4,
# #         final_answer_required_hits=3,
# #         iou_threshold=0.45,
# #         blur_threshold=80.0
# #     )

# #     result = pipeline.process_frame(
# #         image_bytes=image_bytes,
# #         raw_tflite_output=raw_tflite_output,
# #         class_names=CLASS_NAMES,
# #         output_format=TFLITE_OUTPUT_FORMAT
# #     )

# #     return result

# from PIL import Image
# import numpy as np
# import io
# import cv2
# from sklearn.cluster import KMeans
# from collections import defaultdict, deque, Counter


# # =========================================================
# # CONFIG
# # =========================================================

# CLASS_NAMES = {
#     0: "shirt",
#     1: "kameez",
#     2: "dupatta",
#     3: "shalwar",
#     4: "trouser",
#     5: "scarf",
#     6: "short",
#     7: "top",
#     8: "tshirt",
#     9: "shawl",
#     10: "pants"
# }

# # stricter thresholds
# CONF_THRESHOLD = 0.75
# MIN_BOX_AREA_RATIO = 0.10
# STABLE_FRAMES_REQUIRED = 5
# FINAL_ANSWER_REQUIRED_HITS = 4
# IOU_THRESHOLD = 0.50
# BLUR_THRESHOLD = 100.0

# # "xyxy" => [x1, y1, x2, y2, score, class_id]
# # "xywh" => [xc, yc, w, h, score, class_id]
# TFLITE_OUTPUT_FORMAT = "xyxy"


# # =========================================================
# # HELPERS
# # =========================================================

# def normalize_class_name(name: str) -> str:
#     name = str(name).lower().strip()

#     if name in ["shirt", "tshirt", "t-shirt", "top", "short"]:
#         return "shirt"

#     if name in ["dupatta", "scarf", "shawl"]:
#         return "dupatta"

#     if name in ["shalwar", "trouser", "pants"]:
#         return "shalwar"

#     return name


# def compute_iou(box_a, box_b):
#     if box_a is None or box_b is None:
#         return 0.0

#     ax1, ay1, ax2, ay2 = box_a
#     bx1, by1, bx2, by2 = box_b

#     inter_x1 = max(ax1, bx1)
#     inter_y1 = max(ay1, by1)
#     inter_x2 = min(ax2, bx2)
#     inter_y2 = min(ay2, by2)

#     inter_w = max(0, inter_x2 - inter_x1)
#     inter_h = max(0, inter_y2 - inter_y1)
#     inter_area = inter_w * inter_h

#     area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
#     area_b = max(0, bx2 - bx1) * max(0, by2 - by1)
#     union = area_a + area_b - inter_area

#     if union <= 0:
#         return 0.0

#     return inter_area / union


# def is_frame_blurry(image_np, threshold=BLUR_THRESHOLD):
#     gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
#     score = cv2.Laplacian(gray, cv2.CV_64F).var()
#     return score < threshold, float(score)


# def clip_box(box, width, height):
#     x1, y1, x2, y2 = box

#     x1 = max(0, min(int(x1), width - 1))
#     y1 = max(0, min(int(y1), height - 1))
#     x2 = max(0, min(int(x2), width))
#     y2 = max(0, min(int(y2), height))

#     if x2 <= x1 or y2 <= y1:
#         return None

#     return (x1, y1, x2, y2)


# def non_max_suppression(detections, iou_threshold=0.5):
#     if not detections:
#         return []

#     detections = sorted(detections, key=lambda d: d["confidence"], reverse=True)
#     kept = []

#     while detections:
#         best = detections.pop(0)
#         kept.append(best)

#         remaining = []
#         for det in detections:
#             same_class = det["class_name"] == best["class_name"]
#             overlap = compute_iou(det["bbox"], best["bbox"])

#             if same_class and overlap > iou_threshold:
#                 continue

#             remaining.append(det)

#         detections = remaining

#     return kept


# # =========================================================
# # TFLITE PARSING
# # =========================================================

# def parse_tflite_output_xyxy(output_array, image_width, image_height, class_names):
#     detections = []

#     rows = np.array(output_array)
#     if rows.ndim == 3:
#         rows = rows[0]

#     for row in rows:
#         if len(row) < 6:
#             continue

#         x1, y1, x2, y2, score, class_id = row[:6]
#         score = float(score)
#         class_id = int(class_id)

#         if class_id not in class_names:
#             continue

#         class_name = normalize_class_name(class_names[class_id])

#         x1 = int(x1 * image_width)
#         y1 = int(y1 * image_height)
#         x2 = int(x2 * image_width)
#         y2 = int(y2 * image_height)

#         box = clip_box((x1, y1, x2, y2), image_width, image_height)
#         if box is None:
#             continue

#         detections.append({
#             "bbox": box,
#             "confidence": score,
#             "class_name": class_name
#         })

#     return detections


# def parse_tflite_output_xywh(output_array, image_width, image_height, class_names):
#     detections = []

#     rows = np.array(output_array)
#     if rows.ndim == 3:
#         rows = rows[0]

#     for row in rows:
#         if len(row) < 6:
#             continue

#         xc, yc, bw, bh, score, class_id = row[:6]
#         score = float(score)
#         class_id = int(class_id)

#         if class_id not in class_names:
#             continue

#         class_name = normalize_class_name(class_names[class_id])

#         x1 = int((xc - bw / 2) * image_width)
#         y1 = int((yc - bh / 2) * image_height)
#         x2 = int((xc + bw / 2) * image_width)
#         y2 = int((yc + bh / 2) * image_height)

#         box = clip_box((x1, y1, x2, y2), image_width, image_height)
#         if box is None:
#             continue

#         detections.append({
#             "bbox": box,
#             "confidence": score,
#             "class_name": class_name
#         })

#     return detections


# def parse_tflite_output(output_array, image_width, image_height, class_names, output_format="xyxy"):
#     if output_format == "xywh":
#         return parse_tflite_output_xywh(output_array, image_width, image_height, class_names)
#     return parse_tflite_output_xyxy(output_array, image_width, image_height, class_names)


# # =========================================================
# # STABILIZERS
# # =========================================================

# class StableAnswerTracker:
#     def __init__(self, maxlen=6, required_hits=4):
#         self.history = deque(maxlen=maxlen)
#         self.required_hits = required_hits

#     def reset(self):
#         self.history.clear()

#     def update(self, value):
#         self.history.append(value)
#         counts = Counter(self.history)
#         best_value, best_count = counts.most_common(1)[0]
#         is_stable = best_count >= self.required_hits
#         return is_stable, best_value, dict(counts)


# class StableClassTracker:
#     def __init__(self, maxlen=6, required_hits=4):
#         self.history = deque(maxlen=maxlen)
#         self.required_hits = required_hits

#     def reset(self):
#         self.history.clear()

#     def update(self, class_name):
#         self.history.append(class_name)
#         counts = Counter(self.history)
#         best_class, best_count = counts.most_common(1)[0]
#         is_stable = best_count >= self.required_hits
#         return is_stable, best_class, dict(counts)


# class ClothingDetectionStabilizer:
#     def __init__(self, required_hits=5, iou_threshold=0.50):
#         self.required_hits = required_hits
#         self.iou_threshold = iou_threshold
#         self.last_box = None
#         self.last_class = None
#         self.hits = 0

#     def reset(self):
#         self.last_box = None
#         self.last_class = None
#         self.hits = 0

#     def update(self, class_name, box):
#         same_class = class_name == self.last_class
#         similar_box = compute_iou(box, self.last_box) >= self.iou_threshold

#         if same_class and similar_box:
#             self.hits += 1
#         else:
#             self.hits = 1

#         self.last_class = class_name
#         self.last_box = box

#         return self.hits >= self.required_hits


# # =========================================================
# # COLOR DETECTOR
# # =========================================================

# class ColorDetector:
#     """
#     Only returns a stable spoken color.
#     No clothing item text should be displayed to users.
#     """

#     def __init__(self):
#         self.color_history = defaultdict(lambda: deque(maxlen=6))

#     def clear_history(self, history_key=None):
#         if history_key is None:
#             self.color_history.clear()
#         else:
#             self.color_history.pop(history_key, None)

#     def _rgb_to_hex(self, rgb):
#         return '#{:02x}{:02x}{:02x}'.format(*rgb)

#     def _crop_to_box(self, image_np, box):
#         h, w = image_np.shape[:2]
#         box = clip_box(box, w, h)
#         if box is None:
#             return None

#         x1, y1, x2, y2 = box
#         crop = image_np[y1:y2, x1:x2]
#         if crop.size == 0:
#             return None

#         return crop

#     def _extract_center_region(self, image_np):
#         h, w = image_np.shape[:2]
#         y1, y2 = h // 3, 2 * h // 3
#         x1, x2 = w // 3, 2 * w // 3
#         region = image_np[y1:y2, x1:x2]
#         if region.size == 0:
#             return image_np
#         return region

#     def _extract_inner_region(self, crop_np, shrink_ratio=0.35, drop_top_ratio=0.12):
#         """
#         Much tighter center crop to avoid hanger, borders, tassels, hands,
#         mirror edges, and background leakage.
#         """
#         h, w = crop_np.shape[:2]
#         if h < 20 or w < 20:
#             return crop_np

#         dx = int(w * shrink_ratio)
#         dy = int(h * shrink_ratio)

#         x1 = dx
#         x2 = max(x1 + 1, w - dx)

#         y1 = dy + int(h * drop_top_ratio)
#         y2 = max(y1 + 1, h - dy)

#         inner = crop_np[y1:y2, x1:x2]
#         if inner.size == 0:
#             return crop_np

#         return inner

#     def _extract_reliable_pixels(self, region_np):
#         if region_np is None or region_np.size == 0:
#             return np.empty((0, 3), dtype=np.uint8)

#         pixels = region_np.reshape(-1, 3)
#         if len(pixels) == 0:
#             return np.empty((0, 3), dtype=np.uint8)

#         brightness = pixels.mean(axis=1)
#         max_rgb = pixels.max(axis=1)
#         min_rgb = pixels.min(axis=1)
#         saturation = max_rgb - min_rgb

#         # stricter filtering
#         filtered = pixels[
#             (brightness > 20) &
#             (brightness < 240) &
#             (saturation > 6)
#         ]

#         if len(filtered) < 80:
#             filtered = pixels[
#                 (brightness > 15) &
#                 (brightness < 245)
#             ]

#         if len(filtered) < 30:
#             filtered = pixels

#         return filtered

#     def _get_dominant_rgb(self, pixels, max_clusters=3):
#         if len(pixels) == 0:
#             return (128, 128, 128)

#         n_clusters = min(max_clusters, len(pixels))
#         if n_clusters <= 1:
#             avg = pixels.mean(axis=0).astype(int)
#             return tuple(int(x) for x in avg)

#         kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
#         kmeans.fit(pixels)

#         labels = kmeans.labels_
#         centers = kmeans.cluster_centers_
#         counts = np.bincount(labels)

#         dominant_idx = np.argmax(counts)
#         dominant_rgb = centers[dominant_idx].astype(int)

#         return tuple(int(x) for x in dominant_rgb)

#     # def _force_dark_override(self, pixels):
#     #     """
#     #     Prevent dark clothing from being misread as off white because of
#     #     highlights, embroidery, hanger, or borders.
#     #     """
#     #     if len(pixels) == 0:
#     #         return None

#     #     brightness = pixels.mean(axis=1)

#     #     dark_ratio = np.mean(brightness < 70)
#     #     medium_dark_ratio = np.mean(brightness < 95)

#     #     if dark_ratio > 0.65:
#     #         return "black"

#     #     if medium_dark_ratio > 0.75:
#     #         return "black"

#     #     return None
#     def _force_dark_override(self, pixels):
#         if len(pixels) == 0:
#             return None

#         brightness = pixels.mean(axis=1)

#         dark_ratio = np.mean(brightness < 55)
#         medium_dark_ratio = np.mean(brightness < 75)

#         # only call it black if MOST pixels are truly dark
#         if dark_ratio > 0.80:
#             return "black"

#         if medium_dark_ratio > 0.90:
#             return "black"

#         return None

#     def _force_light_neutral_if_applicable(self, rgb, pixels=None):
#         r, g, b = rgb
#         brightness = (r + g + b) / 3
#         spread = max(r, g, b) - min(r, g, b)

#         if pixels is not None and len(pixels) > 0:
#             pixel_brightness = pixels.mean(axis=1)
#             dark_ratio = np.mean(pixel_brightness < 90)
#             if dark_ratio > 0.30:
#                 return None

#         if brightness > 230 and spread < 28:
#             return "white"

#         if brightness > 200 and spread < 32:
#             return "off white"

#         return None

#     # def _get_simple_color_name(self, rgb, pixels=None):
#     #     neutral = self._force_light_neutral_if_applicable(rgb, pixels=pixels)
#     #     if neutral is not None:
#     #         return neutral

#     #     r, g, b = rgb
#     #     brightness = (r + g + b) / 3
#     #     spread = max(r, g, b) - min(r, g, b)

#     #     if brightness < 40:
#     #         return "black"

#     #     if spread < 14:
#     #         if brightness > 230:
#     #             return "white"
#     #         elif brightness > 195:
#     #             return "off white"
#     #         else:
#     #             return "gray"

#     #     # purple before red because lilac/lavender was drifting
#     #     if r > 120 and b > 120 and g < min(r, b) - 5:
#     #         return "purple"

#     #     # pastel purple / lavender
#     #     if r > 150 and b > 150 and g > 130 and abs(r - b) < 35:
#     #         return "purple"

#     #     if r > 170 and g > 160 and b < 125:
#     #         return "yellow"

#     #     if r > 105 and g > 70 and b < 100:
#     #         if brightness > 175:
#     #             return "brown"
#     #         return "brown"

#     #     if g > r + 15 and g > b + 15:
#     #         return "green"

#     #     if b > r + 15 and b > g + 15:
#     #         return "blue"

#     #     if r > 165 and b > 130 and g > 95:
#     #         return "pink"

#     #     if r > g + 18 and r > b + 18:
#     #         return "red"

#     #     if brightness > 185:
#     #         return "off white"

#     #     if brightness < 80:
#     #         return "black"

#     #     return "gray"
#     def _get_simple_color_name(self, rgb, pixels=None):
#         r, g, b = rgb
#         brightness = (r + g + b) / 3
#         spread = max(r, g, b) - min(r, g, b)

#         # ---------- very dark ----------
#         if brightness < 45:
#             return "black"

#         # ---------- true neutrals ----------
#         if spread < 18:
#             if brightness > 235:
#                 return "white"
#             elif brightness > 205:
#                 return "off white"
#             elif brightness > 160:
#                 return "gray"
#             elif brightness > 90:
#                 return "gray"
#             else:
#                 return "black"

#         # ---------- beige / tan / cream ----------
#         # warm light neutral, like #bba27d
#         if r > 160 and g > 140 and b > 100:
#             if brightness > 190:
#                 return "off white"
#             return "beige"

#         # ---------- brown / maroon family ----------
#         # dark warm reds should not become black/purple
#         if r > 90 and g < 90 and b < 90:
#             if r > b + 20:
#                 return "red"
#             return "brown"

#         # maroon / burgundy tones
#         if r > 70 and r > g + 20 and r > b + 10 and b < 90:
#             return "red"

#         # ---------- purple ----------
#         # only purple if red and blue are both clearly present
#         if r > 95 and b > 95 and abs(r - b) < 55 and g < min(r, b):
#             return "purple"

#         # lavender / lilac
#         if r > 150 and b > 150 and g > 120 and abs(r - b) < 40:
#             return "purple"

#         # ---------- pink ----------
#         if r > 170 and b > 140 and g > 110:
#             return "pink"

#         # dusty pink / mauve
#         if r > 140 and b > 120 and g > 100 and r > g:
#             return "pink"

#         # ---------- red ----------
#         if r > g + 18 and r > b + 18:
#             return "red"

#         # ---------- green ----------
#         if g > r + 15 and g > b + 15:
#             return "green"

#         # ---------- blue ----------
#         if b > r + 15 and b > g + 15:
#             return "blue"

#         # ---------- yellow ----------
#         if r > 170 and g > 160 and b < 130:
#             return "yellow"

#         # ---------- fallback by brightness ----------
#         if brightness > 200:
#             return "off white"
#         if brightness < 85:
#             return "brown"

#         return "gray"

#     def detect_color_simple(self, image_bytes, bbox=None, history_key="default"):
#         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#         image.thumbnail((640, 640))
#         image_np = np.array(image)

#         if bbox is not None:
#             region = self._crop_to_box(image_np, bbox)
#             if region is None:
#                 return None
#             region = self._extract_inner_region(region, shrink_ratio=0.35, drop_top_ratio=0.12)
#         else:
#             region = self._extract_center_region(image_np)

#         filtered_pixels = self._extract_reliable_pixels(region)
#         rgb = self._get_dominant_rgb(filtered_pixels, max_clusters=3)

#         dark_override = self._force_dark_override(filtered_pixels)
#         if dark_override is not None:
#             raw_color = dark_override
#         else:
#             raw_color = self._get_simple_color_name(rgb, pixels=filtered_pixels)

#         history = self.color_history[history_key]
#         history.append(raw_color)
#         stable_color = Counter(history).most_common(1)[0][0]

#         return {
#             "rgb": rgb,
#             "hex": self._rgb_to_hex(rgb),
#             "name": stable_color,
#             "raw_name": raw_color,
#             "used_bbox": bbox is not None
#         }


# # =========================================================
# # FULL PIPELINE
# # =========================================================

# class ClothingColorPipeline:
#     def __init__(
#         self,
#         confidence_threshold=CONF_THRESHOLD,
#         min_box_area_ratio=MIN_BOX_AREA_RATIO,
#         stable_frames_required=STABLE_FRAMES_REQUIRED,
#         final_answer_required_hits=FINAL_ANSWER_REQUIRED_HITS,
#         iou_threshold=IOU_THRESHOLD,
#         blur_threshold=BLUR_THRESHOLD
#     ):
#         self.confidence_threshold = confidence_threshold
#         self.min_box_area_ratio = min_box_area_ratio
#         self.blur_threshold = blur_threshold

#         self.color_detector = ColorDetector()
#         self.detection_stabilizer = ClothingDetectionStabilizer(
#             required_hits=stable_frames_required,
#             iou_threshold=iou_threshold
#         )
#         self.class_tracker = StableClassTracker(
#             maxlen=6,
#             required_hits=4
#         )
#         self.final_answer_tracker = StableAnswerTracker(
#             maxlen=6,
#             required_hits=final_answer_required_hits
#         )

#     def reset(self):
#         self.color_detector.clear_history()
#         self.detection_stabilizer.reset()
#         self.class_tracker.reset()
#         self.final_answer_tracker.reset()

#     def is_valid_clothing_detection(self, box, conf, class_name, image_shape):
#         h, w = image_shape[:2]
#         x1, y1, x2, y2 = [int(v) for v in box]

#         bw = max(0, x2 - x1)
#         bh = max(0, y2 - y1)
#         area = bw * bh
#         image_area = w * h

#         if bw <= 0 or bh <= 0:
#             return False

#         if conf < self.confidence_threshold:
#             return False

#         if area < image_area * self.min_box_area_ratio:
#             return False

#         edge_margin_x = int(0.04 * w)
#         edge_margin_y = int(0.04 * h)

#         touches_left = x1 <= edge_margin_x
#         touches_right = x2 >= w - edge_margin_x
#         touches_top = y1 <= edge_margin_y
#         touches_bottom = y2 >= h - edge_margin_y

#         edge_touches = sum([touches_left, touches_right, touches_top, touches_bottom])
#         if edge_touches >= 2:
#             return False

#         aspect_ratio = bw / max(bh, 1)
#         cname = normalize_class_name(class_name)

#         if cname == "dupatta":
#             if aspect_ratio < 0.10 or aspect_ratio > 5.5:
#                 return False
#         elif cname == "shirt" or cname == "kameez":
#             if aspect_ratio < 0.20 or aspect_ratio > 2.2:
#                 return False
#         elif cname == "shalwar":
#             if aspect_ratio < 0.15 or aspect_ratio > 2.5:
#                 return False

#         return True

#     def select_best_clothing_detection(self, detections, image_shape):
#         valid = []

#         for det in detections:
#             box = det["bbox"]
#             conf = float(det["confidence"])
#             class_name = normalize_class_name(det["class_name"])

#             if self.is_valid_clothing_detection(box, conf, class_name, image_shape):
#                 x1, y1, x2, y2 = box
#                 area = max(0, x2 - x1) * max(0, y2 - y1)

#                 valid.append({
#                     "bbox": tuple(int(v) for v in box),
#                     "confidence": conf,
#                     "class_name": class_name,
#                     "area": area
#                 })

#         if not valid:
#             return None

#         valid = non_max_suppression(valid, iou_threshold=0.5)
#         if not valid:
#             return None

#         valid.sort(key=lambda d: (d["confidence"], d["area"]), reverse=True)
#         return valid[0]

#     def process_frame(self, image_bytes, raw_tflite_output, class_names=CLASS_NAMES, output_format=TFLITE_OUTPUT_FORMAT):
#         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#         image.thumbnail((640, 640))
#         image_np = np.array(image)
#         h, w = image_np.shape[:2]

#         blurry, blur_score = is_frame_blurry(image_np, threshold=self.blur_threshold)
#         if blurry:
#             self.detection_stabilizer.reset()
#             self.class_tracker.reset()
#             self.final_answer_tracker.reset()
#             return {
#                 "detected": False,
#                 "speak": None,
#                 "status": "frame_too_blurry",
#                 "blur_score": blur_score
#             }

#         detections = parse_tflite_output(
#             output_array=raw_tflite_output,
#             image_width=w,
#             image_height=h,
#             class_names=class_names,
#             output_format=output_format
#         )

#         best = self.select_best_clothing_detection(detections, image_np.shape)
#         if best is None:
#             self.detection_stabilizer.reset()
#             self.class_tracker.reset()
#             self.final_answer_tracker.reset()
#             return {
#                 "detected": False,
#                 "speak": None,
#                 "status": "no_valid_clothing_detected",
#                 "blur_score": blur_score
#             }

#         class_name = normalize_class_name(best["class_name"])

#         is_box_stable = self.detection_stabilizer.update(class_name, best["bbox"])
#         is_class_stable, stable_class, class_counts = self.class_tracker.update(class_name)

#         if not is_box_stable or not is_class_stable:
#             self.final_answer_tracker.reset()
#             return {
#                 "detected": False,
#                 "speak": None,
#                 "status": "waiting_for_stable_detection",
#                 "blur_score": blur_score,
#                 "confidence": best["confidence"],
#                 "class_counts": class_counts
#             }

#         history_key = stable_class
#         color_result = self.color_detector.detect_color_simple(
#             image_bytes=image_bytes,
#             bbox=best["bbox"],
#             history_key=history_key
#         )

#         if color_result is None:
#             self.final_answer_tracker.reset()
#             return {
#                 "detected": False,
#                 "speak": None,
#                 "status": "color_detection_failed",
#                 "blur_score": blur_score,
#                 "confidence": best["confidence"]
#             }

#         proposed_color = color_result["name"]
#         is_answer_stable, stable_color, color_counts = self.final_answer_tracker.update(proposed_color)

#         if not is_answer_stable:
#             return {
#                 "detected": False,
#                 "speak": None,
#                 "status": "waiting_for_stable_color",
#                 "blur_score": blur_score,
#                 "confidence": best["confidence"],
#                 "proposed_color": proposed_color,
#                 "color_counts": color_counts
#             }

#         # IMPORTANT: only return color name for display/speech
#         return {
#             "detected": True,
#             "speak": stable_color,
#             "color": stable_color,
#             "status": "stable_color_ready"
#         }


# # =========================================================
# # OPTIONAL COMPATIBILITY FUNCTION
# # =========================================================

# def run_pipeline_on_tflite_output(image_bytes, raw_tflite_output):
#     pipeline = ClothingColorPipeline(
#         confidence_threshold=CONF_THRESHOLD,
#         min_box_area_ratio=MIN_BOX_AREA_RATIO,
#         stable_frames_required=STABLE_FRAMES_REQUIRED,
#         final_answer_required_hits=FINAL_ANSWER_REQUIRED_HITS,
#         iou_threshold=IOU_THRESHOLD,
#         blur_threshold=BLUR_THRESHOLD
#     )

#     return pipeline.process_frame(
#         image_bytes=image_bytes,
#         raw_tflite_output=raw_tflite_output,
#         class_names=CLASS_NAMES,
#         output_format=TFLITE_OUTPUT_FORMAT
#     )

from PIL import Image
import numpy as np
import io
import cv2
from sklearn.cluster import KMeans
from collections import defaultdict, deque, Counter


class ColorDetector:
    """
    Robust clothing color detector using:
    1. bbox crop or center crop
    2. filtered pixels
    3. dominant cluster
    4. LAB palette matching
    """

    def __init__(self):
        self.color_history = defaultdict(lambda: deque(maxlen=6))

        # LAB palette: compact user-friendly colors only
        # Stored as OpenCV LAB values
        self.color_palette_lab = {
            "black":     (20, 128, 128),
            "white":     (245, 128, 128),
            "off white": (225, 128, 132),
            "gray":      (160, 128, 128),
            "beige":     (190, 135, 145),
            "brown":     (110, 145, 155),
            "red":       (110, 180, 160),
            "pink":      (180, 150, 145),
            "purple":    (105, 155, 105),
            "blue":      (90, 120, 80),
            "green":     (130, 105, 155),
            "yellow":    (220, 120, 190),
            "orange":    (170, 150, 185),
        }

    def clear_history(self, history_key=None):
        if history_key is None:
            self.color_history.clear()
        else:
            self.color_history.pop(history_key, None)

    def _rgb_to_hex(self, rgb):
        return "#{:02x}{:02x}{:02x}".format(*rgb)

    def _rgb_to_lab(self, rgb):
        arr = np.uint8([[list(rgb)]])
        lab = cv2.cvtColor(arr, cv2.COLOR_RGB2LAB)[0][0]
        return tuple(int(x) for x in lab)

    def _lab_distance(self, a, b):
        return float(np.sqrt(sum((x - y) ** 2 for x, y in zip(a, b))))

    def _crop_to_box(self, image_np, box):
        h, w = image_np.shape[:2]
        x1, y1, x2, y2 = box

        x1 = max(0, min(int(x1), w - 1))
        y1 = max(0, min(int(y1), h - 1))
        x2 = max(0, min(int(x2), w))
        y2 = max(0, min(int(y2), h))

        if x2 <= x1 or y2 <= y1:
            return None

        crop = image_np[y1:y2, x1:x2]
        if crop.size == 0:
            return None

        return crop

    def _extract_center_region(self, image_np):
        h, w = image_np.shape[:2]
        y1, y2 = h // 3, 2 * h // 3
        x1, x2 = w // 3, 2 * w // 3

        region = image_np[y1:y2, x1:x2]
        if region.size == 0:
            return image_np

        return region

    def _extract_inner_region(self, crop_np, shrink_ratio=0.30, drop_top_ratio=0.10):
        """
        Shrink bbox inward to reduce hanger/background/border noise.
        """
        h, w = crop_np.shape[:2]
        if h < 20 or w < 20:
            return crop_np

        dx = int(w * shrink_ratio)
        dy = int(h * shrink_ratio)

        x1 = dx
        x2 = max(x1 + 1, w - dx)

        y1 = dy + int(h * drop_top_ratio)
        y2 = max(y1 + 1, h - dy)

        inner = crop_np[y1:y2, x1:x2]
        if inner.size == 0:
            return crop_np

        return inner

    def _extract_reliable_pixels(self, region_np):
        if region_np is None or region_np.size == 0:
            return np.empty((0, 3), dtype=np.uint8)

        pixels = region_np.reshape(-1, 3)
        if len(pixels) == 0:
            return np.empty((0, 3), dtype=np.uint8)

        brightness = pixels.mean(axis=1)
        max_rgb = pixels.max(axis=1)
        min_rgb = pixels.min(axis=1)
        saturation = max_rgb - min_rgb

        # remove extreme highlights + deep shadows first
        filtered = pixels[
            (brightness > 25) &
            (brightness < 235) &
            (saturation > 5)
        ]

        # relaxed fallback
        if len(filtered) < 80:
            filtered = pixels[
                (brightness > 20) &
                (brightness < 245)
            ]

        if len(filtered) < 30:
            filtered = pixels

        return filtered

    def _get_dominant_rgb(self, pixels, max_clusters=3):
        if len(pixels) == 0:
            return (128, 128, 128)

        n_clusters = min(max_clusters, len(pixels))
        if n_clusters <= 1:
            avg = pixels.mean(axis=0).astype(int)
            return tuple(int(x) for x in avg)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(pixels)

        labels = kmeans.labels_
        centers = kmeans.cluster_centers_
        counts = np.bincount(labels)

        dominant_idx = np.argmax(counts)
        dominant_rgb = centers[dominant_idx].astype(int)

        return tuple(int(x) for x in dominant_rgb)

    def _force_dark_override(self, pixels):
        if len(pixels) == 0:
            return None

        brightness = pixels.mean(axis=1)

        very_dark_ratio = np.mean(brightness < 45)
        dark_ratio = np.mean(brightness < 60)

        if very_dark_ratio > 0.85:
            return "black"

        if dark_ratio > 0.92:
            return "black"

        return None

    def _force_neutral_override(self, rgb):
        r, g, b = rgb
        brightness = (r + g + b) / 3
        spread = max(r, g, b) - min(r, g, b)

        if brightness < 38:
            return "black"

        if spread < 18:
            if brightness > 238:
                return "white"
            elif brightness > 205:
                return "off white"
            elif brightness > 145:
                return "gray"
            elif brightness > 85:
                return "gray"
            else:
                return "black"

        return None

    def _classify_with_lab_palette(self, rgb):
        neutral = self._force_neutral_override(rgb)
        if neutral is not None:
            return neutral

        lab = self._rgb_to_lab(rgb)

        best_name = None
        best_dist = float("inf")

        for name, ref_lab in self.color_palette_lab.items():
            dist = self._lab_distance(lab, ref_lab)
            if dist < best_dist:
                best_dist = dist
                best_name = name

        # tiny post-corrections for common mistakes

        r, g, b = rgb
        brightness = (r + g + b) / 3

        # dark maroon should be red, not beige/brown/purple
        if r > g + 15 and r > b + 8 and brightness < 100:
            return "red"

        # olive should lean green, not purple
        if g >= r and r > b and brightness < 95:
            return "green"

        # warm light neutral should not become black
        if brightness > 175 and r > 150 and g > 140 and b > 120:
            if max(r, g, b) - min(r, g, b) < 35:
                return "off white"

        return best_name if best_name is not None else "gray"

    def detect_color(self, image_bytes, n_colors=3):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image.thumbnail((300, 300))
        image_np = np.array(image)

        pixels = image_np.reshape(-1, 3)
        rgb = self._get_dominant_rgb(pixels, max_clusters=n_colors)
        color_name = self._classify_with_lab_palette(rgb)

        return {
            "dominant_colors": [{
                "rank": 1,
                "rgb": rgb,
                "hex": self._rgb_to_hex(rgb),
                "name": color_name,
                "percentage": 100.0,
                "is_primary": True,
            }],
            "primary_color": {
                "rgb": rgb,
                "hex": self._rgb_to_hex(rgb),
                "name": color_name,
            },
            "color_count": 1,
            "image_size": {
                "width": image.width,
                "height": image.height,
            }
        }

    def detect_color_simple(self, image_bytes, bbox=None, history_key="default"):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image.thumbnail((640, 640))
        image_np = np.array(image)

        if bbox is not None:
            region = self._crop_to_box(image_np, bbox)
            if region is None:
                return {
                    "rgb": None,
                    "hex": None,
                    "name": "Unknown",
                    "description": "No color detected",
                }
            region = self._extract_inner_region(region, shrink_ratio=0.30, drop_top_ratio=0.10)
        else:
            region = self._extract_center_region(image_np)

        filtered_pixels = self._extract_reliable_pixels(region)
        rgb = self._get_dominant_rgb(filtered_pixels, max_clusters=3)

        dark_override = self._force_dark_override(filtered_pixels)
        if dark_override is not None:
            raw_color = dark_override
        else:
            raw_color = self._classify_with_lab_palette(rgb)

        history = self.color_history[history_key]
        history.append(raw_color)
        stable_color = Counter(history).most_common(1)[0][0]

        # FIX: Force the name to match the current RGB/Hex
        return {
            "rgb": rgb,
            "hex": self._rgb_to_hex(rgb),
            "name": raw_color,           # Change this to always return the CURRENT color
            "stable_name": stable_color, # Keep this only for debugging
            "used_bbox": bbox is not None
        }