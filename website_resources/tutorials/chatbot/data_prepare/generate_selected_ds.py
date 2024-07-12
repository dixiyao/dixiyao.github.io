from unsloth import FastLanguageModel
from datasets import Dataset
from tqdm import tqdm

model_name = "unsloth/llama-3-8b-Instruct-bnb-4bit"
max_seq_length=4096
dtype=None
load_in_4bit=True

model, tokenizer = FastLanguageModel.from_pretrained(
            model_name = model_name,
            max_seq_length = max_seq_length,
            dtype = dtype,
            load_in_4bit = load_in_4bit,
            #token = "", # use one if using gated models 
        )

EOS_TOKEN = tokenizer.eos_token # Must add EOS_TOKEN

prompt_template = """Below is a conservation between a PhD student and a professor. Reply as you are the professor and respond to the student
### Student Question: {}
### Professor Li Response: {}"""
def formatting_prompts_func(examples):
    inputs       = examples["Student Question"]
    outputs      = examples["Professor Response"]
    texts = []
    preferreds=[]
    for input, output in zip(inputs, outputs):
        # Must add EOS_TOKEN, otherwise your generation will go on forever!
        text = prompt_template.format(input,"")
        preferred=output
        texts.append(text)
        preferreds.append(preferred)
    return { "text" : texts,"preferred":preferreds}
        
dataset = Dataset.from_csv("conversation_selected.csv", encoding="utf-8", lineterminator='\n', delimiter=";")
train_dataset=dataset.map(formatting_prompts_func,batched=True)

FastLanguageModel.for_inference(model)
new_file="conversation_selected_template.csv"
new_f=open(new_file,"w")
new_f.write("prompt;chosen;rejected\n")
with tqdm(total=len(train_dataset)) as pbar:
    for data in train_dataset:
        inputs =tokenizer(data["text"]+EOS_TOKEN, return_tensors = "pt").to("cuda")
        outputs = model.generate(**inputs, max_new_tokens = 1024)
        outputs=tokenizer.decode(outputs[0], skip_special_tokens=True)
        outputs=outputs.replace(data["text"],"")
        outputs=outputs.replace("assistant","")
        outputs=outputs.replace("\n"," ")
        print(outputs)
        new_f.write(data["text"].replace("\n"," ")+";"+outputs+";"+data["preferred"].replace("\n"," ")+"\n")
        pbar.update(1)
