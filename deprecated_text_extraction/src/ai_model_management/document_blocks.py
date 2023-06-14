class DocumentBlock:
    def __init__(self, heading, paragraph):
        self.heading = heading
        self.paragraph = paragraph

    def to_dict(self):
        return {
            'heading': "<SO_HEADING>" + self.heading + " <EO_HEADING>",
            'paragraph': "<SO_PARAGRAPH>" + self.paragraph + " <EO_PARAGRAPH>",
        }
