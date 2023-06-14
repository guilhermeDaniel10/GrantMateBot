class File:
    def __init__(self, file_path):
        self.file_path = file_path

    def read_file(self):
        # Acts like an abstract class
        pass

    def write_file(self, content):
        # Acts like an abstract class for the file classes
        pass

    def print_content(self):
        # Acts like an abstract class
        pass
