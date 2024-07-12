import spaces
import gradio as gr
from rag import Rag_qa
import os

gr.close_all()

with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown(
    """
    # Welcome to the ChatBot with a Professor!
    """)
    chatbot = gr.Chatbot()
    msg = gr.Textbox()
    clear = gr.ClearButton([msg, chatbot])
    
    @spaces.GPU
    def respond(message, chat_history):
        bot_message = Rag_qa(message)
        chat_history.append((message, bot_message))  
        return "", chat_history
        
    msg.submit(respond, [msg, chatbot], [msg, chatbot])
    
if __name__ == "__main__":
    #demo.launch()
    demo.launch(auth=(os.environ.get("USERNAME"), os.environ.get("PASSWORD")))