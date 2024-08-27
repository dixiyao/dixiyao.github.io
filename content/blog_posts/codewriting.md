+++
author = "Dixi Yao"
title = "Write High-quality Code"
date = "2024-07-11"
+++

## Some Experience to Share For Writing Good Code
During my experience of researching and doing projects, I believe it is always very helpful to manage good code. Clear code with good annotations will help us complete projects and develop products more smoothly. 

For different programming languages, we have different forms. For example, object oriented programming and functional programming. Different programming languages also have different rules. For example, C++, Python, Rust, and Java, they all have different rules. 

Here, I would like to share some of my thoughts based on my past experiences. I will generally use Python as the example but may also discuss other languages as well.

### Introduction of Tools
I place the usage of tools as the first important thing to talk about. The reason is that a good choice of coding environment will to a large extension decide the quality of the code.
#### IDEs

Many people have different preferences for IDEs. I would like to recommend **VS Code** as an extension. The merit of the VS code is that you can add any extensions and build up your own working station. Choose a good appearance and the placement of toolbox bars.

#### Packages
- [Formatter](https://code.visualstudio.com/docs/python/formatting). I would suggest choosing a formatter before the start of coding. Some languages such as Python, rely heavily on formatting and indentation. Some languages like C++ might not. But a good formatter will greatly improve the readability of your code.
- [Grammar Checker](https://code.visualstudio.com/docs/python/linting). Usually, in the IDE, it will highlight the warnings and potential errors before compiling or running the program. But Linting is also another important part during the writing of your code. It will give hints to better improve the code, avoid potential bugs, mistakes causing overheads, and etc. It is highly recommended to have the Grammar checker prepared.
#### AI Assistant
With the fast development of Generative AI and large models, we have a lot of tools which can help us write the code. With proper annotations and hints, they can complete the remaining codes. I think they are very helpful sometimes and it is recommended to have them installed in your IDE. For example, we can use the [Copilot](https://code.visualstudio.com/docs/copilot/overview) extension in VS Code.

### Project Management
Project management is usually very important, especially if there is a project with a large team. The Github and own GitLan are both good options. The Git provides the flexibility of pull, push, commit tracing, pulling request, rolling back, and so on for the easy management of a project. 

**Here is a [good guide](https://rogerdudler.github.io/git-guide/) on git commands.**

Apart from these, there are some important logistics in managing projects.
- README is a very important file to introduce the project, which should be continuously maintained till the end of the project. ```.gitignore``` is another important file.
- Always commit and push your updates of the code immediately. With a specific change in your code, you should update the repo to make sure others can get the updated version in time.

- Provide a proper description of your commit. The reason for doing this is that others can quickly grab your change without reading your code and it will make it more convenient if some cases come to the rolling back.

 1. Capitalize the first letter of the message.
 2. Always started with a verb.
 3. The start verb should be in past tense, such as "Added..." and "Supported...".
 4. Capitalize proper nouns. 
 5. End with a period. 

- When there is a big change or an important change, a pull request is usually a good option.
- Git submodule, subtree, or subrepo are better choices than copying and pasting the code from an existing repo. But if you plan to have some big modifications, copying and pasting and then revision and including a proper citation in the README is fine.
- Even if it is a personal project, using Git does not have any drawbacks. The reason is that I can track progress and roll back when necessary. If I want to involve other people in, it will also be easier.
- Setting several milestones either in the README or some places like Wikipages is helpful for the management of the project.
  
### Code Logistics
The code logistics is another important component of having good code. However, this may vary between case by case.

- **Occam's razor**: Always remember, unless it is really necessary, do not make the code more complicated. A usual case is that there will be a lot of functions and classes one out of another. When we want to check one function, we need to check another function and sometimes it will be defined in another file. However, for more simple cases, for example, if there are several command lines, we can just move it into another function with a line of annotation. This will improve readability.
- **Trojan Horse**: Always be careful when you copy and paste others' code. Even if their code does not have bugs or vulnerabilities, you may misuse them when you do the copy and paster. Some copying and pasting is fine, for example,
 ```
 loss.backward()
 optimizer.step()
 optimizer.zero_grad()
 ```
 in a usual training script by PyTorch. However, even for this kind of code, a better way is to use the package where the code is well-checked, in most programming languages.

 - **Odysseus**: Your codes do not have to be great epics. Having millions of codes will not increase the quality of the code. Make each code file at a proper length and have good functionalities.

- **Misuse of concepts**: In different programming languages, there are usually helpful features. For example, heritage, pointers, reference, and so on. But one thing we need to do is make sure that they are properly used. For example, sometimes, a callback function is a better solution than a heritage or direct calling function. 


#### Doc String and Annotation
I think doc strings and annotations are always important and well-discussed. Here is a guide of writing [code annotation](https://docs.github.com/en/contributing/writing-for-github-docs/annotating-code-examples). *Code annotations help explain longer code examples by describing what a code example does and why.*

The meaning of code annotation is to help others understand the functionalities of each piece of the code very quickly. As a result, they should be short. This is a little bit similar to writing a *TL;DR* for a paper. We need to catch the high-level idea very quickly. Usually, a comment should not be longer than **50** words. 

The doc string is a little bit different, it should be more detailed, giving the idea of each module and package. Some references to papers and other codes may be needed. You also want to include the author names of the code in the doc string. When you write a doc string for a package, a class, or a function. Others can know what they need to put in as the arguments and what they will get from the returning, without reading your code.

The names of variables, classes, and functions are also important. There have been different naming rules and formats. No matter which one you choose, you should make them easy to understand. Something like `abc` and `qwe` are very bad examples. `Tree1`, `Tree2` are also not very good. `TreeClassification`, `TreeRecognition` are better options to clearly convey the meanings.

I would like to provide a [coding best practices](https://curc.readthedocs.io/en/latest/programming/coding-best-practices.html#:~:text=Variable%20naming%20is%20an%20important,consistent%20theme%20throughout%20your%20code.) as a reference.