from file_management.file import File


class TextFile(File):
    def read_file(self):
        with open(self.file_path, 'r') as file:
            content = file.read()
        return content

    def write_file(self, content):
        with open(self.file_path, 'w') as file:
            file.write(content)

    def print_content(self):
        print(self.read_file(), flush=True)
