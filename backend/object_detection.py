# # from ultralytics import YOLO
# # import numpy as np
# # from PIL import Image
# # import io

# # class ObjectDetector:
# #     def __init__(self, model_path='assets/yolov8n.pt'):

# #         """Initialize YOLOv8 object detector with COCO pretrained model"""
# #         self.model = YOLO(model_path)
# #         # COCO class names
# #         self.class_names = self.model.names
        
# #     def detect_objects(self, image_bytes, conf_threshold=0.25):
# #         """
# #         Detect objects in an image
        
# #         Args:
# #             image_bytes: Image as bytes
# #             conf_threshold: Confidence threshold for detections (0-1)
            
# #         Returns:
# #             dict: Detection results with bounding boxes, classes, and confidences
# #         """
# #         # Convert bytes to PIL Image
# #         image = Image.open(io.BytesIO(image_bytes))
        
# #         # Convert PIL to numpy array
# #         image_np = np.array(image)
        
# #         # Run inference
# #         results = self.model(image_np, conf=conf_threshold)
        
# #         detections = []
# #         image_width, image_height = image.width, image.height
# #         image_area = image_width * image_height

# #         for result in results:
# #             for box in result.boxes:
# #                 x1, y1, x2, y2 = box.xyxy[0].tolist()
# #                 confidence = float(box.conf[0])
# #                 class_id = int(box.cls[0])
# #                 class_name = self.class_names[class_id]

# #                 x_center = (x1 + x2) / 2
# #                 box_area = (x2 - x1) * (y2 - y1)

# #                 detections.append({
# #                     "class": class_name,
# #                     "confidence": confidence,
# #                     "bbox": {
# #                         "x1": x1,
# #                         "y1": y1,
# #                         "x2": x2,
# #                         "y2": y2
# #                     },
# #                     "position": horizontal_position(x_center, image_width),
# #                     "distance": estimate_distance(box_area, image_area),
# #                     "priority": PRIORITY_MAP.get(class_name, 4)
# #                 })

# #         # sort detections by priority before returning
# #         detections.sort(key=lambda d: d["priority"])

# #         return {
# #             'detections': detections,
# #             'count': len(detections),
# #             'image_size': {
# #                 'width': image.width,
# #                 'height': image.height
# #             }
# #         }
    
# #     def detect_and_draw(self, image_bytes, conf_threshold=0.25):
# #         """
# #         Detect objects and return annotated image
        
# #         Args:
# #             image_bytes: Image as bytes
# #             conf_threshold: Confidence threshold for detections
            
# #         Returns:
# #             bytes: Annotated image as bytes
# #         """
# #         # Convert bytes to PIL Image
# #         # image = Image.open(io.BytesIO(image_bytes))
# #         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

# #         image_np = np.array(image)
        
# #         # Run inference
# #         results = self.model(image_np, conf=conf_threshold)
        
# #         # Draw annotations
# #         # annotated_img = results[0].plot()
# #         annotated_img = results[0].plot() if len(results) > 0 else image_np

        
# #         # Convert back to bytes
# #         annotated_pil = Image.fromarray(annotated_img)
# #         img_byte_arr = io.BytesIO()
# #         annotated_pil.save(img_byte_arr, format='PNG')
# #         img_byte_arr.seek(0)
        
# #         return img_byte_arr.getvalue()
    
# # def horizontal_position(x_center, img_width):
# #     if x_center < img_width * 0.33:
# #         return "left"
# #     elif x_center > img_width * 0.66:
# #         return "right"
# #     return "center"


# # def estimate_distance(box_area, img_area):
# #     ratio = box_area / img_area
# #     if ratio > 0.20:
# #         return "very_close"
# #     elif ratio > 0.08:
# #         return "close"
# #     elif ratio > 0.03:
# #         return "medium"
# #     return "far"


# # PRIORITY_MAP = {
# #     "stairs": 1,
# #     "car": 1,
# #     "bicycle": 1,
# #     "person": 2,
# #     "chair": 3,
# #     "table": 3,
# # }

# from ultralytics import YOLO
# import numpy as np
# from PIL import Image
# import io

# WANTED_COCO_CLASSES = {
#     0: 'person',
#     56: 'chair',
#     57: 'couch',
#     59: 'bed',
#     60: 'dining table',
#     58: 'potted plant',
#     13: 'bench',
#     61: 'toilet',
#     71: 'sink',
#     72: 'refrigerator',
#     68: 'microwave',
#     69: 'oven',
#     70: 'toaster',
#     62: 'tv',
#     63: 'laptop',
#     64: 'mouse',
#     65: 'remote',
#     66: 'keyboard',
#     67: 'cell phone',
#     39: 'bottle',
#     40: 'wine glass',
#     41: 'cup',
#     42: 'fork',
#     43: 'knife',
#     44: 'spoon',
#     45: 'bowl',
#     73: 'book',
#     74: 'clock',
#     75: 'vase',
#     76: 'scissors',
#     79: 'toothbrush',
#     24: 'backpack',
#     28: 'suitcase',
# }

# PRIORITY_MAP = {
#     "stairs": 1,
#     "car": 1,
#     "bicycle": 1,
#     "person": 2,
#     "chair": 3,
#     "table": 3,
# }

# class ObjectDetector:
#     def __init__(self,
#                  custom_model_path='assets/washroom_kitchen_only.pt',
#                  coco_model_path='assets/yolov8n.pt'):

#         """Initialize YOLOv8 object detector with COCO pretrained model"""
#         self.custom_model = YOLO(custom_model_path)
#         self.coco_model = YOLO(coco_model_path)

#         self.custom_classes = self.custom_model.names
#         self.coco_classes = self.coco_model.names

#     def detect_objects(self, image_bytes, conf_threshold=0.25):
#         """
#         Detect objects in an image
        
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
        
#         detections = []
#         image_width, image_height = image.width, image.height
#         image_area = image_width * image_height

#         # Run custom model
#         custom_results = self.custom_model(image_np, conf=conf_threshold)
#         for result in custom_results:
#             for box in result.boxes:
#                 x1, y1, x2, y2 = box.xyxy[0].tolist()
#                 confidence = float(box.conf[0])
#                 class_id = int(box.cls[0])
#                 class_name = self.custom_classes[class_id]

#                 x_center = (x1 + x2) / 2
#                 box_area = (x2 - x1) * (y2 - y1)

#                 detections.append({
#                     "class": class_name,
#                     "confidence": confidence,
#                     "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
#                     "position": horizontal_position(x_center, image_width),
#                     "distance": estimate_distance(box_area, image_area),
#                     "priority": PRIORITY_MAP.get(class_name, 4)
#                 })

#         # Run COCO model
#         coco_results = self.coco_model(image_np, conf=conf_threshold)
#         for result in coco_results:
#             for box in result.boxes:
#                 class_id = int(box.cls[0])
#                 if class_id not in WANTED_COCO_CLASSES:
#                     continue
#                 x1, y1, x2, y2 = box.xyxy[0].tolist()
#                 confidence = float(box.conf[0])
#                 class_name = self.coco_classes[class_id]

#                 x_center = (x1 + x2) / 2
#                 box_area = (x2 - x1) * (y2 - y1)

#                 detections.append({
#                     "class": class_name,
#                     "confidence": confidence,
#                     "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
#                     "position": horizontal_position(x_center, image_width),
#                     "distance": estimate_distance(box_area, image_area),
#                     "priority": PRIORITY_MAP.get(class_name, 4)
#                 })

#         # sort detections by priority before returning
#         detections.sort(key=lambda d: d["priority"])

#         return {
#             'detections': detections,
#             'count': len(detections),
#             'image_size': {
#                 'width': image.width,
#                 'height': image.height
#             }
#         }
    
#     def detect_and_draw(self, image_bytes, conf_threshold=0.25):
#         """
#         Detect objects and return annotated image
        
#         Args:
#             image_bytes: Image as bytes
#             conf_threshold: Confidence threshold for detections
            
#         Returns:
#             bytes: Annotated image as bytes
#         """
#         image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#         image_np = np.array(image)

#         # Run custom model and draw
#         custom_results = self.custom_model(image_np, conf=conf_threshold)
#         annotated_img = custom_results[0].plot() if len(custom_results) > 0 else image_np

#         # Run COCO model and draw on top
#         from ultralytics.utils.plotting import Annotator
#         coco_results = self.coco_model(annotated_img, conf=conf_threshold)
#         annotator = Annotator(annotated_img)
#         for result in coco_results:
#             for box in result.boxes:
#                 class_id = int(box.cls[0])
#                 if class_id not in WANTED_COCO_CLASSES:
#                     continue
#                 xyxy = box.xyxy[0].tolist()
#                 conf = float(box.conf[0])
#                 label = f"{WANTED_COCO_CLASSES[class_id]} {conf:.2f}"
#                 annotator.box_label(xyxy, label)
#         annotated_img = annotator.result()

#         # Convert back to bytes
#         annotated_pil = Image.fromarray(annotated_img)
#         img_byte_arr = io.BytesIO()
#         annotated_pil.save(img_byte_arr, format='PNG')
#         img_byte_arr.seek(0)
        
#         return img_byte_arr.getvalue()
    

# def horizontal_position(x_center, img_width):
#     if x_center < img_width * 0.33:
#         return "left"
#     elif x_center > img_width * 0.66:
#         return "right"
#     return "center"


# def estimate_distance(box_area, img_area):
#     ratio = box_area / img_area
#     if ratio > 0.20:
#         return "very_close"
#     elif ratio > 0.08:
#         return "close"
#     elif ratio > 0.03:
#         return "medium"
#     return "far"
import numpy as np
from PIL import Image
import io
import tensorflow as tf

WANTED_COCO_CLASSES = {
    0: 'person',
    56: 'chair',
    57: 'couch',
    59: 'bed',
    60: 'dining table',
    58: 'potted plant',
    13: 'bench',
    61: 'toilet',
    71: 'sink',
    72: 'refrigerator',
    68: 'microwave',
    69: 'oven',
    70: 'toaster',
    62: 'tv',
    63: 'laptop',
    64: 'mouse',
    65: 'remote',
    66: 'keyboard',
    67: 'cell phone',
    39: 'bottle',
    40: 'wine glass',
    41: 'cup',
    42: 'fork',
    43: 'knife',
    44: 'spoon',
    45: 'bowl',
    73: 'book',
    74: 'clock',
    75: 'vase',
    76: 'scissors',
    79: 'toothbrush',
    24: 'backpack',
    28: 'suitcase',
}

PRIORITY_MAP = {
    "stairs": 1,
    "car": 1,
    "bicycle": 1,
    "person": 2,
    "chair": 3,
    "table": 3,
}

CUSTOM_CLASS_NAMES = {
    0: 'hawan Dasta',
    1: 'pateela',
    2: 'pressure cooker',
    3: 'roti ki dalya',
    4: 'tawwa',
    5: 'tap',
    6: 'muslim shower',
    7: 'toilet',
    8: 'bucket',
    9: 'shower',
    10: 'mug',
    11: 'Kettle',
    12: 'door',
    13: 'hairbrush',
    14: 'stairs',
    15: 'water gallon',
    16: 'waterdispenser'
}


class TFLiteModel:
    """Wrapper for a single TFLite model"""
    def __init__(self, model_path):
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()

        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        # Get expected input shape: [1, H, W, C]
        self.input_shape = self.input_details[0]['shape']
        self.input_h = self.input_shape[1]
        self.input_w = self.input_shape[2]
        self.is_int8 = self.input_details[0]['dtype'] == np.uint8

    def preprocess(self, image_np):
        """Resize and normalize image for TFLite input"""
        img = Image.fromarray(image_np).resize((self.input_w, self.input_h))
        img = np.array(img, dtype=np.float32)

        if self.is_int8:
            # INT8 model expects uint8 input
            img = np.clip(img, 0, 255).astype(np.uint8)
        else:
            img /= 255.0  # normalize to [0, 1]

        return np.expand_dims(img, axis=0)  # add batch dim

    def run(self, image_np):
        """Run inference and return raw output"""
        input_data = self.preprocess(image_np)
        self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
        self.interpreter.invoke()

        # YOLO TFLite output: [1, num_detections, 6] (x1,y1,x2,y2,conf,class)
        output = self.interpreter.get_tensor(self.output_details[0]['index'])
        return output[0]  # shape: (num_detections, 6)


class ObjectDetector:
    def __init__(self,
                 custom_model_path='assets/object_detection_float16.tflite',
                 coco_model_path='assets/coco_yolo26n_int8.tflite'):

        self.custom_model = TFLiteModel(custom_model_path)
        self.coco_model = TFLiteModel(coco_model_path)

    def _parse_detections(self, raw_output, class_names, conf_threshold,
                           image_width, image_height, wanted_classes=None):
        """Parse raw YOLO TFLite output into detection dicts"""
        image_area = image_width * image_height
        detections = []

        for det in raw_output:
            # det = [x1, y1, x2, y2, confidence, class_id]
            x1, y1, x2, y2, confidence, class_id = det
            class_id = int(class_id)

            if confidence < conf_threshold:
                continue

            if wanted_classes is not None and class_id not in wanted_classes:
                continue

            # Denormalize bbox (TFLite YOLO outputs normalized coords)
            x1 = float(x1) * image_width
            y1 = float(y1) * image_height
            x2 = float(x2) * image_width
            y2 = float(y2) * image_height

            class_name = class_names.get(class_id, f"class_{class_id}")
            x_center = (x1 + x2) / 2
            box_area = (x2 - x1) * (y2 - y1)

            detections.append({
                "class": class_name,
                "confidence": float(confidence),
                "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                "position": horizontal_position(x_center, image_width),
                "distance": estimate_distance(box_area, image_area),
                "priority": PRIORITY_MAP.get(class_name, 4)
            })

        return detections

    def detect_objects(self, image_bytes, conf_threshold=0.25):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_np = np.array(image)
        image_width, image_height = image.width, image.height

        detections = []

        # Run custom model
        custom_output = self.custom_model.run(image_np)
        detections += self._parse_detections(
            custom_output, CUSTOM_CLASS_NAMES,
            conf_threshold, image_width, image_height
        )

        # Run COCO model (filtered to wanted classes)
        coco_output = self.coco_model.run(image_np)
        detections += self._parse_detections(
            coco_output, WANTED_COCO_CLASSES,
            conf_threshold, image_width, image_height,
            wanted_classes=set(WANTED_COCO_CLASSES.keys())
        )

        detections.sort(key=lambda d: d["priority"])

        return {
            'detections': detections,
            'count': len(detections),
            'image_size': {'width': image_width, 'height': image_height}
        }

    def detect_and_draw(self, image_bytes, conf_threshold=0.25):
        import cv2

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_np = np.array(image)
        image_width, image_height = image.width, image.height

        result = self.detect_objects(image_bytes, conf_threshold)

        # Draw boxes
        annotated = image_np.copy()
        for det in result['detections']:
            b = det['bbox']
            x1, y1, x2, y2 = int(b['x1']), int(b['y1']), int(b['x2']), int(b['y2'])
            label = f"{det['class']} {det['confidence']:.2f}"
            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(annotated, label, (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        annotated_pil = Image.fromarray(annotated)
        img_byte_arr = io.BytesIO()
        annotated_pil.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return img_byte_arr.getvalue()


def horizontal_position(x_center, img_width):
    if x_center < img_width * 0.33:
        return "left"
    elif x_center > img_width * 0.66:
        return "right"
    return "center"


def estimate_distance(box_area, img_area):
    ratio = box_area / img_area
    if ratio > 0.20:
        return "very_close"
    elif ratio > 0.08:
        return "close"
    elif ratio > 0.03:
        return "medium"
    return "far"