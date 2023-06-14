class SectionStructure:

    def __init__(self):
        self.paragraph = ""
        self.iteration = -1

    def set_iteration(self, iteration):
        self.iteration = iteration

    def set_heading(self, heading):
        self.heading = heading

    def set_paragraph(self, paragraph):
        self.paragraph = paragraph

    def is_section_valid(self):
        return self.iteration > -1

    def to_dict(self):
        return {
            'iteration': self.iteration,
            'heading': self.heading,
            'paragraph': self.paragraph,
        }
    
    def print_section_structure(self):
        print(self.iteration, self.heading, self.paragraph, flush=True)
