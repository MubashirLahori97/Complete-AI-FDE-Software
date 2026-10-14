import sys

is_virtual_environment = sys.prefix != sys.base_prefix
print("Python major version:", sys.version_info.major)
print("Virtual environment:", is_virtual_environment)
print("Run command: python environment_check.py")
