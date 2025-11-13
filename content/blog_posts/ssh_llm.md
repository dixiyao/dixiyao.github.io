+++
author = "Dixi Yao"
title = "Efficient Coding Trick: Letting Cursor Access Project Folder via SSH"
date = "2025-11-11"
+++

I would like to share a tool which I think is very helpful in my daily coding and research. Cursor is a highly-helpful tool which helps with my coding a lot. Other options include Claude and GPT CodeX, etc. In machine learning projects, we usually won't run our tasks locally, especially training. Uploading code to the cloud and downloading and debugging it is not efficient. Hence, VSCode SSH is a common plugin to help us directly manage our code remotely. GitHub is also a useful tool that we can put everything on Git and manage the project. As a result, I would like to share how I combine them.

# Preparation
- Cursor: You can apply for student discount
- Github
- GPU cluster

## Connection
Set up your connection with the server via SSH. You can search a lot of references on the Internet. Here is an [example](https://clinic.ds.uchicago.edu/tutorials/ssh_github_cluster.html#windows-enable-openssh)

## Set Up with Cursor
Open a Cursor Window and select connect via SSH.

You should be able to view your folders directly in the Cursor and then you can start programming and you can directly ask the Cursor to revise the code based on the feedback of the logs. 

You can also connect the server with the Github so that you can directly make commits in the cursor.

## Security Keys
It is a good manner to put security keys in some places. We can have huggingface tokens, wandb tokens, etc. You can put any where you like on the server in a file. Then, you just need `source xxx.txt` and then export them in your script files.

# Limitation
One critical drawback of this system is that it will have quite a severe privacy vulnerability. Basically, you are exposing all your codebase and the whole data of your directory on the server to those LLM companies and they can freely leverage your data for further training. As a result, this convenience is a compromise to your personal privacy.