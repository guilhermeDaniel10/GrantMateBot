class EmbeddingsCreationDto:
    def __init__(self, number_of_rows, number_of_columns):
        self.number_of_rows = number_of_rows
        self.number_of_columns = number_of_columns

    def __str__(self):
        return "Number of Rows: " + str(self.number_of_rows) + "\nNumber of Columns: " + str(self.number_of_columns)

    def get_number_of_rows(self):
        return self.number_of_rows

    def get_number_of_columns(self):
        return self.number_of_columns

    def to_json(self):
        return {
            "number_of_rows": self.number_of_rows,
            "number_of_columns": self.number_of_columns,
        }
