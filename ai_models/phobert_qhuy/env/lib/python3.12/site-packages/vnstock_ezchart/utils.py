from .config import *

class Utils:
    """
    Class (lớp) chứa các phương thức tiện ích cho việc tùy chỉnh và tùy biến biểu đồ.
    """
    def __init__(self):
        pass

    # Adding brand and thematic color palettes
    brand_palettes = {
        'percentage': ['#D45F5F', '#F3C301', '#FEE3A2', '#ADCACB', '#87C159', '#058240'],
        'amount': [
                    '#E8EDE7',  # Lightest Neutral: Base color, suitable for low amounts
                    '#C4D3D5',  # Slightly Darker Neutral: Bridge between lightest neutral and light blue
                    '#81BECE',  # Light Blue: Starts the transition into deeper colors
                    '#AEDCEA',  # Light Sky Blue: Softens the transition from light to mid blues
                    '#378BA4',  # Mid Blue: Represents a mid-range amount
                    '#2B6C8A',  # Ocean Blue: Intermediate shade, deepens the gradient
                    '#6297B5',  # Soft Blue: Fills gap between mid and deep blues
                    '#036280',  # Deep Blue: Indicates larger amounts
                    '#012E4A',  # Darker Blue: Near-endpoint, for higher amounts
                    '#001D35'   # Deep Ocean: Darkest shade, for the highest amounts
                    ],
        'category': [
                    '#000000',  # Black: Neutral/base color, offers maximum contrast
                    '#8B0000',  # Dark Red: Adds depth to warmer tones, enhances contrast
                    '#F8492E',  # Red/Orange: Bright and vibrant, stands out for attention
                    '#FFC107',  # Amber: Bright yellow/orange, adds vibrancy and contrast
                    '#4CAF50',  # Green: Mid-tone green, introduces a fresh hue for contrast
                    '#00F9F0',  # Cyan: Bright and lively, offers a cool, contrasting hue
                    '#0072BB',  # Blue: Solid, reliable blue for stability and trust
                    '#00457E',  # Dark Blue: Deeper blue, adds sophistication and depth
                    '#5CAEFF',  # Sky Blue: Lighter shade of blue, bridges the gap in cool tones
                    '#FB4C69',  # Pink/Red: Vivid and energetic, finalizes the spectrum with warmth
                    ],
        'trend': [
                    '#017C5E',  # Green variant
                    '#7D916A',  # Greenish gray
                    '#1496BB',  # Blue
                    '#CF90B9',  # Purple
                    '#789BBA',  # Light blue
                    '#D4C1CC',  # Light purple/neutral
                    '#4D5C6F',  # Dark neutral/blue
                    '#F6DDB7',  # Light neutral/orange
                    '#FCAF9F',  # Light orange
                    '#E45332',  # Orange/red
                    '#BB191F'   # Red
                        ],
        'stock': [   # 65% luminant
                    '#70db8f', # Xanh lá - Tăng
                    '#ff4d4d', # Đỏ
                    '#c44dff', # Tím - Trần
                    '#4ddbff', # Xanh lơ - Sàn
                    #  '#3385ff', # Xanh dương
                ],
        'flatui': ['#FEDD78', '#348DC1', '#BA516B', '#4FA487', '#9B59B6', '#613F66'],
        'vnstock': ['#2eb855', '#257CFF', '#DD390D', '#7A7A7A', '#FFFFFF'],
        'learn_anything': ['#002E5D', '#00FF84', '#FFD700', '#808080'],
        'beach' : ['#217074', '#37745B', '#8B9D77', '#E7EAEF', '#EDC5AB'],
        'forest' : ['#162e1a', '#437a38', '#97b261', '#c5d7d7', '#536b69']

    }

    @classmethod
    def apply_palette(cls, color_palette, palette_shuffle=False):
        """
        Áp dụng bảng màu cho biểu đồ, có khả năng xáo trộn màu sắc nếu cần.

        Tham số:
            color_palette (str hoặc list): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh.
            palette_shuffle (bool): Nếu là True, sẽ xáo trộn thứ tự các màu trong bảng màu.
        """
        if isinstance(color_palette, str):
            palette = cls.brand_palettes.get(color_palette, None)
            if palette is None:
                print(f"Palette '{color_palette}' not found. Available palettes: {list(cls.brand_palettes.keys())}")
                return
        else:
            palette = color_palette

        # Ensure palette is a list for shuffling and manipulation
        palette_list = list(palette)

        if palette_shuffle:
            random.shuffle(palette_list)

        sns.set_palette(palette_list)
        plt.rcParams['axes.prop_cycle'] = cycler('color', palette_list)

    @staticmethod
    def readable_format(num, fmt=None):
        """
        Convert a number into a human-readable format, e.g., 1K, 1M, etc.
        """
        magnitude = 0
        while abs(num) >= 1000:
            magnitude += 1
            num /= 1000.0
        # Allow custom format to be applied
        if fmt and isinstance(fmt, str):
            return f'{num:.1f}{["", "K", "M", "B", "T"][magnitude]}'.format(fmt)
        return f'{num:.1f}{["", "K", "M", "B", "T"][magnitude]}'

    @staticmethod
    def list_font():
        """
        Liệt kê các font hiện có được Matplotlib nhận diện. Sử dụng đặc biệt là trong môi trường Google Colab để chọn font.
        """
        font_list = []
        for font in font_manager.fontManager.ttflist:
            font_list.append(font.name)

        return pd.Series(font_list)

    @staticmethod
    def download_font(font_family):
        """
        Downloads a Google font and adds it to matplotlib's font list.

        Args:
            font_family (str): The family name of the Google font to download.
        """
        font_url = f'https://fonts.google.com/download?family={font_family.replace(" ", "+")}'
        response = requests.get(font_url, allow_redirects=True)
        zip_path = os.path.join('fonts', f'{font_family}.zip')
        os.makedirs(os.path.dirname(zip_path), exist_ok=True)

        with open(zip_path, 'wb') as font_file:
            font_file.write(response.content)

        shutil.unpack_archive(zip_path, 'fonts')
        os.remove(zip_path)

        # Add the font to matplotlib's font list
        for root, dirs, files in os.walk(os.path.join('fonts', font_family)):
            for file in files:
                if file.endswith('.ttf'):
                    font_path = os.path.join(root, file)
                    print(font_path)
                    font_manager.fontManager.addfont(font_path)
                    plt.rcParams['font.family'] = font_family

    @staticmethod
    def set_font(font_family):
        """
        Ghi đè tùy chọn cài đặt một font cố định vào hệ thống. Sử dụng trong trường hợp môi trường Google Colab không có sẵn font mong muốn.
        Chọn DejaVu Sans trong Colab có hỗ trợ tiếng Việt.
        """
        plt.rcParams['font.family'] = font_family

    @staticmethod
    def list_cmap ():
        """
        Liệt kê các bảng màu cmap có sẵn trong hệ thống, sử dụng trong các tùy chọn có tham số cmap, ví dụ 'Set3'
        """
        import matplotlib.pyplot as plt
        return pd.Series(plt.cm.datad)
    
    @classmethod
    def create_cmap (cls, color_palette, cmap_name='custom'):
        """
        Tạo ra colormap từ danh sách các màu được nhập vào, ví dụ sử dụng hexcode
        
        Tham số:
            color_palette: Tên một bảng màu có sẵn từ thư viện hoặc 1 danh sách các mã màu
            cmap_name: tên của cmap muốn tạo ra để đăng ký với Matplotlib
        """
        from matplotlib.colors import LinearSegmentedColormap

        if isinstance(color_palette, str):
            palette = cls.brand_palettes.get(color_palette, None)
            color_map = LinearSegmentedColormap.from_list(cmap_name, palette, N=len(color_palette))
            if palette is None:
                print(f"Palette '{color_palette}' not found. Available palettes: {list(cls.brand_palettes.keys())}")
                return
        else:
            color_map = LinearSegmentedColormap.from_list(cmap_name, color_palette, N=len(color_palette))
        return color_map