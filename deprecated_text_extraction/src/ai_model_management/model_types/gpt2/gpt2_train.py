from file_management.file_manager import FileManager
from sklearn.model_selection import train_test_split
from transformers import GPT2Tokenizer, GPT2LMHeadModel, TextDataset, DataCollatorForLanguageModeling, Trainer, TrainingArguments,  pipeline, AutoConfig, AutoTokenizer, IntervalStrategy, AutoModelForCausalLM
from dotenv import load_dotenv
from datasets import Dataset
import pandas as pd
import torch
from torch.utils.data import Dataset, random_split
import os
import openai


load_dotenv()
FILE_STORAGE_PATH_PYTHON = os.getenv("FILE_STORAGE_PATH_PYTHON")
model_name = "GPT2_MODEL"
model_path = FILE_STORAGE_PATH_PYTHON + model_name


class GPT2Train:
    def __init__(self):
        # empty constructor
        pass

    def set_file_content(self, file_path, content):
        return self.save_file_as_txt(file_path, content)
        # self.process_information(self.txt_file)

     
    def fine_tune_alternative(self, filename, content):
        txt_file = self.set_file_content(filename, content)
        print("Document processed", flush=True)
        train_dataset, val_dataset = self.process_information(txt_file)
        print("Data processed", flush=True)

        base_tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')
        print("Tokenizer read", flush=True)
        # the eos and bos tokens are defined
        bos = '<|endoftext|>'
        eos = '<|EOS|>'
        pad = '<|pad|>'

        special_tokens_dict = {'eos_token': eos,
                               'bos_token': bos, 'pad_token': pad}
        # the new token is added to the tokenizer
        num_added_toks = base_tokenizer.add_special_tokens(special_tokens_dict)

        # model configuration to which we add the special tokens
        config = AutoConfig.from_pretrained('gpt2-medium',
                                            bos_token_id=base_tokenizer.bos_token_id,
                                            eos_token_id=base_tokenizer.eos_token_id,
                                            pad_token_id=base_tokenizer.pad_token_id,
                                            sep_token_id=base_tokenizer.sep_token_id,
                                            output_hidden_states=False)
        print("Config made", flush=True)

        # we load the pre-trained model with custom settings
        base_model = GPT2LMHeadModel.from_pretrained('gpt2-medium', config=config)
        print("Model read", flush=True)

        # model embeding resizing
        base_model.resize_token_embeddings(len(base_tokenizer))
        print("Token Resize", flush=True)

        def tokenize_function(examples):
            return base_tokenizer(examples['text'], padding=True)

        tokenized_train_dataset = train_dataset.map(
            tokenize_function,
            batched=True,
            num_proc=5,
            remove_columns=['text'],
        )
        print("Train Dataset created", flush=True)
        tokenized_val_dataset = val_dataset.map(
            tokenize_function,
            batched=True,
            num_proc=5,
            remove_columns=['text'],
        )
        print("Real Dataset created", flush=True)
        trained_dataset = base_tokenizer.decode(
            tokenized_train_dataset['input_ids'][0])
        print("Trained Dataset decoded", flush=True)

        training_args = TrainingArguments(
            output_dir=model_path,          # output directory
            num_train_epochs=6,              # total # of training epochs
            per_device_train_batch_size=32,  # batch size per device during training
            per_device_eval_batch_size=16,   # batch size for evaluation
            warmup_steps=200,                # number of warmup steps for learning rate scheduler
            weight_decay=0.01,               # strength of weight decay
            logging_dir=model_path,            # directory for storing logs
            prediction_loss_only=True,
            save_steps=10000
        )
        print("Training Arguments instantiated", flush=True)

        data_collator = DataCollatorForLanguageModeling(
            tokenizer=base_tokenizer,
            mlm=False
        )
        print("Data Collator instantiated", flush=True)

        trainer = Trainer(
            # the instantiated 🤗 Transformers model to be trained
            model=base_model,
            args=training_args,                  # training arguments, defined above
            data_collator=data_collator,
            train_dataset=tokenized_train_dataset,         # training dataset
            eval_dataset=tokenized_val_dataset            # evaluation dataset
        )
        print("Trainer instantiated", flush=True)

        trainer.train()
        print("Model trained", flush=True)
        trainer.save_model()
        print("Model saved", flush=True)
        base_tokenizer.save_pretrained(model_path)
        trainer.evaluate()

        headlines_model = GPT2LMHeadModel.from_pretrained(model_path)
        headlines_tokenizer = GPT2Tokenizer.from_pretrained(model_path)

        input_text = "INOVA+"

        headlines = self.generate_n_text_samples(headlines_model, headlines_tokenizer,
                                            input_text, n_samples=10)

        for h in headlines:
            print(h)
            print()
        print("FINE TUNE DONE", flush=True)
       

    
    def fine_tune_second_alternative(self, filename, content):
        txt_file = self.set_file_content(filename, content)
        print("File saved.", flush=True)
        torch.manual_seed(42)
        tokenizer = AutoTokenizer.from_pretrained("gpt2", bos_token='<|startoftext|>',
                                          eos_token='<|endoftext|>', pad_token='<|pad|>')
        print("Tokenizer has been loaded.", flush=True)
        model = AutoModelForCausalLM.from_pretrained("gpt2")
        print("Pre-trained model has been loaded.", flush=True)
        model.resize_token_embeddings(len(tokenizer))

        # read the text file
        with open(txt_file, 'r') as f:
            text = [line.strip() for line in f]

        # create a DataFrame from the text
        df = pd.DataFrame({'text': text})
        df_data = df['text']
        max_length = max([len(tokenizer.encode(data)) for data in df_data])
        print("Max length: {}".format(max_length))

        class ModelDataset(Dataset):
            def __init__(self, txt_list, tokenizer, max_length):
                self.input_ids = []
                self.attn_masks = []
                self.labels = []
                for txt in txt_list:
                    encodings_dict = tokenizer('<|startoftext|>' + txt + '<|endoftext|>', truncation=True,
                                            max_length=max_length, padding="max_length")
                    self.input_ids.append(torch.tensor(encodings_dict['input_ids']))
                    self.attn_masks.append(torch.tensor(encodings_dict['attention_mask']))

            def __len__(self):
                return len(self.input_ids)

            def __getitem__(self, idx):
                return self.input_ids[idx], self.attn_masks[idx]
            
        dataset = ModelDataset(df_data, tokenizer, max_length=max_length)
        print("Dataset has been created.", flush= True)
        train_size = int(0.9 * len(dataset))
        train_dataset, val_dataset = random_split(dataset, [train_size, len(dataset) - train_size])

        training_args = TrainingArguments(output_dir=model_path, num_train_epochs=5, logging_steps=5000,
                                  save_strategy=IntervalStrategy.NO,
                                  per_device_train_batch_size=2, per_device_eval_batch_size=2,
                                  warmup_steps=100, weight_decay=0.01, logging_dir='./logs')

        Trainer(model=model, args=training_args, train_dataset=train_dataset,
        eval_dataset=val_dataset, data_collator=lambda data: {'input_ids': torch.stack([f[0] for f in data]),
                                                              'attention_mask': torch.stack([f[1] for f in data]),
                                                              'labels': torch.stack([f[0] for f in data])}).train()
        
        print("Model trained", flush=True)

        generated = tokenizer("<|startoftext|>", return_tensors="pt").input_ids

        sample_outputs = model.generate(generated, do_sample=True, top_k=50,
                                bos_token='<|startoftext|>',
                                eos_token='<|endoftext|>', pad_token='<|pad|>',
                                max_length=300, top_p=0.95, temperature=1.9, num_return_sequences=20)
        
        for i, sample_output in enumerate(sample_outputs):
            print("{}: {}".format(i, tokenizer.decode(sample_output, skip_special_tokens=True)), flush= True)




    def generate_n_text_samples(self, model, tokenizer, input_text, n_samples=5):
        text_ids = tokenizer.encode(input_text, return_tensors='pt')
        #text_ids = text_ids.to(device)
       # model = model.to(device)

        generated_text_samples = model.generate(
            text_ids,
            max_length=100,
            num_return_sequences=n_samples,
            no_repeat_ngram_size=2,
            repetition_penalty=1.5,
            top_p=0.92,
            temperature=.85,
            do_sample=True,
            top_k=125,
            early_stopping=True
        )
        gen_text = []
        for t in generated_text_samples:
            text = tokenizer.decode(t, skip_special_tokens=True)
            gen_text.append(text)

        return gen_text

    def process_information(self, filename):
        # the eos and bos tokens are defined
        bos = '<|endoftext|>'
        eos = '<|EOS|>'
        pad = '<|pad|>'
        # read the text file
        with open(filename, 'r') as f:
            text = [line.strip() for line in f]

        # create a DataFrame from the text
        df = pd.DataFrame({'text': text})
        df['text'] = bos + ' ' + df['text'] + ' ' + eos

        print(df.head(), flush=True)
        pd.set_option('display.max_colwidth', None)
        print(df['text'], flush=True)

        df_train, df_val = train_test_split(
            df, train_size=0.9, random_state=77)
        print(
            f'There are {len(df_train)} lines for training and {len(df_val)} for validation')

        # we load the datasets directly from a pandas df
        train_dataset = Dataset.from_pandas(df_train[['text']])
        val_dataset = Dataset.from_pandas(df_val[['text']])

        return train_dataset, val_dataset

    def fine_tune(self):
        model_as_checkpoint = model_path
        if os.path.exists(model_as_checkpoint):
            model = GPT2LMHeadModel.from_pretrained(model_as_checkpoint)
        else:
            model = GPT2LMHeadModel.from_pretrained('gpt2-medium')

        # Initialize the tokenizer and model
        tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')

        # Load the extracted text into a TextDataset
        dataset = TextDataset(tokenizer=tokenizer,
                              file_path=self.txt_file, block_size=128)

        print("DATASET:", flush=True)
        print(dataset, flush=True)

        # Initialize a DataCollatorForLanguageModeling object
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=tokenizer, mlm=False)

        try:
            # Initialize a TrainingArguments object
            training_args = TrainingArguments(
                output_dir=model_path,
                overwrite_output_dir=True,  # overwrite the content of the output directory
                num_train_epochs=3,  # number of training epochs
                per_device_train_batch_size=32,  # batch size for training
                save_steps=800,  # after # steps model is saved
                warmup_steps=500,  # number of warmup steps for learning rate scheduler
                prediction_loss_only=True,
                learning_rate=1e-5
            )

            # Initialize a Trainer object and train the model
            trainer = Trainer(
                model=model,
                args=training_args,
                data_collator=data_collator,
                train_dataset=dataset,
            )

            trainer.train()
            trainer.save_model()
            print("Training finished", flush=True)
        except Exception as e:
            print("Error:", e)

    def generate_text(self, prompt):
        # Initialize the tokenizer and model
        print("Generating", flush=True)
        tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')
        print("Loaded the tokenizer", flush=True)

        model = GPT2LMHeadModel.from_pretrained(model_path)
        print("Loaded the model", flush=True)

        # Set up the text generation pipeline
        text_generator = pipeline(
            'text-generation', model=model, tokenizer=tokenizer)

        # inputs = tokenizer.encode(prompt, return_tensors='pt')

        # Generate text
        generated_text = text_generator(prompt, max_length=100, do_sample=True)
        print(generated_text[0]['generated_text'], flush=True)

    def save_file_as_txt(self, file_name, content):
        print(file_name, flush=True)
        file_manager = FileManager()
        return file_manager.save_content_as_txt(file_name, content)
    
    #####################################################################################
    ################################ GPT 3 TESTE ########################################


    def fine_tune_gpt3(self, content):
        openai.api_key = "aaaaaaaaaaaaaaaaaaaaaaaaa" # replace with your own API key

        # prepare the training data
        training_data = [
            content,
            # add more project proposals here
        ]

        # define the parameters for fine-tuning
        model = "text-davinci-002"
        epochs = 3
        batch_size = 4
        learning_rate = 1e-5
        max_tokens = 2048

        # fine-tune the model
        fine_tune_data = {
            "prompt": "\n".join(training_data),
            "model": model,
            "num_epochs": epochs,
            "batch_size": batch_size,
            "learning_rate": learning_rate,
            "max_tokens": max_tokens,
        }
        response = openai.api_request("POST", "/fine-tunes", fine_tune_data)
        model_id = response["model"]

        print(model_id, flush=True)
    
    def generate_text_gpt3(self, prompt):
        openai.api_key = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa" # replace with your own API key
        model_id = "YOUR_MODEL_ID"
        response = openai.Completion.create(
            engine=model_id,
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5
        )
        
        # extract the generated text from the API response
        generated_text = response.choices[0].text
        print(generated_text, flush=True)

