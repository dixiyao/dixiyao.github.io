import os
import tempfile
import urllib.request
import shutil
import fitz
import csv

def convert_pdf_to_text(pdf_path, output_txt_path):
    # Open the PDF file
    document = fitz.open(pdf_path)

    text = ""  # Initialize a text string to hold all text from the PDF

    texts=[]
    for page_num in range(len(document)):
        # Get the page
        page = document.load_page(page_num)

        # First, try to extract text using PyMuPDF
        text_content = page.get_text()

        if text_content.strip():  # If text is found, append it.
            text_lines=text_content.split("\n")
            for line in text_lines:
                if line.strip():
                    if "references" in line.lower():
                        break
                    if line[-1] not in [".","?","!"]:
                        if len(line)<50:
                            continue
                        else:
                            text+=line+" "   
                    else:
                        text=text+line
                        if len(text.strip().split(" ")):
                            pass
                        else:
                            texts.append([text])
                        text=""

    # Close the document
    document.close()

    return texts

def main():
    prefix="2406."
    range_min=1
    range_max=225
    content=[["text"]]
    file=open("data/arxiv_24.csv","w")
    with file: 
        write = csv.writer(file)
        write.writerows(content)
    file.close()
    file=open("data/arxiv_24.csv","a")
    for index in range(range_min, range_max):
        arxiv_ref = f"{prefix}{index:04d}"
        pdf_url = f"https://arxiv.org/pdf/{arxiv_ref}.pdf"
        (fd, tmpfile) = tempfile.mkstemp(".tmp", prefix=prefix, dir=".")
        os.close(fd)
        os.unlink(tmpfile)
        try:
            (tmpfile, _) = urllib.request.urlretrieve(pdf_url, tmpfile, None)
            print(f"Downloaded {pdf_url}")
        except ConnectionResetError:
            continue
        shutil.move(tmpfile, "tmp.pdf")
        texts=convert_pdf_to_text("tmp.pdf", "tmp.txt")
        write = csv.writer(file,escapechar='\\')
        write.writerows(texts)
       
        

if __name__ == "__main__":
    main()