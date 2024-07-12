import spaces
import time
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
import pandas as pd
import faiss
import transformers
import spaces
import torch
import re

pipeline = transformers.pipeline(
    "text-generation",
    model=<your-model-name>,
    model_kwargs={
        "torch_dtype": torch.float16,
        "quantization_config": {"load_in_4bit": True},
        "low_cpu_mem_usage": True,
    },
)
terminators =  [
    pipeline.tokenizer.eos_token_id,
    pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
]
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
# Initialize an empty FAISS index
dimension = embeddings.client.get_sentence_embedding_dimension()
index = faiss.IndexFlatL2(dimension)
docstore = InMemoryDocstore()
vector_store = FAISS(
    embedding_function=embeddings,
    index=index,
    docstore=docstore,
    index_to_docstore_id={}
)

class Langchain_RAG:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        print("Loading files, this may take time to process...")
        self.data = pd.read_csv("conversation_RAG.csv", delimiter=",")
        self.texts=self.data["Output"]
        self.texts=self.texts.tolist()
        self.get_vec_value = FAISS.from_texts(self.texts, self.embeddings)
        print("Vector values saved.")
        self.retriever = self.get_vec_value.as_retriever(search_kwargs={"k": 4})

    def __call__(self, query):
        relevant_docs = self.retriever.invoke(query)
        return "".join([doc.page_content for doc in relevant_docs])
    
class Llama3_8B_gen:
    def __init__(self, pipeline, embeddings, vector_store, threshold):
        self.pipeline = pipeline
        self.embeddings = embeddings
        self.vector_store = vector_store
        self.threshold = threshold
        
    @staticmethod
    def generate_prompt(query,retrieved_text):
        messages = """Below is a conservation between a PhD student and Professor. Reply as you are Professor and respond to the student. In the response, remove replicated sentences. The last sentence should be ended. Remove unended sentences.
        ### Student Question: {}
        ### Professor Li Response: {}""".format(query,retrieved_text)
        return messages

    
    def remove_repeated_sentences(self,paragraph):
    # Split the paragraph into sentences using regex to handle punctuation properly
        sentences = re.split(r'(?<=[.!?]) +', paragraph)
        
        # Create a set to store unique sentences
        seen_sentences = set()
        unique_sentences = []
        
        for sentence in sentences:
            # Check if the sentence is already seen
            if sentence not in seen_sentences:
                # If not seen, add to the set and the list of unique sentences
                seen_sentences.add(sentence)
                unique_sentences.append(sentence)
        
        # Join the unique sentences back into a paragraph
        unique_paragraph = ' '.join(unique_sentences)
        return unique_paragraph

    def semantic_cache(self, query, prompt):
        query_embedding = self.embeddings.embed_documents([query])
        similar_docs = self.vector_store.similarity_search_with_score_by_vector(query_embedding[0], k=1)
        
        if similar_docs and similar_docs[0][1] <self.threshold:
            self.print_bold_underline("---->> From Cache")
            return similar_docs[0][0].metadata['response']
        else:
            self.print_bold_underline("---->> From LLM")
            output = self.pipeline(prompt, max_new_tokens=512, eos_token_id=terminators, do_sample=True, temperature=0.7, top_p=0.9)
            
            response = output[0]["generated_text"][len(prompt):]
            response=response.split('\n')[0]
            
            self.vector_store.add_texts(texts = [query], 
                       metadatas = [{'response': response},])
            
            response=self.remove_repeated_sentences(response)
            return response
            
    @spaces.GPU
    def generate(self, query, retrieved_context):
        start_time = time.time()
        
        prompt = self.generate_prompt(query, retrieved_context)
        res = self.semantic_cache(query, prompt)   
        
        end_time = time.time()
        execution_time = end_time - start_time
        self.print_bold_underline(f"LLM generated in {execution_time:.6f} seconds")
        
        return res

    @staticmethod
    def print_bold_underline(text):
        print(f"\033[1m\033[4m{text}\033[0m")

text_gen=Llama3_8B_gen(pipeline,embeddings,vector_store,0.1)
retriever=Langchain_RAG()

@spaces.GPU
def Rag_qa(query):
    retriever_context = retriever(query)
    result = text_gen.generate(query,retriever_context)
    return result

print(Rag_qa("Can you write a reference letter for me?"))

