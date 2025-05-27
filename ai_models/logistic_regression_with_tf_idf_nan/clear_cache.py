import os
import shutil

root_dir = os.path.dirname(os.path.abspath(__file__))

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Xóa thư mục __pycache__ nếu có
    if '__pycache__' in dirnames:
        pycache_path = os.path.join(dirpath, '__pycache__')
        print(f"Deleting: {pycache_path}")
        shutil.rmtree(pycache_path, ignore_errors=True)
    # Xóa file .pyc nếu có
    for filename in filenames:
        if filename.endswith('.pyc'):
            pyc_path = os.path.join(dirpath, filename)
            print(f"Deleting: {pyc_path}")
            try:
                os.remove(pyc_path)
            except Exception as e:
                print(f"Error deleting {pyc_path}: {e}")
print("Cache cleared!") 