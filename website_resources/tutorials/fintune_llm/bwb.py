"""
This dataset is a wrapper around BWB dataset for usage of torchtune.

Referece:
BWB dataset: https://github.com/EleanorJiang/BlonDe

"""
from typing import Any, Callable, Dict, List, Mapping, Optional, Tuple
import os

import numpy as np

from torch.utils.data import Dataset
from torchtune.modules.tokenizers import Tokenizer
from torchtune.data import (
    CROSS_ENTROPY_IGNORE_IDX,
    InstructTemplate,
    Message,
    validate_messages,
)

class BWBTemplate(InstructTemplate):
    """
    Prompt template for BWB dataset. 
    """

    template = {
        "prompt_input": (
            "Below is an instruction that describes a task, paired with an input that provides further context. "
            "### Instruction:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n"
        ),
        "prompt_no_input": (
            "Below is an instruction that describes a task. "
            "### Instruction:\n{instruction}\n\n### Response:\n"
        ),
    }

    @classmethod
    def format(
        cls, sample: Mapping[str, Any], column_map: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generate prompt from instruction and input.

        Args:
            sample (Mapping[str, Any]): a single data sample with instruction
            column_map (Optional[Dict[str, str]]): a mapping from the expected
                placeholder names in the template to the column names in the sample.
                If None, assume these are identical.

        Returns:
            The formatted prompt
        """
        column_map = column_map or {}
        key_input = column_map.get("input", "input")
        key_instruction = column_map.get("instruction", "instruction")

        if key_input in sample and sample[key_input]:
            prompt = cls.template["prompt_input"].format(
                instruction=sample[key_instruction], input=sample[key_input]
            )
        else:
            prompt = cls.template["prompt_no_input"].format(
                instruction=sample[key_instruction]
            )
        return prompt

class BWBDataset(Dataset):
    """
    Class that supports any custom dataset with instruction-based prompts and a
    configurable template.

    The general flow from loading a sample to tokenized prompt is:
    load sample -> apply transform -> format into template -> tokenize

    If the column/key names differ from the expected names in the `InstructTemplate`,
    then the `column_map` argument can be used to provide this mapping.

    Masking of the prompt during training is controlled by the `train_on_input` flag, which is
    set to `False` by default.
    - If `train_on_input` is True, the prompt is used during training and
    contributes to the loss.
    - If `train_on_input` is False, the prompt is masked out (tokens replaced with -100)

    Args:
        tokenizer (Tokenizer): Tokenizer used to encode data. Tokenize must implement an `encode` and `decode` method.
        source (str): path string of dataset, anything supported by Hugging Face's `load_dataset`
            (https://huggingface.co/docs/datasets/en/package_reference/loading_methods#datasets.load_dataset.path)
        template (InstructTemplate): template used to format the prompt. If the placeholder variable
            names in the template do not match the column/key names in the dataset, use `column_map` to map them.
        transform (Optional[Callable]): transform to apply to the sample before formatting to the template.
            Default is None.
        column_map (Optional[Dict[str, str]]): a mapping from the expected placeholder names in the template
            to the column/key names in the sample. If None, assume these are identical.
        train_on_input (bool): Whether the model is trained on the prompt or not. Default is False.
        max_seq_len (Optional[int]): Maximum number of tokens in the returned input and label token id lists.
            Default is None, disabling truncation. We recommend setting this to the highest you can fit in memory
            and is supported by the model. For example, llama2-7B supports up to 4096 for sequence length.
        **load_dataset_kwargs (Dict[str, Any]): additional keyword arguments to pass to `load_dataset`.
    """

    def __init__(
        self,
        tokenizer: Tokenizer,
        source: str,
        template: InstructTemplate,
        transform: Optional[Callable] = None,
        column_map: Optional[Dict[str, str]] = None,
        train_on_input: bool = False,
        max_seq_len: Optional[int] = None,
        **load_dataset_kwargs: Dict[str, Any],
    ) -> None:
        self._tokenizer = tokenizer
        self._data = []
        for books in os.listdir(source):
            if books.endswith(".chs"):
                chs_book_name = books.split(".chs")[0]
                chs_content= open(os.path.join(source, books), "r",encoding="utf-8").read()
                enu_content= open(os.path.join(source, chs_book_name+".enu"), "r",encoding="utf-8").read()
                chs_sentences=chs_content.split("<sep> ")
                enu_sentences=enu_content.split("<sep> ")
                for i,chs_sentence in enumerate(chs_sentences):
                    if i<len(enu_sentences):
                        self._data.append({"chs": chs_sentence, "enu": enu_sentences[i],"instruction":"Write this content in style of Chinese Web Novels."})
                    else:
                        self._data.append({"chs": chs_sentence,"instruction":"Write a Chinese Web Novel."})
        self.template = template
        self._transform = transform
        self._column_map = column_map
        self.train_on_input = train_on_input
        self.max_seq_len = max_seq_len

    def __len__(self):
        return len(self._data)

    def __getitem__(self, index: int) -> Tuple[List[int], List[int]]:
        sample = self._data[index]
        return self._prepare_sample(sample)

    def _prepare_sample(self, sample: Mapping[str, Any]) -> Tuple[List[int], List[int]]:
        transformed_sample = self._transform(sample) if self._transform else sample

        prompt = self.template.format(transformed_sample, self._column_map)
        key_output = (
            self._column_map["output"]
            if self._column_map and "output" in self._column_map
            else "output"
        )
        messages = [
            Message(role="user", content=prompt, masked=(not self.train_on_input)),
            Message(role="assistant", content=transformed_sample[key_output]),
        ]

        validate_messages(messages)

        tokens, mask = self._tokenizer.tokenize_messages(
            messages, max_seq_len=self.max_seq_len
        )

        # Wherever mask == True, set to CROSS_ENTROPY_IGNORE_IDX. Otherwise keep as tokens
        labels = list(np.where(mask, CROSS_ENTROPY_IGNORE_IDX, tokens))
        assert len(tokens) == len(labels)

        return tokens, labels


def bwb_dataset(
    tokenizer: Tokenizer,
    source: str = "",
    train_on_input: bool = False,
) -> BWBDataset:
    """
    Support for summarization datasets and their variants from Hugging Face Datasets.
    An example is the `SAMsum dataset <https://huggingface.co/datasets/samsum>`_.

    The prompt template mirrors what is used in the llama_recipes `codebase
    <https://github.com/meta-llama/llama-recipes/blob/main/src/llama_recipes/datasets/samsum_dataset.py#L13>`_

    where `dialogue` and `summary` are fields from the dataset.

    Masking of the prompt during training is controlled by the `train_on_input` flag, which is
    set to `False` by default
    - If `train_on_input` is True, the prompt is used during training and
    contributes to the loss.
    - If `train_on_input` is False, the prompt is masked out (tokens replaced with -100)

    Args:
        tokenizer (Tokenizer): Tokenizer used to encode data. Tokenize must implement an `encode` and `decode` method.
        source (str): path string of dataset.
        train_on_input (bool): Whether the model is trained on the prompt or not. Default is False.

    Returns:
        BWBDataset: dataset configured with source data and template


    Example:
        >>> samsum_ds = samsum_dataset(tokenizer=tokenizer)
        >>> for batch in Dataloader(samsum_ds, batch_size=8):
        >>>     print(f"Batch size: {len(batch)}")
        >>> Batch size: 8
    """

    return BWBDataset(
        tokenizer=tokenizer,
        source=source,
        template=BWBTemplate,
        column_map={"input":  "enu",
                    "output": "chs",
                    "instruction": "instruction"},
        train_on_input=train_on_input,
        split="train",
    )


if __name__=="__main__":
    from torchtune.models.llama3 import llama3_tokenizer
    dataset = bwb_dataset(llama3_tokenizer("Finetune_LLM/Models/original/tokenizer.model"),source="./data/BWB_dataset/train")
    print(len(dataset))
    for i, (tokens_, labels_) in enumerate(dataset):
        print(tokens_)
        print(labels_)
        if i>1:
            break