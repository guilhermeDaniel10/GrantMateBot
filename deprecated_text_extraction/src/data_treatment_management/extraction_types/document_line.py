class DocumentLine():
    def __init__(self):
        pass

    def set_line(self, line_type, content):
        self.line_type = line_type
        self.content = content
    
    def get_line_type(self):
        return self.line_type
    
    def get_content(self):
        return self.content
    
    def document_line_print(self):
        print(self.line_type, self.content, flush=True)