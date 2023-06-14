class ResponseDTO:
    def __init__(self, status_code, body):
        self.status_code = status_code
        self.body = body

    def __str__(self):
        return "Status Code: " + str(self.status_code) + "\nBody: " + str(self.body)

    def get_body(self):
        return self.body

    def get_status_code(self):
        return self.status_code
    
