"""
Do finetuning for text completion tasks. 
Referenced https://colab.research.google.com/drive/135ced7oHytdxu3N2DNe1Z0kqjyYIkDXp?usp=sharing#scrollTo=upcOlWe7A1vc
"""
import torch
import logging
from datasets import Dataset
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth import is_bfloat16_supported,FastLanguageModel
import sys
import argparse

logger = logging.getLogger()
logger.setLevel(logging.CRITICAL)
file_handler = logging.FileHandler('unsloth_qa_finetuning.log')
logger.addHandler(file_handler)

class UnslothQAFinetuning:
    
    def __init__(self, model_name, max_seq_length = 4096, dtype = None, load_in_4bit = True):
        # Load the model and tokenizer
        self.max_seq_length = max_seq_length
        if model_name == "mistral-7b":
            self.model_name = "unsloth/mistral-7b-v0.3"
        else:
            self.model_name = "unsloth/llama-3-8b-Instruct-bnb-4bit"
        self.model, self.tokenizer = FastLanguageModel.from_pretrained(
            model_name = self.model_name,
            max_seq_length = max_seq_length,
            dtype = dtype,
            load_in_4bit = load_in_4bit,
            #token = "hf_xxx", # use one if using gated models like meta-llama/Llama-2-7b-hf
        )

        # Add LoRA adapters, embed_tokens and lm_head
        self.model = FastLanguageModel.get_peft_model(
           self.model,
            r = 16, # Choose any number > 0 ! Suggested 8, 16, 32, 64, 128
            target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                            "gate_proj", "up_proj", "down_proj",],
            lora_alpha = 16,
            lora_dropout = 0, # Supports any, but = 0 is optimized
            bias = "none",    # Supports any, but = "none" is optimized
            # [NEW] "unsloth" uses 30% less VRAM, fits 2x larger batch sizes!
            use_gradient_checkpointing = "unsloth", # True or "unsloth" for very long context
            random_state = 1112,
            use_rslora = False,  # We support rank stabilized LoRA
            loftq_config = None, # And LoftQ
        )
        
        logging.critical(f"Loaded {self.model_name}")
        
        self.prompt_template = """Below is a conservation between a PhD student and Professor. Reply as you are Professor and repspond to the student
            ### Student Question:
            {}
            ### Professor  Response:
            {}"""

        self.load_data()
        
    def load_data(self):
        """
        Load the train and test dataset.
        """
        EOS_TOKEN = self.tokenizer.eos_token # Must add EOS_TOKEN
        def formatting_prompts_func(examples):
            inputs       = examples["Student Question"]
            outputs      = examples["Professor Response"]
            texts = []
            for input, output in zip(inputs, outputs):
                # Must add EOS_TOKEN, otherwise your generation will go on forever!
                text = self.prompt_template.format(input, output) + EOS_TOKEN
                texts.append(text)
            return { "text" : texts, }
        
        dataset = Dataset.from_csv("data/conversation.csv", encoding="utf-8", lineterminator='\n', delimiter=";")
        self.train_dataset=dataset.map(formatting_prompts_func,batched=True)
        
    def save_model(self, output_dir) -> None:
        """
        Save the model and tokenizer to the specified output directory.
        
        :param output_dir: the output directory that the model and tokonizer will be saved
        """
        self.model.save_pretrained(output_dir)
        self.tokenizer.save_pretrained(output_dir)
        
    def _show_curr_mem_stats(self) -> None:
        """
        Show the current memory statistics.
        """
        gpu_stats = torch.cuda.get_device_properties(0)
        self.start_gpu_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
        self.max_memory = round(gpu_stats.total_memory / 1024 / 1024 / 1024, 3)
        logging.critical(f"GPU = {gpu_stats.name}. Max memory = {self.max_memory} GB.")
        logging.critical(f"{self.start_gpu_memory} GB of memory reserved.")
        
    def _show_final_mem_stats(self, trainer_stats) -> None:
        """
        Show the final memory statistics of the continued pretraining.
        
        :param trainer_stats: trainer's statistics
        """
        used_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
        used_memory_for_lora = round(used_memory - self.start_gpu_memory, 3)
        used_percentage = round(used_memory / self.max_memory * 100, 3)
        lora_percentage = round(used_memory_for_lora / self.max_memory * 100, 3)
        logging.critical(f"{trainer_stats.metrics['train_runtime']} seconds used for training.")
        logging.critical(f"{round(trainer_stats.metrics['train_runtime']/60, 2)} minutes used for training.")
        logging.critical(f"Peak reserved memory = {used_memory} GB.")
        logging.critical(f"Peak reserved memory for training = {used_memory_for_lora} GB.")
        logging.critical(f"Peak reserved memory % of max memory = {used_percentage} %.")
        logging.critical(f"Peak reserved memory for training % of max memory = {lora_percentage} %.")
        
    def finetuning(self) -> None:
        """
        Do finetuning
        """
        trainer = SFTTrainer(
            model = self.model,
            tokenizer = self.tokenizer,
            train_dataset = self.train_dataset,
            dataset_text_field = "text",
            max_seq_length = self.max_seq_length,
            dataset_num_proc = 2,
            packing = False, # Can make training 5x faster for short sequences.
            args = TrainingArguments(
                per_device_train_batch_size = 2,
                gradient_accumulation_steps = 4,
                warmup_steps = 5,
                max_steps = 1000,
                learning_rate = 2e-4,
                fp16 = not is_bfloat16_supported(),
                bf16 = is_bfloat16_supported(),
                logging_steps = 1,
                optim = "adamw_8bit",
                weight_decay = 0.01,
                lr_scheduler_type = "linear",
                seed = 1112,
                output_dir = "outputs",
                report_to="tensorboard",
            ),
        )
        
        self._show_curr_mem_stats()
        trainer_stats = trainer.train()
        self._show_final_mem_stats(trainer_stats)
        for log in trainer.state.log_history:
            logging.critical(log)

    def evalute(self):
        FastLanguageModel.for_inference(self.model)
        inputs = self.tokenizer(
        [    
            self.prompt_template.format(
                "Can you help me write a reference letter?", 
                ""
            )
        ], return_tensors = "pt").to("cuda")

        from transformers import TextStreamer
        text_streamer = TextStreamer(self.tokenizer)
        _ = self.model.generate(**inputs, streamer = text_streamer, max_new_tokens = 128)

def main(args):
    # Load a pretrained model, tokenizer, and data
    unsloth_finetuning = UnslothQAFinetuning(args.model)
    
    # Finetuning
    unsloth_finetuning.finetuning()

    unsloth_finetuning.evalute()
    
    # Save the model and tokenizer
    unsloth_finetuning.save_model(f"fine-tuned-LLM/{unsloth_finetuning.model_name}-conversation")
    
def parse_arguments(argv):
    """
    Parse the argument for extracting training data.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, default="llama3-8b-instruct", help="the model name")
    return parser.parse_args(argv)

if __name__ == "__main__":
    args = parse_arguments(sys.argv[1:])
    main(args)
