from .config import *
from .utils import Utils

# This package serves as a comprehensive wrapper for Matplotlib, Seaborn, Squarify, and Wordcloud, 
# designed to provide a fast, simple, and efficient user experience for routine data visualization tasks

class MPlot:
    """
    Class chứa các phương thức để vẽ biểu đồ sử dụng thư viện matplotlib và seaborn với các tùy chỉnh hiện đại.
    
    Các phương thức bao gồm:
    - bar: Vẽ biểu đồ cột.
    - hist: Vẽ biểu đồ histogram.
    - pie: Vẽ biểu đồ tròn.
    - timeseries: Vẽ biểu đồ dữ liệu theo thời gian.
    - heatmap: Vẽ biểu đồ nhiệt.
    - scatter: Vẽ biểu đồ phân tán.
    - treemap: Vẽ biểu đồ treemap.
    - boxplot: Vẽ biểu đồ boxplot.
    - wordcloud: Vẽ biểu đồ đám mây từ.
    - pairplot: Vẽ biểu đồ các mối quan hệ cặp.
    - table: Vẽ bảng dữ liệu.
    """

    def __init__(self):
        """Khởi tạo đối tượng MPLPlot."""
        self.utils = Utils()

    def help(self, method_path):
        """
        Hiển thị thông tin chi tiết về một phương thức dựa trên tên của nó.

        Tham số:
        - method_name: Tên của phương thức để lấy thông tin chi tiết. Nhập tên dưới dạng văn bản, ví dụ MPlot.help('bar').
        """
        parts = method_path.split('.')
        obj = self
        for part in parts[:-1]:
            try:
                obj = getattr(obj, part)
            except AttributeError:
                print(f"Attribute '{part}' not found.")
                return
        
        method_name = parts[-1]
        try:
            method = getattr(obj, method_name)
            print(method.__doc__)
        except AttributeError:
            print(f"Method or property '{method_name}' not found in '{obj.__class__.__name__}'.")

    @staticmethod
    def apply_chart_style(ax, 
                        title=None, title_fontsize=14, 
                        xlabel=None, ylabel=None, grid=None, 
                        data_labels=None, data_label_format='1K', label_fontsize=None, 
                        legend_title=None, show_legend=True, legend_fontsize=None, 
                        series_names=None, 
                        font_name=None, figsize=None, 
                        show_xaxis=True, show_yaxis=True, 
                        tick_labelsize=None, xtick_format=None, 
                        ytick_format=None, tick_rotation=None, 
                        xlim=None, ylim=None, 
                        background_color=None, bar_edge_color=None, **kwargs):
        """
        Áp dụng các tùy chỉnh phong cách cho biểu đồ.

        Tham số:
            - ax (matplotlib.axes.Axes): Trục của biểu đồ.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - data_labels (bool): Hiển thị nhãn dữ liệu trên biểu đồ.
            - data_label_format (str): Định dạng cho nhãn dữ liệu. Nhận các giá trị rút gọn như 1K, 1M, 1B, 1T tương ứng với 1 ngàn, 1 triệu, 1 tỷ, 1 nghìn tỷ.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột (bar) trong biểu đồ.      
        """
        if font_name:
            plt.rcParams['font.family'] = font_name
        if title:
            ax.set_title(title, fontsize=title_fontsize)
        if xlabel:
            ax.set_xlabel(xlabel, fontsize=label_fontsize)
        if ylabel:
            ax.set_ylabel(ylabel, fontsize=label_fontsize)
        if grid:
            ax.grid(True) #, color=grid_color, linestyle=grid_linestyle
        if data_labels:
            # for p in ax.patches:
            #     ax.annotate(format(p.get_height(), '.2f'), 
            #                 (p.get_x() + p.get_width() / 2., p.get_height()), 
            #                 ha='center', va='center', xytext=(0, 10), textcoords='offset points')

            formatter = mticker.FuncFormatter(lambda x, pos: Utils.readable_format(x, data_label_format))
            for p in ax.patches:
                ax.annotate(formatter(p.get_height()), 
                            (p.get_x() + p.get_width() / 2., p.get_height()), 
                            ha='center', va='center', xytext=(0, 10), textcoords='offset points')
    
                
        if show_legend and (legend_title or series_names):
            ax.legend(title=legend_title, labels=series_names, fontsize=legend_fontsize)
        elif not show_legend:
            ax.legend().set_visible(False)
        if figsize:
            ax.figure.set_size_inches(figsize)
        if xlim:
            ax.set_xlim(xlim)
        if ylim:
            ax.set_ylim(ylim)
        if tick_rotation:
            plt.xticks(rotation=tick_rotation)
        if background_color:
            ax.set_facecolor(background_color)
        if xtick_format:
            ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: xtick_format.format(x)))
        if ytick_format:
            ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: ytick_format.format(y)))
        if tick_labelsize:
            ax.tick_params(axis='both', which='major', labelsize=tick_labelsize)
        if bar_edge_color:
            for p in ax.patches:
                p.set_edgecolor(bar_edge_color)
        if show_xaxis is False:
            ax.xaxis.set_visible(False)
        if show_yaxis is False:
            ax.yaxis.set_visible(False)

    @classmethod
    def bar(cls, data, **kwargs):
        """
        Vẽ biểu đồ cột với các tùy chỉnh chi tiết.

        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame hoặc Series.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - data_labels (bool): Hiển thị nhãn dữ liệu trên biểu đồ.
            - data_label_format (str): Định dạng cho nhãn dữ liệu. Nhận các giá trị rút gọn như 1K, 1M, 1B, 1T tương ứng với 1 ngàn, 1 triệu, 1 tỷ, 1 nghìn tỷ.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột (bar) trong biểu đồ.
        """
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'ylabel', 'grid', 'data_labels', 
                                                        'legend_title', 'series_names', 'font_name', 
                                                        'show_legend', 'show_xaxis', 'show_yaxis', 
                                                        'title_fontsize', 'label_fontsize', 'tick_labelsize', 
                                                        'legend_fontsize', 'xtick_format', 'ytick_format', 
                                                        'figsize', 'xlim', 'ylim', 'tick_rotation', 
                                                        'background_color', 'grid_color', 'grid_linestyle', 
                                                        'bar_edge_color']}
        
        ax = kwargs.pop('ax', None)
        if ax is None:
            fig, ax = plt.subplots()
        data.plot(kind='bar', ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax

    @classmethod
    def hist(cls, data, **kwargs):
        """
        Biểu diễn phân phối của dữ liệu với biểu đồ histogram.
        
        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame hoặc Series.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - data_labels (bool): Hiển thị nhãn dữ liệu trên biểu đồ.
            - data_label_format (str): Định dạng cho nhãn dữ liệu. Nhận các giá trị rút gọn như 1K, 1M, 1B, 1T tương ứng với 1 ngàn, 1 triệu, 1 tỷ, 1 nghìn tỷ.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột (bar) trong biểu đồ.
        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'ylabel', 'grid', 'data_labels', 
                                                        'legend_title', 'series_names', 'font_name', 
                                                        'show_legend', 'show_xaxis', 'show_yaxis', 
                                                        'title_fontsize', 'label_fontsize', 'tick_labelsize', 
                                                        'legend_fontsize', 'xtick_format', 'ytick_format', 
                                                        'figsize', 'xlim', 'ylim', 'tick_rotation', 
                                                        'background_color', 'bar_edge_color']}

        data.plot(kind='hist', ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax
    

    @classmethod
    def pie(cls, data, labels, **kwargs):
        """
        Biểu diễn dữ liệu dưới dạng biểu đồ tròn (pie chart).

        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame hoặc Series.
            - labels (list): Nhãn cho từng phần của biểu đồ tròn.
            - title (str): Tiêu đề của biểu đồ.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - legend_title (str): Tiêu đề cho chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - legend_fontsize (int): Cỡ chữ cho chú giải.
        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'legend_title', 'series_names', 'font_name', 
                                                        'show_legend', 'title_fontsize', 'legend_fontsize', 
                                                        'figsize']}

        data.plot(kind='pie', labels=labels, ax=ax, autopct='%1.1f%%', **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax
    
    @classmethod
    def timeseries(cls, data, **kwargs):
        """
        Biểu diễn dữ liệu theo thời gian (timeseries). Dữ liệu cần có cột index là kiểu dữ liệu datetime.

        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame hoặc Series.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - data_labels (bool): Hiển thị nhãn dữ liệu trên biểu đồ.
            - data_label_format (str): Định dạng cho nhãn dữ liệu. Nhận các giá trị rút gọn như 1K, 1M, 1B, 1T tương ứng với 1 ngàn, 1 triệu, 1 tỷ, 1 nghìn tỷ.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột (bar) trong biểu đồ.
        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'ylabel', 'grid', 'data_labels', 
                                                        'legend_title', 'series_names', 'font_name', 
                                                        'show_legend', 'show_xaxis', 'show_yaxis', 
                                                        'title_fontsize', 'label_fontsize', 'tick_labelsize', 
                                                        'legend_fontsize', 'xtick_format', 'ytick_format', 
                                                        'figsize', 'xlim', 'ylim', 'tick_rotation', 
                                                        'background_color', 'bar_edge_color']}

        data.plot(ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax


    @classmethod
    def heatmap(cls, data, **kwargs):
        """
        Biểu diễn dữ liệu dưới dạng biểu đồ nhiệt (heatmap).

        Tham số:
            - data (pd.DataFrame): Dữ liệu đầu vào dạng DataFrame.
            - title (str): Tiêu đề của biểu đồ.
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - background_color (str): Màu nền cho biểu đồ.
        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        # Note: For heatmaps, not all styling arguments apply (e.g., data_labels)
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'font_name', 'figsize', 'xlim', 'ylim', 
                                                        'title_fontsize', 'background_color']}

        sns.heatmap(data, ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax

    @classmethod
    def scatter(cls, data, x, y, **kwargs):
        """
        Biểu diễn dữ liệu với biểu đồ phân tán (scatter plot).

        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame.
            - x (str): Tên cột dữ liệu trên trục X trong DataFrame.
            - y (str): Tên cột dữ liệu trên trục Y trong DataFrame.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột (bar) trong biểu đồ.
        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'ylabel', 'grid', 'legend_title', 
                                                        'series_names', 'font_name', 'show_legend', 'show_xaxis', 
                                                        'show_yaxis', 'title_fontsize', 'label_fontsize', 
                                                        'tick_labelsize', 'legend_fontsize', 'xtick_format', 
                                                        'ytick_format', 'figsize', 'xlim', 'ylim', 'tick_rotation', 
                                                        'background_color', 'bar_edge_color']}

        data.plot(kind='scatter', x=x, y=y, ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax

    @classmethod
    def treemap(cls, values, labels, title='', color_palette='vnstock', palette_shuffle=False, figsize=(10,8), title_fontsize=14, **kwargs):
        """
        Vẽ biểu đồ treemap.
        Tham số:
            - values (series): Dải dữ liệu cần vẽ dạng List hoặc Pandas Series
            - labels (list): Nhãn cho từng phần của biểu đồ treemap
            - title (str): Tiêu đề của biểu đồ
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - fontsize: Kích thước chữ bên trong biểu đồ. Mặc định là 10
            - color: Màu chữ, mặc định là 'white'.
        """
        colors = Utils.brand_palettes[color_palette]

        if palette_shuffle:
            random.shuffle(colors)

        fig, ax = plt.subplots(figsize=figsize) 
        squarify.plot(sizes=values, label=labels, pad=0.2,
                    text_kwargs={'fontsize': 10, 'color': 'white'},
                    color=colors, ax=ax)
        fig.suptitle(title, y=0.98, fontweight="bold", fontname=kwargs.get('font_name'), fontsize=title_fontsize, color=kwargs.get('color'))
        ax.axis('off')
        return fig, ax


    @classmethod
    def boxplot(cls, data, **kwargs):
        """
        Biểu diễn dữ liệu dưới dạng biểu đồ boxplot.

        Tham số:
            - data (pd.DataFrame hoặc pd.Series): Dữ liệu đầu vào dạng DataFrame hoặc Series.
            - title (str): Tiêu đề của biểu đồ.
            - title_fontsize (int): Cỡ chữ cho tiêu đề.
            - xlabel (str): Nhãn cho trục X.
            - ylabel (str): Nhãn cho trục Y.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - grid (bool): Hiển thị lưới. Nhận True để hiện thị hoặc False để ẩn lưới.
            - data_labels (bool): Hiển thị nhãn dữ liệu trên biểu đồ.
            - data_label_format (str): Định dạng cho nhãn dữ liệu. Nhận các giá trị rút gọn như 1K, 1M, 1B, 1T tương ứng với 1 ngàn, 1 triệu, 1 tỷ, 1 nghìn tỷ.
            - label_fontsize (int): Cỡ chữ cho nhãn trục X và Y.
            - legend_title (str): Tiêu đề cho chú giải.
            - show_legend (bool): Hiển thị chú giải. Nhận True để hiển thị hoặc False để ẩn chú giải.
            - legend_fontsize (int): Cỡ chữ cho chú giải.
            - series_names (list): Danh sách tên cho các dải (series) dữ liệu trong biểu đồ. Nhận giá trị là 1 danh sách (list).
            - font_name (str): Tên của font chữ muốn áp dụng.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - show_xaxis (bool): Hiển thị trục X. Nhận True để hiển thị hoặc False để ẩn trục X.
            - show_yaxis (bool): Hiển thị trục Y. Nhận True để hiển thị hoặc False để ẩn trục Y.
            - tick_labelsize (int): Cỡ chữ cho các nhãn trục.
            - xtick_format (str): Định dạng cho nhãn trục X. Ví dụ định dạng số thập phân '{:.0f}'.
            - ytick_format (str): Định dạng cho nhãn trục Y. Ví dụ định dạng phần trăm '{:.0%}'.
            - tick_rotation (int): Góc quay cho các nhãn trục.
            - xlim (tuple): Giới hạn cho trục X, ví dụ (0, 100).
            - ylim (tuple): Giới hạn cho trục Y, ví dụ (0, 100).
            - background_color (str): Màu nền cho biểu đồ.
            - bar_edge_color (str): Màu viền cho các cột trong biểu đồ.

        """
        fig, ax = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))
        
        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'ylabel', 'grid', 'legend_title', 
                                                        'series_names', 'font_name', 'show_legend', 'show_xaxis', 
                                                        'show_yaxis', 'title_fontsize', 'label_fontsize', 
                                                        'tick_labelsize', 'legend_fontsize', 'xtick_format', 
                                                        'ytick_format', 'figsize', 'xlim', 'ylim', 'tick_rotation', 
                                                        'background_color', 'bar_edge_color']}

        data.plot(kind='box', ax=ax, **kwargs)
        cls.apply_chart_style(ax, **style_kwargs)
        plt.show()
        return fig, ax

    @classmethod
    def pairplot(cls, data, **kwargs):
        """
        Biểu diễn dữ liệu các mối quan hệ cặp (pair plot).

        Args:
            data (pd.DataFrame): Dữ liệu cần biểu diễn.
            **kwargs: Các tham số tùy chỉnh cho biểu đồ với tùy chọn của thư viện Seaborn.
        """
        g = sns.pairplot(data, **kwargs)
        return g

    @staticmethod
    def wordcloud(text, title="Word Cloud", color_palette='vnstock', palette_shuffle=False,
                    max_words=100, width=800, height=400, figsize=(10, 8),
                    fontname=None, savefig=None, show=True):
        """"
        Biểu diễn dữ liệu dưới dạng word cloud.

        Tham số:
            - text (str): Dữ liệu đầu vào dạng văn bản.
            - title (str): Tiêu đề của biểu đồ.
            - color_palette (str): Tên của bảng màu đã được định trước hoặc danh sách các màu tùy chỉnh. Mặc định là 'vnstock'. Các bảng màu có sẵn: 'percentage', 'amount', 'category', 'trend', 'flatui', 'vnstock', 'learn_anything'. Có thể liệt kê tất cả bảng màu với Utils.brand_palettes.keys().
            - palette_shuffle (bool): Xáo trộn thứ tự màu sắc trong bảng màu, cho phép chọn màu ngẫu nhiên trong bảng màu để biểu diễn cho đến khi bạn ưng ý. Mặc định là False.
            - max_words (int): Số lượng từ tối đa muốn hiển thị trên biểu đồ.
            - width (int): Chiều rộng của biểu đồ.
            - height (int): Chiều cao của biểu đồ.
            - figsize (tuple): Kích thước của biểu đồ, ví dụ (10, 6).
            - fontname (str): Tên của font chữ muốn áp dụng.
            - savefig (str): Đường dẫn lưu file ảnh. Mặc định là None.
            - show (bool): Hiển thị biểu đồ. Mặc định là True.
        """
        
        colors = Utils.brand_palettes[color_palette]

        if palette_shuffle:
            random.shuffle(colors)

        custom_cmap = Utils.create_cmap(colors)

        # Generate word cloud
        wordcloud = WordCloud(width=width, height=height, background_color="white", colormap=custom_cmap, max_words=max_words).generate(text)

        # Create plot
        fig, ax = plt.subplots(figsize=figsize)
        ax.imshow(wordcloud, interpolation='bilinear')
        ax.axis("off")

        fig.suptitle(title, y=0.98, fontweight="bold", fontname=fontname, fontsize=14, color="black")

        fig.set_facecolor("white")
        ax.set_facecolor("white")

        try:
            plt.subplots_adjust(hspace=0, bottom=0, top=0.9)
        except Exception:
            pass

        if savefig:
            if isinstance(savefig, dict):
                plt.savefig(**savefig)
            else:
                plt.savefig(savefig)
        if show:
            plt.show()
        plt.close()

    @staticmethod
    def table(
        data,
        columns=None,
        title="",
        title_loc="left",
        header=True,
        colWidths=None,
        rowLoc="right",
        colLoc="right",
        colLabels=None,
        edges="horizontal",
        orient="horizontal",
        figsize=(5.5, 6),
        savefig=None,
        show=False
    ):
        
        """
            Plot a table using matplotlib.
            Parameters:
            
            data (DataFrame): Dữ liệu cần biểu diễn
            columns (list, optional): Các cột cần hiển thị. Mặc định là None.
            title (str, optional): Tiêu đề của bảng. Mặc định là "".
            title_loc (str, optional): Tiêu đề của bảng. Mặc định là "left".
            header (bool, optional): Tùy chọn hiển thị header - hàng tiêu đề. Mặc định là True.
            colWidths (list, optional): Chiều rộng của các cột. Mặc định là None.
            rowLoc (str, optional): Vị trí hiển thị dữ liệu của các hàng. Mặc định là "right".
            colLoc (str, optional): Vị trí hiển thị dữ liệu của các cột. Mặc định là "right".
            colLabels (list, optional): Tiêu đề của các cột. Mặc định là None.
            edges (str, optional): Cạnh của bảng. Mặc định là "horizontal".
            orient (str, optional): Hướng của bảng. Mặc định là "horizontal".
            figsize (tuple, optional): Kích thước của bảng. Mặc định là (5.5, 6).
            savefig (str, optional): Địa chỉ lưu file. Mặc định là None.
            show (bool, optional): Hiển thị bảng. Mặc định là False.
        """

        if columns is not None:
            try:
                data.columns = columns
            except Exception:
                pass

        fig = plt.figure(figsize=figsize)
        ax = plt.subplot(111, frame_on=False)

        if title != "":
            ax.set_title(
                title, fontweight="bold", fontsize=14, color="black", loc=title_loc
            )

        the_table = ax.table(
            cellText=data.values,
            colWidths=colWidths,
            rowLoc=rowLoc,
            colLoc=colLoc,
            edges=edges,
            colLabels=(data.columns if header else colLabels),
            loc="center",
            zorder=2,
        )

        the_table.auto_set_font_size(False)
        the_table.set_fontsize(12)
        the_table.scale(1, 1)

        for (row, col), cell in the_table.get_celld().items():
            cell.set_height(0.08)
            cell.set_text_props(color="black")
            cell.set_edgecolor("#dddddd")
            if row == 0 and header:
                cell.set_edgecolor("black")
                cell.set_facecolor("black")
                cell.set_linewidth(2)
                cell.set_text_props(weight="bold", color="black")
            elif col == 0 and "vertical" in orient:
                cell.set_edgecolor("#dddddd")
                cell.set_linewidth(1)
                cell.set_text_props(weight="bold", color="black")
            elif row > 1:
                cell.set_linewidth(1)

        ax.grid(False)
        ax.set_xticks([])
        ax.set_yticks([])

        try:
            plt.subplots_adjust(hspace=0)
        except Exception:
            pass
        try:
            fig.tight_layout(w_pad=0, h_pad=0)
        except Exception:
            pass

        if savefig:
            if isinstance(savefig, dict):
                plt.savefig(**savefig)
            else:
                plt.savefig(savefig)

        if show:
            plt.show(block=False)

        plt.close()

        if not show:
            return fig

        return None

    @classmethod
    def combo_chart(cls, bar_data, line_data, left_ylabel='Bar Data', right_ylabel='Line Data', **kwargs):
        """
        Creates a combo chart with a bar chart and a line chart on two different Y axes.

        Args:
            bar_data (pd.Series): Data for the bar chart.
            line_data (pd.Series): Data for the line chart.
            **kwargs: Additional keyword arguments for styling.
        """
        # Setup figure and primary axis
        fig, ax1 = plt.subplots()
        mpl_plot_instance = cls()
        mpl_plot_instance.utils.apply_palette(kwargs.pop('color_palette', 'vnstock'), kwargs.pop('palette_shuffle', False))

        style_kwargs = {k: kwargs.pop(k, None) for k in ['title', 'xlabel', 'grid', 
                                                        'data_labels', 'legend_title', 'series_names', 
                                                        'font_name', 'show_legend', 'show_xaxis', 
                                                        'show_yaxis', 'title_fontsize', 'label_fontsize', 
                                                        'tick_labelsize', 'legend_fontsize', 'xtick_format', 
                                                        'ytick_format', 'figsize', 'xlim', 'ylim', 
                                                        'tick_rotation', 'background_color', 'bar_edge_color']}

        # Bar chart
        ax1.bar(bar_data.index, bar_data.values, label=bar_data.name, **kwargs)
        ax1.set_ylabel(left_ylabel, fontsize=style_kwargs.get('label_fontsize', 10))
        
        # Line chart on secondary axis
        ax2 = ax1.twinx()
        ax2.plot(line_data.index, line_data.values, label=line_data.name, **kwargs)
        ax2.set_ylabel(right_ylabel, fontsize=style_kwargs.get('label_fontsize', 10))

        # Apply common chart styles
        cls.apply_chart_style(ax1, **style_kwargs)
        cls.apply_chart_style(ax2, **style_kwargs)

        # Handle legends
        handles1, labels1 = ax1.get_legend_handles_labels()
        handles2, labels2 = ax2.get_legend_handles_labels()
        ax1.legend(handles1 + handles2, labels1 + labels2, loc='upper left')

        plt.show()
        return fig, ax1, ax2
