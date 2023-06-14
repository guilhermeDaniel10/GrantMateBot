class DocumentExtractionDTO:
    def __init__(self, number_of_pages, number_of_lines,):
        self.number_of_pages = number_of_pages
        self.number_of_lines = number_of_lines

    def __str__(self):
        return "Number of Pages: " + str(self.number_of_pages) + "\nNumber of Lines: " + str(self.number_of_lines)

    def get_number_of_pages(self):
        return self.number_of_pages
    
    def get_number_of_lines(self):
        return self.number_of_lines

    def to_json(self):
        return {
            "number_of_pages": self.number_of_pages,
            "number_of_lines": self.number_of_lines,
        }