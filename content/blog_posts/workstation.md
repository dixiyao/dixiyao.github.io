+++
author = "Dixi Yao"
title = "Build Your Own GPU Workstation"
date = "2024-08-27"
+++

As machine learning researchers, sometimes we may have the need to have our own GPU workstation. Along with the recent trend of WuKong, I built a 4090 GPU workstation. The total amount excluding the price of GPU is around 1800 before tax. I would like to share my experience about choosing each component and the process of building such a workstation from hardware to software.

## Components
First, I would like to share my experience of choosing each necessary component. The price of computer components vary from time to time. So, I think the price here is only for reference and I would like share more about the ideas and the important things you need to pay attention to when choose the components. I will put my choice in the brackets.

### GPU (ASUS RTX 4090 OC)
- GPU: The GPU is the most important part of the whole workstation. I think the most important thing is what you need is. For example, if you just want to play some video games, it is more recommended to choose game cards such as 4090, 3090, 3060, etc. While if your need is to do deep learning, you usually have broad options. When you want to use it for deep learning, one thing you need to pay attention to is the GPU memory. This depends on your applications.
- GPU Cooling System: Usually the heat solutions for the GPU are enough. So, we do not need to give the GPU for extra cooling system like liquid cooling.
- GPU Stands: As today's GPU are usually very huge. The connection between the GPU and motherboard is the PCIE plugin. The connection between the GPU and the container is only at one end of the GPU. As a result, it is highly recommended to have a GPU stand.

### CPU (i9 14900KF, Valkyrie E360)
- CPU: The next important part is the CPU. If you are going to do some research stuff, it is recommended to have a more powerful CPU, for example i7 or i9. If you are going to use it for video games, it does not matter much about your CPU as most of the workloads are on the CPU. 
- CPU Cooling System: The cooling system of a CPU depends on what CPU you are using. It is not always necessary to have a liquid cooling. You may need to consult some professional advisors about whether your CPU needs the liquid cooling or an air cooling system.
 
### Storage (KingBank DDR5 24G 6800 X2, GeIL P4P 7400MHz 2TB)
- RAM: The RAM is cheaper nowadays. It would be better to use DDR5 but DDR4 is okay. The frequency is an important factor to consider the RAM.
- SSD: One important thing about the SSD is that we need to make sure which PCIE protocol it uses.
 
### Motherboard (MSI Pro Z790-A Max Wifi)
- Motherboard: To support the 4090 GPU, you usually need a motherboard from ATX. The motherboard should be able to support the CPU you choose and have the correct PCIE protocols. It should also support the DDR5 or DDR4 you choose. 
 
### Power Supply and Computer Case (Corsair RMX Shift White RM 1000X, Sama Neview 2351 White Dual USB 3.0 and Type C Tempered Glass ATX Mid Tower Gaming Computer Case)
- The power supply usually only has one parameter you need to consider is the power. For 4090, you need at least 1000W.
- The choice of the computer case is relatively flexible, the only thing is that it needs to support your motherboard. For example, if you have an ATX motherboard, the case needs to support it.
- System Cooling: The system cooling is composed of fans. We usually need 3 to 7 fans depending on your needs. It is recommended to choose fans with minimal noise.

## Install and Assembly Them
Usually, you can find a lot of resources guiding on assembling the desktop on Youtube and Bilibili. Here I want to mention several things you need may need to pay attention to. 

The first step is to install the CPU on the motherboard. You need to make sure that the triangle on the CPU is at the direction of the same triangle on the motherboard. Then, you can install the RAM on the motherboard. When you are installing CPU and RAM, if you feel that it is not smooth, do not add on more force. The higher possibility is that you install incorrectly. Next, you need to install the SSD via PCIE. Then, you can install the motherboard into the case and install the system cooling systems. Next, you need to install the CPU cooling systems. One important thing is to make sure that you install the direction of the fans correctly. The next step is to install the GPU. The next step is to place the power supply and connect all wires. You need to make sure that you are installing all pins correctly.

Then, you can power up the computer. There are usually fours lights on the motherboard: CPU, VGA, DDR, and, BIOS. If any light is on, it means that part is missing or you installed it incorrectly. Otherwise, you will need to refund and replace the component.

## Operating System (OS)
The last step towards success is installing the operating system. An operating system is a software and creates an individual environment working as the interface between upper software and lower hardware. Since we are installing our PC, we do not care about the hypervisor (which is used to place VMs). Usually, we have two options for the OS.

After you power up, if you see that you can enter the BIOS, everything is good. Select the USB as the first option to start up. Next, prepare a USB. If you want to install Windows system, it is very easy. Buy and get an activation guide and follow the [steps](https://www.microsoft.com/en-us/software-download/windows11) and it will be done.

If you are going to install the Linux system, for example, using the workstation as a server, it is also not very hard. You need to first get the `.ios` image, which you can download from the official website, e.g. [Ubuntu](https://ubuntu.com/blog/tag/ubuntu-24-04-lts). Then, you can use the [Rufus](https://rufus.ie/en/) to create a start USB and then you will be able to enter the OS installment guide. 

## Summary
It is not a very hard thing but a very nice thing to have your own workstation. All you need is patience and being careful. Good luck with your desktops.
