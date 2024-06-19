from datasets import Dataset
    
def remove_none(example) -> bool:
    """
    Check if any value in the example is None
    """
    return all(value is not None for value in example.values())

def remove_none_paragraph(example) -> bool:
    """
    Filter out the samples which are not paragraphs
    """
    return all(len(value.strip().split(" "))>50 and value[0]!='[' and ". . . ." for value in example.values())
    
def remove_references(example) -> bool:
    """
    Filter out the samples which are references
    """
    return all("http" not in value and "doi" not in value and "et al" for value in example.values())
def main():
    dataset = Dataset.from_csv("data/arxiv_24_06_cleaned.csv")
    cleaned_dataset = dataset.filter(remove_none)
    cleaned_dataset = cleaned_dataset.filter(remove_none_paragraph)
    cleaned_dataset = cleaned_dataset.filter(remove_references)
    df = cleaned_dataset.to_pandas()
    df.to_csv("arxiv_24_06_cleaned.csv", mode='w', encoding="utf-8", index=False, lineterminator='\n')
        
if __name__ == "__main__":
    main()