# from ultralytics import YOLO
# import cv2
# import numpy as np
# from PIL import Image
# import io

# class CurrencyDetector:
#     def __init__(self, model_path='assets/best.pt'):
#         """Initialize currency detector with custom trained model"""
#         self.model = YOLO(model_path)
#         self.class_names = self.model.names
        
#     def detect_currency(self, image_bytes, conf_threshold=0.25):
#         """
#         Detect Pakistani currency in an image
        
#         Args:
#             image_bytes: Image as bytes
#             conf_threshold: Confidence threshold for detections (0-1)
            
#         Returns:
#             dict: Detection results with bounding boxes, classes, and confidences
#         """
#         # Convert bytes to PIL Image
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Convert PIL to numpy array
#         image_np = np.array(image)
        
#         # Run inference
#         results = self.model(image_np, conf=conf_threshold)
        
#         # Process results
#         detections = []
#         total_amount = 0
        
#         for result in results:
#             boxes = result.boxes
#             for box in boxes:
#                 # Get box coordinates
#                 x1, y1, x2, y2 = box.xyxy[0].tolist()
                
#                 # Get confidence and class
#                 confidence = float(box.conf[0])
#                 class_id = int(box.cls[0])
#                 class_name = self.class_names[class_id]
                
#                 # Try to extract currency value from class name
#                 try:
#                     # Assuming class names are like "10", "20", "50", "100", etc.
#                     currency_value = int(''.join(filter(str.isdigit, class_name)))
#                     total_amount += currency_value
#                 except:
#                     currency_value = None
                
#                 detections.append({
#                     'class': class_name,
#                     'class_id': class_id,
#                     'confidence': confidence,
#                     'value': currency_value,
#                     'bbox': {
#                         'x1': x1,
#                         'y1': y1,
#                         'x2': x2,
#                         'y2': y2
#                     }
#                 })
        
#         return {
#             'detections': detections,
#             'count': len(detections),
#             'total_amount': total_amount,
#             'image_size': {
#                 'width': image.width,
#                 'height': image.height
#             }
#         }
    
#     def detect_and_draw(self, image_bytes, conf_threshold=0.25):
#         """
#         Detect currency and return annotated image
        
#         Args:
#             image_bytes: Image as bytes
#             conf_threshold: Confidence threshold for detections
            
#         Returns:
#             bytes: Annotated image as bytes
#         """
#         # Convert bytes to PIL Image
#         image = Image.open(io.BytesIO(image_bytes))
#         image_np = np.array(image)
        
#         # Run inference
#         results = self.model(image_np, conf=conf_threshold)
        
#         # Draw annotations
#         annotated_img = results[0].plot()
        
#         # Convert back to bytes
#         annotated_pil = Image.fromarray(annotated_img)
#         img_byte_arr = io.BytesIO()
#         annotated_pil.save(img_byte_arr, format='PNG')
#         img_byte_arr.seek(0)
        
#         return img_byte_arr.getvalue()

from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io


class CurrencyDetector:
    def _init_(self, model_path='assets/currency_obb.pt'):
        self.model = YOLO(model_path)
        self.class_names = self.model.names

    def _image_from_bytes(self, image_bytes):
        """Convert bytes to RGB numpy array safely."""
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")  # force RGB, handles RGBA/grayscale
        return image, np.array(image)

    def detect_currency(self, image_bytes, conf_threshold=0.5):
        """
        Detect Pakistani currency in an image (OBB model supported)

        Returns:
            dict: detections, count, total_amount, image_size
        """
        image, image_np = self._image_from_bytes(image_bytes)

        results = self.model(image_np, conf=conf_threshold)

        detections = []
        total_amount = 0

        for result in results:
            # the rotated/OBB model returns `⁠ result.obb ⁠` but older releases
            # (or standard models) don't have that attribute at all.  we still
            # need to support genuine OBB outputs because the user is using such
            # a model, so only fall back to `⁠ boxes ⁠` when `⁠ obb ⁠` is missing or
            # empty.  `⁠ hasattr ⁠` avoids the AttributeError that triggered the
            # original 500 error.

            obb_list = getattr(result, "obb", None)
            if obb_list and len(obb_list) > 0:
                # rotated boxes present, convert each to an axis-aligned rect
                for box in obb_list:
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = self.class_names[class_id]

                    # 8 corner coords → (x1,y1,x2,y2,x3,y3,x4,y4)
                    corners = box.xyxyxyxy[0].tolist()
                    pts = np.array(corners, dtype=np.float32)
                    x1 = float(pts[:, 0].min())
                    y1 = float(pts[:, 1].min())
                    x2 = float(pts[:, 0].max())
                    y2 = float(pts[:, 1].max())

                    currency_value = self._extract_value(class_name)
                    if currency_value:
                        total_amount += currency_value

                    detections.append({
                        'class': class_name,
                        'class_id': class_id,
                        'confidence': round(confidence, 4),
                        'value': currency_value,
                        'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
                        'obb': {
                            # include raw corners for downstream users if
                            # they really want the rotated info
                            'corners': corners,
                        },
                    })
                continue

            # fallback to standard axis-aligned boxes
            if result.boxes is None or len(result.boxes) == 0:
                continue

            for box in result.boxes:
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = self.class_names[class_id]
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                currency_value = self._extract_value(class_name)
                if currency_value:
                    total_amount += currency_value

                detections.append({
                    'class': class_name,
                    'class_id': class_id,
                    'confidence': round(confidence, 4),
                    'value': currency_value,
                    'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
                })

        return {
            'detections':   detections,
            'count':        len(detections),
            'total_amount': total_amount,
            'image_size': {
                'width':  image.width,
                'height': image.height
            }
        }

    def detect_and_draw(self, image_bytes, conf_threshold=0.25):
        """Detect currency and return annotated image as bytes."""
        image, image_np = self._image_from_bytes(image_bytes)

        results = self.model(image_np, conf=conf_threshold)

        if not results or results[0] is None:
            # Return original image unchanged if no results
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            return img_byte_arr.getvalue()

        annotated_img = results[0].plot()  # handles both OBB and standard boxes

        annotated_pil = Image.fromarray(annotated_img)
        img_byte_arr  = io.BytesIO()
        annotated_pil.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return img_byte_arr.getvalue()

    def _extract_value(self, class_name):
        """Extract numeric currency value from class name e.g. '100_rupee' → 100."""
        try:
            return int(''.join(filter(str.isdigit, class_name)))
        except (ValueError, TypeError):
            return None