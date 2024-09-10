import os
import shutil
import argparse

print("Script started")  # 添加调试信息

# 设置命令行参数解析
parser = argparse.ArgumentParser(description='Move and rename image.png to a specified directory.')
parser.add_argument('new_name', type=str, help='The new name for the image file (without extension)')
parser.add_argument('new_directory', type=str, help='The directory to move the image file to')

args = parser.parse_args()

print(f"Arguments received: new_name={args.new_name}, new_directory={args.new_directory}")  # 添加调试信息

# 获取脚本所在的目录
current_directory = os.path.dirname(os.path.abspath(__file__))
print(f"Current directory: {current_directory}")

# 定义源文件路径
source_file = os.path.join(current_directory, 'source', '_posts', 'image.png')
print(f"Source file: {source_file}")

# 定义目标文件夹路径，使用命令行参数指定的新目录
destination_folder = os.path.join(current_directory, 'source', '_posts', args.new_directory)
print(f"Destination folder: {destination_folder}")

# 如果目标文件夹不存在，则创建它
if not os.path.exists(destination_folder):
    print(f"Destination folder does not exist. Creating: {destination_folder}")
    os.makedirs(destination_folder)
else:
    print(f"Destination folder already exists: {destination_folder}")

# 定义目标文件路径，使用命令行参数指定的新名称
destination_file = os.path.join(destination_folder, f'{args.new_name}.png')
print(f"Destination file: {destination_file}")

# 检查源文件是否存在
if not os.path.exists(source_file):
    print(f"Source file does not exist: {source_file}")
else:
    # 移动并重命名文件
    shutil.move(source_file, destination_file)
    print(f"Moved {source_file} to {destination_file}")

print("Script finished")  # 添加调试信息