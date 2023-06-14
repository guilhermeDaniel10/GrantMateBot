import json

class SectionStructure:

    def __init__(self):
        self.paragraph = ""
        self.iteration = -1
        self.language = ""

    def set_all_values(self, iteration, heading, paragraph, language):
        self.set_iteration(iteration)
        self.set_heading(heading)
        self.set_paragraph(paragraph)
        self.set_language(language)

    def set_iteration(self, iteration):
        self.iteration = iteration

    def set_heading(self, heading):
        self.heading = heading

    def set_paragraph(self, paragraph):
        self.paragraph = paragraph

    def set_language(self, language):
        self.language = language

    def get_iteration(self):
        return self.iteration

    def get_heading(self):
        return self.heading

    def get_paragraph(self):
        return self.paragraph

    def get_language(self):
        return self.language

    def is_section_valid(self):
        return self.iteration > -1

    def to_dict(self):
        return {
            'iteration': self.iteration,
            'heading': self.heading,
            'paragraph': self.paragraph,
            'language': self.language
        }
    
    def to_simple_dict(self):
        return {
            'heading': self.heading,
            'paragraph': self.paragraph,
            'language': self.language
        }
    
    def to_json(self):
        return json.dumps(self.to_simple_dict())

    def print_section_structure(self):
        print(self.iteration, self.heading,
              self.paragraph, self.language, flush=True)
