import os

from dotenv import load_dotenv
from ai_model_management.model_types.bert.bert_data_treatment import BertDataTreatment
import transformers
import torch.nn as nn
from torch.utils.data import DataLoader



load_dotenv()
FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
model_name = "BERT_MODEL"
model_path = FILE_STORAGE_PATH_PYTHON + "/" + model_name


class BertTrain:
    def __init__(self, filename):
        self.filename = filename
        # Check if model exists, otherwise create new model
        if not os.path.exists(model_path):
            os.makedirs(model_path)
            model = transformers.BertForMaskedLM.from_pretrained(
                "bert-base-uncased")
            tokenizer = transformers.BertTokenizer.from_pretrained(
                "bert-base-uncased")
            model.save_pretrained(model_path)
            tokenizer.save_pretrained(model_path)
            self.model = model
            self.tokenizer = tokenizer
        else:
            model = transformers.BertForMaskedLM.from_pretrained(model_path)
            tokenizer = transformers.BertTokenizer.from_pretrained(model_path)
            self.model = model
            self.tokenizer = tokenizer

    def fine_tune(self, content):
        bert_data_treatment = BertDataTreatment()
        pre_processed_file = bert_data_treatment.preprocess_file_contents(
            content, self.filename)

        # Fine-tune BERT model on new data
        optimizer = transformers.AdamW(self.model.parameters(), lr=5e-5)
        loss_fn = nn.CrossEntropyLoss()
        train_dataset = transformers.LineByLineTextDataset(
            tokenizer=self.tokenizer, file_path=pre_processed_file, block_size=128)
        train_loader = DataLoader(
            train_dataset, batch_size=16, shuffle=True)
        trainer = transformers.Trainer(
            model=self.model,
            train_dataset=train_dataset,
           # optimizer=optimizer,
            data_collator=transformers.DataCollatorForLanguageModeling(tokenizer=self.tokenizer, mlm=True, mlm_probability=0.15),
            compute_metrics=None,
            callbacks=[transformers.EarlyStoppingCallback(early_stopping_patience=3)]
        )
        trainer.train()

        # Generate text with fine-tuned model
        prompt = 'Emerging network technologies'
        input_ids = self.tokenizer.encode(prompt, return_tensors='pt')
        output = self.model.generate(input_ids=input_ids,
                                     max_length=20, do_sample=True)
        generated_text = self.tokenizer.decode(
            output[0], skip_special_tokens=True)
        print(generated_text, flush=True)
