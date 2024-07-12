from unsloth import FastLanguageModel

max_seq_length=4096
dtype=None
load_in_4bit=True

model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "models/dpo-enhanced-model", # YOUR MODEL YOU USED FOR TRAINING
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
    )

model.push_to_hub_merged("<model-name>",tokenizer, save_method = "lora",token="hf_")