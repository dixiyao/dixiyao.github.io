from unsloth import FastLanguageModel, PatchDPOTrainer,is_bfloat16_supported
PatchDPOTrainer()
from transformers import TrainingArguments
from trl import DPOTrainer
from datasets import Dataset
from transformers import TrainingArguments,TextStreamer

max_seq_length=4096
dtype=None
load_in_4bit=True

model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "models/finetuned-model", # YOUR MODEL YOU USED FOR TRAINING
        max_seq_length = max_seq_length,
        dtype = dtype,
        load_in_4bit = load_in_4bit,
    )

EOS_TOKEN = tokenizer.eos_token # Must add EOS_TOKEN

        
dataset = Dataset.from_csv("data/conversation_selected_template.csv", encoding="utf-8", lineterminator='\n', delimiter=";")
EOS_TOKEN = tokenizer.eos_token # Must add EOS_TOKEN
def formatting_prompts_func(examples):
    prompts=examples["prompt"]
    chosens=examples["chosen"]
    rejecteds=examples["rejected"]
    output_prompts=[]
    output_chosens=[]
    output_rejecteds=[]
    for prompt,chosen,rejected in zip(prompts,chosens,rejecteds):
        output_prompts.append(prompt+EOS_TOKEN)
        output_chosens.append(chosen+EOS_TOKEN)
        output_rejecteds.append(rejected+EOS_TOKEN)
    return { "prompt" : output_prompts, "chosen" : output_chosens, "rejected" : output_rejecteds, }
dataset=dataset.map(formatting_prompts_func,batched=True)

dpo_trainer = DPOTrainer(
    model = model,
    ref_model = None,
    args = TrainingArguments(
        per_device_train_batch_size = 4,
        gradient_accumulation_steps = 8,
        warmup_ratio = 0.1,
        num_train_epochs = 3,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        seed = 42,
        output_dir = "outputs",
    ),
    beta = 0.1,
    train_dataset = dataset,
    # eval_dataset = YOUR_DATASET_HERE,
    tokenizer = tokenizer,
    max_length = 2049,
    max_prompt_length = 512,
)
dpo_trainer.train()

FastLanguageModel.for_inference(model)
inputs = tokenizer(
        ["""Below is a conservation between a PhD student and Professor Li. Reply as you are Professor and respond to the student
        ### Student Question: Sorry for making the mistake
        ### Professor Li Response: """
        ], return_tensors = "pt").to("cuda")

text_streamer = TextStreamer(tokenizer)
model.generate(**inputs, streamer = text_streamer, max_new_tokens = 1024)
model.save_pretrained("dpo-enhanced-model-3")
tokenizer.save_pretrained("dpo-enhanced-model-3")